import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trash2, Minus, Send, Mic, MicOff, Volume2, VolumeX, Maximize2, Minimize2, Bookmark, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import html2canvas from 'html2canvas';
import { useChatbot } from '../../hooks/useChatbot';
import { SUGGESTED_PROMPTS } from '../../utils/constants';
import { formatTime } from '../../utils/helpers';
import { parseChatTags } from '../../utils/chatParser';
import logo from '../../images/lionlanka-logo.png';
import WikiImage from './WikiImage';
import ChatMap from './ChatMap';
import FollowUpChips from './FollowUpChips';
import API from '../../services/api';
import { useSelector } from 'react-redux';

const ChatbotWindow = ({ isOpen, onClose }) => {
  const { messages, isLoading, error, sendMessage, clearChat } = useChatbot();
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [readingId, setReadingId] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [chatLang, setChatLang] = useState(localStorage.getItem('chatLang') || 'en');
  const [toast, setToast] = useState('');
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const audioRef = useRef(null);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Append language instruction silently if not English
    const instruction = chatLang === 'si' ? ' (Please respond in Sinhala)' : 
                        chatLang === 'ta' ? ' (Please respond in Tamil)' : '';
    await sendMessage(userText + instruction, userText);
  };

  const handleLangChange = async (lang) => {
    setChatLang(lang);
    localStorage.setItem('chatLang', lang);
    
    // If there is a previous user message, re-ask it automatically
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      const instruction = lang === 'si' ? ' (Please translate your last response to Sinhala)' : 
                          lang === 'ta' ? ' (Please translate your last response to Tamil)' : 
                          ' (Please translate your last response to English)';
      await sendMessage(instruction, `Translate to ${lang === 'si' ? 'Sinhala' : lang === 'ta' ? 'Tamil' : 'English'}`);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      showToast('Please login to save chats.');
      return;
    }
    if (messages.length === 0) {
      showToast('No messages to save.');
      return;
    }
    try {
      const formattedMessages = messages.map(m => ({
        role: m.role === 'assistant' ? 'ai' : m.role,
        content: m.content || ''
      }));
      
      const firstUserMsg = formattedMessages.find(m => m.role === 'user');
      const title = firstUserMsg ? firstUserMsg.content.substring(0, 30) + '...' : 'Saved Chat';

      await API.post('/api/chats', {
        title,
        messages: formattedMessages,
        isPinned: true
      });
      showToast('Full chat saved to your collection →');
    } catch (err) {
      showToast('Failed to save chat.');
    }
  };



  const formatMsgTime = (timestamp) => {
      if(!timestamp) return '';
      const d = new Date(timestamp);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleTTS = (id, text) => {
    if (readingId === id) {
      window.speechSynthesis.cancel();
      setReadingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    
    const { cleanText } = parseChatTags(text);
    const plainText = cleanText.replace(/[*#`_]/g, '');
    
    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.lang = chatLang === 'si' ? 'si-LK' : chatLang === 'ta' ? 'ta-IN' : 'en-US';
    utterance.onend = () => setReadingId(null);
    utterance.onerror = () => setReadingId(null);
    
    setReadingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const windowClasses = isFullScreen 
    ? "fixed inset-0 z-50 flex flex-col bg-deep/95 backdrop-blur-md sm:p-4" 
    : "fixed inset-x-4 top-16 bottom-24 z-50 flex flex-col overflow-hidden bg-deep/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl sm:inset-x-auto sm:top-auto sm:bottom-24 sm:right-7 sm:w-[400px] sm:h-[600px]";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={isFullScreen ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 }}
          animate={isFullScreen ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={isFullScreen ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={windowClasses}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-surface/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center overflow-hidden border border-primary/50 p-1.5 shadow-md">
                <img src={logo} alt="Lion Lanka AI" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-cinzel font-bold text-white leading-tight">Lion Lanka AI</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[10px] text-white/60">Online</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex bg-black/30 rounded-lg p-0.5 border border-white/5 mr-2">
                {['en', 'si', 'ta'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => handleLangChange(lang)}
                    className={`px-2 py-0.5 text-xs rounded-md transition-colors ${chatLang === lang ? 'bg-primary/40 text-white' : 'text-white/40 hover:text-white/80'}`}
                  >
                    {lang === 'si' ? 'සිං' : lang === 'ta' ? 'தமிழ்' : 'EN'}
                  </button>
                ))}
              </div>
              <button 
                onClick={clearChat}
                className="p-2 text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                title="Clear Chat"
              >
                <Trash2 size={16} />
              </button>
              <button 
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="p-2 text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button 
                onClick={onClose}
                className="p-2 text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <Minus size={16} />
              </button>
            </div>
          </div>

          {/* Toast */}
          <AnimatePresence>
            {toast && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="absolute top-16 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-4 py-2 rounded-full shadow-lg z-50"
              >
                {toast}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/40 to-blue-500/40 flex items-center justify-center mb-4 border border-primary/30 p-3 shadow-lg backdrop-blur-sm">
                  <img src={logo} alt="Lion Lanka AI" className="w-full h-full object-contain drop-shadow-md" />
                </div>
                <h4 className="font-cinzel text-lg text-white mb-2">Welcome to Lion Lanka AI</h4>
                <p className="text-sm text-white/60 mb-8">
                  Ask me anything about Sri Lankan history, ancient kingdoms, or cultural heritage.
                </p>
                <div className="flex flex-col gap-2 w-full">
                  {SUGGESTED_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(prompt)}
                      className="text-xs bg-white/5 hover:bg-white/10 text-white/80 border border-white/5 rounded-lg py-2.5 px-4 transition-all text-left truncate"
                    >
                      "{prompt}"
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg, idx) => {
                  const { cleanText, image, map, maps, followUps } = msg.role === 'assistant' 
                    ? parseChatTags(msg.content) 
                    : { cleanText: msg.content };

                  return (
                    <div key={msg.id || idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div id={`msg-${msg.id}`} className={`max-w-[85%] md:max-w-2xl lg:max-w-3xl ${
                        msg.role === 'user' 
                          ? 'bg-gradient-to-br from-primary to-blue-600 text-white rounded-[16px_16px_4px_16px]' 
                          : 'bg-primary/10 border border-primary/20 text-text-main rounded-[16px_16px_16px_4px]'
                      } px-4 py-3 shadow-sm overflow-hidden`}
                      >
                        {msg.role === 'user' ? (
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{cleanText}</p>
                        ) : (
                          <div className="text-sm leading-relaxed">
                            <ReactMarkdown
                              components={{
                                p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                                strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                                li: ({node, ...props}) => <li className="pl-1" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-lg font-cinzel font-bold text-white mt-4 mb-2" {...props} />,
                                h4: ({node, ...props}) => <h4 className="text-base font-cinzel font-bold text-white mt-3 mb-2" {...props} />,
                              }}
                            >
                              {cleanText}
                            </ReactMarkdown>

                            {/* Render Wiki Image if tag present */}
                            {image && <WikiImage title={image} />}

                            {/* Render Map if tag present */}
                            {(map || maps.length > 0) && <ChatMap map={map} maps={maps} />}

                            {/* Render FollowUp chips if present */}
                            {followUps.length > 0 && !isLoading && (
                              <FollowUpChips questions={followUps} onSelect={(q) => sendMessage(q, q)} />
                            )}
                          </div>
                        )}
                        <div className={`flex items-center mt-2 pt-2 border-t border-white/5 ${msg.role === 'user' ? 'justify-end' : 'justify-between'}`}>
                          {msg.role === 'assistant' && !isLoading && (
                            <div className="flex gap-1">
                              <button 
                                onClick={() => handleTTS(msg.id, cleanText)}
                                className={`p-1.5 rounded-md transition-colors ${readingId === msg.id ? 'text-accent bg-accent/10' : 'text-muted hover:text-white hover:bg-white/5'}`}
                                title={readingId === msg.id ? "Stop reading" : "Read aloud"}
                              >
                                {readingId === msg.id ? <VolumeX size={14} /> : <Volume2 size={14} />}
                              </button>
                              <button 
                                onClick={handleBookmark}
                                className="p-1.5 rounded-md transition-colors text-muted hover:text-white hover:bg-white/5"
                                title="Save full chat"
                              >
                                <Bookmark size={14} />
                              </button>
                            </div>
                          )}
                          <span className={`text-[10px] ${msg.role === 'user' ? 'text-white/60' : 'text-muted'}`}>
                            {formatMsgTime(msg.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-primary/10 border border-primary/20 rounded-[16px_16px_16px_4px] px-4 py-3">
                      <div className="flex gap-1.5">
                        <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                        <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {error && (
            <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/20 text-red-400 text-xs text-center">
              {error}
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-white/10 bg-surface/50">
            <form onSubmit={handleSubmit} className="flex gap-2 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder={chatLang === 'si' ? 'මෙහි ලියන්න...' : chatLang === 'ta' ? 'இங்கே தட்டச்சு செய்க...' : "Ask about history..."}
                className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-primary/50 resize-none max-h-32 scrollbar-hide"
                rows={1}
                disabled={isLoading}
              />
              <div className="absolute right-14 top-1/2 -translate-y-1/2">
                <button
                  type="button"
                  onClick={() => setIsListening(!isListening)}
                  className={`p-2 rounded-lg transition-colors ${
                    isListening ? 'text-red-400 bg-red-400/10' : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                  disabled={isLoading}
                >
                  {isListening ? <Mic size={18} /> : <MicOff size={18} />}
                </button>
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-primary hover:bg-primary-light disabled:opacity-50 disabled:hover:bg-primary text-white p-3 rounded-xl transition-colors flex items-center justify-center shrink-0 self-end"
              >
                <Send size={18} className={input.trim() && !isLoading ? 'translate-x-0.5 -translate-y-0.5 transition-transform' : ''} />
              </button>
            </form>
            <div className="text-center mt-2">
              <span className="text-[10px] text-white/30">
                Lion Lanka AI can make mistakes. Verify important facts.
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatbotWindow;
