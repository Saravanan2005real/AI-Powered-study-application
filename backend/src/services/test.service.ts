import { memoryDb, generateId } from '../config/db';

export class TestService {
  static async getTests(userId: string) {
    return memoryDb.practiceTests
      .filter(t => t.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  static async createTest(userId: string, data: any) {
    const { subject, chapter, questionsCount, difficulty } = data;

    const newTest = {
      id: generateId(),
      userId,
      subject,
      chapter,
      questionsCount: parseInt(questionsCount),
      difficulty,
      correctAnswers: 0,
      wrongAnswers: 0,
      finalScore: 0,
      completed: false,
      createdAt: new Date()
    };

    memoryDb.practiceTests.push(newTest);
    return newTest;
  }

  static async getTestById(userId: string, testId: string) {
    return memoryDb.practiceTests.find(t => t.id === testId && t.userId === userId);
  }

  static async evaluateTest(userId: string, testId: string, results: any) {
    const { correctAnswers, wrongAnswers, finalScore } = results;

    const test = memoryDb.practiceTests.find(t => t.id === testId);
    if (test) {
      test.correctAnswers = correctAnswers;
      test.wrongAnswers = wrongAnswers;
      test.finalScore = finalScore;
      test.completed = true;
    }

    // Update progress tracker
    const tracker = memoryDb.progressTrackers.find(t => t.userId === userId);
    if (tracker) {
      tracker.completedTests += 1;
    }

    return test;
  }
}
