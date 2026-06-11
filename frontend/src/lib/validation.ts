import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const goalSchema = z.object({
  subject: z.string().min(1),
  weeklyGoal: z.string().min(1),
  scoreTarget: z.number().min(0).max(100),
  deadline: z.string().optional() // ISO date string
});

export const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  notifications: z.boolean().optional(),
  emailAlerts: z.boolean().optional()
});
