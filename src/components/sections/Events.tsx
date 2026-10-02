import { eventsData } from '../../data/events';
import { Button } from '../ui/Button';
import { Calendar } from 'lucide-react';

interface EventsProps {
  onReserveClick: () => void;
}

export const Events = ({ onReserveClick }: EventsProps) => {
  return (
    <section className="py-20 lg:py-28 bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-amber-500 text-xs font-mono uppercase tracking-widest mb-2 block">
            SEASONAL CALENDAR
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-light text-stone-100 mb-3">
            What's <span className="italic text-amber-200">Happening</span>
          </h2>
          <p className="text-stone-400 font-light text-sm sm:text-base">
            Curated evenings, live performances, and limited tasting journeys at Ember & Olive.
          </p>
        </div>

        {/* Editorial Horizontal List */}
        <div className="space-y-8">
          {eventsData.map((evt) => (
            <div
              key={evt.id}
              className="bg-stone-950/80 border border-stone-800 rounded-xl overflow-hidden p-6 sm:p-8 flex flex-col lg:flex-row gap-8 items-center hover:border-amber-900/60 transition-all shadow-lg group"
            >
              {/* Event Image */}
              <div className="w-full lg:w-72 h-52 rounded-lg overflow-hidden shrink-0 relative bg-stone-900">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 bg-stone-950/90 text-amber-400 text-[11px] font-mono px-2.5 py-1 rounded border border-amber-900/40">
                  {evt.tag}
                </span>
              </div>

              {/* Event Description */}
              <div className="flex-1">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-mono mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{evt.schedule}</span>
                </div>

                <h3 className="text-2xl font-serif text-stone-100 font-light mb-1 group-hover:text-amber-200 transition-colors">
                  {evt.title}
                </h3>
                <p className="text-amber-400/80 text-xs font-medium uppercase tracking-wider mb-3">
                  {evt.tagline}
                </p>
                <p className="text-stone-300 text-sm font-light leading-relaxed max-w-2xl mb-4">
                  {evt.description}
                </p>
              </div>

              {/* CTA */}
              <div className="w-full lg:w-auto shrink-0">
                <Button
                  onClick={onReserveClick}
                  variant="outline"
                  className="w-full lg:w-auto border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-stone-950 font-medium text-xs sm:text-sm py-3 px-6"
                >
                  Reserve For Event
                </Button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
