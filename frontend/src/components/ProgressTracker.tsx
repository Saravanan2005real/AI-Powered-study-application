"use client";

import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { BarChart2, Clock, CheckCircle, Target, Award, AlertCircle } from "lucide-react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function ProgressTracker() {
  const { goals, setIsMobileMenuOpen, studyHours: localStudyHours, completedTests: localCompletedTests } = useAppContext();
  
  const [stats, setStats] = useState({
    studyHours: localStudyHours,
    completedTests: localCompletedTests,
    topicsMastered: [] as string[],
    weakTopics: [] as string[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/progress`);
        if (response.data) {
          setStats({
            studyHours: response.data.studyHours || localStudyHours,
            completedTests: response.data.completedTests || localCompletedTests,
            topicsMastered: response.data.topicsMastered || [],
            weakTopics: response.data.weakTopics || []
          });
        }
      } catch (error) {
        console.error("Failed to fetch progress from backend", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [localStudyHours, localCompletedTests]); // Re-fetch if local state changes

  const completedGoals = goals.filter(g => g.completed).length;
  const totalGoals = goals.length;
  const goalProgress = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 animate-fade-in bg-background">
      <div className="max-w-4xl mx-auto flex flex-col space-y-8">
        <div className="flex items-center gap-4 mb-2">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 -ml-2 text-foreground-muted hover:bg-[#3d3b38] rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="hidden sm:flex w-12 h-12 bg-primary-400/20 text-primary-400 rounded-2xl items-center justify-center shadow-sm border border-primary-400/30">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground">Progress Tracker</h2>
            <p className="text-foreground-muted">Monitor your study journey and achievements</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="luxury-card p-6 border-t-4 border-t-primary-400 flex flex-col items-center text-center">
            <Clock className="w-8 h-8 text-primary-400 mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-1">
              {stats.studyHours.toFixed(1)} Hours
            </h3>
            <p className="text-sm text-foreground-muted">Total Study Time</p>
          </div>

          <div className="luxury-card p-6 border-t-4 border-t-[#D4AF37] flex flex-col items-center text-center">
            <CheckCircle className="w-8 h-8 text-[#D4AF37] mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-1">{stats.completedTests} Tests</h3>
            <p className="text-sm text-foreground-muted">Completed Practice Tests</p>
          </div>

          <div className="luxury-card p-6 border-t-4 border-t-[#8B7355] flex flex-col items-center text-center">
            <Target className="w-8 h-8 text-[#8B7355] mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-1">{completedGoals} / {totalGoals}</h3>
            <p className="text-sm text-foreground-muted">Goals Achieved</p>
          </div>
        </div>

        <div className="luxury-card p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6">Goal Completion Rate</h3>
          <div className="flex items-center gap-6">
            <div className="flex-1 bg-[#1c1b1a] rounded-full h-6 border border-[#3d3b38] overflow-hidden">
              <div 
                className="bg-primary-400 h-full transition-all duration-1000 ease-out"
                style={{ width: `${goalProgress}%` }}
              ></div>
            </div>
            <span className="text-2xl font-extrabold text-primary-400 min-w-[3ch]">{goalProgress}%</span>
          </div>
          <p className="mt-6 text-foreground-muted text-center max-w-lg mx-auto">
            {goalProgress === 100 && totalGoals > 0 
              ? "Amazing job! You've completed all your goals." 
              : goalProgress > 50 
                ? "Keep going! You're more than halfway there." 
                : "You've got this! Start working on your goals to see this bar fill up."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="luxury-card p-6 border-t-4 border-t-green-500">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-green-500" />
              <h3 className="text-xl font-bold text-foreground">Topics Mastered</h3>
            </div>
            {stats.topicsMastered.length > 0 ? (
              <ul className="space-y-3">
                {stats.topicsMastered.map((topic, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground bg-[#2D2C2A]/50 p-3 rounded-lg border border-green-500/20">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-foreground-muted text-center py-4 bg-[#1c1b1a] rounded-lg border border-[#3d3b38]">Take more practice tests to master topics!</p>
            )}
          </div>

          <div className="luxury-card p-6 border-t-4 border-t-red-500">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h3 className="text-xl font-bold text-foreground">Needs Review</h3>
            </div>
            {stats.weakTopics.length > 0 ? (
              <ul className="space-y-3">
                {stats.weakTopics.map((topic, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground bg-[#2D2C2A]/50 p-3 rounded-lg border border-red-500/20">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-foreground-muted text-center py-4 bg-[#1c1b1a] rounded-lg border border-[#3d3b38]">No weak topics identified yet. Keep it up!</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
