import { MapPin, Phone, Mail, Clock, ExternalLink, Navigation } from 'lucide-react';
import { Button } from '../ui/Button';

export const LocationContact = () => {
  return (
    <section id="contact" className="py-20 lg:py-28 bg-stone-950 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-amber-500 text-xs font-mono uppercase tracking-widest mb-2 block">
            VISIT & CONNECT
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-light text-stone-100 mb-3">
            Come Find <span className="italic text-amber-200">Us</span>
          </h2>
          <p className="text-stone-400 font-light text-sm sm:text-base">
            Located in the vibrant Vijay Nagar dining district of Indore.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Contact & Hours */}
          <div className="lg:col-span-6 bg-stone-900 border border-stone-800 rounded-2xl p-8 flex flex-col justify-between shadow-xl">
            <div>
              <h3 className="text-2xl font-serif text-amber-100 mb-6 font-light">
                OLIVE & RESTRO
              </h3>

              {/* Address */}
              <div className="flex items-start gap-4 mb-6">
                <div className="p-2.5 rounded-lg bg-stone-950 border border-stone-800 text-amber-400 shrink-0 mt-1">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-mono tracking-wider text-stone-400 mb-1">
                    LOCATION ADDRESS
                  </h4>
                  <p className="text-stone-200 text-base font-light leading-snug">
                    Scheme No. 54, Vijay Nagar,<br />
                    Indore, Madhya Pradesh 452010, India
                  </p>
                </div>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 border-y border-stone-800 py-6">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-amber-500 shrink-0 mt-1" />
                  <div>
                    <span className="text-xs font-mono text-stone-400 uppercase block">EMAIL</span>
                    <a href="mailto:hello@oliveandrestro.com" className="text-stone-200 hover:text-amber-300 font-medium text-sm">
                      hello@oliveandrestro.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="mb-8">
                <h4 className="text-xs uppercase font-mono tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  OPENING HOURS
                </h4>
                <div className="space-y-2 text-sm font-light text-stone-300">
                  <div className="flex justify-between border-b border-stone-800/60 pb-1.5">
                    <span>Monday – Thursday</span>
                    <span className="font-serif text-amber-200">12:00 PM – 10:30 PM</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-800/60 pb-1.5">
                    <span>Friday – Sunday</span>
                    <span className="font-serif text-amber-200">12:00 PM – 11:30 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="https://maps.google.com/?q=Vijay+Nagar+Indore"
                target="_blank"
                rel="noreferrer"
                className="flex-1"
              >
                <Button className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold flex items-center justify-center gap-2 py-3 text-sm">
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </Button>
              </a>
            </div>
          </div>

          {/* Right Column: Custom Stylized Map Integration Area */}
          <div className="lg:col-span-6 bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden relative min-h-[400px] flex flex-col shadow-xl">
            {/* Custom SVG Map Visualiser for Vijay Nagar */}
            <div className="relative w-full h-full min-h-[420px] bg-stone-950 flex flex-col justify-between p-6">
              {/* Background Map Grid Graphic */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="relative z-10 flex items-center justify-between text-xs font-mono text-amber-400">
                <span className="bg-stone-900/90 px-3 py-1.5 rounded-md border border-stone-800">
                  INDORE · VIJAY NAGAR DISTRICT
                </span>
                <span className="bg-emerald-950/80 text-emerald-400 px-3 py-1.5 rounded-md border border-emerald-800">
                  ● OPEN NOW
                </span>
              </div>

              {/* Central Map Pin Focus */}
              <div className="relative z-10 my-auto text-center flex flex-col items-center">
                <div className="relative mb-4">
                  <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-amber-500/40 opacity-75"></span>
                  <div className="relative w-12 h-12 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-2xl">
                    <MapPin className="w-6 h-6 fill-stone-950" />
                  </div>
                </div>

                <h4 className="text-xl font-serif text-stone-100 font-medium">Ember & Olive</h4>
                <p className="text-xs text-stone-400 font-light max-w-xs mt-1">
                  Opposite Fortune Landmark, Near AB Road, Vijay Nagar, Indore
                </p>
                <p className="text-[11px] text-amber-400/80 font-mono mt-2">
                  Valet Parking Available
                </p>
              </div>

              {/* Bottom Interactive Link */}
              <div className="relative z-10 pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                <span>Coordinates: 22.7533° N, 75.8937° E</span>
                <a
                  href="https://maps.google.com/?q=Vijay+Nagar+Indore"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 hover:underline flex items-center gap-1"
                >
                  Open in Google Maps <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
