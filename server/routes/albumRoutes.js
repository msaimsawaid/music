const express = require('express');
const albumController = require('../controllers/albumController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes (read-only)
router.get('/', albumController.getAllAlbums);
router.get('/:id', albumController.getAlbum);

// Protected routes
router.use(authMiddleware.protect);

router.post(
    '/',
    albumController.uploadAlbumImage, // Middleware for file upload
    albumController.createAlbum
);

router.patch(
    '/:id',
    albumController.uploadAlbumImage,
    albumController.updateAlbum
);

router.delete('/:id', albumController.deleteAlbum);

module.exports = router;
