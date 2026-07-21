import { type Request, type Response, type NextFunction } from "express";
import { ZodError, z } from "zod";

export const validateData = (schema: z.ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: 'Invalid payload', details: error.issues });
        return;
      }
      res.status(500).json({ error: 'Internal validation error' });
    }
  };
};