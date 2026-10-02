import { useNavigate } from 'react-router-dom';

export const OurSpeciality = () => {
  const navigate = useNavigate();

  const specialities = [
    {
      name: 'Mughlai',
      image: 'https://res.cloudinary.com/yfmmvj6f/image/upload/v1790930962/file_0000000069888211bbbdadb699d37b31.png',
      fallback: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      description: 'Slow-cooked Dum Biryanis, tender Nihari & rich royal gravies',
    },
    {
      name: 'Indian',
      image: 'https://res.cloudinary.com/yfmmvj6f/image/upload/v1790931046/file_00000000717c8211ac1a0a0683478cb1.png',
      fallback: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
      description: 'Clay tandoor breads, dal makhani & rich heirloom curries',
    },
    {
      name: 'Chinese',
      image: 'https://res.cloudinary.com/yfmmvj6f/image/upload/v1790931089/file_000000002bc88211b43937b172bc51b1.png',
      fallback: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      description: 'Wok-tossed chilli paneer, crispy appetizers & spiced noodles',
    },
  ];

  return (
    <section id="speciality" className="py-16 sm:py-20 lg:py-24 bg-stone-950 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-serif text-stone-100 font-normal mb-3 tracking-tight">
            Our Speciality
          </h2>

          {/* Decorative Divider with Amber Theme */}
          <div className="flex items-center justify-center gap-3 my-4">
            <span className="w-12 h-px bg-amber-500/40"></span>
            <span className="text-[#f5be38] text-xs tracking-widest font-serif">✤</span>
            <span className="w-12 h-px bg-amber-500/40"></span>
          </div>

          <p className="text-stone-300 font-normal text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            We provide a wide range of cuisines and dishes to choose from so that every foodie in town has their best experience with us.
          </p>
        </div>

        {/* 3 Large Vertical Cuisine Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {specialities.map((item) => (
            <div
              key={item.name}
              onClick={() => navigate('/menu')}
              className="relative group overflow-hidden rounded-xl bg-stone-900 border border-stone-800 shadow-2xl cursor-pointer h-[420px] sm:h-[480px] transition-all duration-500 hover:border-amber-700/60 hover:shadow-amber-950/30"
            >
              {/* Dish Photography */}
              <img
                src={item.image}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = item.fallback;
                }}
                alt={`${item.name} cuisine speciality at Ember & Olive`}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/30 to-stone-950/10 transition-opacity duration-300 group-hover:from-stone-950/90" />

              {/* Bottom Cuisine Title & Subtitle */}
              <div className="absolute inset-x-0 bottom-8 text-center px-4 z-10 flex flex-col items-center">
                <h3 className="text-3xl sm:text-4xl font-serif text-stone-100 font-normal tracking-wide drop-shadow-md group-hover:text-[#f5be38] transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-stone-300 font-normal mt-1 max-w-[240px] opacity-90 group-hover:opacity-100 transition-opacity">
                  {item.description}
                </p>
                <span className="text-[11px] font-sans font-semibold uppercase tracking-widest text-[#f5be38] mt-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  View Dishes →
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
