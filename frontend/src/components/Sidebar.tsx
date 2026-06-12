"use client";

import React, { useState } from "react";
import { MessageSquare, Target, User, BarChart2, Settings, Plus, CheckCircle } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function Sidebar() {
  const [showSettings, setShowSettings] = useState(false);
  const { activeView, setActiveView, createNewChat, clearHistory, logout, updateSettings, chats, activeChatId, setActiveChatId } = useAppContext();

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
        <button 
          onClick={createNewChat}
          className="w-full bg-[#2D2C2A] hover:bg-[#3d3b38] border border-[#3d3b38] text-primary-400 font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          New Chat
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 space-y-1">
        <NavItem 
          onClick={() => setActiveView("chat")} 
          icon="chat" 
          label="Chats" 
          active={activeView === "chat"} 
        />
        <NavItem 
          onClick={() => setActiveView("goals")} 
          icon="target" 
          label="Study Goals" 
          active={activeView === "goals"} 
        />
        <NavItem 
          onClick={() => setActiveView("progress")} 
          icon="chart" 
          label="Progress Tracker" 
          active={activeView === "progress"} 
        />
        <div>
          <NavItem 
            onClick={(e) => {
              e?.preventDefault();
              setActiveView("settings");
            }}
            icon="settings" 
            label="Settings" 
            active={activeView === "settings"} 
          />
        </div>
      </div>

      {/* Chat History Section */}
      {chats.length > 0 && (
        <div className="px-4 mt-2 mb-2 flex-shrink-0">
          <div className="h-px bg-[#3d3b38] w-full mb-3"></div>
          <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-2 px-3">Recent Chats</h3>
          <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
            {chats.map(chat => (
              <button
                key={chat.id}
                onClick={() => {
                  setActiveChatId(chat.id);
                  setActiveView("chat");
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left truncate ${
                  activeChatId === chat.id && activeView === "chat"
                    ? "bg-[#3d3b38] text-primary-400 font-medium"
                    : "text-foreground-muted hover:bg-[#3d3b38]/50 hover:text-foreground"
                }`}
                title={chat.title}
              >
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <span className="truncate text-sm">{chat.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Section */}
      <div className="p-4 border-t border-[#3d3b38]">
        <div className="mb-4">
          <button 
            onClick={() => setActiveView("practice")}
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

function NavItem({ icon, label, active = false, onClick }: { icon: string; label: string; active?: boolean, onClick?: (e?: React.MouseEvent) => void }) {
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

  return (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  );
}
