"use client";

import React from "react";
import { BookOpen, Target, PenTool } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function QuickActions() {
  const { studentData } = useAppContext();

  const actions = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Explain Concept",
      description: `Break down a difficult topic in ${studentData?.subject || "your subject"}`,
      prompt: `Can you explain a fundamental concept in ${studentData?.subject || "my subject"} that will help me ${studentData?.goal || "reach my goals"}?`
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Study Plan",
      description: `Create a schedule to ${studentData?.goal || "achieve your goals"}`,
      prompt: `Create a 7-day study plan for ${studentData?.subject || "my subject"} to help me ${studentData?.goal || "succeed"}.`
    },
    {
      icon: <PenTool className="w-5 h-5" />,
      title: "Practice Quiz",
      description: `Test your knowledge in ${studentData?.subject || "your subject"}`,
      prompt: `Generate a quick 5-question quiz about ${studentData?.subject || "my subject"} to test my knowledge.`
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {actions.map((action, idx) => (
        <button 
          key={idx}
          className="bg-[#2D2C2A] border border-[#3d3b38] hover:border-primary-400 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] p-4 rounded-2xl flex flex-col items-start gap-3 transition-all duration-300 group text-left h-full"
          onClick={() => {
            const textarea = document.querySelector('textarea');
            if (textarea) {
              const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
              nativeInputValueSetter?.call(textarea, action.prompt);
              textarea.dispatchEvent(new Event('input', { bubbles: true }));
              textarea.focus();
            }
          }}
        >
          <div className="w-10 h-10 rounded-xl bg-primary-400/10 text-primary-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary-400 group-hover:text-[#1c1b1a] transition-all">
            {action.icon}
          </div>
          <div>
            <h4 className="text-foreground font-semibold mb-1 group-hover:text-primary-400 transition-colors">{action.title}</h4>
            <p className="text-xs text-foreground-muted leading-relaxed">{action.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
