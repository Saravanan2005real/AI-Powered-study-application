import { memoryDb } from '../config/db';

export class SettingsService {
  static async getSettings(userId: string) {
    let user = memoryDb.users.find(u => u.id === userId);
    
    if (!user) {
      user = { id: userId, email: `student-${Date.now()}@example.com`, name: "Student" };
      memoryDb.users.push(user);
    }

    let settings = memoryDb.settings.find(s => s.userId === userId);
    if (!settings) {
      settings = { userId, theme: 'system', notifications: true, emailAlerts: true };
      memoryDb.settings.push(settings);
    }

    return { ...user, settings };
  }

  static async updateSettings(userId: string, data: any) {
    const { name, language, learningLevel, theme, notifications, emailAlerts } = data;

    let user = memoryDb.users.find(u => u.id === userId);
    if (user) {
      if (name) user.name = name;
      if (language) user.language = language;
      if (learningLevel) user.learningLevel = learningLevel;
    }

    let settings = memoryDb.settings.find(s => s.userId === userId);
    if (!settings) {
      settings = { userId, theme: theme || 'system', notifications: notifications !== undefined ? notifications : true, emailAlerts: emailAlerts !== undefined ? emailAlerts : true };
      memoryDb.settings.push(settings);
    } else {
      if (theme) settings.theme = theme;
      if (notifications !== undefined) settings.notifications = notifications;
      if (emailAlerts !== undefined) settings.emailAlerts = emailAlerts;
    }

    return { ...user, settings };
  }

  static async clearHistory(userId: string) {
    // Delete all chats for user
    memoryDb.chatSessions = memoryDb.chatSessions.filter(c => c.userId !== userId);
    return { success: true };
  }
}
