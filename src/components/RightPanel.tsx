"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";

export default function RightPanel() {
  const [activeTab, setActiveTab] = useState<"home" | "about" | "developer">("home");

  if (activeTab === "developer") {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-8 animate-fade-in bg-[#1c1b1a]">
        <div className="luxury-card p-10 max-w-lg w-full text-center relative">
          <button 
            onClick={() => setActiveTab("home")}
            className="absolute top-4 left-4 text-foreground-muted hover:text-primary-400 transition-colors"
            title="Back to Home"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="w-24 h-24 bg-[#3d3b38] rounded-full mx-auto mb-6 flex items-center justify-center border-2 border-primary-400/50 shadow-lg">
            <Users className="w-12 h-12 text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Developer Team</h1>
          <p className="text-primary-400 font-medium mb-6">AI Engineering & UX Design</p>
          <p className="text-foreground-muted mb-8 leading-relaxed">
            The EduGenie platform is crafted by a dedicated team of engineers and designers specializing in educational AI. We are passionate about creating seamless, intelligent learning experiences that empower students worldwide.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col p-8 bg-[#1c1b1a]">
      {/* Navigation Buttons */}
      <div className="flex gap-4 mb-8 border-b border-[#3d3b38] pb-4">
        <button
          onClick={() => setActiveTab("home")}
          className={`px-6 py-2 rounded-xl font-bold transition-all duration-300 ${
            activeTab === "home" 
              ? "bg-primary-400 text-[#1c1b1a] shadow-[0_0_15px_rgba(212,175,55,0.4)]" 
              : "text-foreground-muted hover:text-foreground hover:bg-[#2D2C2A]"
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`px-6 py-2 rounded-xl font-bold transition-all duration-300 ${
            activeTab === "about" 
              ? "bg-primary-400 text-[#1c1b1a] shadow-[0_0_15px_rgba(212,175,55,0.4)]" 
              : "text-foreground-muted hover:text-foreground hover:bg-[#2D2C2A]"
          }`}
        >
          About Us
        </button>
        <Link
          href="/developer"
          className="px-6 py-2 rounded-xl font-bold text-foreground-muted hover:text-foreground hover:bg-[#2D2C2A] transition-all duration-300 flex items-center justify-center"
        >
          Developer
        </Link>
      </div>

      {/* Description Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
        {activeTab === "home" && (
          <div className="animate-fade-in space-y-6 mt-8">
            <h2 className="text-4xl font-extrabold text-foreground tracking-tight">
              Welcome to <span className="gold-gradient-text">EduGenie</span>
            </h2>
            <p className="text-lg text-foreground-muted leading-relaxed">
              EduGenie is your ultimate AI-powered personalized learning companion. Start your educational journey by filling out the form on the left. Tell us what you want to learn, and we&apos;ll adapt to your unique needs.
            </p>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-12">
              <div className="luxury-card p-6">
                <h3 className="text-xl font-bold text-primary-400 mb-2">Smart AI</h3>
                <p className="text-sm text-foreground-muted">Advanced AI that understands your pace and learning style.</p>
              </div>
              <div className="luxury-card p-6">
                <h3 className="text-xl font-bold text-primary-400 mb-2">Instant Feedback</h3>
                <p className="text-sm text-foreground-muted">Get real-time insights and corrections as you learn.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="animate-fade-in space-y-6 mt-8">
            <h2 className="text-3xl font-extrabold text-foreground">
              About Us
            </h2>
            <div className="space-y-4 text-foreground-muted leading-relaxed">
              <p>
                The EduGenie platform was created with a single vision: to democratize high-quality, personalized education for students everywhere.
              </p>
              <p>
                We believe that every student has a unique way of learning. Traditional one-size-fits-all education often leaves students behind or fails to challenge them appropriately. EduGenie changes this by leveraging advanced artificial intelligence to tailor content, pacing, and pedagogical strategies to each individual.
              </p>
              <p>
                Our platform integrates intelligent chat, document analysis, and dynamic practice testing to provide a comprehensive and engaging learning environment. Whether you are studying for a critical exam, trying to grasp a complex physics concept, or just exploring new subjects, EduGenie is here to help you achieve your goals.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
