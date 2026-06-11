import { prisma } from '@/lib/prisma';

export class SettingsService {
  static async getSettings(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { settings: true }
    });

    if (!user) {
      // Create user if not exists
      return await prisma.user.create({
        data: { id: userId, name: "Student" },
        include: { settings: true }
      });
    }

    return user;
  }

  static async updateSettings(userId: string, data: any) {
    const { name, language, learningLevel, theme, notifications, emailAlerts } = data;

    // Update User table fields
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(language && { language }),
        ...(learningLevel && { learningLevel }),
      }
    });

    // Update Settings table fields
    const updatedSettings = await prisma.settings.upsert({
      where: { userId },
      update: {
        ...(theme && { theme }),
        ...(notifications !== undefined && { notifications }),
        ...(emailAlerts !== undefined && { emailAlerts }),
      },
      create: {
        userId,
        theme: theme || 'system',
        notifications: notifications !== undefined ? notifications : true,
        emailAlerts: emailAlerts !== undefined ? emailAlerts : true,
      }
    });

    return { ...updatedUser, settings: updatedSettings };
  }

  static async clearHistory(userId: string) {
    await prisma.chatSession.deleteMany({
      where: { userId }
    });
    return { success: true };
  }
}
