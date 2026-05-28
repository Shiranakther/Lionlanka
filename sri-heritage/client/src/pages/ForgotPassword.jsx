import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    
    setLoading(true);
    try {
      await API.post('/api/auth/forgot-password', { email });
      setIsSent(true);
      toast.success('Password reset email sent');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-deep flex items-center justify-center relative overflow-hidden py-20 px-4"
    >
      <Helmet>
        <title>Reset Password — Lion Lanka</title>
      </Helmet>

      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl backdrop-blur-xl">
          
          <Link to="/login" className="inline-flex items-center gap-2 text-muted hover:text-white mb-6 text-sm transition-colors">
             <ArrowLeft size={16} /> Back to login
          </Link>

          {!isSent ? (
            <>
              <h2 className="text-2xl font-bold text-white mb-2 font-cinzel">Reset Password</h2>
              <p className="text-muted text-sm mb-8">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-deep/50 border border-white/10 focus:border-primary rounded-xl py-3 pl-11 pr-4 text-white outline-none transition-all placeholder:text-white/20"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 font-cinzel">Check your email</h2>
              <p className="text-muted text-sm mb-8">
                We've sent a password reset link to <span className="text-white font-medium">{email}</span>.
              </p>
              <button 
                onClick={() => setIsSent(false)}
                className="text-primary text-sm hover:underline"
              >
                Try a different email address
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
