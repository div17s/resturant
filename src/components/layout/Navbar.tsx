import { useState, useEffect } from 'react';
import { Menu as MenuIcon, X, ShoppingBag, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';

interface NavbarProps {
  onReserveClick: () => void;
}

export const Navbar = ({ onReserveClick }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsCartOpen, itemCount } = useOrder();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (isHomePage) {
        const sections = ['hero', 'story', 'menu', 'experiences', 'gallery', 'contact'];
        const scrollPosition = window.scrollY + 150;

        for (const section of sections) {
          const el = document.getElementById(section);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              setActiveSection(section);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '/', id: 'hero' },
    { name: 'Menu', href: isHomePage ? '#menu' : '/#menu', id: 'menu' },
    { name: 'Our Story', href: isHomePage ? '#story' : '/#story', id: 'story' },
    { name: 'Experiences', href: isHomePage ? '#experiences' : '/#experiences', id: 'experiences' },
    { name: 'Gallery', href: isHomePage ? '#gallery' : '/#gallery', id: 'gallery' },
    { name: 'Contact', href: '/contact', id: 'contact' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);

    if (href.startsWith('#')) {
      if (!isHomePage) {
        navigate('/' + href);
      } else {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (href.startsWith('/#')) {
      const targetId = href.replace('/#', '');
      if (isHomePage) {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
      return;
    }

    navigate(href);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-stone-950/95 backdrop-blur-md shadow-lg border-b border-stone-800/80 py-3 text-stone-100'
          : 'bg-stone-950/80 md:bg-stone-950/40 backdrop-blur-sm py-4 text-stone-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand logo */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('/');
          }}
          className="text-lg sm:text-2xl font-serif font-normal tracking-[0.06em] uppercase text-stone-100 hover:text-amber-300 transition-colors shrink-0"
        >
          OLIVE & RESTRO
        </a>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive =
              (link.href === '/' && location.pathname === '/') ||
              (link.href === '/menu' && location.pathname === '/menu') ||
              (link.href === '/story' && location.pathname === '/story') ||
              (link.href === '/contact' && location.pathname === '/contact') ||
              (isHomePage && activeSection === link.id);

            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className={`transition-colors relative py-1 ${
                  isActive ? 'text-amber-400 font-semibold' : 'text-stone-300 hover:text-white'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-400 rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Action buttons & Mobile toggle */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Order Bag trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 rounded-lg bg-stone-900 border border-stone-800 hover:border-amber-500/50 text-stone-300 hover:text-amber-300 transition-colors relative"
            title="Online Ordering Bag"
            aria-label="View online ordering bag"
          >
            <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          <Button
            onClick={() => handleLinkClick('/login')}
            variant="ghost"
            className="flex text-stone-300 hover:text-white hover:bg-white/5 gap-2 text-xs sm:text-sm font-medium px-2 sm:px-4 h-9"
          >
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Sign In</span>
          </Button>

          <Button
            onClick={onReserveClick}
            variant="outline"
            className="hidden sm:inline-flex border-amber-500/40 text-amber-200 hover:bg-amber-500 hover:text-stone-950 hover:border-amber-500 transition-all font-medium text-xs sm:text-sm tracking-wide h-9"
          >
            Reserve a Table
          </Button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800/60 transition-colors"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-amber-400" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-0 left-0 w-full h-screen bg-stone-950 z-[40] flex flex-col pt-20 px-8 pb-10 overflow-y-auto">
          <nav className="flex flex-col gap-6 text-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="text-2xl font-serif py-2 text-stone-100 hover:text-amber-400 border-b border-stone-900 transition-all"
              >
                {link.name}
              </a>
            ))}

            <div className="mt-4 pt-6 border-t border-stone-800 flex flex-col gap-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLinkClick('/login');
                }}
                className="w-full bg-stone-900 border border-stone-800 text-white font-medium py-4 rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
              >
                <User className="w-5 h-5 text-amber-500" />
                Sign In to Member Club
              </button>
              
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCartOpen(true);
                }}
                className="w-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium py-4 rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
              >
                <ShoppingBag className="w-5 h-5" />
                Your Ordering Bag ({itemCount})
              </button>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <p className="text-stone-500 text-[10px] uppercase tracking-[0.2em] mb-1">Information</p>
              <div className="grid grid-cols-2 gap-4">
                <a href="/privacy" className="text-stone-400 text-sm hover:text-white">Privacy Policy</a>
                <a href="/terms" className="text-stone-400 text-sm hover:text-white">Terms of Use</a>
                <a href="/help" className="text-stone-400 text-sm hover:text-white">Help Center</a>
                <a 
                  href="/admin" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('/admin');
                  }}
                  className="text-stone-600 text-sm italic"
                >
                  Staff Portal
                </a>
              </div>
            </div>
          </nav>

          <div className="mt-auto pt-10 text-center">
            <p className="text-stone-500 text-xs">© 2026 Olive & Restro Indore</p>
          </div>
        </div>
      )}
    </header>
  );
};
