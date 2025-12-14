
const User = require('../models/User');
const Album = require('../models/Album'); // ADD THIS LINE
const { catchAsync } = require('../middleware/errorMiddleware');
const bcrypt = require('bcryptjs');

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
        success: true,
        data: {
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        }
    });
});

// @desc    Update user profile
// @route   PATCH /api/users/profile
// @access  Private
exports.updateProfile = catchAsync(async (req, res, next) => {
    // 1) Filter unwanted fields
    const filteredBody = {};
    const allowedFields = ['username', 'email'];
    
    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
            filteredBody[field] = req.body[field];
        }
    });
    
    // 2) Check if email is already taken (if updating email)
    if (filteredBody.email) {
        const existingUser = await User.findOne({ 
            email: filteredBody.email,
            _id: { $ne: req.user.id }
        });
        
        if (existingUser) {
            const error = new Error('Email already exists');
            error.statusCode = 400;
            throw error;
        }
    }
    
    // 3) Update user
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            new: true,
            runValidators: true
        }
    ).select('-password');
    
    res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
            user: updatedUser
        }
    });
});

// @desc    Update user password
// @route   PATCH /api/users/updatePassword
// @access  Private
exports.updatePassword = catchAsync(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
        const error = new Error('Please provide current and new password');
        error.statusCode = 400;
        throw error;
    }
    
    const user = await User.findById(req.user.id).select('+password');
    
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
        const error = new Error('Current password is incorrect');
        error.statusCode = 401;
        throw error;
    }
    
    if (currentPassword === newPassword) {
        const error = new Error('New password must be different');
        error.statusCode = 400;
        throw error;
    }
    
    if (newPassword.length < 6) {
        const error = new Error('Password must be at least 6 characters');
        error.statusCode = 400;
        throw error;
    }
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    
    res.status(200).json({
        success: true,
        message: 'Password updated successfully',
        token,
        data: {
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        }
    });
});

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find().select('-password');
    
    res.status(200).json({
        success: true,
        results: users.length,
        data: {
            users
        }
    });
});

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
exports.deleteAccount = catchAsync(async (req, res, next) => {
    await User.findByIdAndDelete(req.user.id);
    
    res.status(200).json({
        success: true,
        message: 'Your account has been deleted'
    });
});

// @desc    Get admin dashboard stats
// @route   GET /api/users/admin/stats
// @access  Private/Admin
exports.getAdminStats = catchAsync(async (req, res, next) => {
    const totalUsers = await User.countDocuments();
    const totalAlbums = await Album.countDocuments();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const newUsersToday = await User.countDocuments({ createdAt: { $gte: today } });
    const newAlbumsToday = await Album.countDocuments({ createdAt: { $gte: today } });
    
    res.status(200).json({
        success: true,
        data: {
            stats: {
                totalUsers,
                totalAlbums,
                newUsersToday,
                newAlbumsToday,
                usersByRole: {
                    user: await User.countDocuments({ role: 'user' }),
                    admin: await User.countDocuments({ role: 'admin' })
                }
            }
        }
    });
});

// @desc    Delete any user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = catchAsync(async (req, res, next) => {
    // Cannot delete yourself
    if (req.params.id === req.user.id) {
        const error = new Error('You cannot delete your own account from admin panel');
        error.statusCode = 400;
        throw error;
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
        success: true,
        message: 'User deleted successfully'
    });
});
