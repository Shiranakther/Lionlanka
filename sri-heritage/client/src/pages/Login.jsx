import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { login, clearError, googleLogin } from '../store/authSlice';
// If using Google OAuth, import component here

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const { email, password } = formData;
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { isAuthenticated, loading, error } = useSelector(state => state.auth);
  
  const returnUrl = new URLSearchParams(location.search).get('returnUrl') || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(returnUrl);
    }
    
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [isAuthenticated, error, navigate, returnUrl, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please enter email and password');
    }
    dispatch(login({ email, password }));
  };

  const handleGoogleLogin = () => {
    // Basic wrapper for Google Login. In a real app, use @react-oauth/google.
    // For now we just dispatch a dummy thunk or mock it for UI demonstration.
    toast.error('Google OAuth not fully configured yet');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-deep flex items-center justify-center relative overflow-hidden py-20 px-4"
    >
      <Helmet>
        <title>Login — Lion Lanka</title>
      </Helmet>

      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="flex justify-center mb-8">
          <span className="font-cinzel font-bold text-3xl tracking-wider gradient-text text-center">
            LionLanka
          </span>
        </Link>

        <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-white mb-2 font-cinzel">Welcome Back</h2>
          <p className="text-muted text-sm mb-8">Sign in to continue exploring ancient history.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  className="w-full bg-deep/50 border border-white/10 focus:border-primary rounded-xl py-3 pl-11 pr-4 text-white outline-none transition-all placeholder:text-white/20"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary hover:text-accent transition-colors">
                  Forgot Password?
                </Link>
              </div>
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
                  placeholder="Enter your password"
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
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 text-muted bg-[#151515]">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                  fill="#EA4335"
                />
                <path
                  d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                  fill="#4285F4"
                />
                <path
                  d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                  fill="#34A853"
                />
              </svg>
              Google
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-muted">
              Don't have an account?{' '}
              <Link to={`/register${returnUrl !== '/' ? `?returnUrl=${returnUrl}` : ''}`} className="text-primary font-semibold hover:text-accent transition-colors">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
