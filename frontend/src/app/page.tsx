"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatMessage from "@/components/ChatMessage";
import QuickActions from "@/components/QuickActions";
import ChatInput from "@/components/ChatInput";
import StudentForm from "@/components/StudentForm";
import DocumentViewer from "@/components/DocumentViewer";
import CinematicLoader from "@/components/CinematicLoader";
import RightPanel from "@/components/RightPanel";
import { useAppContext } from "@/context/AppContext";
import { AIService } from "@/services/ai.service";

import StudyGoals from "@/components/StudyGoals";
import ProgressTracker from "@/components/ProgressTracker";
import PracticeTest from "@/components/PracticeTest";
import SettingsPanel from "@/components/SettingsPanel";

export default function Home() {
  const { studentData, setStudentData, activeView, chats, activeChatId, addMessage, setActiveView, isUploaded, isLoaded } = useAppContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(!!studentData);
  const [isLoading, setIsLoading] = useState(false);

  const activeChat = chats.find(c => c.id === activeChatId);

  const handleFormSubmit = (data: any) => {
    setStudentData(data);
    setIsLoading(true);
  };

  const handleLoaderComplete = async () => {
    setIsLoading(false);
    setIsFormSubmitted(true);
    // Auto-create initial chat if none exists
    if (!activeChatId) {
      if (studentData?.question) {
        addMessage(studentData.question, "user");
        try {
          const contextPrefix = studentData?.name ? `I am ${studentData.name}. ` : "";
          const goalPrefix = studentData?.goal ? `My study goal is ${studentData.goal}. ` : "";
          const fullMessage = `${contextPrefix}${goalPrefix}${studentData.question}`;
          const aiResponse = await AIService.sendMessage(fullMessage);
          addMessage(aiResponse, "ai");
        } catch (error: any) {
          addMessage(`Error: ${error.message || "Failed to generate AI response. Is your Groq API key valid?"}`, "ai");
        }
      }
    }
  };

  if (!isLoaded) {
    return <div className="h-screen w-full bg-background flex items-center justify-center text-primary-400">Loading EduGenie...</div>;
  }

  if (!isFormSubmitted && !isLoading && !studentData) {
    return (
      <div className="flex flex-col lg:flex-row h-screen bg-background overflow-y-auto lg:overflow-hidden selection:bg-primary-400/30 selection:text-primary-400">
        <div className="w-full lg:w-1/2 min-h-screen lg:min-h-0 lg:h-full flex flex-col border-b lg:border-b-0 lg:border-r border-[#3d3b38] overflow-y-auto custom-scrollbar">
          <StudentForm onSubmit={handleFormSubmit} />
        </div>
        
        <div className="w-full lg:w-1/2 min-h-screen lg:min-h-0 lg:h-full bg-[#1c1b1a]">
          <RightPanel />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <CinematicLoader onComplete={handleLoaderComplete} />;
  }

  const renderActiveView = () => {
    if (activeView === "goals") return <StudyGoals />;
    if (activeView === "progress") return <ProgressTracker />;
    if (activeView === "practice") return <PracticeTest />;
    if (activeView === "settings") return <SettingsPanel />;
    
    // Default to chat view
    return (
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-background">
        <header className="flex-shrink-0 border-b border-[#3d3b38] bg-[#2D2C2A]/80 backdrop-blur-md px-6 py-4 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center justify-between mx-auto">
            <div className="flex items-center gap-4">
              <button className="md:hidden p-2 -ml-2 text-foreground-muted hover:bg-[#3d3b38] rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h2 className="text-xl font-bold text-foreground tracking-tight">{activeChat ? activeChat.title : "EduGenie AI"}</h2>
                <p className="text-sm text-foreground-muted font-medium">Your personalized learning companion</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-8">
          <div className="max-w-4xl mx-auto flex flex-col">
            
            {(!activeChat || activeChat.messages.length === 0) ? (
              <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
                <div className="w-16 h-16 bg-primary-400/20 text-primary-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-primary-400/30">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Welcome, {studentData?.name || "Student"}!</h3>
                <p className="text-foreground-muted max-w-md">I see you are focusing on <span className="text-primary-400 font-medium">{studentData?.subject}</span> to <span className="text-primary-400 font-medium">{studentData?.goal}</span>. How can I help you today?</p>
                <div className="mt-8 w-full">
                  <QuickActions />
                </div>
              </div>
            ) : (
              <div className="mt-4 pt-8 pb-4">
                {activeChat.messages.map((msg) => (
                  <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
                ))}
              </div>
            )}
            
          </div>
        </div>

        <div className="flex-shrink-0 bg-[#2D2C2A]/80 backdrop-blur-md">
          <ChatInput />
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary-400/30 selection:text-primary-400">
      <div className="hidden md:block w-64 flex-shrink-0 border-r border-[#3d3b38]">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col md:flex-row h-full max-w-full overflow-hidden">
        {renderActiveView()}
        
        {/* Right Side: Document Viewer */}
        <div className="hidden lg:block lg:w-1/4 xl:w-1/4 flex-shrink-0 h-full border-l border-[#3d3b38]">
          <DocumentViewer />
        </div>
      </div>
    </div>
  );
}
