import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes';
import producerRouter from './routes/producer.routes';

const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/producer', producerRouter);
app.get('/health', (req, res) => {
  res.json('healthy');
});

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
