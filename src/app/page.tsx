"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatMessage from "@/components/ChatMessage";
import QuickActions from "@/components/QuickActions";
import ChatInput from "@/components/ChatInput";
import StudentForm from "@/components/StudentForm";
import DocumentViewer from "@/components/DocumentViewer";

export default function Home() {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);
  const [showPracticeTest, setShowPracticeTest] = useState(false);

  const handleFormSubmit = (data: any) => {
    setStudentData(data);
    setIsFormSubmitted(true);
  };

  const handlePracticeTest = () => {
    setShowPracticeTest(true);
  };

  if (!isFormSubmitted) {
    return (
      <div className="flex h-screen bg-background overflow-hidden selection:bg-primary-400/30 selection:text-primary-400">
        <StudentForm onSubmit={handleFormSubmit} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary-400/30 selection:text-primary-400">
      {/* Sidebar - Hidden on mobile, block on md+ */}
      <div className="hidden md:block w-64 flex-shrink-0 border-r border-[#3d3b38]">
        <Sidebar onPracticeTest={handlePracticeTest} />
      </div>

      {/* Main Content Area - Dual Layout */}
      <div className="flex-1 flex flex-col md:flex-row h-full max-w-full overflow-hidden">
        
        {/* Left Side: AI Chat */}
        <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-background">
          {/* Header */}
          <header className="flex-shrink-0 border-b border-[#3d3b38] bg-[#2D2C2A]/80 backdrop-blur-md px-6 py-4 sticky top-0 z-10 shadow-sm">
            <div className="flex items-center justify-between mx-auto">
              <div className="flex items-center gap-4">
                <button className="md:hidden p-2 -ml-2 text-foreground-muted hover:bg-[#3d3b38] rounded-lg transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div>
                  <h2 className="text-xl font-bold text-foreground tracking-tight">EduGenie AI</h2>
                  <p className="text-sm text-foreground-muted font-medium">Your personalized learning companion</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <button className="p-2 text-foreground-muted hover:text-primary-400 hover:bg-[#3d3b38] rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          {/* Scrollable Chat Area */}
          <div className="flex-1 overflow-y-auto px-4 py-8">
            <div className="max-w-4xl mx-auto flex flex-col">
              
              {/* Welcome State based on Form */}
              <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
                <div className="w-16 h-16 bg-primary-400/20 text-primary-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-primary-400/30">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Welcome, {studentData?.name || "Student"}!</h3>
                <p className="text-foreground-muted max-w-md">I see you are focusing on <span className="text-primary-400 font-medium">{studentData?.subject}</span> to <span className="text-primary-400 font-medium">{studentData?.goal}</span>. How can I help you today?</p>
                
                {/* <QuickActions />  -- keeping existing functionality */}
                <div className="mt-8 w-full">
                  <QuickActions />
                </div>
              </div>

              {/* Initial Form Question */}
              {studentData?.question && !showPracticeTest && (
                <div className="mt-4 border-t border-[#3d3b38] pt-8 pb-4">
                  <ChatMessage 
                    role="user" 
                    content={studentData.question} 
                  />
                  <ChatMessage 
                    role="ai" 
                    content={`That's an excellent question about ${studentData.subject}. Let me break this down for you based on your goal to ${studentData.goal}. Please refer to the document viewer on the right if you have any study materials you'd like me to analyze along with my explanation!`} 
                  />
                </div>
              )}

              {/* Practice Test Generated Content */}
              {showPracticeTest && (
                <div className="mt-4 border-t border-[#3d3b38] pt-8 pb-4 animate-fade-in">
                  <ChatMessage 
                    role="user" 
                    content="Generate a practice test based on my current study goals." 
                  />
                  <ChatMessage 
                    role="ai" 
                    content={`Certainly! Here is a practice test for ${studentData.subject || 'your subject'}:\n\n1. What is the fundamental principle behind this concept?\n2. Can you explain a real-world application of this theory?\n3. How does this connect to your goal of ${studentData.goal || 'learning'}?\n\nTake your time to answer these, and I'll provide feedback on your responses.`} 
                  />
                </div>
              )}

            </div>
          </div>

          {/* Fixed Input Area */}
          <div className="flex-shrink-0 bg-[#2D2C2A]/80 backdrop-blur-md">
            <ChatInput />
          </div>
        </div>

        {/* Right Side: Document Viewer (Hidden on small screens) */}
        <div className="hidden lg:block lg:w-1/3 xl:w-2/5 flex-shrink-0 h-full">
          <DocumentViewer />
        </div>

      </div>
    </div>
  );
}
