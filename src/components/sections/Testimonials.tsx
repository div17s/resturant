import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const reviews = [
    {
      id: 'rev-1',
      name: 'Aarav Sharma',
      rating: 5,
      comment: 'The royal dum biryani and butter chicken brought back memories of Delhi\'s best kitchens. Truly authentic flavors!',
    },
    {
      id: 'rev-2',
      name: 'Priya Patel',
      rating: 5,
      comment: 'Absolute perfection! The paneer tikka was melt-in-the-mouth and the hospitality was exceptionally warm.',
    },
    {
      id: 'rev-3',
      name: 'Vikram Malhotra',
      rating: 5,
      comment: 'An exquisite culinary journey. The slow-cooked dal makhani is unmatched anywhere else in town.',
    },
    {
      id: 'rev-4',
      name: 'Ananya Gupta',
      rating: 5,
      comment: 'Incredible ambiance and mouth-watering tandoori starters. A must-visit for every food lover!',
    },
    {
      id: 'rev-5',
      name: 'Rohan Verma',
      rating: 5,
      comment: 'Fast service, gorgeous interiors, and exceptionally delicious North Indian delicacies. 5 stars!',
    },
    {
      id: 'rev-6',
      name: 'Sneha Iyer',
      rating: 5,
      comment: 'The wok-tossed chilli paneer and hakka noodles were bursting with flavor. Will definitely be back!',
    },
    {
      id: 'rev-7',
      name: 'Karan Kapoor',
      rating: 5,
      comment: 'Unmatched quality and royal presentation. Every single dish we ordered was cooked to absolute perfection.',
    },
    {
      id: 'rev-8',
      name: 'Neha Reddy',
      rating: 5,
      comment: 'Such a cozy place with incredible food. The mocktails and kebabs are top notch!',
    },
    {
      id: 'rev-9',
      name: 'Aditya Sen',
      rating: 5,
      comment: 'A true haven for food connoisseurs. The rich gravies and fresh tandoori rotis are world-class.',
    },
    {
      id: 'rev-10',
      name: 'Pooja Joshi',
      rating: 5,
      comment: 'We celebrated our anniversary here and the experience was magical. Amazing food and stellar service.',
    },
    {
      id: 'rev-11',
      name: 'Kabir Mehta',
      rating: 5,
      comment: 'Hands down the best Indian restaurant experience. Authentic spices, generous portions, and lovely staff.',
    },
    {
      id: 'rev-12',
      name: 'Divya Nair',
      rating: 5,
      comment: 'Loved every bite! From starters to dessert, everything was prepared with genuine care and culinary expertise.',
    },
  ];

  const itemsPerPage = 3;
  const maxIndex = Math.max(0, reviews.length - itemsPerPage);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  const visibleReviews = reviews.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <section 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="py-16 sm:py-20 lg:py-24 bg-stone-950 text-stone-100 border-b border-stone-800 relative overflow-hidden"
    >
      
      {/* Background ambient glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Centered Header with Styled Brackets */}
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-serif text-stone-100 font-normal tracking-tight inline-flex items-center gap-3 px-8 py-3 rounded-3xl bg-[#1c222b]/80 border border-stone-800 shadow-xl">
            <span className="text-[#f5be38] font-mono font-bold">[</span>
            <span>What They Say?</span>
            <span className="text-[#f5be38] font-mono font-bold">]</span>
          </h2>
        </div>

        {/* 3 Review Cards Grid with Slider Controls */}
        <div className="relative max-w-6xl mx-auto">
          
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#1c222b] border border-stone-800 hover:border-[#f5be38] flex items-center justify-center text-stone-300 hover:text-[#f5be38] transition-colors cursor-pointer shadow-lg"
            aria-label="Previous reviews"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
            aria-label="Next reviews"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {visibleReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#1c222b] border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between hover:border-stone-700 transition-all duration-500 group"
              >
                <div>
                  {/* User Name & Stars (No Avatar) */}
                  <div className="mb-4">
                    <h3 className="text-stone-100 font-serif font-medium text-lg sm:text-xl mb-1">
                      {rev.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[#f5be38]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#f5be38] text-[#f5be38]" />
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-stone-300 font-light text-sm leading-relaxed">
                    {rev.comment}
                  </p>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Dots Indicator */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentIndex === idx ? 'w-8 bg-[#f5be38]' : 'w-2 bg-stone-800 hover:bg-stone-700'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
