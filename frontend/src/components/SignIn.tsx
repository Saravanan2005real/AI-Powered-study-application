"use client";

import React, { useState } from "react";

interface SignInProps {
  onSignIn: () => void;
}

export default function SignIn({ onSignIn }: SignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onSignIn();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-12 px-4 sm:px-6 lg:px-8 animate-fade-in w-full">
      <div className="w-full max-w-md space-y-8 luxury-card p-8 sm:p-10">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary-600/20 text-primary-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-primary-400/30">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-foreground tracking-tight">
            Sign In to <span className="gold-gradient-text">EduGenie</span>
          </h2>
          <p className="mt-2 text-sm text-foreground-muted">
            Enter your credentials to access your personalized learning space.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground-muted mb-1">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 bg-[#1c1b1a] border border-[#3d3b38] placeholder-gray-500 text-foreground rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 focus:z-10 sm:text-sm transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground-muted mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 bg-[#1c1b1a] border border-[#3d3b38] placeholder-gray-500 text-foreground rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 focus:z-10 sm:text-sm transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-medium rounded-xl text-[#1c1b1a] bg-primary-400 hover:bg-primary-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 focus:ring-offset-[#1c1b1a] transition-all transform active:scale-[0.98] shadow-lg shadow-primary-400/20"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
