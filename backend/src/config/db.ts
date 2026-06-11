export const memoryDb = {
  users: [] as any[],
  settings: [] as any[],
  chatSessions: [] as any[],
  messages: [] as any[],
  studyGoals: [] as any[],
  progressTrackers: [] as any[],
  studySessions: [] as any[],
  analytics: [] as any[],
  practiceTests: [] as any[],
  studyMaterials: [] as any[]
};

export const generateId = () => Math.random().toString(36).substring(2, 15);
