import { memoryDb, generateId } from '../config/db';

export class GoalsService {
  static async getGoals(userId: string) {
    return memoryDb.studyGoals
      .filter(g => g.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  static async createGoal(userId: string, data: any) {
    const newGoal = {
      id: generateId(),
      userId,
      subject: data.subject,
      weeklyGoal: data.weeklyGoal,
      scoreTarget: parseInt(data.scoreTarget),
      completed: false,
      deadline: data.deadline ? new Date(data.deadline) : null,
      milestones: data.milestones ? JSON.stringify(data.milestones) : null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    memoryDb.studyGoals.push(newGoal);
    return newGoal;
  }

  static async updateGoal(userId: string, goalId: string, data: any) {
    const goal = memoryDb.studyGoals.find(g => g.id === goalId && g.userId === userId);
    if (!goal) throw new Error("Goal not found");

    if (data.subject !== undefined) goal.subject = data.subject;
    if (data.weeklyGoal !== undefined) goal.weeklyGoal = data.weeklyGoal;
    if (data.scoreTarget !== undefined) goal.scoreTarget = parseInt(data.scoreTarget);
    if (data.completed !== undefined) goal.completed = data.completed;
    if (data.deadline !== undefined) goal.deadline = new Date(data.deadline);
    if (data.milestones !== undefined) goal.milestones = JSON.stringify(data.milestones);
    
    goal.updatedAt = new Date();
    return goal;
  }
}
