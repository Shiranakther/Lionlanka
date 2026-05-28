import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { MessageSquare, Trash2, Pin, Clock, Search, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';
import { GenericSkeleton } from '../components/ui/Skeleton';

const SavedChats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchChats = async () => {
    try {
      const res = await API.get('/api/chats');
      setChats(res.data.chats);
    } catch (error) {
      toast.error('Failed to load chat history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this chat session?')) return;
    
    try {
      await API.delete(`/api/chats/${id}`);
      setChats(chats.filter(chat => chat._id !== id));
      toast.success('Chat deleted');
    } catch (err) {
      toast.error('Failed to delete chat');
    }
  };

  const handlePin = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await API.patch(`/api/chats/${id}/pin`);
      setChats(chats.map(chat => chat._id === id ? res.data.chat : chat));
    } catch (err) {
      toast.error('Failed to pin chat');
    }
  };

  // Sort: pinned first, then by updated date
  const filteredAndSortedChats = chats
    .filter(chat => chat.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (a.isPinned === b.isPinned) {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
      return a.isPinned ? -1 : 1;
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-deep pt-24 pb-20"
    >
      <Helmet>
        <title>Chat History — Lion Lanka</title>
      </Helmet>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <MessageSquare size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-cinzel font-bold text-white">Chat History</h1>
              <p className="text-muted text-sm mt-1">Your past conversations with Heritage AI.</p>
            </div>
          </div>
          
          <div className="w-full md:w-64 relative">
             <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
             <input 
               type="text" 
               placeholder="Search sessions..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-text-main outline-none focus:border-primary transition-colors"
             />
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => <GenericSkeleton key={i} height={80} className="rounded-xl" />)}
          </div>
        ) : filteredAndSortedChats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredAndSortedChats.map((chat) => (
                <motion.div
                  key={chat._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group relative bg-surface border border-white/5 hover:border-primary/30 rounded-2xl p-5 transition-all cursor-pointer overflow-hidden flex flex-col"
                  onClick={() => {
                      // Logic to open this specific chat in the FAB window.
                      // This could involve updating a Redux state or local storage that the ChatbotWindow reads on mount.
                      // For this implementation, we will assume setting a local storage key and triggering the custom event
                      localStorage.setItem('activeChatId', chat._id);
                      window.dispatchEvent(new CustomEvent('open-chatbot'));
                  }}
                >
                  {/* Pinned Indicator BG */}
                  {chat.isPinned && (
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/20 to-transparent pointer-events-none rounded-tr-2xl"></div>
                  )}

                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-white truncate pr-8 font-cinzel text-lg">{chat.title}</h3>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => handlePin(chat._id, e)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-muted hover:text-white transition-colors"
                        title={chat.isPinned ? "Unpin" : "Pin"}
                      >
                        <Pin size={16} className={chat.isPinned ? "fill-primary text-primary" : ""} />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(chat._id, e)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-muted line-clamp-2 mb-4 flex-1">
                    {chat.messages && chat.messages.length > 0 
                      ? chat.messages[chat.messages.length - 1].content 
                      : 'Empty session'}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <Clock size={12} />
                      <span>{formatDate(chat.updatedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-primary">
                       <span>{chat.messages?.length || 0} msgs</span>
                       <ExternalLink size={12} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20 bg-surface border border-white/5 rounded-3xl mt-8">
            <MessageSquare size={40} className="mx-auto text-muted mb-4 opacity-50" />
            <h3 className="text-xl font-cinzel text-white mb-2">No chat history</h3>
            <p className="text-muted text-sm">
              {searchQuery ? 'No chats matched your search.' : 'Start a conversation with Heritage AI to see it here.'}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SavedChats;
