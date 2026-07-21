import { Router, type Request, type Response } from "express";
import { pool } from "../db";

const router = Router();

router.get('/:profileId', async (req: Request, res: Response) => {
  const { profileId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM health_records WHERE profile_id = $1', [profileId]);
    res.status(200).json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch health records' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const { id, profile_id, type, notes, created_at } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO health_records (id, profile_id, type, notes, created_at) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id, profile_id, type, notes, created_at]);
    res.status(201).json(result.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to insert health recrods' });
  }
});

export default router;