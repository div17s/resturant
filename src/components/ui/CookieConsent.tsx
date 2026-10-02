import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('ember_olive_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('ember_olive_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-50 p-5 rounded-xl bg-stone-900/95 border border-stone-800 text-stone-300 backdrop-blur-md shadow-2xl text-xs sm:text-sm"
        >
          <div className="flex flex-col gap-3">
            <p className="leading-relaxed">
              We use refined cookies to elevate your browsing experience and remember your dining preferences.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleAccept}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold rounded text-xs transition-colors"
              >
                Accept Selection
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="px-4 py-2 text-stone-400 hover:text-stone-200 text-xs transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
