import { useState, useRef, useEffect } from 'react';
import { menuData, menuCategories, MenuItem } from '../../data/menuData';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { useToast } from '../ui/ToastNotification';
import { useOrder } from '../../context/OrderContext';

interface SignatureMenuProps {
  onSelectDish: (dish: MenuItem) => void;
  onOpenFullMenuModal: () => void;
}

export const SignatureMenu = ({ onSelectDish, onOpenFullMenuModal }: SignatureMenuProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('signature');
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  const { addToCart, setIsCartOpen } = useOrder();

  const filteredDishes = menuData.filter((item) => {
    const categoryMatches = item.category === activeCategory;
    const vegMatches = vegOnly ? item.vegetarian : true;
    return categoryMatches && vegMatches;
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const offset = direction === 'left' ? -clientWidth / 1.5 : clientWidth / 1.5;
      scrollRef.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' });
    }
  };

  // Auto-play loop for mobile experience
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        
        // If we've reached the end of the scrollable area
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scroll('right');
        }
      }
    }, 5000); // Scroll every 5 seconds

    return () => clearInterval(interval);
  }, [filteredDishes, activeCategory, vegOnly]);

  const handleQuickAdd = (e: React.MouseEvent, dish: MenuItem) => {
    e.stopPropagation();
    addToCart(dish, 1);
    setIsCartOpen(true);
    showToast(`Added ${dish.name} to your bag!`, 'success');
  };

  return (
    <section id="menu" className="py-16 sm:py-20 lg:py-24 bg-stone-950 text-stone-100 border-b border-stone-800 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-5xl font-serif font-normal text-stone-100 mb-4 tracking-tight">
            Our <span className="text-[#f5be38] font-serif">Topnotch</span> Menu
          </h2>
          <p className="text-stone-300 font-light text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            A handpicked selection of authentic Indian culinary masterworks, slow-cooked gravies, and live charcoal tandoor specials.
          </p>
        </div>

        {/* Category Controls & Filter & Navigation Arrows */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12 pb-6 border-b border-stone-800">
          
          {/* Scrollable Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            {menuCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#f5be38] text-stone-950 font-semibold shadow-lg'
                      : 'bg-stone-900 text-stone-300 hover:text-white hover:bg-stone-800 border border-stone-800'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-end">
            {/* Veg Only Toggle */}
            <label className="inline-flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm text-stone-300 select-none shrink-0">
              <input
                type="checkbox"
                checked={vegOnly}
                onChange={(e) => setVegOnly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600 relative"></div>
              <span>Vegetarian Only</span>
            </label>

            {/* Slider Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 hover:border-[#f5be38] flex items-center justify-center text-stone-300 hover:text-[#f5be38] transition-colors cursor-pointer shadow-md"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-10 h-10 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

        {/* Horizontal Slider with Overlapping Circular Dishes (Second Image Style) */}
        {filteredDishes.length > 0 ? (
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-12 pt-16 px-2 scrollbar-none snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredDishes.map((dish) => (
              <div
                key={dish.id}
                onClick={() => onSelectDish(dish)}
                className="relative shrink-0 w-[270px] sm:w-[300px] bg-[#1c222b] border border-stone-800 rounded-3xl pt-24 pb-6 px-6 shadow-2xl flex flex-col justify-between snap-start group hover:border-stone-700 transition-all duration-300 cursor-pointer"
              >
                {/* Overlapping Circular Food Image */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-2xl ring-4 ring-[#1c222b] border-2 border-stone-700/60 group-hover:scale-105 transition-transform duration-500">
                  <img
                    src={dish.image}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80";
                    }}
                    alt={dish.name}
                    className="w-full h-full object-cover"
                  />
                  {dish.vegetarian && (
                    <span
                      title="Vegetarian"
                      className="absolute top-2 right-2 w-3.5 h-3.5 bg-white border border-emerald-600 p-[2px] flex items-center justify-center rounded-sm shadow"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="text-center mt-2">
                  <h3 className="text-lg sm:text-xl font-serif text-stone-100 font-medium mb-1.5 tracking-wide group-hover:text-[#f5be38] transition-colors">
                    {dish.name}
                  </h3>
                  <p className="text-stone-400 font-light text-xs sm:text-sm line-clamp-2 min-h-[36px]">
                    {dish.description}
                  </p>
                </div>

                {/* Price and Order Now Button */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-stone-800/80 gap-3">
                  <span className="text-rose-500 font-sans font-bold text-lg sm:text-xl shrink-0">
                    {dish.price}
                  </span>

                  <button
                    onClick={(e) => handleQuickAdd(e, dish)}
                    className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-medium text-xs sm:text-sm tracking-wide shadow-lg transition-all cursor-pointer flex items-center justify-center"
                    aria-label={`Order ${dish.name} now`}
                  >
                    Order Now
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-stone-900/40 rounded-2xl border border-stone-800">
            <p className="text-stone-400 text-sm">No dishes found matching your criteria.</p>
          </div>
        )}

      </div>
    </section>
  );
};
