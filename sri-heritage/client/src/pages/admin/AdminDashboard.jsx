import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, MapPin, MessageSquare, TrendingUp, Activity, Settings } from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse h-64 bg-white/5 rounded-2xl"></div>;
  }

  const statCards = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: <Users size={24} />, color: 'text-blue-400', bg: 'bg-blue-400/10', path: '/admin/users' },
    { title: 'Total Articles', value: stats?.totalArticles || 0, icon: <FileText size={24} />, color: 'text-green-400', bg: 'bg-green-400/10', path: '/admin/articles' },
    { title: 'Total Places', value: stats?.totalPlaces || 0, icon: <MapPin size={24} />, color: 'text-amber-400', bg: 'bg-amber-400/10', path: '/admin/places' },
    { title: 'Total Chats', value: stats?.totalChats || 0, icon: <MessageSquare size={24} />, color: 'text-purple-400', bg: 'bg-purple-400/10', path: '/admin/chats' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-cinzel font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-text-muted">Welcome to the Lion Lanka admin portal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <Link key={idx} to={card.path} className="glass p-6 rounded-2xl border border-white/10 hover:border-white/40 hover:bg-white/5 transition-all flex items-center gap-4 cursor-pointer">
            <div className={`p-4 rounded-xl ${card.bg} ${card.color}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-text-muted text-sm">{card.title}</p>
              <h3 className="text-3xl font-bold text-white">{card.value}</h3>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div>
             <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Homepage Config</h3>
              <Settings className="text-text-muted" size={20} />
            </div>
            <p className="text-text-muted mb-6">Customize the landing page's hero texts, chatbot promos, newsletter texts, stats, and timelines.</p>
          </div>
          <Link to="/admin/homepage" className="btn-primary py-3 text-center w-full block">Manage Homepage Content</Link>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">System Status</h3>
              <TrendingUp className="text-text-muted" size={20} />
            </div>
            <div className="flex flex-col items-center justify-center h-24 space-y-4">
              <div className="w-16 h-16 rounded-full border-4 border-green-400/20 border-t-green-400 flex items-center justify-center">
                <span className="text-lg font-bold text-green-400">99%</span>
              </div>
              <p className="text-text-muted text-sm">System Health Score</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
