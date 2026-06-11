import { Request, Response } from 'express';
import { SettingsService } from '../services/settings.service';

const getUserId = () => "user-1";

export const getSettings = async (req: Request, res: Response) => {
  try {
    const user = await SettingsService.getSettings(getUserId());
    res.json({ name: user.name, language: user.language, learningLevel: user.learningLevel });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const user = await SettingsService.updateSettings(getUserId(), req.body);
    res.json({ name: user.name, language: user.language, learningLevel: user.learningLevel });
  } catch (error) {
    res.status(500).json({ error: "Failed to update settings" });
  }
};

export const clearHistory = async (req: Request, res: Response) => {
  try {
    await SettingsService.clearHistory(getUserId());
    res.json({ success: true, message: "History cleared successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to clear history" });
  }
};
