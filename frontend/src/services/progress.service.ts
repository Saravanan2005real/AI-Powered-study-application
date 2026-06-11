import { prisma } from '@/lib/prisma';

export class ProgressService {
  static async getProgress(userId: string) {
    return await prisma.progressTracker.findUnique({
      where: { userId }
    });
  }

  static async updateStudyHours(userId: string, hours: number, subject: string) {
    const tracker = await prisma.progressTracker.findUnique({ where: { userId } });
    if (!tracker) return null;

    let subjectWise = JSON.parse(tracker.subjectWise || '{}');
    subjectWise[subject] = (subjectWise[subject] || 0) + hours;

    return await prisma.progressTracker.update({
      where: { userId },
      data: {
        studyHours: tracker.studyHours + hours,
        subjectWise: JSON.stringify(subjectWise)
      }
    });
  }
  
  static async getAnalytics(userId: string) {
    const tracker = await prisma.progressTracker.findUnique({ where: { userId } });
    if (!tracker) return { weeklyHours: [], subjectBreakdown: {} };

    return {
      totalHours: tracker.studyHours,
      completedGoals: tracker.completedGoals,
      subjectBreakdown: JSON.parse(tracker.subjectWise || '{}'),
      weeklyTrend: [
        { day: 'Mon', hours: 2 },
        { day: 'Tue', hours: 3.5 },
        { day: 'Wed', hours: 1 },
        { day: 'Thu', hours: 4 },
        { day: 'Fri', hours: 2.5 },
        { day: 'Sat', hours: 5 },
        { day: 'Sun', hours: 3 },
      ]
    };
  }
}
