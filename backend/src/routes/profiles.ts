import { Router, type Request, type Response } from "express";
import { pool } from "../db";

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM profiles');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const { id, name, created_at } = req.body;
  try {
    const result = await pool.query('INSERT INTO profiles (id, name, created_at) VALUES ($1, $2, $3) RETURNING *', [id, name, created_at]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to insert profile' });
  }
});

export default router;