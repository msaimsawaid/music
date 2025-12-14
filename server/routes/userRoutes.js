const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware.protect);

// Current user routes
router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.patch('/updatePassword', userController.updatePassword);
router.delete('/profile', userController.deleteAccount);

// Admin only routes
router.use(authMiddleware.restrictTo('admin'));
router.get('/', userController.getAllUsers);
router.get('/admin/stats', userController.getAdminStats);
router.delete('/:id', userController.deleteUser);

module.exports = router;