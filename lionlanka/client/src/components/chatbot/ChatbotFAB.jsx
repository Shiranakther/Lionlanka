import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import ChatbotWindow from './ChatbotWindow';
import logo from '../../images/lionlanka-logo.png';

const ChatbotFAB = ({ hasUnread = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-chatbot', handleOpen);
    return () => window.removeEventListener('open-chatbot', handleOpen);
  }, []);
  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-7 right-7 z-50 flex items-center gap-3">
        {/* Tooltip (only when closed) */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="hidden md:block glass border border-primary/30 px-4 py-2 rounded-xl shadow-lg backdrop-blur-md bg-deep/80"
            >
              <p className="text-sm font-medium text-text-main whitespace-nowrap">
                LionLanka AI — <span className="text-primary">Ask about history</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAB Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-[0_8px_32px_rgba(139,92,246,0.3)] bg-gradient-to-tr from-blue-900 to-indigo-600 border border-blue-400/20 z-50 focus:outline-none"
        >
          {/* Animated glow ring behind */}
          <div className="absolute inset-0 rounded-full animate-pulse-glow bg-blue-600 mix-blend-screen pointer-events-none"></div>

          {/* Unread badge */}
          {hasUnread && !isOpen && (
            <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-orange-500 rounded-full border-2 border-deep shadow-sm"></div>
          )}

          {/* Icon transition */}
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} className="text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <img src={logo} alt="Chat" className="w-8 h-8 object-contain drop-shadow-md" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Chat Window */}
      <ChatbotWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default ChatbotFAB;
