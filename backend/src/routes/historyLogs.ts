import { Router, type Request, type Response } from "express";
import { pool } from "../db";

import { validateData } from "../middleware/validate";
import { HistoryLogSchema } from "../schema";

const router = Router();

router.get('/:profileId', async (req: Request, res: Response) => {
  const { profileId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM history_logs WHERE profile_id = $1', [profileId]);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch history logs' });
  }
});

router.post('/', validateData(HistoryLogSchema),async (req: Request, res: Response) => {
  const { id, medicine_id, profile_id, timestamp, scheduled_time, status } = req.body;
  try {
    const result = await pool.query(`INSERT INTO history_logs (id, medicine_id, profile_id, timestamp, scheduled_time, status) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id, medicine_id, profile_id, timestamp, scheduled_time, status]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to insert history log' });
  }
});

export default router;