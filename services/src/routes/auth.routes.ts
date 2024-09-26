import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import cookieParser from 'cookie-parser';

const authRouter = express.Router();
const prisma = new PrismaClient();

import 'dotenv/config';

export const COOKIE_OPTIONS = {
    httpOnly: true, // Ensures the cookie is sent only over HTTP(S), not client JavaScript
    secure: process.env.NODE_ENV === 'production', // Ensures the cookie is only used over HTTPS
    sameSite: 'lax' as const, // Helps mitigate CSRF attacks, 'lax' is generally more compatible with third-party apps
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days in milliseconds
    domain: process.env.COOKIE_DOMAIN || 'localhost', // Set your domain here
};

// Middleware to parse cookies
authRouter.use(cookieParser());

// Login route
authRouter.post('/signin', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '2d' }
        );

        res.cookie('token', token, COOKIE_OPTIONS);

        return res.status(200).json({ message: 'Login successful', userId: user.id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Register route
authRouter.post('/signup', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { email, password: passwordHash },
        });

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '2d' }
        );

        res.cookie('token', token, COOKIE_OPTIONS);

        return res.status(201).json({ message: 'Signup successful', userId: user.id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Password reset route
authRouter.post('/forgotpassword', async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Implement your logic for sending a password reset email here
        // Generate and send the password reset token via email

        return res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Logout route to clear the cookie
authRouter.post('/signout', (req: Request, res: Response) => {
    res.clearCookie('token', COOKIE_OPTIONS);
    return res.status(200).json({ message: 'Signout successful' });
});

export default authRouter;
