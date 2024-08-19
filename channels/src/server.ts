import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import winston from 'winston';
import connectDB from './config/database';
import cors from 'cors';

import { setupRouter } from './routes/setup.routes';
import { chatRouter } from './routes/chat.routes';

const app = express();

const allowedOrigins = ['http://localhost:3000']; // Add your React and Next.js app URLs here

const corsOptions = {
  origin: function (origin: any, callback: any) {
    console.log('Request origin:', origin);
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.error('Blocked by CORS:', origin); // Added debugging
      callback(new Error('Not allowed by CORS'));
    }
  },
};

// Use CORS middleware
app.use(cors(corsOptions));

// Logger setup with Winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

connectDB();

// Middleware
app.use(express.json());
app.use('/setup', setupRouter);
app.use('/chat', chatRouter);

app.get('/healthy', (req: Request, res: Response) => {
  res.json({ status: 'Healthy' });
});

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err); // Logs the error using the Winston logger
  res.status(500).send({ error: err.message }); // Sends a 500 Internal Server Error response with the error message
});

const port = process.env.PORT || 7000;
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
