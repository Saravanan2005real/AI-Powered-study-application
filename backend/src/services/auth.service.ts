import { memoryDb, generateId } from '../config/db';
import bcrypt from 'bcryptjs';
import { signToken } from '../lib/jwt';
import { registerSchema, loginSchema } from '../lib/validation';

export class AuthService {
  static async register(data: any) {
    const parsed = registerSchema.parse(data);

    const existingUser = memoryDb.users.find(u => u.email === parsed.email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const passwordHash = await bcrypt.hash(parsed.password, 10);

    const user = {
      id: generateId(),
      name: parsed.name,
      email: parsed.email,
      passwordHash,
    };
    memoryDb.users.push(user);

    const token = await signToken({ userId: user.id });
    
    // Create initial settings & progress
    memoryDb.settings.push({ userId: user.id, theme: 'system', notifications: true, emailAlerts: true });
    memoryDb.progressTrackers.push({ 
      userId: user.id, 
      subjectWise: JSON.stringify({}),
      studyHours: 0,
      completedGoals: 0,
      completedTests: 0,
      learningActivities: 0,
      updatedAt: new Date()
    });

    return { user: { id: user.id, name: user.name, email: user.email }, token };
  }

  static async login(data: any) {
    const parsed = loginSchema.parse(data);

    const user = memoryDb.users.find(u => u.email === parsed.email);

    if (!user || !user.passwordHash) {
      throw new Error("Invalid credentials");
    }

    const isValid = await bcrypt.compare(parsed.password, user.passwordHash);

    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    const token = await signToken({ userId: user.id });

    return { user: { id: user.id, name: user.name, email: user.email }, token };
  }
}
