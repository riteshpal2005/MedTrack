import { Router, type Request, type Response } from "express";
import jwt from 'jsonwebtoken';

const router = Router();
router.post('/login', (req: Request, res: Response) => {
  const { apiKey } = req.body;

  if (apiKey === 'MEDTRACK_SECURE_SYNC_123') {
    const token = jwt.sign({ role: 'sync_client'}, process.env.JWT_SECRET as string, { expiresIn: '24h' });
    res.status(200).json({ token });
  } else {
    res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
  }
});

export default router;