const Album = require('../models/Album');
const { catchAsync } = require('../middleware/errorMiddleware');
const APIFeatures = require('../utils/apiFeatures');
const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'server/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // 5MB
});

exports.uploadAlbumImage = upload.single('coverImage');

exports.getAllAlbums = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Album.find(), req.query)
        .filter()
        .search()
        .sort()
        .limitFields()
        .paginate();

    const albums = await features.query;

    res.status(200).json({
        success: true,
        results: albums.length,
        data: {
            albums
        }
    });
});

exports.getAlbum = catchAsync(async (req, res, next) => {
    const album = await Album.findById(req.params.id).populate('createdBy', 'username email');

    if (!album) {
        const error = new Error('No album found with that ID');
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({
        success: true,
        data: {
            album
        }
    });
});

exports.createAlbum = catchAsync(async (req, res, next) => {
    const albumData = { ...req.body, createdBy: req.user.id };

    if (req.file) {
        albumData.coverImage = req.file.path.replace(/\\/g, '/');
    }

    const newAlbum = await Album.create(albumData);

    res.status(201).json({
        success: true,
        data: {
            album: newAlbum
        }
    });
});

exports.updateAlbum = catchAsync(async (req, res, next) => {
    let album = await Album.findById(req.params.id);

    if (!album) {
        const error = new Error('No album found with that ID');
        error.statusCode = 404;
        throw error;
    }

    // Check ownership
    // Convert both to string to be safe
    const isOwner = album.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
        const error = new Error('You do not have permission to perform this action');
        error.statusCode = 403;
        throw error;
    }

    const updateData = { ...req.body };
    if (req.file) {
        updateData.coverImage = req.file.path.replace(/\\/g, '/');
    }

    album = await Album.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: {
            album
        }
    });
});

exports.deleteAlbum = catchAsync(async (req, res, next) => {
    const album = await Album.findById(req.params.id);

    if (!album) {
        const error = new Error('No album found with that ID');
        error.statusCode = 404;
        throw error;
    }

    // Check ownership
    // Convert both to string to be safe
    const isOwner = album.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
        const error = new Error('You do not have permission to perform this action');
        error.statusCode = 403;
        throw error;
    }

    await Album.findByIdAndDelete(req.params.id);

    res.status(204).json({
        success: true,
        data: null
    });
});
