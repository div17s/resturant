import { useState, useMemo } from 'react';
import { menuData, menuCategories, dietaryFilters, MenuItem } from '../data/menuData';
import { Navbar } from '../components/layout/Navbar';
import { AnnouncementBar } from '../components/layout/AnnouncementBar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { DishDetailModal } from '../components/modals/DishDetailModal';
import { ReservationModal } from '../components/modals/ReservationModal';
import { LegalModal } from '../components/modals/LegalModal';
import { OrderDrawer } from '../components/order/OrderDrawer';
import { ScrollProgress } from '../components/ui/ScrollProgress';
import { BackToTop } from '../components/ui/BackToTop';
import { Search, Plus, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { useToast } from '../components/ui/ToastNotification';

export const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeDietary, setActiveDietary] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | 'accessibility' | null>(null);

  const { addToCart, setIsCartOpen, itemCount } = useOrder();
  const { showToast } = useToast();

  const filteredDishes = useMemo(() => {
    return menuData.filter((dish) => {
      // Category match
      const categoryMatch = activeCategory === 'all' || dish.category === activeCategory;

      // Dietary match
      let dietaryMatch = true;
      if (activeDietary === 'veg') dietaryMatch = dish.vegetarian;
      if (activeDietary === 'non-veg') dietaryMatch = !dish.vegetarian;
      if (activeDietary === 'chef') dietaryMatch = !!dish.chefPick;
      if (activeDietary === 'popular') dietaryMatch = !!dish.popular;
      if (activeDietary === 'gluten-free') {
        dietaryMatch = !dish.allergens?.includes('Gluten');
      }

      // Search match
      const searchMatch =
        !searchQuery.trim() ||
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.ingredients?.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));

      return categoryMatch && dietaryMatch && searchMatch;
    });
  }, [activeCategory, activeDietary, searchQuery]);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-stone-950">
      <ScrollProgress />

      <AnnouncementBar
        onReserveClick={() => setIsReservationOpen(true)}
        onMenuClick={() => window.scrollTo({ top: 300, behavior: 'smooth' })}
      />

      <Navbar onReserveClick={() => setIsReservationOpen(true)} />

      {/* Menu Page Hero Banner */}
      <section className="relative py-20 lg:py-24 bg-stone-900 border-b border-stone-800 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <span className="text-amber-500 text-xs font-mono uppercase tracking-widest mb-3 block">
            CONTEMPORARY CULINARY REPERTOIRE
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif text-stone-100 font-light mb-4">
            The Complete <span className="italic text-amber-200">Menu</span>
          </h1>
          <p className="text-stone-400 font-light max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            An intentional synthesis of modern European gastronomy and royal Indian heritage cuisine. Prepared fresh daily in our Vijay Nagar kitchen.
          </p>

          {/* Quick Stats or Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-stone-400 font-mono">
            <span>● 100% Seasonal Farm Sourcing</span>
            <span>● Allergen Aware Kitchen</span>
            <span>● Wood-Fired Tandoor & Charcoal Grill</span>
          </div>
        </div>
      </section>

      {/* Main Interactive Menu Browser */}
      <section className="py-12 lg:py-16 max-w-7xl mx-auto px-6">
        
        {/* Search Bar & Dietary Filter Row */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dishes, ingredients (e.g. Truffle, Saffron, Risotto)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-900 border border-stone-800 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-500 hover:text-stone-300"
              >
                Clear
              </button>
            )}
          </div>

          {/* Bag Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full md:w-auto px-5 py-2.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-amber-500/50 flex items-center justify-center gap-2 text-xs sm:text-sm text-amber-300 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Delivery & Pickup Bag</span>
            {itemCount > 0 && (
              <span className="bg-amber-500 text-stone-950 font-bold px-1.5 py-0.2 rounded-full text-xs">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeCategory === 'all'
                ? 'bg-amber-500 text-stone-950 font-semibold shadow'
                : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
            }`}
          >
            All Courses
          </button>
          {menuCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-stone-950 font-semibold shadow'
                  : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Dietary Sub-filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 border-b border-stone-800/80 text-xs text-stone-400 no-scrollbar">
          <span className="font-mono text-[10px] text-stone-500 uppercase shrink-0 mr-1">Filter by:</span>
          {dietaryFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveDietary(filter.id)}
              className={`px-3 py-1.5 rounded text-xs transition-colors shrink-0 ${
                activeDietary === filter.id
                  ? 'bg-amber-950/60 text-amber-300 border border-amber-800'
                  : 'bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-stone-800/80'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Dish Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.length > 0 ? (
            filteredDishes.map((dish) => (
              <div
                key={dish.id}
                className="group bg-stone-900/60 border border-stone-800 rounded-xl overflow-hidden flex flex-col justify-between hover:border-amber-900/60 hover:bg-stone-900 transition-all shadow-md"
              >
                <div>
                  {/* Image Container */}
                  <div
                    onClick={() => setSelectedDish(dish)}
                    className="relative h-48 bg-stone-950 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={dish.image}
                      alt={dish.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-transparent transition-colors" />

                    {/* Veg / Non-Veg Indicator */}
                    <div className="absolute top-3 left-3">
                      {dish.vegetarian ? (
                        <span
                          title="Vegetarian"
                          className="w-4 h-4 bg-white border border-emerald-600 p-[2px] flex items-center justify-center rounded-sm shadow"
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        </span>
                      ) : (
                        <span
                          title="Non-Vegetarian"
                          className="w-4 h-4 bg-white border border-rose-600 p-[2px] flex items-center justify-center rounded-sm shadow"
                        >
                          <span className="w-2 h-2 rounded-full bg-rose-600" />
                        </span>
                      )}
                    </div>

                    {/* Badge */}
                    <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                      {dish.chefPick && (
                        <span className="bg-stone-950/90 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded border border-amber-900/60 uppercase tracking-wider">
                          Chef's Choice
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3
                        onClick={() => setSelectedDish(dish)}
                        className="font-serif text-lg text-stone-100 font-medium group-hover:text-amber-200 transition-colors cursor-pointer"
                      >
                        {dish.name}
                      </h3>
                      <span className="font-serif text-amber-400 font-semibold shrink-0">
                        {dish.price}
                      </span>
                    </div>

                    <p className="text-stone-400 text-xs font-light leading-relaxed mb-3 line-clamp-2">
                      {dish.description}
                    </p>

                    {/* Allergens & Spice Tag */}
                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-stone-500 font-mono">
                      {dish.spiceLevel && dish.spiceLevel > 0 && (
                        <span className="text-amber-500 font-mono">
                          {dish.spiceLevel === 1 ? 'Mild' : dish.spiceLevel === 2 ? 'Medium' : 'Spicy'}
                        </span>
                      )}
                      {dish.allergens && dish.allergens.length > 0 && (
                        <span>Contains: {dish.allergens.join(', ')}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-5 pt-0 flex gap-2">
                  <button
                    onClick={() => setSelectedDish(dish)}
                    className="flex-1 py-2 rounded bg-stone-950 border border-stone-800 hover:border-stone-700 text-xs text-stone-300 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      addToCart(dish, 1);
                      setIsCartOpen(true);
                      showToast(`Added ${dish.name} to bag`, 'success');
                    }}
                    className="p-2 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors"
                    title="Add to order bag"
                    aria-label={`Add ${dish.name} to order`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center bg-stone-900/40 rounded-xl border border-stone-800 text-stone-400 space-y-3">
              <UtensilsCrossed className="w-10 h-10 text-stone-600 mx-auto" />
              <p className="font-serif text-lg text-stone-200">No dishes match your active filter</p>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try clearing search terms or selecting 'All Items' to view our complete culinary repertoire.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                  setActiveDietary('all');
                }}
                variant="outline"
                className="text-xs border-stone-700 text-amber-400"
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>

      </section>

      {/* Footer */}
      <Footer
        onOpenPrivacy={() => setLegalModal('privacy')}
        onOpenTerms={() => setLegalModal('terms')}
        onReserveClick={() => setIsReservationOpen(true)}
      />

      {/* Modals & Drawers */}
      <DishDetailModal
        dish={selectedDish}
        onClose={() => setSelectedDish(null)}
        onReserveClick={() => setIsReservationOpen(true)}
      />

      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
      />

      <LegalModal
        isOpen={!!legalModal}
        type={legalModal === 'accessibility' ? 'terms' : legalModal}
        onClose={() => setLegalModal(null)}
      />

      <OrderDrawer />
      <BackToTop />
    </div>
  );
};
