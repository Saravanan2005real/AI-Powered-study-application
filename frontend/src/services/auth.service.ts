import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';
import { registerSchema, loginSchema } from '@/lib/validation';

export class AuthService {
  static async register(data: any) {
    const parsed = registerSchema.parse(data);

    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.email }
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const passwordHash = await bcrypt.hash(parsed.password, 10);

    const user = await prisma.user.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        passwordHash,
      }
    });

    const token = await signToken({ userId: user.id });
    
    // Create initial settings & progress
    await prisma.settings.create({ data: { userId: user.id } });
    await prisma.progressTracker.create({ 
      data: { 
        userId: user.id, 
        subjectWise: JSON.stringify({}) 
      } 
    });

    return { user: { id: user.id, name: user.name, email: user.email }, token };
  }

  static async login(data: any) {
    const parsed = loginSchema.parse(data);

    const user = await prisma.user.findUnique({
      where: { email: parsed.email }
    });

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
