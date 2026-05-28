import { toast } from 'react-hot-toast';
import { CheckCircle2, XCircle, Info } from 'lucide-react';
import React from 'react';

// Common base style for all custom toasts
const baseStyle = "flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md w-full max-w-sm";

// Custom Toast component to be rendered by react-hot-toast
const ToastComponent = ({ t, title, message, icon, typeStyle }) => (
  <div
    className={`${baseStyle} ${typeStyle} ${
      t.visible ? 'animate-in fade-in slide-in-from-top-4' : 'animate-out fade-out slide-out-to-top-4'
    }`}
  >
    <div className="flex-shrink-0 mt-0.5">{icon}</div>
    <div className="flex-1 flex flex-col gap-1">
      {title && <h4 className="text-sm font-semibold text-white">{title}</h4>}
      <p className="text-sm text-text-main/90">{message}</p>
    </div>
    <button
      onClick={() => toast.dismiss(t.id)}
      className="flex-shrink-0 text-white/50 hover:text-white transition-colors"
    >
      <span className="sr-only">Close</span>
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
);

export const showSuccess = (message, title = 'Success') => {
  toast.custom((t) => (
    <ToastComponent 
      t={t} 
      title={title} 
      message={message} 
      icon={<CheckCircle2 className="w-5 h-5 text-green-400" />}
      typeStyle="bg-card/90 border-l-4 border-l-green-400 border-y-white/10 border-r-white/10"
    />
  ), { duration: 4000 });
};

export const showError = (message, title = 'Error') => {
  toast.custom((t) => (
    <ToastComponent 
      t={t} 
      title={title} 
      message={message} 
      icon={<XCircle className="w-5 h-5 text-red-400" />}
      typeStyle="bg-card/90 border-l-4 border-l-red-400 border-y-white/10 border-r-white/10"
    />
  ), { duration: 5000 });
};

export const showInfo = (message, title = 'Info') => {
  toast.custom((t) => (
    <ToastComponent 
      t={t} 
      title={title} 
      message={message} 
      icon={<Info className="w-5 h-5 text-primary" />}
      typeStyle="bg-card/90 border-l-4 border-l-primary border-y-white/10 border-r-white/10"
    />
  ), { duration: 4000 });
};

// Export default toast object with methods to match standard toast API somewhat
export default {
  success: showSuccess,
  error: showError,
  info: showInfo,
};
