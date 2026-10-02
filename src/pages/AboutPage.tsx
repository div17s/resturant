import { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { AnnouncementBar } from '../components/layout/AnnouncementBar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { ReservationModal } from '../components/modals/ReservationModal';
import { LegalModal } from '../components/modals/LegalModal';
import { OrderDrawer } from '../components/order/OrderDrawer';
import { ScrollProgress } from '../components/ui/ScrollProgress';
import { BackToTop } from '../components/ui/BackToTop';
import { Leaf } from 'lucide-react';

export const AboutPage = () => {
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-stone-950">
      <ScrollProgress />

      <AnnouncementBar
        onReserveClick={() => setIsReservationOpen(true)}
        onMenuClick={() => window.location.href = '/menu'}
      />

      <Navbar onReserveClick={() => setIsReservationOpen(true)} />

      {/* Hero Header */}
      <section className="relative py-24 lg:py-32 bg-stone-900 border-b border-stone-800 text-center overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <span className="text-amber-500 text-xs font-mono uppercase tracking-widest mb-3 block">
            OUR CULINARY ETHOS
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif text-stone-100 font-light mb-6 leading-tight">
            Rooted in Fire, <br />
            <span className="italic text-amber-200">Refined by Nature.</span>
          </h1>
          <p className="text-stone-300 font-light max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            The narrative of Olive & Restro is written daily in wood-smoke, slow reductions, and seasonal produce celebrating the fertile heart of Madhya Pradesh.
          </p>
        </div>
      </section>

      {/* Main Story Narrative */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-6 relative">
            <div className="relative z-10 overflow-hidden rounded-2xl shadow-2xl border border-stone-800 bg-stone-900 group">
              <img
                src="https://res.cloudinary.com/yfmmvj6f/image/upload/v1790887777/file_00000000240082118848097a9ad7761d.png"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/src/assets/images/ember_olive_story.png";
                }}
                alt="Olive & Restro Culinary Experience"
                className="w-full h-[440px] sm:h-[500px] object-cover object-[20%_top] transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 p-6 rounded-xl bg-stone-900 border border-stone-800 shadow-2xl hidden sm:block max-w-xs">
              <p className="font-serif text-amber-200 text-sm italic">
                "We do not mask ingredients; we elevate their natural character through fire and time."
              </p>
              <p className="text-[11px] text-stone-400 mt-2 font-mono uppercase">— Executive Chef, Ember & Olive</p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 text-stone-300 font-light text-base leading-relaxed">
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-100 font-light">
              A Dining Sanctuary in <span className="italic text-amber-200">Indore</span>
            </h2>
            <p>
              Founded in Vijay Nagar, Indore, Ember & Olive began with an ambition to celebrate the soulful depth of Indian regional cooking in an intimate, contemporary setting.
            </p>
            <p>
              We cook with living fire—tending clay tandoors and wood embers daily to extract deep, smoky aromas from seasonal vegetables, house-paneer, and tender slow-braised delicacies. Spices are hand-selected, roasted in small batches, and balanced with natural reductions rather than heavy artificial additives.
            </p>
            <p>
              Our dining room is designed as an unhurried retreat from the city's bustle: warm candlelight, welcoming smiles, and tables thoughtfully arranged so you can savor conversations just as deeply as the food.
            </p>

            <div className="pt-4">
              <Button
                onClick={() => setIsReservationOpen(true)}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold px-8 py-3"
              >
                Reserve Your Table
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* Sourcing & Pillars */}
      <section className="py-20 bg-stone-900 border-y border-stone-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-2xl sm:text-4xl font-serif text-stone-100 mb-3 font-light">
              Our Commitments to the Craft
            </h3>
            <p className="text-stone-400 text-sm font-light">
              Transparency, provenance, and hospitality underpin everything we serve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-stone-950 border border-stone-800 space-y-4">
              <span className="font-mono text-xs text-amber-500 uppercase tracking-widest block">
                01 · SOURCING
              </span>
              <h4 className="font-serif text-xl text-stone-100">Regional Farm Sourcing</h4>
              <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed">
                We partner with certified organic farms across Malwa for heirloom grains, cold-pressed oils, seasonal roots, and aromatic herbs.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-stone-950 border border-stone-800 space-y-4">
              <span className="font-mono text-xs text-amber-500 uppercase tracking-widest block">
                02 · TECHNIQUE
              </span>
              <h4 className="font-serif text-xl text-stone-100">Live Fire & Smoke</h4>
              <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed">
                Applewood, hickory embers, and clay tandoors impart an irreplaceable depth to our proteins, paneer, and flatbreads.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-stone-950 border border-stone-800 space-y-4">
              <span className="font-mono text-xs text-amber-500 uppercase tracking-widest block">
                03 · ETHOS
              </span>
              <h4 className="font-serif text-xl text-stone-100">Unhurried Hospitality</h4>
              <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed">
                Dining at Ember & Olive is never rushed. We cultivate an atmosphere where hours melt seamlessly into stories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer
        onOpenPrivacy={() => setLegalModal('privacy')}
        onOpenTerms={() => setLegalModal('terms')}
        onReserveClick={() => setIsReservationOpen(true)}
      />

      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
      />

      <LegalModal
        isOpen={!!legalModal}
        type={legalModal}
        onClose={() => setLegalModal(null)}
      />

      <OrderDrawer />
      <BackToTop />
    </div>
  );
};
