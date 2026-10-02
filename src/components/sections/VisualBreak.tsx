export const VisualBreak = () => {
  return (
    <section className="relative h-[50vh] sm:h-[60vh] flex items-center justify-center text-center overflow-hidden bg-stone-950 border-b border-stone-800">
      <img
        src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80"
        alt="Olive & Restro Atmosphere"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-[2px]" />

      <div className="relative z-10 px-6 max-w-4xl">
        <span className="text-amber-400/80 text-sm font-sans mb-4 block">
          Olive & Restro Promise
        </span>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-stone-100 font-light tracking-wide leading-tight text-balance">
          GOOD FOOD.<br />
          GOOD PEOPLE.<br />
          <span className="italic font-normal text-amber-200">GOOD MOMENTS.</span>
        </h2>
      </div>
    </section>
  );
};
