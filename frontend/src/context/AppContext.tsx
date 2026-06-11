"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { StorageService } from "../services/storage.service";

export type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
};

export type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
};

export type Goal = {
  id: string;
  title: string;
  completed: boolean;
};

export type StudentData = {
  name: string;
  grade: string;
  subject: string;
  goal: string;
  question: string;
} | null;

export type Settings = {
  language: string;
  learningLevel: string;
};

export type AppContextType = {
  activeView: "chat" | "goals" | "progress" | "practice" | "settings";
  setActiveView: (view: "chat" | "goals" | "progress" | "practice" | "settings") => void;

  studentData: StudentData;
  setStudentData: (data: StudentData) => void;

  chats: ChatSession[];
  activeChatId: string | null;
  createNewChat: () => void;
  setActiveChatId: (id: string) => void;
  addMessage: (content: string, role: "user" | "ai") => void;

  goals: Goal[];
  addGoal: (title: string) => void;
  toggleGoal: (id: string) => void;

  studyHours: number;
  addStudyHour: () => void;
  completedTests: number;
  addCompletedTest: () => void;

  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  clearHistory: () => void;
  logout: () => void;

  isUploaded: boolean;
  setIsUploaded: (val: boolean) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [activeView, setActiveView] = useState<"chat" | "goals" | "progress" | "practice" | "settings">("chat");
  const [studentData, setStudentDataState] = useState<StudentData>(null);
  const [chats, setChatsState] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  
  const [goals, setGoalsState] = useState<Goal[]>([]);
  const [studyHours, setStudyHoursState] = useState(0);
  const [completedTests, setCompletedTestsState] = useState(0);
  
  const [settings, setSettingsState] = useState<Settings>({ language: "English", learningLevel: "Intermediate" });
  const [isUploaded, setIsUploaded] = useState(false);

  // Load from StorageService on mount
  useEffect(() => {
    setStudentDataState(StorageService.getStudentData());
    
    const storedChats = StorageService.getChats();
    setChatsState(storedChats);
    if (storedChats.length > 0) setActiveChatId(storedChats[0].id);

    setGoalsState(StorageService.getGoals());

    const progress = StorageService.getProgress();
    setStudyHoursState(progress.hours);
    setCompletedTestsState(progress.tests);

    setSettingsState(StorageService.getSettings());
    setIsLoaded(true);
  }, []);

  const setStudentData = (data: StudentData) => {
    setStudentDataState(data);
    StorageService.setStudentData(data);
  };

  const setChats = (newChats: ChatSession[] | ((prev: ChatSession[]) => ChatSession[])) => {
    setChatsState(prev => {
      const updated = typeof newChats === "function" ? newChats(prev) : newChats;
      StorageService.setChats(updated);
      return updated;
    });
  };

  const setGoals = (newGoals: Goal[] | ((prev: Goal[]) => Goal[])) => {
    setGoalsState(prev => {
      const updated = typeof newGoals === "function" ? newGoals(prev) : newGoals;
      StorageService.setGoals(updated);
      return updated;
    });
  };

  const setStudyHours = (updater: (prev: number) => number) => {
    setStudyHoursState(prev => {
      const updated = updater(prev);
      StorageService.setProgress({ hours: updated, tests: completedTests });
      return updated;
    });
  };

  const setCompletedTests = (updater: (prev: number) => number) => {
    setCompletedTestsState(prev => {
      const updated = updater(prev);
      StorageService.setProgress({ hours: studyHours, tests: updated });
      return updated;
    });
  };

  const setSettings = (updater: (prev: Settings) => Settings) => {
    setSettingsState(prev => {
      const updated = updater(prev);
      StorageService.setSettings(updated);
      return updated;
    });
  };

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: "New Session",
      messages: [],
      updatedAt: Date.now(),
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setActiveView("chat");
  };

  const addMessage = (content: string, role: "user" | "ai") => {
    if (!activeChatId) {
      // Create chat if none exists
      const newChat: ChatSession = {
        id: Date.now().toString(),
        title: content.substring(0, 20) + "...",
        messages: [{ id: Date.now().toString() + role, role, content }],
        updatedAt: Date.now()
      };
      setChats(prev => [newChat, ...prev]);
      setActiveChatId(newChat.id);
    } else {
      setChats(prev => prev.map(chat => {
        if (chat.id === activeChatId) {
          const updatedChat = {
            ...chat,
            messages: [...chat.messages, { id: Date.now().toString() + role, role, content }],
            updatedAt: Date.now()
          };
          if (chat.title === "New Session" && role === "user") {
            updatedChat.title = content.substring(0, 20) + "...";
          }
          return updatedChat;
        }
        return chat;
      }));
    }
  };

  const addGoal = (title: string) => {
    setGoals(prev => [...prev, { id: Date.now().toString(), title, completed: false }]);
  };

  const toggleGoal = (id: string) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const addStudyHour = () => setStudyHours(prev => prev + 1);
  const addCompletedTest = () => setCompletedTests(prev => prev + 1);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const clearHistory = () => {
    setChats([]);
    setActiveChatId(null);
    setGoals([]);
    setStudyHoursState(0);
    setCompletedTestsState(0);
    StorageService.clearHistory();
  };

  const logout = () => {
    clearHistory();
    setStudentDataState(null);
    StorageService.clearAll();
  };

  return (
    <AppContext.Provider value={{
      activeView, setActiveView,
      studentData, setStudentData,
      chats, activeChatId, createNewChat, setActiveChatId, addMessage,
      goals, addGoal, toggleGoal,
      studyHours, addStudyHour, completedTests, addCompletedTest,
      settings, updateSettings, clearHistory, logout,
      isUploaded, setIsUploaded
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error("useAppContext must be used within AppProvider");
  return context;
};
