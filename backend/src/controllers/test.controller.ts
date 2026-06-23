import { Request, Response } from 'express';
import { TestService } from '../services/test.service';
import { AIService } from '../services/ai.service';

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
    
    res.json({ testId: testRecord.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to create test" });
  }
};

export const generatePersonalizedTest = async (req: Request, res: Response) => {
  try {
    const userId = getUserId();
    const context = req.body.context || {};
    
    // We can also create the test record here so we can save it.
    const testRecord = await TestService.createTest(userId, { 
      subject: context.subject || "General", 
      chapter: "Mixed", 
      questionsCount: 10, 
      difficulty: "Medium" 
    });

    const questions = await AIService.generatePersonalizedTest(context);
    
    res.json({ testId: testRecord.id, questions });
  } catch (error) {
    console.error("Generate Test Error:", error);
    res.status(500).json({ error: "Failed to generate personalized test" });
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
