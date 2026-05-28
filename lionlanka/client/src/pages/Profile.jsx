import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { User, Shield, Camera, Bookmark, MessageSquare, FileText, Settings, LogOut, PenSquare, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';
import { updateProfileAPI, changePasswordAPI } from '../services/authService';
import { getMyArticlesAPI, deleteArticleAPI } from '../services/articleService';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const { savedArticles } = useSelector((state) => state.articles);
  const dispatch = useDispatch();
  
  const [activeTab, setActiveTab] = useState('overview'); // overview, my-articles, settings
  const [myArticles, setMyArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  
  if (!user) return null;

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfileAPI(profileData);
      toast.success('Profile updated successfully');
      // Ideally dispatch an action to update user in Redux store here
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    setSavingPassword(true);
    try {
      await changePasswordAPI({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'my-articles') {
      fetchMyArticles();
    }
  }, [activeTab]);

  const fetchMyArticles = async () => {
    try {
      setLoadingArticles(true);
      const res = await getMyArticlesAPI();
      setMyArticles(res.data.articles || []);
    } catch (err) {
      toast.error('Failed to load your articles');
    } finally {
      setLoadingArticles(false);
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await deleteArticleAPI(id);
      setMyArticles(myArticles.filter(a => a._id !== id));
      toast.success('Article deleted successfully');
    } catch (err) {
      toast.error('Failed to delete article');
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('profileImage', file);
    try {
      await updateProfileAPI(formData);
      toast.success('Avatar updated successfully');
      // Dispatch action to update user in Redux store
    } catch (err) {
      toast.error('Failed to update avatar');
    }
  };

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const profileImage = user.profileImage ? (user.profileImage.startsWith('http') ? user.profileImage : `${API_URL}${user.profileImage}`) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-deep pt-24 pb-20"
    >
      <Helmet>
        <title>Profile | {user.name} — Lion Lanka</title>
      </Helmet>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">
        
        {/* Profile Header */}
        <div className="bg-surface border border-white/10 rounded-3xl overflow-hidden mb-8 relative">
          {/* Cover Area */}
          <div className="h-48 bg-gradient-to-r from-primary/40 to-accent/40 relative">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay opacity-50"></div>
          </div>
          
          <div className="px-8 pb-8 pt-0 relative flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-surface bg-deep overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-cinzel font-bold text-5xl">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <label className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer">
                <Camera size={16} />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              </label>
            </div>
            
            {/* Info */}
            <div className="flex-1 text-center md:text-left mb-2">
              <h1 className="text-3xl font-cinzel font-bold text-white flex items-center justify-center md:justify-start gap-3">
                {user.name} 
                {user.role === 'admin' && <Shield size={20} className="text-accent" title="Admin" />}
              </h1>
              <p className="text-muted">@{user.username}</p>
            </div>
            
            {/* Action */}
            <div className="mb-2">
              <Link to="/create-article" className="btn-primary py-2 px-4 flex items-center gap-2">
                <FileText size={16} /> Create Article
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
             <div className="bg-card border border-white/10 rounded-2xl p-4 sticky top-24">
                <nav className="flex flex-col gap-2">
                  <button 
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${activeTab === 'overview' ? 'bg-primary/20 text-primary font-medium' : 'text-text-main hover:bg-white/5'}`}
                  >
                    <User size={18} /> Overview
                  </button>
                  <button 
                    onClick={() => setActiveTab('my-articles')}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${activeTab === 'my-articles' ? 'bg-primary/20 text-primary font-medium' : 'text-text-main hover:bg-white/5'}`}
                  >
                    <FileText size={18} /> My Articles
                  </button>
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${activeTab === 'settings' ? 'bg-primary/20 text-primary font-medium' : 'text-text-main hover:bg-white/5'}`}
                  >
                    <Settings size={18} /> Settings
                  </button>
                  <div className="h-px bg-white/10 my-2"></div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-left"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </nav>
             </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Link to="/saved-articles" className="bg-surface border border-white/10 rounded-2xl p-6 flex items-center justify-between group hover:border-primary/50 transition-colors">
                    <div>
                      <p className="text-muted text-sm font-semibold uppercase tracking-wider mb-1">Saved Articles</p>
                      <p className="text-3xl font-cinzel font-bold text-white">{savedArticles.length}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Bookmark size={24} />
                    </div>
                  </Link>

                  <Link to="/saved-chats" className="bg-surface border border-white/10 rounded-2xl p-6 flex items-center justify-between group hover:border-primary/50 transition-colors">
                    <div>
                      <p className="text-muted text-sm font-semibold uppercase tracking-wider mb-1">Chat Sessions</p>
                      <p className="text-3xl font-cinzel font-bold text-white">View</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <MessageSquare size={24} />
                    </div>
                  </Link>
                </div>

                {/* Info Card */}
                <div className="bg-surface border border-white/10 rounded-2xl p-8">
                  <h3 className="text-xl font-cinzel font-bold text-white mb-6">Personal Information</h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pb-6 border-b border-white/5">
                      <div className="text-muted">Full Name</div>
                      <div className="md:col-span-2 text-white">{user.name}</div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pb-6 border-b border-white/5">
                      <div className="text-muted">Email Address</div>
                      <div className="md:col-span-2 text-white flex items-center gap-2">
                        {user.email} <span className="px-2 py-0.5 rounded text-[10px] bg-green-500/20 text-green-400 border border-green-500/30">Verified</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pb-6 border-b border-white/5">
                      <div className="text-muted">Bio</div>
                      <div className="md:col-span-2 text-text-main/80 italic">
                        {user.bio || "No bio added yet. Write something about your interest in Sri Lankan history."}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="text-muted">Member Since</div>
                      <div className="md:col-span-2 text-white">{formatDate(user.createdAt || new Date())}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'my-articles' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-cinzel font-bold text-white">My Articles</h3>
                  <Link to="/create-article" className="btn-primary py-2 px-4 text-sm flex items-center gap-2">
                    <FileText size={16} /> Write New
                  </Link>
                </div>
                
                {loadingArticles ? (
                  <div className="animate-pulse space-y-4">
                    {[1,2,3].map(n => <div key={n} className="h-24 bg-white/5 rounded-2xl"></div>)}
                  </div>
                ) : myArticles.length > 0 ? (
                  <div className="space-y-4">
                    {myArticles.map(article => (
                      <div key={article._id} className="bg-surface border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-primary/50 transition-colors">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-white mb-1 line-clamp-1">{article.title}</h4>
                          <div className="flex items-center gap-3 text-sm text-muted">
                            <span>{formatDate(article.createdAt)}</span>
                            <span className="w-1 h-1 rounded-full bg-white/20"></span>
                            <span className={article.status === 'published' ? 'text-green-400' : 'text-yellow-400 capitalize'}>
                              {article.status}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-white/20"></span>
                            <span>{article.views} views</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link to={`/articles/${article.slug}`} className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="View">
                            <ExternalLink size={18} />
                          </Link>
                          <Link to={`/edit-article/${article._id}`} className="p-2 text-text-muted hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors" title="Edit">
                            <PenSquare size={18} />
                          </Link>
                          <button onClick={() => handleDeleteArticle(article._id)} className="p-2 text-text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-surface border border-white/10 rounded-2xl">
                    <FileText size={48} className="mx-auto text-muted mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No articles yet</h3>
                    <p className="text-muted mb-6">You haven't written any articles. Share your knowledge!</p>
                    <Link to="/create-article" className="btn-primary py-2 px-6 inline-block">
                      Create Your First Article
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                {/* Profile Settings */}
                <div className="bg-surface border border-white/10 rounded-2xl p-8">
                  <h3 className="text-xl font-cinzel font-bold text-white mb-6">Account Settings</h3>
                  <p className="text-muted mb-8">Update your personal details here.</p>
                  
                  <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-muted mb-2">Full Name</label>
                        <input type="text" name="name" value={profileData.name} onChange={handleProfileChange} className="w-full bg-deep border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-sm text-muted mb-2">Username</label>
                        <input type="text" name="username" value={profileData.username} onChange={handleProfileChange} className="w-full bg-deep border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-muted mb-2">Email Address</label>
                      <input type="email" defaultValue={user.email} readOnly className="w-full bg-deep/50 border border-white/5 rounded-xl px-4 py-3 text-muted outline-none cursor-not-allowed" />
                      <p className="text-xs text-muted mt-2">Email address cannot be changed.</p>
                    </div>

                    <div>
                      <label className="block text-sm text-muted mb-2">Bio</label>
                      <textarea 
                        name="bio"
                        value={profileData.bio}
                        onChange={handleProfileChange}
                        rows={4}
                        placeholder="Tell us about yourself..."
                        className="w-full bg-deep border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary resize-none" 
                      />
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button type="submit" disabled={savingProfile} className="btn-primary">
                        {savingProfile ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Password Settings */}
                <div className="bg-surface border border-white/10 rounded-2xl p-8">
                  <h3 className="text-xl font-cinzel font-bold text-white mb-6">Change Password</h3>
                  <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-2xl">
                    <div>
                      <label className="block text-sm text-muted mb-2">Current Password</label>
                      <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required className="w-full bg-deep border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-muted mb-2">New Password</label>
                        <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required minLength={6} className="w-full bg-deep border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-sm text-muted mb-2">Confirm New Password</label>
                        <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required minLength={6} className="w-full bg-deep border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary" />
                      </div>
                    </div>
                    <div className="pt-4 flex justify-end">
                      <button type="submit" disabled={savingPassword} className="btn-primary">
                        {savingPassword ? 'Updating...' : 'Change Password'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
            
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
