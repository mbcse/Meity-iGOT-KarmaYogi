import express from 'express';
// import { producerRouter } from './routes/producer.routes';

const app = express();

app.use(express.json()); 
// app.use('/produce', producerRouter);

app.get('/health', (req, res) => {
  res.json('healthy');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
