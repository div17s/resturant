export interface GalleryItem {
  id: string;
  title: string;
  category: 'interior' | 'dishes' | 'chef' | 'cocktails';
  image: string;
  caption: string;
  aspect?: string;
}

export const galleryCategories = [
  { id: 'all', label: 'All Photos' },
  { id: 'interior', label: 'Interior & Ambience' },
  { id: 'dishes', label: 'Culinary Creations' },
  { id: 'chef', label: 'Kitchen & Craft' },
  { id: 'cocktails', label: 'Bar & Mixology' },
];

export const galleryData: GalleryItem[] = [
  {
    id: 'g1',
    title: 'The Dining Hall at Dusk',
    category: 'interior',
    image: '/src/assets/images/hero_banner_1790878389975.jpg',
    caption: 'Warm ambient illumination sets the tone for an unhurried culinary journey.',
    aspect: 'aspect-[16/9]'
  },
  {
    id: 'g2',
    title: 'Smoked Paneer Steak Detail',
    category: 'dishes',
    image: '/src/assets/images/signature_dish_1790878418293.jpg',
    caption: 'Flame-charred paneer accompanied by seasonal root glaze.',
    aspect: 'aspect-[4/3]'
  },
  {
    id: 'g3',
    title: 'Private Dining Enclave',
    category: 'interior',
    image: '/src/assets/images/private_dining_1790879463651.jpg',
    caption: 'An intimate architectural space crafted for milestone celebrations.',
    aspect: 'aspect-[4/3]'
  },
  {
    id: 'g4',
    title: 'Crafting the Signature Cocktail',
    category: 'cocktails',
    image: '/src/assets/images/cocktails_bar_1790879486946.jpg',
    caption: 'House-infused botanicals and hand-carved crystal ice.',
    aspect: 'aspect-[3/4]'
  },
  {
    id: 'g5',
    title: 'Master Chef at Work',
    category: 'chef',
    image: '/src/assets/images/chef_plating_1790879498149.jpg',
    caption: 'Precision, passion, and respect for seasonal ingredients in our open kitchen.',
    aspect: 'aspect-[4/3]'
  },
  {
    id: 'g6',
    title: 'Truffle Mushroom Kulcha',
    category: 'dishes',
    image: '/src/assets/images/culinary_gallery_1_1790879508736.jpg',
    caption: 'Freshly pulled from the tandoor with black truffle butter.',
    aspect: 'aspect-[3/4]'
  },
  {
    id: 'g7',
    title: 'Sunday Brunch Atmosphere',
    category: 'interior',
    image: '/src/assets/images/weekend_brunch_1790879475634.jpg',
    caption: 'Sunlit tables with cured treats and conversation.',
    aspect: 'aspect-[16/9]'
  },
  {
    id: 'g8',
    title: 'Acoustic Evenings Courtyard',
    category: 'interior',
    image: '/src/assets/images/events_acoustic_1790879522815.jpg',
    caption: 'Live acoustic strings under open sky lighting.',
    aspect: 'aspect-[4/3]'
  },
  {
    id: 'g9',
    title: 'Artisanal Dessert Plating',
    category: 'dishes',
    image: '/src/assets/images/social_grid_item_1790878443602.jpg',
    caption: 'A delicate synthesis of European technique and Indian flavor notes.',
    aspect: 'aspect-[1/1]'
  }
];
