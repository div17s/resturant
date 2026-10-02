import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onReserveClick: () => void;
}

export const Footer = ({ onOpenPrivacy, onOpenTerms, onReserveClick }: FooterProps) => {
  return (
    <footer className="bg-stone-950 text-stone-300 py-16 px-6 border-t border-stone-800 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Footer Grid with Clean Alignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-12 items-start">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl sm:text-3xl font-serif text-stone-100 font-normal tracking-[0.06em] uppercase hover:text-amber-300 transition-colors inline-block">
              OLIVE & RESTRO
            </Link>
            <p className="text-stone-400 text-sm font-light leading-relaxed">
              Olive & Restro is known for creating unforgettable food experiences. We believe that food is therapy and try to put a smile on your face with every bite.
            </p>
            <div className="pt-2">
              <button
                onClick={onReserveClick}
                className="text-xs font-mono uppercase tracking-wider text-stone-100 hover:text-amber-300 underline underline-offset-4 flex items-center gap-1.5"
              >
                Reserve Your Table →
              </button>
            </div>
          </div>

          {/* Our Addresses Col */}
          <div className="space-y-4">
            <h4 className="text-lg font-serif text-stone-100 font-medium tracking-wide">
              Our Addresses
            </h4>
            <div className="space-y-4 text-sm font-light text-stone-400 leading-relaxed">
              <p className="flex items-start gap-2 text-stone-300">
                <MapPin className="w-4 h-4 text-stone-200 shrink-0 mt-0.5" />
                <span>Scheme 54, Vijay Nagar, Indore, Madhya Pradesh 452010</span>
              </p>
            </div>
          </div>

          {/* Information Col */}
          <div className="space-y-4">
            <h4 className="text-lg font-serif text-stone-100 font-medium tracking-wide">
              Information
            </h4>
            <ul className="space-y-2.5 text-sm font-light text-stone-400">
              <li><a href="/#story" className="hover:text-stone-200 transition-colors">Our Story & Heritage</a></li>
              <li><a href="/#experiences" className="hover:text-stone-200 transition-colors">Private Dining Experiences</a></li>
              <li><button onClick={onReserveClick} className="hover:text-stone-200 transition-colors text-left">Table Reservations</button></li>
              <li><Link to="/staff-portal" className="hover:text-stone-200 transition-colors">Staff Portal</Link></li>
            </ul>
          </div>

          {/* Business Hours & Connect Col */}
          <div className="space-y-4">
            <h4 className="text-lg font-serif text-stone-100 font-medium tracking-wide">
              Business Hours
            </h4>
            <div className="space-y-2 text-sm font-light text-stone-400">
              <p className="flex justify-between border-b border-stone-900 pb-1">
                <span>Mon – Thu:</span> <span className="text-stone-200 font-mono text-xs">11:00 AM – 11:00 PM</span>
              </p>
              <p className="flex justify-between border-b border-stone-900 pb-1">
                <span>Fri – Sun:</span> <span className="text-stone-200 font-mono text-xs">11:00 AM – 11:30 PM</span>
              </p>
            </div>

            <div className="pt-2 space-y-2 text-xs text-stone-400">
              <p className="flex items-center gap-2 text-stone-300">
                <Mail className="w-3.5 h-3.5 text-stone-200 shrink-0" />
                <a href="mailto:hello@oliveandrestro.com" className="hover:text-stone-200">hello@oliveandrestro.com</a>
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 text-stone-300">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 bg-stone-900 rounded-lg hover:text-stone-100 hover:bg-stone-800 transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4 text-stone-200" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2 bg-stone-900 rounded-lg hover:text-stone-100 hover:bg-stone-800 transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4 text-stone-200" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2 bg-stone-900 rounded-lg hover:text-stone-100 hover:bg-stone-800 transition-colors" aria-label="YouTube">
                <Youtube className="w-4 h-4 text-stone-200" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-stone-400">
          <p>© 2026 Olive & Restro Restaurant. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-stone-200 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-stone-200 transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
