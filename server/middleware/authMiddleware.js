const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { catchAsync } = require('../middleware/errorMiddleware');

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    // 1) Getting token and check of it's there
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        const error = new Error('You are not logged in! Please log in to get access.');
        error.statusCode = 401;
        throw error;
    }

    // 2) Verification token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_dev_key');

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        const error = new Error('The user belonging to this token no longer does exist.');
        error.statusCode = 401;
        throw error;
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'lead-guide']. role='user'
        if (!roles.includes(req.user.role)) {
            const error = new Error('You do not have permission to perform this action');
            error.statusCode = 403;
            return next(error);
        }
        next();
    };
};
