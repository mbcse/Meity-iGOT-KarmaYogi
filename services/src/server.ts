import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes';
import producerRouter from './routes/producer.routes';
import bucketsRouter from './routes/buckets.routes';
import pixelRouter from './routes/pixel.routes';
import statsRouter from './routes/stats.routes';
import campaignRouter from './routes/campaign.routes';

const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/producer', producerRouter);
app.use('/buckets', bucketsRouter);
app.use('/pixels',pixelRouter);
app.use('/stats',statsRouter);
app.use('/campaigns',campaignRouter);

app.get('/health', (req, res) => {
  res.json('healthy');
});

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
