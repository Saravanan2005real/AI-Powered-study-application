"use client";

import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { CheckCircle, Circle, Target, Plus } from "lucide-react";

export default function StudyGoals() {
  const { goals, addGoal, toggleGoal } = useAppContext();
  const [newGoal, setNewGoal] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.trim()) {
      addGoal(newGoal.trim());
      setNewGoal("");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 animate-fade-in bg-background">
      <div className="max-w-4xl mx-auto flex flex-col space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-primary-400/20 text-primary-400 rounded-2xl flex items-center justify-center shadow-sm border border-primary-400/30">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground">Study Goals</h2>
            <p className="text-foreground-muted">Set and track your learning objectives</p>
          </div>
        </div>

        <form onSubmit={handleAdd} className="flex gap-4 bg-[#2D2C2A] p-4 rounded-xl border border-[#3d3b38] shadow-sm">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Add a new weekly goal..."
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder-foreground-muted"
          />
          <button 
            type="submit"
            className="flex items-center gap-2 bg-primary-400 hover:bg-primary-500 text-[#1c1b1a] px-4 py-2 rounded-lg font-bold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </form>

        <div className="space-y-3">
          {goals.length === 0 ? (
            <div className="text-center py-12 luxury-card rounded-xl border border-[#3d3b38] border-dashed">
              <Target className="w-12 h-12 text-primary-400/50 mx-auto mb-4" />
              <p className="text-foreground-muted font-medium">No goals set yet. Start by adding one above!</p>
            </div>
          ) : (
            goals.map((goal) => (
              <div 
                key={goal.id} 
                onClick={() => toggleGoal(goal.id)}
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  goal.completed 
                    ? "bg-[#2D2C2A]/50 border-[#3d3b38] opacity-70" 
                    : "bg-[#2D2C2A] border-[#3d3b38] hover:border-primary-400/50 shadow-sm"
                }`}
              >
                <div className={`flex-shrink-0 ${goal.completed ? "text-primary-400" : "text-foreground-muted"}`}>
                  {goal.completed ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                </div>
                <span className={`flex-1 font-medium text-lg ${goal.completed ? "text-foreground-muted line-through" : "text-foreground"}`}>
                  {goal.title}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
