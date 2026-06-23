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
    const { correctAnswers, wrongAnswers, finalScore, duration, detailedResults } = results;

    const test = memoryDb.practiceTests.find(t => t.id === testId);
    if (test) {
      test.correctAnswers = correctAnswers;
      test.wrongAnswers = wrongAnswers;
      test.finalScore = finalScore;
      test.completed = true;
      test.duration = duration || 0;
      test.detailedResults = detailedResults || [];
    }

    // Identify topics mastered and weak topics
    const topicPerformance: Record<string, { correct: number, total: number }> = {};
    if (detailedResults && Array.isArray(detailedResults)) {
      detailedResults.forEach((res: any) => {
        if (res.topicName) {
          if (!topicPerformance[res.topicName]) {
            topicPerformance[res.topicName] = { correct: 0, total: 0 };
          }
          topicPerformance[res.topicName].total += 1;
          if (res.isCorrect) {
            topicPerformance[res.topicName].correct += 1;
          }
        }
      });
    }

    const topicsMastered: string[] = [];
    const weakTopics: string[] = [];

    Object.entries(topicPerformance).forEach(([topic, stats]) => {
      const percentage = (stats.correct / stats.total) * 100;
      if (percentage >= 80) topicsMastered.push(topic);
      else if (percentage <= 50) weakTopics.push(topic);
    });

    // Update progress tracker
    let tracker = memoryDb.progressTrackers.find(t => t.userId === userId);
    if (!tracker) {
      tracker = { userId, completedTests: 0, studyHours: 0, topicsMastered: [], weakTopics: [] };
      memoryDb.progressTrackers.push(tracker);
    }
    
    tracker.completedTests += 1;
    tracker.studyHours += (duration || 0) / 3600; // Assuming duration is in seconds
    
    if (!tracker.topicsMastered) tracker.topicsMastered = [];
    if (!tracker.weakTopics) tracker.weakTopics = [];

    // Add new mastered topics avoiding duplicates
    topicsMastered.forEach(t => {
      if (!tracker.topicsMastered.includes(t)) tracker.topicsMastered.push(t);
    });
    
    // Update weak topics
    weakTopics.forEach(t => {
      if (!tracker.weakTopics.includes(t)) tracker.weakTopics.push(t);
      // If it was mastered before but now weak, remove from mastered
      tracker.topicsMastered = tracker.topicsMastered.filter((m: string) => m !== t);
    });

    return {
      test,
      tracker,
      topicsMastered,
      weakTopics
    };
  }
}
