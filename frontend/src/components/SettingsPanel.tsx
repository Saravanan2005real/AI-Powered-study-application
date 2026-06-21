"use client";

import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";

export default function SettingsPanel() {
  const { studentData, setStudentData, settings, updateSettings, clearHistory, logout, setIsMobileMenuOpen } = useAppContext();
  
  const [name, setName] = useState(studentData?.name || "");
  const [grade, setGrade] = useState(studentData?.grade || "");
  const [subject, setSubject] = useState(studentData?.subject || "");
  const [goal, setGoal] = useState(studentData?.goal || "");
  
  const [language, setLanguage] = useState(settings.language || "English");
  const [learningLevel, setLearningLevel] = useState(settings.learningLevel || "Intermediate");

  const handleSaveProfile = () => {
    if (studentData) {
      setStudentData({
        ...studentData,
        name,
        grade,
        subject,
        goal,
      });
      alert("Profile updated successfully!");
    }
  };

  const handleSaveSettings = () => {
    updateSettings({ language, learningLevel });
    alert("Settings updated successfully!");
  };

  return (
    <div className="flex-1 h-full bg-[#1c1b1a] overflow-y-auto custom-scrollbar p-8 animate-fade-in relative">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 -ml-2 text-foreground-muted hover:bg-[#3d3b38] rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-foreground">Settings & Profile</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Form */}
          <div className="luxury-card p-6">
            <h3 className="text-xl font-bold text-primary-400 mb-6">Edit Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground-muted mb-1">Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#2D2C2A] border border-[#3d3b38] rounded-xl px-4 py-2 text-foreground focus:border-primary-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-muted mb-1">Grade Level</label>
                <input 
                  type="text" 
                  value={grade} 
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full bg-[#2D2C2A] border border-[#3d3b38] rounded-xl px-4 py-2 text-foreground focus:border-primary-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-muted mb-1">Current Subject Focus</label>
                <input 
                  type="text" 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#2D2C2A] border border-[#3d3b38] rounded-xl px-4 py-2 text-foreground focus:border-primary-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-muted mb-1">Primary Goal</label>
                <input 
                  type="text" 
                  value={goal} 
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-[#2D2C2A] border border-[#3d3b38] rounded-xl px-4 py-2 text-foreground focus:border-primary-400 outline-none"
                />
              </div>
              <button 
                onClick={handleSaveProfile}
                className="w-full bg-[#3d3b38] hover:bg-[#4a4845] text-foreground font-medium py-2 rounded-xl mt-4 transition-colors"
              >
                Save Profile
              </button>
            </div>
          </div>

          {/* Preferences */}
          <div className="luxury-card p-6">
            <h3 className="text-xl font-bold text-primary-400 mb-6">Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground-muted mb-1">Language</label>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-[#2D2C2A] border border-[#3d3b38] rounded-xl px-4 py-2 text-foreground focus:border-primary-400 outline-none"
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-muted mb-1">Learning Level Difficulty</label>
                <select 
                  value={learningLevel} 
                  onChange={(e) => setLearningLevel(e.target.value)}
                  className="w-full bg-[#2D2C2A] border border-[#3d3b38] rounded-xl px-4 py-2 text-foreground focus:border-primary-400 outline-none"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>Expert</option>
                </select>
              </div>
              <button 
                onClick={handleSaveSettings}
                className="w-full bg-[#3d3b38] hover:bg-[#4a4845] text-foreground font-medium py-2 rounded-xl mt-4 transition-colors"
              >
                Save Preferences
              </button>
            </div>

            <h3 className="text-xl font-bold text-red-400 mb-4 mt-8">Danger Zone</h3>
            <div className="space-y-3">
              <button 
                onClick={() => { if(confirm("Are you sure you want to clear your study history, chats, and progress?")) clearHistory(); }}
                className="w-full border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium py-2 rounded-xl transition-colors"
              >
                Clear All History
              </button>
              <button 
                onClick={() => { if(confirm("Are you sure you want to completely log out and delete all data?")) logout(); }}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-xl transition-colors"
              >
                Logout & Delete Data
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
