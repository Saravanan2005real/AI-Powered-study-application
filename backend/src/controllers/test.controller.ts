import { Request, Response } from 'express';
import { TestService } from '../services/test.service';

const getUserId = () => "user-1";

export const getTests = async (req: Request, res: Response) => {
  try {
    const tests = await TestService.getTests(getUserId());
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tests" });
  }
};

export const createTest = async (req: Request, res: Response) => {
  try {
    const userId = getUserId();


    const testRecord = await TestService.createTest(userId, req.body);
    
    // Mock questions since AIService generatePracticeTest is not implemented
    const questions = [
      { id: 1, text: `Sample question for ${testRecord.subject}`, options: ['A', 'B', 'C', 'D'], answer: 'A' }
    ];

    res.json({ testId: testRecord.id, questions });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate test" });
  }
};

export const evaluateTest = async (req: Request, res: Response) => {
  try {
    const result = await TestService.evaluateTest(getUserId(), req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to evaluate test" });
  }
};
