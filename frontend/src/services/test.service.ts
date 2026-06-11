import { prisma } from '@/lib/prisma';

export class TestService {
  static async getTests(userId: string) {
    return await prisma.practiceTest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async createTest(userId: string, data: any) {
    const { subject, chapter, questionsCount, difficulty } = data;

    // Optional: Integrate with AIService to generate questions here if needed
    // For now we just create the test record

    return await prisma.practiceTest.create({
      data: {
        userId,
        subject,
        chapter,
        questionsCount: parseInt(questionsCount),
        difficulty,
      }
    });
  }

  static async getTestById(userId: string, testId: string) {
    return await prisma.practiceTest.findFirst({
      where: { id: testId, userId }
    });
  }

  static async evaluateTest(userId: string, testId: string, results: any) {
    const { correctAnswers, wrongAnswers, finalScore } = results;

    const updatedTest = await prisma.practiceTest.update({
      where: { id: testId },
      data: {
        correctAnswers,
        wrongAnswers,
        finalScore,
        completed: true
      }
    });

    // Update progress tracker
    const tracker = await prisma.progressTracker.findUnique({ where: { userId } });
    if (tracker) {
      await prisma.progressTracker.update({
        where: { userId },
        data: {
          completedTests: tracker.completedTests + 1
        }
      });
    }

    return updatedTest;
  }
}
