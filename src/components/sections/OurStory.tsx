import { Button } from '../ui/Button';
import atmosphereImg from '../../assets/images/atmosphere_rooftop_1790942715835.jpg';
import privateDiningImg from '../../assets/images/private_dining_cabana_1790942736132.jpg';

interface OurStoryProps {
  onReserveClick: () => void;
}

export const OurStory = ({ onReserveClick }: OurStoryProps) => {
  return (
    <section id="story" className="py-20 sm:py-28 bg-[#0b0e14] text-stone-100 relative overflow-hidden border-b border-stone-800">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-serif text-stone-100 font-normal tracking-tight">
            Our <span className="text-[#f5be38] italic">Story</span>
          </h2>
        </div>

        {/* Bento Grid Story Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Visual Collage with rectangular box style badges */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-3xl h-64 sm:h-80 shadow-2xl border border-stone-800 group">
                <img
                  src={atmosphereImg}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/images/atmosphere_rooftop.jpg';
                  }}
                  alt="Atmosphere - Rooftop Open Air Dining"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 text-xs font-mono text-stone-100 bg-stone-950/90 px-4 py-1.5 rounded-none border border-stone-700 backdrop-blur-md shadow-lg">
                  Atmosphere
                </span>
              </div>
              <div className="relative overflow-hidden rounded-3xl h-44 sm:h-52 shadow-2xl border border-stone-800 group">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
                  alt="Signature Dish"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 text-xs font-mono text-stone-100 bg-stone-950/90 px-4 py-1.5 rounded-none border border-stone-700 backdrop-blur-md shadow-lg">
                  Handcrafted
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="relative overflow-hidden rounded-3xl h-44 sm:h-52 shadow-2xl border border-stone-800 group">
                <img
                  src={privateDiningImg}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/images/private_dining_cabana.jpg';
                  }}
                  alt="Private Dining Enclave Cabana"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 text-xs font-mono text-stone-100 bg-stone-950/90 px-4 py-1.5 rounded-none border border-stone-700 backdrop-blur-md shadow-lg">
                  Private Dining
                </span>
              </div>
              <div className="relative overflow-hidden rounded-3xl h-64 sm:h-80 shadow-2xl border border-stone-800 group">
                <img
                  src="https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80"
                  alt="Chef Culinary Mastery"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 text-xs font-mono text-stone-100 bg-stone-950/90 px-4 py-1.5 rounded-none border border-stone-700 backdrop-blur-md shadow-lg">
                  Culinary Art
                </span>
              </div>
            </div>
          </div>

          {/* Right Text & Narrative */}
          <div className="lg:col-span-6 space-y-6 lg:pl-6">
            
            <h3 className="text-2xl sm:text-3xl font-sans text-stone-100 font-bold leading-snug">
              Nestled in Vijay Nagar, Indore, <span className="text-[#f5be38]">Olive & Restro</span> redefines the sensory landscape of fine dining.
            </h3>

            <div className="space-y-4 text-stone-300 font-light text-base leading-relaxed">
              <p className="text-stone-300 font-light">
                We believe that great dining is not merely about food—it is an immersive journey of aromas, warmth, and soul. Every spice blend is ground in-house daily, pairing time-honored royal Mughal recipes with contemporary European presentation.
              </p>
              <p className="text-stone-300 font-light">
                From slow-cooked Dum Biryanis simmered for hours under dough-sealed copper handis to wood-fired kebabs kissed by open flame, our kitchen celebrates uncompromising quality and sustainable farm-fresh sourcing.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-transparent border border-stone-800 rounded-2xl p-4">
                <h4 className="font-medium text-stone-200 text-sm">Wood-Fire Hearths</h4>
                <p className="text-stone-400 text-xs mt-1">Natural charcoal embers for authentic tandoori smoke.</p>
              </div>

              <div className="bg-transparent border border-stone-800 rounded-2xl p-4">
                <h4 className="font-medium text-stone-200 text-sm">Master Chefs</h4>
                <p className="text-stone-400 text-xs mt-1">Decades of royal culinary heritage & artistry.</p>
              </div>
            </div>

            {/* Statistic Row */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-800/80 text-stone-300">
              <div>
                <div className="text-xl sm:text-2xl font-sans font-semibold text-stone-100">12+</div>
                <div className="text-xs text-stone-400 uppercase tracking-wider mt-1">Years of Craft</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-sans font-semibold text-stone-100">45+</div>
                <div className="text-xs text-stone-400 uppercase tracking-wider mt-1">Heritage Dishes</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-sans font-semibold text-stone-100">30K+</div>
                <div className="text-xs text-stone-400 uppercase tracking-wider mt-1">Happy Guests</div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={onReserveClick}
                className="bg-[#f5be38] hover:bg-amber-400 text-stone-950 font-semibold px-8 py-3.5 shadow-xl transition-transform active:scale-95"
              >
                Experience Olive & Restro
              </Button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
