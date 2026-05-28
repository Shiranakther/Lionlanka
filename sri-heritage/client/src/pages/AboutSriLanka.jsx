import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Map, Users, Crown } from 'lucide-react';

// Import images
import h1 from '../images/h1.webp';
import h2 from '../images/h2.webp';
import h3 from '../images/h3.webp';
import h4 from '../images/h4.webp';
import h5 from '../images/h5.webp';

const images = [h1, h2, h3, h4, h5];

const AboutSriLanka = () => {
  const [currentImg, setCurrentImg] = useState(0);

  // Auto slider logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length);
    }, 5000); // 5 seconds per image
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-deep pt-24 pb-20 relative overflow-hidden"
    >
      <Helmet>
        <title>About Us — Lion Lanka</title>
      </Helmet>

      {/* Main Grid Layout */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Content (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-16 py-10 lg:pr-8">
            
            {/* Header Section */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-cinzel font-bold tracking-tight mb-6 gradient-text">
                Preserving the Echoes of Antiquity
              </h1>
              <p className="text-xl md:text-2xl text-white font-medium mb-4">
                Our Purpose
              </p>
              <p className="text-lg text-muted leading-relaxed">
                Lion Lanka was born out of a profound necessity: to digitize, immortalize, and make accessible the monumental heritage of ancient Sri Lanka. For millennia, this island has stood as a beacon of Theravada Buddhism, architectural brilliance, and unparalleled hydraulic engineering. Our mission is to ensure that the stories of our ancient kings, the sacredness of our temples, and the ingenuity of our ancestors are never lost to time. We strive to educate the world about the Pearl of the Indian Ocean through deep historical accuracy and modern web technology.
              </p>
            </div>

            {/* Historical Data Section */}
            <div className="space-y-12">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                    <Crown size={24} className="text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-cinzel font-bold text-white">The Golden Eras</h2>
                </div>
                <p className="text-muted leading-relaxed mb-4">
                  The early historic period of Sri Lanka commenced in the 3rd century BC. The Anuradhapura Kingdom (377 BC – 1017 AD) heralded the arrival of Buddhism, leading to the construction of massive stupas like the Ruwanwelisaya and Jetavanaramaya—which were among the tallest structures in the ancient world, rivaling even the pyramids of Giza in scale. 
                </p>
                <p className="text-muted leading-relaxed">
                  Following its fall, the Polonnaruwa Kingdom (1056 – 1236 AD) emerged, renowned for its renaissance in art and architecture. Under the rule of King Parakramabahu the Great, the island was unified, and the legendary Parakrama Samudra (Sea of Parakrama) was constructed, symbolizing the absolute pinnacle of ancient hydraulic capabilities.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                    <Map size={24} className="text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-cinzel font-bold text-white">Hydraulic Marvels</h2>
                </div>
                <p className="text-muted leading-relaxed">
                  To sustain thriving civilizations in the arid dry zone, ancient Sri Lankan engineers conceived an intricate network of massive reservoirs (wewas) and highly advanced canal systems. Built with astonishing mathematical precision, these water networks not only sustained agriculture but completely reshaped the island's ecosystem. Structures like the Yoda Ela, featuring a gradient of just 6 inches per mile, stand as a testament to an extraordinarily advanced ancient civilization.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                    <Users size={24} className="text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-cinzel font-bold text-white">The Silk Road of the Sea</h2>
                </div>
                <p className="text-muted leading-relaxed">
                  Strategically positioned at the crossroads of the Indian Ocean, ancient Sri Lanka—known to the world as Taprobane, Serendib, and Ceylon—was a legendary global trading hub. Merchants from Rome, Arabia, and China sailed to our ports to trade for the island's renowned spices, ivory, pearls, and precious gems. This continuous influx of foreign cultures deeply enriched the island's cultural and economic landscape.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Vertical Image Slider (5 cols on desktop) */}
          <div className="lg:col-span-5 relative h-[60vh] lg:h-auto mt-8 lg:mt-0">
            <div className="sticky top-32 w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 glass">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImg}
                  src={images[currentImg]}
                  alt={`Sri Lankan Heritage ${currentImg + 1}`}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {/* Slider Controls / Vertical Indicators */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImg(idx)}
                    className={`w-2 rounded-full transition-all duration-500 ${
                      currentImg === idx ? 'h-8 bg-primary' : 'h-2 bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  />
                ))}
              </div>
              
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
              <div className="absolute bottom-8 left-8 right-12 z-10">
                <motion.p 
                  key={`text-${currentImg}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-white/90 text-sm md:text-base font-medium tracking-wide"
                >
                  {currentImg === 0 && "Ancient architectural wonders preserved through time."}
                  {currentImg === 1 && "Sacred spaces of Theravada Buddhist devotion."}
                  {currentImg === 2 && "The enduring legacy of the Anuradhapura Kingdom."}
                  {currentImg === 3 && "Intricate carvings telling stories of millennia."}
                  {currentImg === 4 && "Monumental stupas rising above the sacred plains."}
                </motion.p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </motion.div>
  );
};

export default AboutSriLanka;
