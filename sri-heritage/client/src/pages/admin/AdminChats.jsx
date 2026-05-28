import React, { useState, useEffect } from 'react';
import { Search, MessageSquare } from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const AdminChats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllChats();
      setChats(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch chats');
    } finally {
      setLoading(false);
    }
  };

  const filteredChats = chats.filter(c => 
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-cinzel font-bold text-white mb-2">System Chats</h1>
          <p className="text-text-muted">Read-only view of historical AI conversations.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse h-96 bg-white/5 rounded-2xl"></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <div key={chat._id} className="glass p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                    <MessageSquare size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate" title={chat.title}>{chat.title || 'Untitled Chat'}</h3>
                    <p className="text-sm text-text-muted mt-1">By: {chat.user?.name || 'Unknown'}</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 mb-4 h-24 overflow-hidden relative">
                  <p className="text-sm text-text-main line-clamp-3">
                    {chat.messages?.[0]?.content || 'No messages'}
                  </p>
                  <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-deep/80 to-transparent"></div>
                </div>
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span>{chat.messages?.length || 0} messages</span>
                  <span>{new Date(chat.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center glass rounded-2xl border border-white/10">
              <MessageSquare className="mx-auto text-text-muted mb-3" size={32} />
              <p className="text-text-muted">No chats found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminChats;
