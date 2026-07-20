import { Router, type Request, type Response } from "express";
import { pool } from "../db";

const router = Router();

router.get('/:profileId', async (req: Request, res: Response) => {
  const { profileId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM medicines WHERE profile_id = $1', [profileId]);

    res.status(200).json(result.rows);
  } catch ( error ) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch medicines' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const { id, profile_id, name, dosage, inventory_count, warning_level, schedule, is_archived, created_at } = req.body;

  try {
    const result = await pool.query(`INSERT INTO medicines (id, profile_id, name, dosage, inventory_count, warning_level, schedule, is_archived, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [id, profile_id, name, dosage, inventory_count, warning_level, schedule, is_archived, created_at]);

    res.status(201).json(result.rows[0]);
  } catch ( error ) {
    console.error(error);
    res.status(500).json({ error: 'Failed to insert medicine' });
  }
});

export default router;