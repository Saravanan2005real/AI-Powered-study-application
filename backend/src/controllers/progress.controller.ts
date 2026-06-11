import { Request, Response } from 'express';
import { memoryDb } from '../config/db';

const getUserId = () => "user-1";

export const getProgress = async (req: Request, res: Response) => {
  try {
    const userId = getUserId();
    let tracker = memoryDb.progressTrackers.find(t => t.userId === userId);
    
    if (!tracker) {
      tracker = {
        userId,
        subjectWise: JSON.stringify({ "Mathematics": 0, "Science": 0 }),
        studyHours: 0,
        completedGoals: 0,
        completedTests: 0,
        learningActivities: 0,
        updatedAt: new Date()
      };
      memoryDb.progressTrackers.push(tracker);
    }
    res.json({ ...tracker, subjectWise: JSON.parse(tracker.subjectWise) });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch progress" });
  }
};

export const updateProgress = async (req: Request, res: Response) => {
  try {
    const userId = getUserId();
    const body = req.body;
    let tracker = memoryDb.progressTrackers.find(t => t.userId === userId);
    
    if (!tracker) return res.status(404).json({ error: "Progress tracker not found" });

    const subjectWise = JSON.parse(tracker.subjectWise);
    if (body.subject) {
      subjectWise[body.subject] = (subjectWise[body.subject] || 0) + (body.studyHours || 0);
    }

    tracker.studyHours += (body.studyHours || 0);
    tracker.learningActivities += (body.learningActivities || 0);
    tracker.completedTests += (body.completedTests || 0);
    tracker.subjectWise = JSON.stringify(subjectWise);
    tracker.updatedAt = new Date();

    res.json({ ...tracker, subjectWise: JSON.parse(tracker.subjectWise) });
  } catch (error) {
    res.status(500).json({ error: "Failed to update progress" });
  }
};
