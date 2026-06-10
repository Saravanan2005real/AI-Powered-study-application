"use client";

import React, { useState } from "react";

interface StudentFormProps {
  onSubmit: (data: { name: string; grade: string; subject: string; goal: string; question: string }) => void;
}

export default function StudentForm({ onSubmit }: StudentFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    subject: "",
    goal: "",
    question: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] py-6 px-4 sm:px-6 lg:px-8 animate-fade-in w-full">
      <div className="w-full max-w-md luxury-card p-6 sm:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col relative pb-8">
        <div className="text-center shrink-0">
          <div className="mx-auto w-12 h-12 bg-primary-600/20 text-primary-400 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-primary-400/30">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Welcome to <span className="gold-gradient-text">EduGenie</span>
          </h2>
          <p className="mt-2 text-sm text-foreground-muted">
            Please tell us a bit about your learning goals today before we start.
          </p>
        </div>
        <form className="mt-6 flex flex-col space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground-muted mb-1">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 bg-[#1c1b1a] border border-[#3d3b38] placeholder-gray-500 text-foreground rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 focus:z-10 sm:text-sm transition-colors"
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-foreground-muted mb-1">Class / Grade</label>
                <input
                  id="grade"
                  name="grade"
                  type="text"
                  required
                  value={formData.grade}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-4 py-3 bg-[#1c1b1a] border border-[#3d3b38] placeholder-gray-500 text-foreground rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 focus:z-10 sm:text-sm transition-colors"
                  placeholder="e.g. 10th Grade"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-foreground-muted mb-1">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-4 py-3 bg-[#1c1b1a] border border-[#3d3b38] placeholder-gray-500 text-foreground rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 focus:z-10 sm:text-sm transition-colors"
                  placeholder="e.g. Physics"
                />
              </div>
            </div>
            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-foreground-muted mb-1">Learning Goal</label>
              <input
                id="goal"
                name="goal"
                type="text"
                required
                value={formData.goal}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 bg-[#1c1b1a] border border-[#3d3b38] placeholder-gray-500 text-foreground rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 focus:z-10 sm:text-sm transition-colors"
                placeholder="What do you want to achieve?"
              />
            </div>
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-foreground-muted mb-1">Detailed Doubt / Question</label>
              <textarea
                id="question"
                name="question"
                required
                rows={2}
                value={formData.question}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 bg-[#1c1b1a] border border-[#3d3b38] placeholder-gray-500 text-foreground rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 focus:z-10 sm:text-sm transition-colors resize-none"
                placeholder="Describe your question or doubt in detail..."
              />
            </div>
          </div>

          <div className="pt-2 sticky bottom-0 z-10 pb-1">
            <button
              type="submit"
              className="group relative w-full flex justify-center items-center h-[56px] px-4 border border-transparent text-base font-bold rounded-xl text-[#141413] bg-gradient-to-r from-[#D4AF37] via-[#FFDF73] to-[#D4AF37] bg-[length:200%_auto] hover:bg-right focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] focus:ring-offset-[#1c1b1a] transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.7)]"
            >
              Start Learning Journey
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
