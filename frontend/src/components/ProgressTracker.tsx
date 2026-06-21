"use client";

import React from "react";
import { useAppContext } from "@/context/AppContext";
import { BarChart2, Clock, CheckCircle } from "lucide-react";

export default function ProgressTracker() {
  const { studyHours, completedTests, goals, setIsMobileMenuOpen } = useAppContext();
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
            <h3 className="text-xl font-bold text-foreground mb-1">{studyHours} Hours</h3>
            <p className="text-sm text-foreground-muted">Total Study Time</p>
          </div>

          <div className="luxury-card p-6 border-t-4 border-t-[#D4AF37] flex flex-col items-center text-center">
            <CheckCircle className="w-8 h-8 text-[#D4AF37] mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-1">{completedTests} Tests</h3>
            <p className="text-sm text-foreground-muted">Completed Practice Tests</p>
          </div>

          <div className="luxury-card p-6 border-t-4 border-t-[#8B7355] flex flex-col items-center text-center">
            <BarChart2 className="w-8 h-8 text-[#8B7355] mb-4" />
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
      </div>
    </div>
  );
}
