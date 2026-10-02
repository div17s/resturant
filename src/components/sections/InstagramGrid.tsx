import { Instagram, Heart } from 'lucide-react';
import { Button } from '../ui/Button';

export const InstagramGrid = () => {
  const posts = [
    {
      id: 'p1',
      image: '/src/assets/images/signature_dish_1790878418293.jpg',
      likes: '1.2k',
      caption: 'Smoked Paneer Steak hot off the applewood embers. #EmberAndOlive',
    },
    {
      id: 'p2',
      image: '/src/assets/images/cocktails_bar_1790879486946.jpg',
      likes: '980',
      caption: 'Hand-infused botanical spritzes for warm Indore evenings.',
    },
    {
      id: 'p3',
      image: '/src/assets/images/culinary_gallery_1_1790879508736.jpg',
      likes: '1.4k',
      caption: 'Truffle Mushroom Kulchas pulled fresh from the tandoor.',
    },
    {
      id: 'p4',
      image: '/src/assets/images/social_grid_item_1790878443602.jpg',
      likes: '2.1k',
      caption: 'Burnt Basque Rose Cheesecake with damask rose reduction.',
    },
    {
      id: 'p5',
      image: '/src/assets/images/private_dining_1790879463651.jpg',
      likes: '1.1k',
      caption: 'Private dining enclaves designed for milestone moments.',
    },
    {
      id: 'p6',
      image: '/src/assets/images/events_acoustic_1790879522815.jpg',
      likes: '1.8k',
      caption: 'Live acoustic courtyard strings every weekend.',
    },
  ];

  return (
    <section className="py-20 bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-amber-500 text-xs font-mono uppercase tracking-widest mb-2 block flex items-center justify-center gap-1.5">
            <Instagram className="w-4 h-4" /> @OLIVEANDRESTRO.INDORE
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-light text-stone-100 mb-3">
            Follow the <span className="italic text-amber-200">Table</span>
          </h2>
          <p className="text-stone-400 font-light text-sm">
            Behind the scenes, seasonal arrivals, and stories from our kitchen.
          </p>
        </div>

        {/* 6-Photo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {posts.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="group relative rounded-xl overflow-hidden aspect-square bg-stone-950 border border-stone-800 shadow-md block"
            >
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-stone-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center">
                <Heart className="w-5 h-5 text-amber-400 fill-amber-400 mb-1" />
                <span className="text-xs font-medium text-white">{post.likes}</span>
                <p className="text-[10px] text-stone-300 line-clamp-2 mt-1 font-light">
                  {post.caption}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Instagram CTA Button */}
        <div className="text-center">
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <Button
              variant="outline"
              className="border-stone-700 text-stone-200 hover:bg-stone-800 hover:border-amber-500/50 inline-flex items-center gap-2"
            >
              <Instagram className="w-4 h-4 text-amber-400" />
              Follow Us on Instagram
            </Button>
          </a>
        </div>

      </div>
    </section>
  );
};
