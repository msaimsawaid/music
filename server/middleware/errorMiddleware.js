
// Async error wrapper
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Global error handler
const errorHandler = (err, req, res, next) => {
    // Only log errors in development, not in tests
    if (process.env.NODE_ENV !== 'test') {
        console.error(err.stack);
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = { catchAsync, errorHandler };
