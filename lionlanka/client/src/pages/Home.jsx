import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowDown } from 'lucide-react';
import SearchBar from '../components/ui/SearchBar';
import PlaceCard from '../components/ui/PlaceCard';
import Timeline from '../components/ui/Timeline';
import ArticleCard from '../components/ui/ArticleCard';
import StatCounter from '../components/ui/StatCounter';
import { getArticlesAPI } from '../services/articleService';
import { getPlacesAPI } from '../services/placeService'; // assuming you'll create one, or use dummy data for now
import { getSiteConfigAPI } from '../services/siteConfigService';
import { MapPin, BookOpen, Compass, Landmark } from 'lucide-react';

import h1 from '../images/h1.webp';
import h2 from '../images/h2.webp';
import h3 from '../images/h3.webp';
import h4 from '../images/h4.webp';
import h5 from '../images/h5.webp';

const heroImages = [h1, h2, h3, h4, h5, h1, h2, h3, h4, h5];

const Home = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);

  const [articles, setArticles] = useState([]);
  const [places, setPlaces] = useState([]);
  const [siteConfig, setSiteConfig] = useState(null);
  const [timelineEvents, setTimelineEvents] = useState([
    { year: '543 BC - 505 BC', title: 'Tambapanni Kingdom', description: 'Established by Prince Vijaya upon his arrival. It was the first Sinhalese Kingdom and marked the dawn of recorded history in Sri Lanka.' },
    { year: '377 BC - 1017 AD', title: 'Anuradhapura Kingdom', description: 'The golden age of ancient Sri Lanka. It saw the arrival of Buddhism, the construction of massive stupas (Ruwanwelisaya), and the creation of advanced hydraulic engineering and irrigation tanks.' },
    { year: '1056 - 1236', title: 'Polonnaruwa Kingdom', description: 'A glorious era of renaissance in art, architecture, and literature. King Parakramabahu I unified the island and built the Parakrama Samudra.' },
    { year: '1232 - 1272', title: 'Dambadeniya Kingdom', description: 'A transitional fortress kingdom built to protect the sacred Tooth Relic from foreign invasions during a period of instability.' },
    { year: '1272 - 1293', title: 'Yapahuwa Kingdom', description: 'A massive rock fortress capital featuring magnificent ornamental staircases and strong defenses against South Indian invaders.' },
    { year: '1293 - 1341', title: 'Kurunegala Kingdom', description: 'A short-lived capital surrounded by large rock outcrops, serving as a royal center during shifting political tides.' },
    { year: '1341 - 1347', title: 'Gampola Kingdom', description: 'The capital was moved to the central highlands, marking the beginning of the hill country kingdoms.' },
    { year: '1412 - 1597', title: 'Kotte Kingdom', description: 'A prosperous era of trade and literature that eventually faced the arrival of the Portuguese in 1505, leading to colonial struggles.' },
    { year: '1521 - 1594', title: 'Sitawaka Kingdom', description: 'Famed for its fierce military resistance against the Portuguese under the leadership of warrior kings like Mayadunne and Rajasinha I.' },
    { year: '1590 - 1815', title: 'Kandyan Kingdom', description: 'The last independent monarchy of Sri Lanka. Nestled in the mountains, it successfully held off three European powers for over 200 years until it fell to the British.' }
  ]);

  useEffect(() => {
    // Fetch latest articles
    const fetchArticles = async () => {
      try {
        const res = await getArticlesAPI({ limit: 3 });
        setArticles(res.data.articles);
      } catch (err) {
        console.error("Failed to fetch articles:", err);
      }
    };
    fetchArticles();

    const fetchPlaces = async () => {
      try {
        const res = await getPlacesAPI();
        if (res.data && res.data.places) {
          setPlaces(res.data.places.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to fetch places:", err);
      }
    };
    fetchPlaces();

    const fetchConfig = async () => {
      try {
        const res = await getSiteConfigAPI();
        setSiteConfig(res.data);
      } catch (err) {
        console.error("Failed to fetch site config", err);
      }
    };
    fetchConfig();
  }, []);

  const titleWords = (siteConfig?.heroTitle || "Ancient Heritage").split(" ");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <Helmet>
        <title>Lion Lanka — Discover Sri Lanka's Ancient Legacy</title>
        <meta name="description" content="Explore thousands of years of rich history, magnificent kingdoms, and cultural treasures of Sri Lanka." />
      </Helmet>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-deep">
        
        {/* Animated Background Slider */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 80 }}
            className="flex h-full w-[1000vw] sm:w-[500vw]"
          >
            {heroImages.map((src, idx) => (
              <div key={idx} className="h-full w-[100vw] sm:w-[50vw] flex-shrink-0 relative">
                 <img src={src} alt="Sri Lanka Heritage" className="w-full h-full object-cover" />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Blur & Dark Overlay for Text Readability */}
        <div className="absolute inset-0 z-0 bg-deep/60 backdrop-blur-[2px] pointer-events-none"></div>

        {/* Floating Orbs (Subtle) */}
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/30 rounded-full blur-[100px] pointer-events-none"
        />
        <motion.div 
          animate={{ y: [0, 30, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/30 rounded-full blur-[120px] pointer-events-none"
        />

        <div className="container mx-auto px-4 z-10 text-center flex flex-col items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.2 } }
            }}
            className="mb-6"
          >
            <motion.h2 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="text-xl md:text-2xl font-medium text-text-main/80 mb-2 tracking-widest uppercase"
            >
              Discover Sri Lanka's
            </motion.h2>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-cinzel font-bold tracking-tight">
              {titleWords.map((word, index) => (
                <motion.span
                  key={index}
                  variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ type: "spring", damping: 12, stiffness: 100 }}
                  className="inline-block mr-4 gradient-text last:mr-0 drop-shadow-2xl"
                >
                  {word}
                </motion.span>
              ))}
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            {siteConfig?.heroSubtitle || "Explore thousands of years of rich history, magnificent kingdoms, and cultural treasures that shaped the Pearl of the Indian Ocean."}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="w-full max-w-2xl mb-12"
          >
            <SearchBar variant="hero" placeholder="Search for kings, battles, or ancient cities..." />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/articles" className="btn-primary flex items-center justify-center gap-2">
              Explore Articles <ChevronRight size={18} />
            </Link>
            <Link to="/places" className="btn-ghost flex items-center justify-center gap-2 bg-deep/50 backdrop-blur-md">
              View Places <MapPin size={18} />
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-muted/50"
        >
          <ArrowDown size={32} />
        </motion.div>
      </section>

      {/* 2. FEATURED PLACES */}
      <section className="py-24 bg-mid relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Heritage Sites</h2>
              <h3 className="text-3xl md:text-4xl font-cinzel font-bold text-white">Explore Historical Places</h3>
            </div>
            <Link to="/places" className="hidden md:flex items-center gap-2 text-primary hover:text-accent transition-colors font-medium">
              View all places <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-8">
            {places.map((place, idx) => (
              <div key={idx} className="w-full h-80">
                <PlaceCard place={place} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TIMELINE SECTION */}
      <section className="py-24 bg-deep relative border-y border-white/5">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Chronology</h2>
            <h3 className="text-3xl md:text-4xl font-cinzel font-bold text-white">Journey Through Time</h3>
            <p className="text-muted mt-4 max-w-2xl mx-auto">Discover the defining moments that shaped Sri Lankan history over millennia.</p>
          </div>
          <Timeline events={timelineEvents} />
        </div>
      </section>

      {/* 4. FEATURED ARTICLES */}
      <section className="py-24 bg-mid">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Stories</h2>
              <h3 className="text-3xl md:text-4xl font-cinzel font-bold text-white">Latest Articles</h3>
            </div>
            <Link to="/articles" className="hidden md:flex items-center gap-2 text-primary hover:text-accent transition-colors font-medium">
              View all articles <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.length > 0 ? articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            )) : (
              [1, 2, 3].map(i => (
                <div key={i} className="h-96 rounded-2xl bg-white/5 animate-pulse border border-white/10"></div>
              ))
            )}
          </div>
          
          <div className="mt-12 text-center md:hidden">
             <Link to="/articles" className="btn-ghost inline-block w-full">View all articles</Link>
          </div>
        </div>
      </section>

      {/* 5. STATS SECTION */}
      <section className="py-20 bg-deep border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <StatCounter value={2500} label="Years of History" icon={BookOpen} />
            <StatCounter value={400} label="Historical Sites" icon={Compass} />
            <StatCounter value={180} label="Ancient Temples" icon={Landmark} />
            <StatCounter value={2000} label="Artifacts Discovered" icon={MapPin} />
          </div>
        </div>
      </section>

      {/* 6. CHATBOT PROMO */}
      <section className="py-24 bg-mid px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10"></div>
        <div className="container mx-auto relative z-10 max-w-5xl">
          <div className="glass rounded-3xl p-8 md:p-12 border border-primary/20 shadow-2xl flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 text-center md:text-left">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4 border border-primary/30">New Feature</span>
              <h2 className="text-3xl md:text-4xl font-cinzel font-bold text-white mb-4">{siteConfig?.chatbotPromoTitle || "Meet Heritage AI"}</h2>
              <p className="text-muted text-lg leading-relaxed mb-8">
                {siteConfig?.chatbotPromoSubtitle || "Your personal Sri Lankan history assistant. Ask any question about ancient kingdoms, historical places, and cultural heritage, powered by advanced AI."}
              </p>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))} 
                className="btn-primary text-lg px-8 py-3 w-full md:w-auto shadow-[0_10px_30px_rgba(139,92,246,0.4)]"
              >
                Try Heritage AI Now
              </button>
            </div>
            
            <div className="w-full md:w-1/2 flex flex-col gap-4">
               {/* Fake Chat Bubbles */}
               <div className="self-end bg-gradient-to-br from-primary to-accent text-white p-4 rounded-[16px_16px_4px_16px] max-w-[80%] shadow-lg">
                 <p className="text-sm">Who built the Sigiriya rock fortress?</p>
               </div>
               <div className="self-start bg-surface border border-white/10 text-text-main p-4 rounded-[16px_16px_16px_4px] max-w-[90%] shadow-lg">
                 <p className="text-sm leading-relaxed">Sigiriya was built by King Kasyapa (477 – 495 CE) as his new capital and fortress. He selected this inaccessible rock to protect himself from his half-brother Moggallana...</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. NEWSLETTER */}
      <section className="py-24 bg-deep text-center border-t border-white/5">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl font-cinzel font-bold text-white mb-4">{siteConfig?.newsletterTitle || "Stay Updated"}</h2>
          <p className="text-muted mb-8 text-lg">{siteConfig?.newsletterSubtitle || "Get weekly insights into Sri Lanka's fascinating history delivered to your inbox."}</p>
          <form className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 bg-surface border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-primary text-text-main"
              required
            />
            <button type="submit" className="btn-primary py-4 px-8 whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
