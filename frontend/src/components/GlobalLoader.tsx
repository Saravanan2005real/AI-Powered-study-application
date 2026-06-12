import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GlobalLoader({ isVisible, text = "Processing..." }: { isVisible: boolean, text?: string }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center"
        >
          <div className="w-16 h-16 rounded-full border-4 border-primary-400/20 border-t-primary-400 animate-spin mb-4"></div>
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-primary-400 font-medium tracking-wide animate-pulse"
          >
            {text}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
