const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { catchAsync } = require('../middleware/errorMiddleware');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_dev_key', {
        expiresIn: process.env.JWT_EXPIRES_IN || '90d'
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        success: true,
        token,
        data: {
            user
        }
    });
};

exports.register = catchAsync(async (req, res, next) => {
    const { username, email, password } = req.body;

    // Simple validation or use Joi here. Mongoose will also validate.
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error('Email already exists');
        error.statusCode = 400;
        throw error;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        username,
        email,
        password: hashedPassword
    });

    createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
        const error = new Error('Please provide email and password');
        error.statusCode = 400;
        throw error;
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        const error = new Error('Incorrect email or password');
        error.statusCode = 401;
        throw error;
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
});
