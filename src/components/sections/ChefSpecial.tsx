import { Button } from '../ui/Button';

interface ChefSpecialProps {
  onReserveClick: () => void;
}

export const ChefSpecial = ({ onReserveClick }: ChefSpecialProps) => {
  return (
    <section className="py-20 lg:py-28 bg-stone-900 text-stone-100 border-b border-stone-800 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Content Column (Asymmetric Left) */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col justify-center">
            <div className="text-amber-500 text-xs font-mono uppercase tracking-widest mb-3">
              CHEF'S TABLE SPOTLIGHT
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif text-stone-100 font-light mb-4">
              Smoked Paneer <span className="italic font-normal text-amber-200">Steak</span>
            </h2>

            <p className="text-2xl font-serif text-amber-400 mb-6">
              ₹480 <span className="text-xs font-sans text-stone-400 font-light">· Inclusive of taxes</span>
            </p>

            <div className="space-y-4 text-stone-300 font-light text-base leading-relaxed mb-8">
              <p>
                Our signature vegetarian masterpiece. Hand-crafted artisanal cottage cheese, cold-smoked over applewood embers for six hours, then flame-seared on lava rocks.
              </p>
              <p>
                Served atop a bed of caramelized heirloom root vegetables and finished with our 24-hour reduced spiced plum and port wine glace.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={onReserveClick}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold px-8 py-3.5"
              >
                Reserve for Dinner
              </Button>
            </div>
          </div>

          {/* Image Column (Asymmetric Right with subtle overlay styling) */}
          <div className="lg:col-span-7 order-1 lg:order-2 relative">
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-stone-800 group">
              <img
                src="/src/assets/images/signature_dish_1790878418293.jpg"
                alt="Smoked Paneer Steak - Ember & Olive Chef's Special"
                className="w-full h-[400px] sm:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-lg bg-stone-950/80 backdrop-blur-md border border-stone-800 flex items-center justify-between text-xs text-stone-300">
                <span>Ingredient Focus: Applewood Smoke · Plum Glaze</span>
                <span className="text-amber-400 font-medium">Limited Daily Covers</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
