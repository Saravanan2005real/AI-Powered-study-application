"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageSquare, Target, User, BarChart2, Settings, Plus, CheckCircle } from "lucide-react";

interface SidebarProps {
  onPracticeTest?: () => void;
}

export default function Sidebar({ onPracticeTest }: SidebarProps) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="w-64 h-full bg-[#1c1b1a] border-r border-[#3d3b38] flex flex-col shadow-sm">
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary-400 flex items-center justify-center text-[#1c1b1a] font-bold text-xl shadow-lg shadow-primary-400/20">
          E
        </div>
        <h1 className="text-xl font-bold gold-gradient-text tracking-tight">EduGenie AI</h1>
      </div>

      {/* New Chat Button */}
      <div className="px-4 mb-6">
        <button className="w-full bg-[#2D2C2A] hover:bg-[#3d3b38] border border-[#3d3b38] text-primary-400 font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm">
          <Plus className="w-5 h-5" />
          New Chat
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 space-y-1">
        <NavItem href="/" icon="chat" label="Chats" active />
        <NavItem href="/" icon="target" label="Study Goals" />
        <NavItem href="/" icon="chart" label="Progress Tracker" />
        <div>
          <NavItem 
            onClick={(e) => {
              e.preventDefault();
              setShowSettings(!showSettings);
            }}
            icon="settings" 
            label="Settings" 
            active={showSettings} 
          />
          {showSettings && (
            <div className="mt-2 ml-4 pl-4 border-l border-[#3d3b38] space-y-1 animate-fade-in">
              <button onClick={() => alert("Profile clicked")} className="w-full text-left px-3 py-2 text-sm text-foreground-muted hover:text-foreground hover:bg-[#3d3b38] rounded-lg transition-colors">Profile</button>
              <button onClick={() => alert("Language clicked")} className="w-full text-left px-3 py-2 text-sm text-foreground-muted hover:text-foreground hover:bg-[#3d3b38] rounded-lg transition-colors">Language</button>
              <button onClick={() => alert("Learning Level clicked")} className="w-full text-left px-3 py-2 text-sm text-foreground-muted hover:text-foreground hover:bg-[#3d3b38] rounded-lg transition-colors">Learning Level</button>
              <button onClick={() => alert("Clear History clicked")} className="w-full text-left px-3 py-2 text-sm text-foreground-muted hover:text-foreground hover:bg-[#3d3b38] rounded-lg transition-colors">Clear History</button>
              <button onClick={() => alert("Logout clicked")} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-[#3d3b38] rounded-lg transition-colors">Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-[#3d3b38]">
        {/* Practice Test Button (Replaced Tip of the Day) */}
        <div className="mb-4">
          <button 
            onClick={onPracticeTest}
            className="w-full bg-primary-400 hover:bg-primary-500 text-[#1c1b1a] font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-lg shadow-primary-400/20"
          >
            <CheckCircle className="w-5 h-5" />
            Practice Test
          </button>
          <p className="text-xs text-center text-foreground-muted mt-2">Test your knowledge</p>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false, href = "/", onClick }: { icon: string; label: string; active?: boolean, href?: string, onClick?: (e: React.MouseEvent) => void }) {
  const getIcon = () => {
    switch (icon) {
      case 'chat': return <MessageSquare className="w-5 h-5" />;
      case 'target': return <Target className="w-5 h-5" />; 
      case 'user': return <User className="w-5 h-5" />;
      case 'chart': return <BarChart2 className="w-5 h-5" />;
      case 'settings': return <Settings className="w-5 h-5" />;
      default: return null;
    }
  };

  const className = `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
    active 
      ? "bg-primary-400/10 text-primary-400 font-medium border border-primary-400/20" 
      : "text-foreground-muted hover:bg-[#3d3b38] hover:text-foreground"
  }`;

  const content = (
    <>
      <div className="relative flex items-center justify-center">
        {getIcon()}
        {active && icon === 'settings' && (
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary-400 rounded-full border-2 border-[#1c1b1a]" />
        )}
      </div>
      {label}
    </>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
