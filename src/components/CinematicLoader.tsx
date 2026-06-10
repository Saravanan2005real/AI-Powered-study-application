"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BookOpen, BrainCircuit, Code, Atom, GraduationCap, Network, Calculator, Lightbulb } from "lucide-react";

interface CinematicLoaderProps {
  onComplete: () => void;
}

export default function CinematicLoader({ onComplete }: CinematicLoaderProps) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage 0: Initial Dark Screen
    // Stage 1: Magical Golden Lamp appears (0.5s)
    // Stage 2: Smoke emerges, Genie appears (1.5s)
    // Stage 3: Genie rises, summons Book (2.5s)
    // Stage 4: Book opens, particles burst (3.5s)
    // Stage 5: Final Golden Flash (6.0s) -> extends duration slightly for reading
    // End: Complete (6.5s)

    const timers = [
      setTimeout(() => setStage(1), 500),
      setTimeout(() => setStage(2), 1500),
      setTimeout(() => setStage(3), 2800),
      setTimeout(() => setStage(4), 4000),
      setTimeout(() => setStage(5), 6500),
      setTimeout(() => onComplete(), 7200)
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // Loading text cycler
  const [textIndex, setTextIndex] = useState(0);
  const texts = [
    "Awakening EduGenie...",
    "Gathering Knowledge...",
    "Preparing Your Learning Journey...",
    "Generating Smart Learning Experience..."
  ];

  useEffect(() => {
    if (stage >= 1 && stage < 5) {
      const interval = setInterval(() => {
        setTextIndex((i) => (i + 1) % texts.length);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [stage, texts.length]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0B0B0F] overflow-hidden" style={{ perspective: "1000px" }}>
      
      {/* Ambient background glow */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_0%,transparent_60%)]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: stage >= 1 ? 1 : 0, scale: stage >= 4 ? 1.5 : 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      {/* Main container for storytelling */}
      <div className="relative w-full max-w-2xl h-[500px] flex items-center justify-center pointer-events-none">
        
        {/* Stage 1 & 2: The Lamp */}
        <AnimatePresence>
          {stage >= 1 && stage < 5 && (
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.5 }}
              animate={{
                y: stage >= 2 ? 150 : 80,
                opacity: stage >= 2 ? 0.3 : 1,
                scale: stage >= 3 ? 0.8 : 1
              }}
              exit={{ opacity: 0, scale: 0, y: 200 }}
              transition={{ duration: 1.5, type: "spring", bounce: 0.3 }}
              className="absolute drop-shadow-[0_0_25px_rgba(212,175,55,0.8)] text-[#D4AF37]"
            >
              {/* Complex Lamp SVG */}
              <svg width="160" height="100" viewBox="0 0 160 100" fill="currentColor">
                <path d="M120,60 C130,60 140,50 140,40 C140,30 130,30 130,30 C130,30 120,40 120,40 C110,40 100,30 100,30 C80,30 60,15 60,15 C60,15 40,30 20,30 C10,30 0,20 0,40 C0,60 20,60 20,60 L120,60 Z" />
                <path d="M40,60 C40,80 80,80 80,60" />
                <path d="M60,15 C60,10 70,0 80,10" fill="none" stroke="currentColor" strokeWidth="4" />
                <circle cx="80" cy="10" r="4" fill="#FFD700" />
                {/* Decorative lines */}
                <path d="M20 40 Q40 30 60 40 T100 40 Q120 30 140 40" stroke="#FFD700" strokeWidth="2" fill="none" />
                <path d="M30 50 Q50 40 70 50 T110 50 Q130 40 130 50" stroke="#FFD700" strokeWidth="2" fill="none" />
              </svg>
              
              {/* Lamp Particles */}
              {stage === 1 && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2">
                  <motion.div
                    animate={{ y: [-10, -50], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-[#FFD700] shadow-[0_0_8px_#FFD700]"
                  />
                  <motion.div
                    animate={{ y: [-5, -40], x: [0, 20], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
                    className="w-1 h-1 rounded-full bg-[#D4AF37] shadow-[0_0_5px_#D4AF37]"
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 2 & 3: Smoke into Genie */}
        <AnimatePresence>
          {stage >= 2 && stage < 5 && (
            <motion.div
              initial={{ y: 80, opacity: 0, scale: 0.3, filter: "blur(20px)" }}
              animate={{
                y: stage >= 3 ? -60 : 20,
                opacity: 1,
                scale: stage >= 3 ? 1.2 : 1,
                filter: "blur(0px)"
              }}
              exit={{ opacity: 0, scale: 2, filter: "blur(30px)" }}
              transition={{ duration: 1.8, type: "spring", bounce: 0.4 }}
              className="absolute z-10 drop-shadow-[0_0_35px_rgba(255,215,0,0.6)]"
            >
              <div className="relative flex flex-col items-center">
                {/* Premium Abstract Genie SVG */}
                <svg width="140" height="200" viewBox="0 0 140 200" className="text-[#FFD700]">
                  <defs>
                    <linearGradient id="genieGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FFF4CE" />
                      <stop offset="40%" stopColor="#FFD700" />
                      <stop offset="70%" stopColor="#D4AF37" />
                      <stop offset="100%" stopColor="#B8860B" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Floating Tail */}
                  <path d="M70,140 C90,160 50,180 70,200 C50,180 90,160 70,140 Z" fill="url(#genieGrad)" />
                  
                  {/* Torso */}
                  <path d="M40,70 C40,40 100,40 100,70 C110,100 90,140 70,140 C50,140 30,100 40,70 Z" fill="url(#genieGrad)" />
                  
                  {/* Head */}
                  <circle cx="70" cy="40" r="25" fill="url(#genieGrad)" />
                  
                  {/* Face details */}
                  <circle cx="60" cy="35" r="4" fill="#0B0B0F" />
                  <circle cx="80" cy="35" r="4" fill="#0B0B0F" />
                  <path d="M65,45 Q70,52 75,45" stroke="#0B0B0F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  
                  {/* Tiny scholar glasses (appear at Stage 4) */}
                  {stage >= 4 && (
                     <g className="text-[#0B0B0F]" stroke="currentColor" strokeWidth="2" fill="none">
                       <circle cx="60" cy="35" r="8" />
                       <circle cx="80" cy="35" r="8" />
                       <line x1="68" y1="35" x2="72" y2="35" strokeWidth="2" />
                       <line x1="52" y1="35" x2="45" y2="30" strokeWidth="1.5" />
                       <line x1="88" y1="35" x2="95" y2="30" strokeWidth="1.5" />
                     </g>
                  )}
                  
                  {/* Magical Hand Waving (Stage 3) */}
                  {stage === 3 && (
                     <path d="M100,70 Q120,60 115,40" stroke="url(#genieGrad)" strokeWidth="6" strokeLinecap="round" fill="none" filter="url(#glow)" />
                  )}
                </svg>

                {/* Ambient breathing animation */}
                {stage >= 3 && (
                  <motion.div
                    className="absolute inset-0 bg-[#FFD700] rounded-full mix-blend-overlay blur-3xl"
                    animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 3 & 4: Book appears and opens */}
        <AnimatePresence>
          {stage >= 3 && stage < 5 && (
            <motion.div
              initial={{ x: 120, y: 0, opacity: 0, rotateY: 90, scale: 0.5 }}
              animate={{
                x: stage >= 4 ? 0 : 80,
                y: stage >= 4 ? 40 : -20,
                opacity: 1,
                rotateY: stage >= 4 ? 0 : 35,
                scale: stage >= 4 ? 1.5 : 1
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
              className="absolute z-20"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="relative text-[#FFD700] drop-shadow-[0_0_25px_rgba(212,175,55,1)]">
                <BookOpen size={stage >= 4 ? 80 : 64} strokeWidth={1.2} />
                
                {/* Book particles bursting */}
                {stage >= 4 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ParticleBurst />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Stage 4: Loading Text and Golden Progress Bar */}
      <AnimatePresence>
        {stage >= 1 && stage < 5 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="absolute bottom-24 flex flex-col items-center space-y-6 z-30"
          >
            <div className="h-8 relative overflow-hidden flex items-center justify-center w-80 text-center">
              <AnimatePresence mode="wait">
                <motion.h3
                  key={textIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="text-[#FFD700] font-bold text-xl tracking-wider drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                >
                  {texts[textIndex]}
                </motion.h3>
              </AnimatePresence>
            </div>
            
            {/* Progress bar container */}
            <div className="w-80 h-1.5 bg-[#2D2C2A]/50 rounded-full overflow-hidden relative shadow-inner">
              <motion.div 
                className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-[#D4AF37] via-[#FFDF73] to-[#D4AF37] rounded-full shadow-[0_0_15px_rgba(255,215,0,0.9)] bg-[length:200%_auto]"
                animate={{
                  width: "100%",
                  backgroundPosition: ["0% center", "200% center"]
                }}
                transition={{
                  width: { duration: 6, ease: "easeInOut" },
                  backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" }
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage 5: Final Golden Flash Transition */}
      <AnimatePresence>
        {stage >= 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-[#FFD700] z-[200] flex items-center justify-center shadow-[inset_0_0_100px_#FFFFFF]"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, filter: "blur(20px)" }}
              animate={{ scale: 1.2, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-[#0B0B0F] text-5xl md:text-7xl font-extrabold tracking-tighter flex items-center gap-4"
            >
              <Sparkles size={64} className="text-[#0B0B0F]" strokeWidth={2} />
              EduGenie
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Sub-component for rendering hundreds of tiny particles resolving into educational icons
interface Particle {
  id: number;
  iconIndex: number;
  x: number;
  y: number;
  scale: number;
  rotate: number;
  duration: number;
  delay: number;
  isIcon: boolean;
  iconSize: number;
  dotWidth: number;
  dotHeight: number;
}

function ParticleBurst() {
  const icons = [BrainCircuit, Code, Atom, GraduationCap, Network, Calculator, Lightbulb, Sparkles];
  
  const [particles] = useState<Particle[]>(() => {
    return Array.from({ length: 36 }).map((_, i) => {
      const angle = (i / 36) * Math.PI * 2 + (Math.random() * 0.5);
      const radius = 80 + Math.random() * 200;
      
      return {
        id: i,
        iconIndex: i % icons.length,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius - (50 + Math.random() * 100),
        scale: 0.5 + Math.random() * 1.5,
        rotate: 360 * Math.random() * 2,
        duration: 2.5 + Math.random() * 1.5,
        delay: Math.random() * 0.2,
        isIcon: i % 3 === 0,
        iconSize: 20 + Math.random() * 16,
        dotWidth: 4 + Math.random() * 8,
        dotHeight: 4 + Math.random() * 8,
      };
    });
  });

  return (
    <>
      {particles.map((p) => {
        const Icon = icons[p.iconIndex];
        return (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 }}
            animate={{ 
              x: p.x, 
              y: p.y, 
              scale: p.scale, 
              opacity: [0, 1, 0.8, 0], 
              rotate: p.rotate 
            }}
            transition={{ 
              duration: p.duration, 
              ease: "easeOut",
              delay: p.delay
            }}
            className="absolute text-[#FFD700] drop-shadow-[0_0_12px_rgba(255,215,0,0.9)]"
          >
            {p.isIcon ? (
              <Icon size={p.iconSize} strokeWidth={1.5} />
            ) : (
              <div 
                className="rounded-full bg-[#FFF4CE] shadow-[0_0_10px_#FFD700]" 
                style={{
                  width: p.dotWidth,
                  height: p.dotHeight
                }} 
              />
            )}
          </motion.div>
        );
      })}
    </>
  );
}
