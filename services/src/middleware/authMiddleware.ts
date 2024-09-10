import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config'; // Make sure to adjust the path to your config file

// Authorization Middleware
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    // If token is not present, redirect to login
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized, please login first' });
    }

    try {
        // Verify the token using jwtSecret
        const decoded = jwt.verify(token, jwtSecret as string);

        // Attach the user details to the request for further use
        (req as any).user = decoded;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Token verification failed, redirect to login
        console.error('JWT verification error:', error);
        return res.status(401).json({ message: 'Invalid token, please login again' });
    }
};
