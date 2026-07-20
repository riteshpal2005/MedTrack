import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'MedTrackj API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});