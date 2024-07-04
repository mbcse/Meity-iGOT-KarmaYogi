import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Health check endpoint
app.get('/healthy', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
