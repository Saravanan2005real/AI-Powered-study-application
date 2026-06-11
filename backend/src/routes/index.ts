import { Router } from 'express';
import { getChats, createChat, getChatById, addMessage } from '../controllers/chat.controller';
import { getGoals, createGoal, updateGoal } from '../controllers/goal.controller';
import { getProgress, updateProgress } from '../controllers/progress.controller';
import { getSettings, updateSettings, clearHistory } from '../controllers/settings.controller';
import { getTests, createTest, evaluateTest } from '../controllers/test.controller';
import { getMaterials, createMaterial, upload } from '../controllers/material.controller';
import chatRoute from './chat';

const router = Router();

// Health/Test
router.get('/health', (req, res) => { res.json({ status: 'ok', message: 'Backend is healthy' }); });
router.get('/test', (req, res) => { res.json({ status: 'ok', message: 'Test route is working' }); });

// Direct Chat API Route
router.use('/chat', chatRoute);

// Chats
router.get('/chats', getChats);
router.post('/chats', createChat);
router.get('/chats/:id', getChatById);
router.post('/chats/:id/messages', addMessage);

// Goals
router.get('/goals', getGoals);
router.post('/goals', createGoal);
router.put('/goals/:id', updateGoal);

// Progress
router.get('/progress', getProgress);
router.post('/progress', updateProgress);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.delete('/settings', clearHistory);

// Tests
router.get('/tests', getTests);
router.post('/tests', createTest);
router.post('/tests/:id/evaluate', evaluateTest);

// Materials
router.get('/materials', getMaterials);
router.post('/materials', upload.single('file'), createMaterial);

export default router;
