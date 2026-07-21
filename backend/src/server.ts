import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './db';
import profileRoutes from './routes/profiles';
import medicineRoutes from './routes/medicines';
import historyRoutes from './routes/historyLogs';
import healthRoutes from './routes/healthRecords';
import authRoutes from './routes/auth';
import { authenticateJWT } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes)
app.use('/api/profiles', authenticateJWT, profileRoutes)
app.use('/api/medicines', authenticateJWT, medicineRoutes)
app.use('/api/history', authenticateJWT, historyRoutes)
app.use('/api/health-records', authenticateJWT, healthRoutes)

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'MedTrackj API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});