import { Request, Response } from 'express';
import { GoalsService } from '../services/goals.service';

const getUserId = () => "user-1";

export const getGoals = async (req: Request, res: Response) => {
  try {
    const goals = await GoalsService.getGoals(getUserId());
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch goals" });
  }
};

export const createGoal = async (req: Request, res: Response) => {
  try {
    const goal = await GoalsService.createGoal(getUserId(), req.body);
    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: "Failed to create goal" });
  }
};

export const updateGoal = async (req: Request, res: Response) => {
  try {
    const goal = await GoalsService.updateGoal(getUserId(), req.params.id, req.body);
    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: "Failed to update goal" });
  }
};
