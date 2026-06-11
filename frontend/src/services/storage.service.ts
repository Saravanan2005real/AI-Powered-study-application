"use client";

import { ChatSession, Goal, StudentData, Settings } from "../context/AppContext";

const KEYS = {
  STUDENT: "edugenie_student",
  CHATS: "edugenie_chats",
  GOALS: "edugenie_goals",
  PROGRESS: "edugenie_progress",
  SETTINGS: "edugenie_settings",
};

export class StorageService {
  static getStudentData(): StudentData | null {
    if (typeof window === "undefined") return null;
    try {
      const data = localStorage.getItem(KEYS.STUDENT);
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  }

  static setStudentData(data: StudentData) {
    if (typeof window !== "undefined") {
      if (data) localStorage.setItem(KEYS.STUDENT, JSON.stringify(data));
      else localStorage.removeItem(KEYS.STUDENT);
    }
  }

  static getChats(): ChatSession[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(KEYS.CHATS);
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  }

  static setChats(chats: ChatSession[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem(KEYS.CHATS, JSON.stringify(chats));
    }
  }

  static getGoals(): Goal[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(KEYS.GOALS);
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  }

  static setGoals(goals: Goal[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem(KEYS.GOALS, JSON.stringify(goals));
    }
  }

  static getProgress(): { hours: number; tests: number } {
    if (typeof window === "undefined") return { hours: 0, tests: 0 };
    try {
      const data = localStorage.getItem(KEYS.PROGRESS);
      return data ? JSON.parse(data) : { hours: 0, tests: 0 };
    } catch { return { hours: 0, tests: 0 }; }
  }

  static setProgress(progress: { hours: number; tests: number }) {
    if (typeof window !== "undefined") {
      localStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
    }
  }

  static getSettings(): Settings {
    if (typeof window === "undefined") return { language: "English", learningLevel: "Intermediate" };
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      return data ? JSON.parse(data) : { language: "English", learningLevel: "Intermediate" };
    } catch { return { language: "English", learningLevel: "Intermediate" }; }
  }

  static setSettings(settings: Settings) {
    if (typeof window !== "undefined") {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    }
  }

  static clearHistory() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(KEYS.CHATS);
      localStorage.removeItem(KEYS.GOALS);
      localStorage.removeItem(KEYS.PROGRESS);
    }
  }

  static clearAll() {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  }
}
