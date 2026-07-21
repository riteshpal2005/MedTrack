import { z } from 'zod';

export const ProfileSchema = z.object({
  id: z.string().min(1, 'ID cannot be empty'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  created_at: z.number().int().positive(),
});

export const MedicineSchema = z.object({
  id: z.string().min(1),
  profile_id: z.string().min(1),
  name: z.string().min(2),
  dosage: z.string().min(1),
  inventory_count: z.number().int().min(0, "Inventory cannot be negative"), 
  warning_level: z.number().int().min(0),
  schedule: z.string(),
  is_archived: z.boolean(),
  created_at: z.number().int().positive(),
});

export const HistoryLogSchema = z.object({
  id: z.string().min(1),
  medicine_id: z.string().min(1),
  profile_id: z.string().min(1),
  timestamp: z.number().int().positive(),
  scheduled_time: z.string().min(1),
  status: z.enum(['taken', 'missed', 'skipped']),
});

export const HealthRecordSchema = z.object({
  id: z.string().min(1),
  profile_id: z.string().min(1),
  type: z.string().min(2),
  notes: z.string().nullable().optional(),
  created_at: z.number().int().positive(),
});