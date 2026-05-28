import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const Timeline = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const scrollRef = useRef(null);
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!events || events.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div ref={ref} className="w-full relative py-10">
      
      {/* Desktop View (Horizontal) */}
      <div className="hidden md:block relative">
        {/* Navigation Arrows */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 z-20 p-2 rounded-full glass border border-white/10 hover:bg-white/10 transform -translate-y-1/2 -ml-4"
        >
          <ChevronLeft className="text-white" />
        </button>
        
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 z-20 p-2 rounded-full glass border border-white/10 hover:bg-white/10 transform -translate-y-1/2 -mr-4"
        >
          <ChevronRight className="text-white" />
        </button>

        {/* Scrollable Container */}
        <div 
          ref={scrollRef}
          className="overflow-x-auto hide-scrollbar pb-8 relative"
          style={{ scrollBehavior: 'smooth' }}
        >
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex min-w-max px-12 pt-8 pb-8 relative"
          >
            {/* Main timeline line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-accent/20 transform -translate-y-1/2"></div>
            
            {events.map((event, index) => {
              const isEven = index % 2 === 0;
              const isActive = selectedEvent === index;
              
              return (
                <motion.div 
                  key={index} 
                  variants={itemVariants}
                  className="relative w-[320px] flex-shrink-0 cursor-pointer group"
                  onClick={() => setSelectedEvent(isActive ? null : index)}
                >
                  <div className="flex flex-col items-center h-[240px] justify-between w-full">
                    
                    {/* Top content (Even items) */}
                    <div className="flex-1 flex flex-col justify-end items-center pb-8 text-center px-4 w-full relative">
                      {isEven && (
                        <div className={`transition-all duration-300 ${isActive ? '-translate-y-2' : 'group-hover:-translate-y-1'}`}>
                          <span className="font-cinzel font-bold text-xl gradient-text block mb-1">{event.year}</span>
                          <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug">{event.title || event.event}</h4>
                        </div>
                      )}
                      {/* Vertical stem */}
                      {isEven && (
                        <div className={`absolute bottom-0 w-px bg-white/20 transition-all duration-300 left-1/2 -translate-x-1/2 ${isActive ? 'h-6 bg-primary' : 'h-4 group-hover:bg-accent group-hover:h-5'}`} />
                      )}
                    </div>

                    {/* Node point (Center) */}
                    <div className="h-0 flex items-center justify-center w-full relative z-10">
                      <div className={`relative w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center bg-deep ${
                        isActive 
                          ? 'border-primary scale-150 shadow-[0_0_15px_rgba(139,92,246,0.6)]' 
                          : 'border-primary group-hover:border-accent group-hover:scale-125'
                      }`}>
                        {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                      </div>
                    </div>

                    {/* Bottom content (Odd items) */}
                    <div className="flex-1 flex flex-col justify-start items-center pt-8 text-center px-4 w-full relative">
                      {/* Vertical stem */}
                      {!isEven && (
                        <div className={`absolute top-0 w-px bg-white/20 transition-all duration-300 left-1/2 -translate-x-1/2 ${isActive ? 'h-6 bg-primary' : 'h-4 group-hover:bg-accent group-hover:h-5'}`} />
                      )}
                      {!isEven && (
                        <div className={`transition-all duration-300 ${isActive ? 'translate-y-2' : 'group-hover:translate-y-1'}`}>
                          <span className="font-cinzel font-bold text-xl gradient-text block mb-1">{event.year}</span>
                          <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug">{event.title || event.event}</h4>
                        </div>
                      )}
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Mobile View (Vertical) */}
      <div className="md:hidden relative pl-6">
        {/* Main timeline line */}
        <div className="absolute top-0 bottom-0 left-6 w-1 bg-gradient-to-b from-primary/20 via-primary to-accent/20 rounded-full"></div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex flex-col gap-8 py-4"
        >
          {events.map((event, index) => {
            const isActive = selectedEvent === index;
            
            return (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className="relative pl-8 cursor-pointer group"
                onClick={() => setSelectedEvent(isActive ? null : index)}
              >
                {/* Node point */}
                <div className={`absolute left-0 top-1 transform -translate-x-1/2 z-10 w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                  isActive 
                    ? 'border-primary bg-primary scale-125 shadow-[0_0_10px_rgba(139,92,246,0.5)]' 
                    : 'border-primary bg-deep group-hover:border-accent'
                }`}>
                  {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                </div>
                
                <div>
                  <span className="font-cinzel font-bold text-lg gradient-text block mb-1">{event.year}</span>
                  <h4 className="text-base font-bold text-white mb-2">{event.title || event.event}</h4>
                  
                  {/* Content shown below on mobile without needing the expanded panel */}
                  {event.description && (
                     <p className="text-sm text-muted">{event.description}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Expanded Detail Panel (Desktop only) */}
      <AnimatePresence>
        {selectedEvent !== null && events[selectedEvent]?.description && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="hidden md:block overflow-hidden"
          >
            <div className="glass border border-white/10 rounded-2xl p-6 relative">
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 text-muted hover:text-white"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-start gap-6">
                <div className="w-1/4">
                  <span className="font-cinzel font-bold text-3xl gradient-text block leading-none mb-2">
                    {events[selectedEvent].year}
                  </span>
                  <h4 className="text-lg font-bold text-white">{events[selectedEvent].title || events[selectedEvent].event}</h4>
                </div>
                <div className="w-3/4 border-l border-white/10 pl-6">
                  <p className="text-muted leading-relaxed">{events[selectedEvent].description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Timeline;
