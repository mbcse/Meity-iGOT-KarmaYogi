
import express, { Request, Response } from 'express';

const app = express();
const port = 3001;

import pixelRouter from './router/pixelRouter'

app.use('/pixel',pixelRouter)

app.get('/', (req: Request, res: Response) => {
  // console.log(req)
  const userIP = req.header('x-forwarded-for') || req.connection.remoteAddress;
  console.log(userIP)
  // console.log(req.socket.remoteAddress);
  res.send('Hello, TypeScript with Express!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
