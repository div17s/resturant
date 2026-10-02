import { Button } from '../ui/Button';
import privateDiningImg from '../../assets/images/private_dining_cabana_1790942736132.jpg';

interface DiningExperiencesProps {
  onReserveClick: () => void;
}

export const DiningExperiences = ({ onReserveClick }: DiningExperiencesProps) => {
  const experiences = [
    {
      title: 'Private Family Dining Hall',
      description: 'An elegant private dining alcove accommodating up to 14 guests. Ideal for milestone birthdays, corporate dinners, or intimate family reunions.',
      image: privateDiningImg,
      fallbackImage: '/assets/images/private_dining_cabana.jpg',
      cta: 'Book Private Room',
      colSpan: 'lg:col-span-7',
    },
    {
      title: 'Master Chef Live Counter',
      description: 'Front-row seating along our live tandoor and open kitchen pass. Watch our expert master chefs craft exquisite multi-course Indian menus.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
      cta: "Reserve Chef's Counter",
      colSpan: 'lg:col-span-5',
    },
    {
      title: 'Sunday Royal Feast Brunch',
      description: 'Sunlit afternoon indulgence with live acoustic music, endless small plates, tandoori breads, and refreshing botanical beverages.',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1000&q=80',
      cta: 'Reserve Brunch Table',
      colSpan: 'lg:col-span-5',
    },
    {
      title: 'Grand Celebration Dinners',
      description: 'Custom engraved menus, personalized dining setup, and candlelit ambiance crafted to make your festive celebration or anniversary unforgettable.',
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=80',
      cta: 'Plan Celebration',
      colSpan: 'lg:col-span-7',
    },
  ];

  return (
    <section id="experiences" className="py-20 lg:py-28 bg-stone-950 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-serif text-stone-100 font-normal tracking-tight">
            More Than a Meal
          </h2>
        </div>

        {/* Asymmetric Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {experiences.map((exp) => (
            <div
              key={exp.title}
              className={`${exp.colSpan} group relative rounded-none overflow-hidden bg-stone-900 border border-stone-800 flex flex-col justify-end min-h-[360px] sm:min-h-[420px] p-6 sm:p-8 hover:border-amber-500/50 transition-all`}
            >
              {/* Image Background */}
              <img
                src={exp.image}
                onError={(e) => {
                  if (exp.fallbackImage) {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = exp.fallbackImage;
                  }
                }}
                alt={exp.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-75"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />

              {/* Content overlay */}
              <div className="relative z-10 flex flex-col items-start">
                <h3 className="text-2xl sm:text-3xl font-serif text-stone-100 font-normal mb-3">
                  {exp.title}
                </h3>
                <p className="text-stone-300 text-sm font-normal leading-relaxed mb-6 max-w-xl">
                  {exp.description}
                </p>
                <Button
                  onClick={onReserveClick}
                  variant="outline"
                  className="bg-transparent border-stone-100/30 text-stone-100 font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] py-2.5 px-6 rounded-none backdrop-blur-sm transition-all hover:bg-stone-100 hover:text-stone-950 cursor-pointer"
                >
                  {exp.cta} →
                </Button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
