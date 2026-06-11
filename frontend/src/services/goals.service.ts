import { prisma } from '@/lib/prisma';
import { goalSchema } from '@/lib/validation';

export class GoalsService {
  static async createGoal(userId: string, data: any) {
    const parsed = goalSchema.parse(data);
    return await prisma.studyGoal.create({
      data: {
        userId,
        subject: parsed.subject,
        weeklyGoal: parsed.weeklyGoal,
        scoreTarget: parsed.scoreTarget,
        deadline: parsed.deadline ? new Date(parsed.deadline) : null,
      }
    });
  }

  static async getGoals(userId: string) {
    return await prisma.studyGoal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateGoal(userId: string, goalId: string, data: any) {
    const goal = await prisma.studyGoal.findFirst({
      where: { id: goalId, userId }
    });
    if (!goal) throw new Error("Goal not found");

    return await prisma.studyGoal.update({
      where: { id: goalId },
      data
    });
  }

  static async deleteGoal(userId: string, goalId: string) {
    const goal = await prisma.studyGoal.findFirst({
      where: { id: goalId, userId }
    });
    if (!goal) throw new Error("Goal not found");

    await prisma.studyGoal.delete({
      where: { id: goalId }
    });
    return { success: true };
  }
}
