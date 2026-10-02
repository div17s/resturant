export interface EventItem {
  id: string;
  title: string;
  schedule: string;
  tagline: string;
  description: string;
  image: string;
  tag: string;
}

export const eventsData: EventItem[] = [
  {
    id: 'e1',
    title: 'Sunday Jazz & Feast Brunch',
    schedule: 'Every Sunday · 12:30 PM – 4:00 PM',
    tagline: 'Sunlit Grazing & Live Saxophone',
    description: 'An expansive weekend feast featuring live grill counters, sparkling cocktails, sourdough station, and smooth live jazz music.',
    image: '/src/assets/images/weekend_brunch_1790879475634.jpg',
    tag: 'Weekly Experience'
  },
  {
    id: 'e2',
    title: 'Live Acoustic Courtyard Evenings',
    schedule: 'Fri & Sat Evenings · 8:00 PM Onwards',
    tagline: 'Under the Stars Ambient Strings',
    description: 'Unwind with handcrafted gin infusions and candlelit dinners while soulful acoustic melodies fill our intimate garden courtyard.',
    image: '/src/assets/images/events_acoustic_1790879522815.jpg',
    tag: 'Live Music'
  },
  {
    id: 'e3',
    title: 'Chef\'s Seasonal Autumn Degustation',
    schedule: 'First Thursday of Every Month',
    tagline: '7-Course Curated Culinary Voyage',
    description: 'An exclusive 7-course tasting menu led personally by Executive Chef, exploring hyper-local organic autumn harvests.',
    image: '/src/assets/images/chef_plating_1790879498149.jpg',
    tag: 'Tasting Menu'
  },
  {
    id: 'e4',
    title: 'Private Celebrations & Bespoke Dining',
    schedule: 'Available Upon Reservation',
    tagline: 'Tailored Menus & Dedicated Sommelier',
    description: 'Elevate birthdays, anniversaries, and corporate dinners with custom engraved menus, dedicated service, and private sommelier pairings.',
    image: '/src/assets/images/private_dining_1790879463651.jpg',
    tag: 'Bespoke'
  }
];
