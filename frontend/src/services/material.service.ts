import { prisma } from '@/lib/prisma';

export class MaterialService {
  static async getMaterials(userId: string) {
    return await prisma.studyMaterial.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async uploadMaterial(userId: string, data: any) {
    const { fileName, filePath, chatSessionId } = data;

    return await prisma.studyMaterial.create({
      data: {
        userId,
        fileName,
        filePath,
        chatSessionId: chatSessionId || null
      }
    });
  }

  static async deleteMaterial(userId: string, materialId: string) {
    const material = await prisma.studyMaterial.findFirst({
      where: { id: materialId, userId }
    });

    if (!material) {
      throw new Error("Material not found");
    }

    await prisma.studyMaterial.delete({
      where: { id: materialId }
    });

    return { success: true };
  }
}
