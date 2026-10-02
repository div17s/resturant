export const WhyUs = () => {
  const pillars = [
    {
      num: '01',
      title: 'Seasonal Ingredients',
      description: 'Organic produce harvested weekly from small regional farms across Malwa and Madhya Pradesh.',
    },
    {
      num: '02',
      title: 'Thoughtful Hospitality',
      description: 'Attentive, unhurried service designed to make every guest feel known and celebrated.',
    },
    {
      num: '03',
      title: 'Open Kitchen Pass',
      description: 'Complete visual transparency as our culinary team crafts every plate with quiet precision.',
    },
    {
      num: '04',
      title: 'Curated Mixology',
      description: 'House-made botanical syrups, hand-cut ice spheres, and vintage spirits curated by our sommelier.',
    },
    {
      num: '05',
      title: 'Locally Inspired',
      description: 'Rooted in the rich food traditions of Indore while embracing modern European culinary aesthetics.',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="max-w-2xl mb-16">
          <span className="text-amber-500 text-xs font-mono uppercase tracking-widest mb-2 block">
            OUR PHILOSOPHICAL PILLARS
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-light text-stone-100 mb-4">
            The Olive & Restro <span className="italic text-amber-200">Difference</span>
          </h2>
          <p className="text-stone-400 font-light text-base">
            How we cultivate moments worth savoring through craft, integrity, and quiet detail.
          </p>
        </div>

        {/* Minimalist Editorial Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 divide-y md:divide-y-0 md:divide-x divide-stone-800">
          {pillars.map((pillar) => {
            return (
              <div key={pillar.title} className="pt-6 md:pt-0 md:px-4 first:pl-0 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs text-amber-500/90 tracking-widest block mb-4">
                    {pillar.num}
                  </span>
                  <h3 className="text-lg font-serif text-stone-100 font-medium mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
