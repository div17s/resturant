import { ChevronDown, Mic } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeroProps {
  onReserveClick: () => void;
  onExploreMenuClick: () => void;
  onOpenConcierge: () => void;
}

export const Hero = ({ onReserveClick, onExploreMenuClick, onOpenConcierge }: HeroProps) => {
  return (
    <section
      id="hero"
      className="relative h-[480px] sm:h-[540px] md:h-[600px] lg:h-[640px] max-h-[80vh] min-h-[460px] flex items-center justify-center text-center text-stone-100 overflow-hidden bg-stone-950"
    >
      {/* Background Video with AutoPlay, Muted, Loop */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/src/assets/images/hero_banner_1790878389975.jpg"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      >
        <source
          src="https://res.cloudinary.com/yfmmvj6f/video/upload/v1790885813/InShot_20261002_014617016.mp4"
          type="video/mp4"
        />
        <img
          src="/src/assets/images/hero_banner_1790878389975.jpg"
          alt="Olive & Restro Restaurant Atmosphere"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </video>

      {/* Atmospheric Scrim Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/40 pointer-events-none" />

      {/* Balanced Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8 flex flex-col items-center">
        <p className="text-stone-200 text-sm sm:text-base md:text-lg font-light tracking-wide mb-3 sm:mb-4 drop-shadow text-center">
          When Flavours meet Passion, Magic happens.
        </p>

        <h1 className="text-[34px] leading-[1.1] sm:text-4xl md:text-5xl lg:text-[64px] font-serif font-normal tracking-tight sm:leading-[1.18] mb-5 sm:mb-6 text-stone-100 drop-shadow-lg text-balance text-center">
          Come Join Us For A Magical Experience.
        </h1>

        <p className="text-stone-300 text-sm sm:text-base md:text-lg font-light max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed text-balance text-center opacity-90">
          Thoughtfully crafted Indian cuisine, wood-fired hearths, and an unhurried atmosphere in Vijay Nagar, Indore.
        </p>

        {/* Action Buttons including Ask Sia with Mic icon */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Button
            onClick={onExploreMenuClick}
            className="bg-amber-500 text-stone-950 hover:bg-amber-400 font-semibold px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            View Menu
          </Button>
          <Button
            onClick={onReserveClick}
            variant="outline"
            className="border-stone-300/80 text-stone-100 hover:bg-stone-100/10 hover:border-white px-5 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm transition-all cursor-pointer"
          >
            Reserve Table
          </Button>
          <Button
            onClick={onOpenConcierge}
            className="bg-stone-900/90 border border-amber-500/50 text-[#f5be38] hover:bg-stone-800 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Mic className="w-4 h-4 text-[#f5be38]" /> Sia
          </Button>
        </div>
      </div>

      {/* Reference Carousel Dots (Bottom Center) */}
      <div className="absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-300"></span>
        <span className="w-2 h-2 rounded-full bg-stone-500/60"></span>
        <span className="w-2 h-2 rounded-full bg-stone-500/60"></span>
        <span className="w-2 h-2 rounded-full bg-stone-500/60"></span>
        <span className="w-2 h-2 rounded-full bg-stone-500/60"></span>
      </div>
    </section>
  );
};
