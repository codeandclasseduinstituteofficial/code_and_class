import User from '../models/user.model.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Generate Access Token (short-lived)
export const generateAccessToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '2h', // your choice
    });
};

// Generate Refresh Token (long-lived)
export const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
    });
};

// Register User
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({ name, email, password });

    if (user) {
        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({
            _id: user._id,
            name: user.name,
            role: user.role,
            accessToken,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// Login User
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            _id: user._id,
            name: user.name,
            role: user.role,
            accessToken,
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// Refresh Access Token
export const refreshToken = asyncHandler(async (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        res.status(401);
        throw new Error('No refresh token');
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
        res.status(401);
        throw new Error('User not found');
    }

    const accessToken = generateAccessToken(user._id, user.role);

    res.json({
        accessToken,
        user: {
            _id: user._id,
            name: user.name,
            role: user.role,
        },
    });
});

// Logout
export const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    res.sendStatus(204);
});

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password');
    res.json(users);
});

export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
});

export const updateUser = asyncHandler(async (req, res) => {
    const { name, email, role } = req.body;
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;
        await user.save();
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});