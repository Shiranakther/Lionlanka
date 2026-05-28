import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Lock, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { resetPasswordAPI } from '../services/authService';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const { password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      await resetPasswordAPI(token, { password });
      toast.success('Password reset successfully. Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
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
          <h2 className="text-2xl font-bold text-white mb-2 font-cinzel">Reset Password</h2>
          <p className="text-muted text-sm mb-8">Enter your new password below.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted ml-1">New Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  className="w-full bg-deep/50 border border-white/10 focus:border-primary rounded-xl py-3 pl-11 pr-4 text-white outline-none transition-all placeholder:text-white/20"
                  placeholder="Enter new password"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted ml-1">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-deep/50 border border-white/10 focus:border-primary rounded-xl py-3 pl-11 pr-4 text-white outline-none transition-all placeholder:text-white/20"
                  placeholder="Confirm new password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>Reset Password <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default ResetPassword;
