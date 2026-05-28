import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Facebook, Instagram, Mail } from 'lucide-react';

import logo from '../../images/lionlanka-logo.png';

const Footer = () => {
  return (
    <footer className="bg-deep border-t border-white/10 pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1 - Brand */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <img src={logo} alt="Lion Lanka Logo" className="h-16 w-auto object-contain drop-shadow-md" />
              <span className="font-cinzel font-bold text-2xl tracking-wider gradient-text">
                Lion Lanka
              </span>
            </Link>
            <p className="text-muted text-sm leading-relaxed mt-2">
              Preserving Sri Lanka's rich heritage through digital storytelling. Explore thousands of years of magnificent history, culture, and ancient wisdom.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <a href="#" className="text-muted hover:text-primary transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-muted hover:text-primary transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-muted hover:text-primary transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-muted hover:text-primary transition-colors"><Github size={20} /></a>
            </div>
          </div>

          {/* Column 2 - Explore */}
          <div>
            <h3 className="font-cinzel font-bold text-white mb-6 tracking-wide">Explore</h3>
            <ul className="flex flex-col gap-3">
              <li><Link to="/" className="text-muted hover:text-primary transition-colors text-sm">Home</Link></li>
              <li><Link to="/articles" className="text-muted hover:text-primary transition-colors text-sm">Articles & Stories</Link></li>
              <li><Link to="/places" className="text-muted hover:text-primary transition-colors text-sm">Historical Places</Link></li>
              <li><Link to="/about" className="text-muted hover:text-primary transition-colors text-sm">About Sri Lanka</Link></li>
            </ul>
          </div>

          {/* Column 3 - Topics */}
          <div>
            <h3 className="font-cinzel font-bold text-white mb-6 tracking-wide">Topics</h3>
            <ul className="flex flex-col gap-3">
              <li><Link to="/articles?category=Ancient+History" className="text-muted hover:text-primary transition-colors text-sm">Ancient Kingdoms</Link></li>
              <li><Link to="/articles?category=Buddhism+%26+Religion" className="text-muted hover:text-primary transition-colors text-sm">Buddhist Heritage</Link></li>
              <li><Link to="/articles?category=Colonial+Era" className="text-muted hover:text-primary transition-colors text-sm">Colonial History</Link></li>
              <li><Link to="/articles?category=Culture+%26+Traditions" className="text-muted hover:text-primary transition-colors text-sm">Cultural Traditions</Link></li>
            </ul>
          </div>

          {/* Column 4 - Connect */}
          <div>
            <h3 className="font-cinzel font-bold text-white mb-6 tracking-wide">Connect</h3>
            <ul className="flex flex-col gap-3">
              <li><a href="#" className="text-muted hover:text-primary transition-colors text-sm">Contact Us</a></li>
              <li><a href="#" className="text-muted hover:text-primary transition-colors text-sm">Contribute</a></li>
              <li><a href="#" className="text-muted hover:text-primary transition-colors text-sm">FAQ</a></li>
            </ul>
            <div className="mt-6">
              <a href="mailto:hello@lionlanka.lk" className="flex items-center gap-2 text-sm text-primary hover:text-accent transition-colors">
                <Mail size={16} /> hello@lionlanka.lk
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted text-xs">
            &copy; {new Date().getFullYear()} LionLanka. Preserving history, inspiring futures.
          </p>
          <p className="text-muted text-xs flex items-center gap-1">
            Made with <span className="text-red-500">♥</span> for Sri Lankan heritage
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
