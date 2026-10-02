import React from 'react';

interface PromoBannerProps {
  onClaimOffer?: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ onClaimOffer }) => {
  return (
    <section className="bg-transparent py-4 px-4 sm:px-6 relative z-20">
      <div className="max-w-6xl mx-auto">
        
        {/* Transparent & Compact 1-Line Banner */}
        <div 
          onClick={onClaimOffer}
          className="relative bg-transparent border border-stone-800/90 rounded-2xl px-4 py-3 sm:px-6 sm:py-5 flex items-center justify-between gap-3 sm:gap-6 shadow-lg cursor-pointer group hover:border-stone-700 transition-all duration-200"
        >
          {/* Left Column: Heading & Social Proof */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xs sm:text-lg lg:text-2xl font-sans font-bold text-stone-100 tracking-tight truncate sm:whitespace-normal mb-1 sm:mb-2">
              Great food and lots of discounted prices
            </h3>

            {/* Social Proof: Avatars + 40+ Counter */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                <img
                  className="inline-block h-6 w-6 sm:h-8 sm:w-8 rounded-full ring-2 ring-stone-950 object-cover"
                  src="/src/assets/images/indian_avatar_1_1790889788308.jpg"
                  alt="Customer"
                />
                <img
                  className="inline-block h-6 w-6 sm:h-8 sm:w-8 rounded-full ring-2 ring-stone-950 object-cover"
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300"
                  alt="Customer"
                />
                <img
                  className="inline-block h-6 w-6 sm:h-8 sm:w-8 rounded-full ring-2 ring-stone-950 object-cover"
                  src="/src/assets/images/indian_avatar_3_1790889823946.jpg"
                  alt="Customer"
                />
                <div className="inline-flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#f5be38] text-stone-950 font-sans font-bold text-[10px] sm:text-xs ring-2 ring-stone-950">
                  40+
                </div>
              </div>
              <span className="text-[10px] sm:text-xs text-stone-400 font-sans hidden xs:inline">
                People grabbed the offer
              </span>
            </div>
          </div>

          {/* Middle: 40% Discount Highlight */}
          <div className="text-center shrink-0 border-l border-stone-800/80 pl-3 sm:pl-6">
            <div className="text-2xl sm:text-4xl lg:text-5xl font-sans font-black text-[#f5be38] tracking-tight leading-none">
              40%
            </div>
            <div className="text-[9px] sm:text-xs font-sans font-semibold uppercase tracking-wider text-stone-300 mt-0.5 sm:mt-1">
              offer on Now
            </div>
          </div>

          {/* Right: Round Gourmet Food Plate */}
          <div className="shrink-0">
            <div className="relative w-14 h-14 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden ring-2 ring-stone-800 shadow-md">
              <img
                src="https://res.cloudinary.com/yfmmvj6f/image/upload/v1790930726/file_00000000eaf88211b55950b4b197c644.png"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/src/assets/images/signature_dish_1790878418293.jpg";
                }}
                alt="Delicious Platter"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
