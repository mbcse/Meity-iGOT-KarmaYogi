import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import winston from 'winston';
import connectDB from './config/database';

const app = express();

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

// Middleware
app.use(express.json());

connectDB();


app.get("/healthy", (req: Request, res: Response) => {
  res.json({"status":"Healthy"});
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
