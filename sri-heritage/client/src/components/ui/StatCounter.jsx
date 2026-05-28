import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const StatCounter = ({ value, label, icon: Icon, suffix = '+' }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView) {
      let start = 0;
      // Extract numeric part if value is a string like "2500"
      const end = parseInt(value.toString().replace(/[^0-9]/g, ''), 10);
      
      // If it's not a number, just display it
      if (isNaN(end)) {
          setCount(value);
          return;
      }

      const duration = 2000; // 2 seconds
      const incrementTime = 30; // ms
      const steps = Math.ceil(duration / incrementTime);
      const increment = Math.ceil(end / steps);

      const timer = setInterval(() => {
        start += increment;
        if (start > end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [inView, value]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-6 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-[var(--grad-card)] border border-[var(--clr-border)] flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(139,92,246,0.15)] relative group">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-accent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <Icon size={28} className="text-white" />
        </div>
      )}
      
      <div className="font-cinzel text-4xl font-bold gradient-text mb-2 tracking-tight">
        {count}{suffix}
      </div>
      
      <p className="text-sm font-semibold text-muted uppercase tracking-widest">
        {label}
      </p>
    </div>
  );
};

export default StatCounter;
