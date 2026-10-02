import { useState, useEffect } from 'react';
import { galleryData, galleryCategories, GalleryItem } from '../../data/galleryData';
import { Maximize2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = galleryData.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  const activeLightboxItem: GalleryItem | null =
    lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  const handleNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const handlePrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems.length]);

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-stone-950 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-amber-500 text-xs font-mono uppercase tracking-widest mb-2 block">
            VISUAL PORTFOLIO
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-light text-stone-100 mb-4">
            A Glimpse <span className="italic text-amber-200">Inside</span>
          </h2>
          <p className="text-stone-400 font-light text-sm sm:text-base">
            Moments captured across our kitchen, private dining spaces, and cocktail laboratory.
          </p>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
          {galleryCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-stone-950 font-semibold shadow-md'
                  : 'bg-stone-900 text-stone-300 hover:text-white border border-stone-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Masonry / Asymmetric Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(index)}
              className="group relative rounded-lg overflow-hidden bg-stone-900 border border-stone-800/80 cursor-pointer aspect-square sm:aspect-[4/3] shadow-lg hover:border-amber-900/60 transition-all"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 sm:p-6">
                <div className="flex justify-end">
                  <span className="p-2 rounded-full bg-stone-900/80 text-amber-300">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
                <div>
                  <h3 className="text-stone-100 font-serif text-sm sm:text-base font-medium mb-1">
                    {item.title}
                  </h3>
                  <p className="text-stone-300 text-xs font-light line-clamp-1">
                    {item.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Accessible Fullscreen Lightbox */}
      <AnimatePresence>
        {activeLightboxItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-md">
            {/* Backdrop click to exit */}
            <div
              onClick={() => setLightboxIndex(null)}
              className="absolute inset-0"
            />

            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 z-10 p-3 rounded-full bg-stone-900/80 text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-stone-900/80 text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-stone-900/80 text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
              aria-label="Next Image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Main Lightbox Content */}
            <motion.div
              key={activeLightboxItem.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 max-w-5xl max-h-[85vh] flex flex-col items-center"
            >
              <img
                src={activeLightboxItem.image}
                alt={activeLightboxItem.title}
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-2xl mb-4 border border-stone-800"
              />
              <div className="text-center max-w-xl text-stone-200">
                <h3 className="text-xl font-serif text-amber-200 mb-1">
                  {activeLightboxItem.title}
                </h3>
                <p className="text-stone-400 text-xs sm:text-sm font-light">
                  {activeLightboxItem.caption}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
