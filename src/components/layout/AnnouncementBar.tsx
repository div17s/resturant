import { useState, useEffect } from 'react';

interface AnnouncementBarProps {
  onReserveClick: () => void;
  onMenuClick?: () => void;
}

export const AnnouncementBar = ({ onReserveClick }: AnnouncementBarProps) => {
  const announcements = [
    {
      text: "Today's Best Offer: Reserve table today to get 40% OFF instantly",
      highlight: true,
    },
    {
      text: "Open daily: 12:00 PM – 11:30 PM | Vijay Nagar, Indore",
      highlight: false,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length);
        setIsFading(false);
      }, 300); // 300ms fade transition
    }, 2000); // changes every 2 seconds as requested

    return () => clearInterval(timer);
  }, [announcements.length]);

  const current = announcements[currentIndex];

  return (
    <div className="bg-stone-950 text-stone-300 text-xs py-2 px-4 sm:px-6 border-b border-stone-800/80 relative z-50 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Animated Rotating Offer & Announcement Ticker */}
        <div
          onClick={onReserveClick}
          className="flex-1 cursor-pointer overflow-hidden py-0.5"
          title="Click to reserve and claim today's offer"
        >
          <div
            className={`transition-all duration-300 ease-out transform ${
              isFading
                ? 'opacity-0 -translate-y-1.5'
                : 'opacity-100 translate-y-0'
            }`}
          >
            {current.highlight ? (
              <span className="font-normal text-stone-200">
                <span className="text-amber-400 font-semibold tracking-wide uppercase mr-2 text-[11px]">
                  Today's Best Offer:
                </span>
                Reserve table today to get{' '}
                <span className="text-amber-400 font-bold underline decoration-amber-500/60 underline-offset-2">
                  40% OFF
                </span>{' '}
                instantly
              </span>
            ) : (
              <span className="text-stone-400 font-normal">
                {current.text}
              </span>
            )}
          </div>
        </div>

        {/* Right Action: Clean 'Reserve Table' button (Menu link removed as requested) */}
        <div className="shrink-0 flex items-center">
          <button
            onClick={onReserveClick}
            className="text-amber-400 hover:text-amber-300 transition-colors font-medium text-xs py-0.5 px-1 hover:underline underline-offset-4"
          >
            Reserve Table →
          </button>
        </div>
      </div>
    </div>
  );
};
