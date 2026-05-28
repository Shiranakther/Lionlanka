import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, User, PenSquare, Bookmark, MessageSquare, LogOut, Shield } from 'lucide-react';
import { logout } from '../../store/authSlice';
import SearchBar from '../ui/SearchBar';

import logo from '../../images/lionlanka-logo.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileDropdownOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Articles', path: '/articles' },
    { name: 'Places', path: '/places' },
    { name: 'About', path: '/about' }
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'glass border-b border-white/10 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 z-50 relative">
            <img src={logo} alt="Lion Lanka Logo" className="h-14 w-auto object-contain drop-shadow-md" />
            <span className="font-cinzel font-bold text-2xl tracking-wider gradient-text hidden sm:block">
              Lion Lanka
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary relative group ${
                  location.pathname === link.path ? 'text-primary' : 'text-text-main'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 ${
                  location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-4 relative">
            
            {/* Search Toggle */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full hover:bg-white/5 transition-colors text-text-main"
            >
              <Search size={20} />
            </button>

            {/* Auth section */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                >
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl glass border border-white/10 shadow-2xl overflow-hidden py-2"
                    >
                      <div className="px-4 py-3 border-b border-white/10 mb-1">
                        <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                        <p className="text-xs text-muted truncate">@{user?.username}</p>
                      </div>
                      
                      {user?.role === 'admin' && (
                        <Link to="/admin" className="flex items-center gap-3 px-4 py-2 text-sm text-amber-400 hover:bg-amber-400/10 transition-colors">
                          <Shield size={16} /> Admin Dashboard
                        </Link>
                      )}
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-text-main hover:bg-white/5 hover:text-primary transition-colors">
                        <User size={16} /> Profile
                      </Link>
                      <Link to="/create-article" className="flex items-center gap-3 px-4 py-2 text-sm text-text-main hover:bg-white/5 hover:text-primary transition-colors">
                        <PenSquare size={16} /> Create Article
                      </Link>
                      <Link to="/saved-articles" className="flex items-center gap-3 px-4 py-2 text-sm text-text-main hover:bg-white/5 hover:text-primary transition-colors">
                        <Bookmark size={16} /> Saved Articles
                      </Link>
                      <Link to="/saved-chats" className="flex items-center gap-3 px-4 py-2 text-sm text-text-main hover:bg-white/5 hover:text-primary transition-colors">
                        <MessageSquare size={16} /> Saved Chats
                      </Link>
                      
                      <div className="h-px bg-white/10 my-1"></div>
                      
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 transition-colors text-left"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-text-main hover:text-primary transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary py-2 px-5 text-sm">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4 z-50">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-text-main">
              <Search size={22} />
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-text-main p-1"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Search Overlay Dropdown */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-4 pt-2 pb-4 border-t border-white/10"
            >
              <div className="max-w-2xl mx-auto">
                <SearchBar placeholder="Search articles, places, history..." />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-40 bg-deep/95 backdrop-blur-xl flex flex-col pt-24 px-6 md:hidden overflow-y-auto"
          >
            <nav className="flex flex-col gap-6 mb-10 text-xl font-cinzel">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`border-b border-white/10 pb-4 ${
                    location.pathname === link.path ? 'text-primary' : 'text-text-main'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {isAuthenticated ? (
              <div className="flex flex-col gap-4 mt-auto mb-8">
                <div className="flex items-center gap-4 mb-4">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-white">{user?.name}</p>
                    <p className="text-sm text-muted">@{user?.username}</p>
                  </div>
                </div>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 text-amber-400 mb-2">
                    <Shield size={18} /> Admin Dashboard
                  </Link>
                )}
                <Link to="/profile" className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <User size={18} className="text-primary" /> Profile
                </Link>
                <Link to="/create-article" className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <PenSquare size={18} className="text-primary" /> Create Article
                </Link>
                <Link to="/saved-articles" className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <Bookmark size={18} className="text-primary" /> Saved Articles
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 text-red-400 text-left mt-2">
                  <LogOut size={18} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 mt-auto mb-8 text-center">
                <Link to="/login" className="btn-ghost w-full">Login</Link>
                <Link to="/register" className="btn-primary w-full">Register</Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
