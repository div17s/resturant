export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  rating: number;
  review: string;
  visitType: string;
  date: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Aarav Mehta',
    role: 'Food & Wine Enthusiast',
    rating: 5,
    review: 'Ember & Olive has elevated dining in Indore to an international benchmark. The Truffle Kulcha paired with their Smoked Old Fashioned is unforgettable.',
    visitType: 'Dinner',
    date: 'September 2026'
  },
  {
    id: 't2',
    name: 'Priya & Vikram Sharma',
    role: 'Local Resident',
    rating: 5,
    review: 'We hosted our 10th anniversary in the Private Dining enclave. The level of hospitality, detail, and custom menu was world-class.',
    visitType: 'Anniversary Celebration',
    date: 'August 2026'
  },
  {
    id: 't3',
    name: 'Dr. Siddharth Kapoor',
    role: 'Surgeon & Traveler',
    rating: 5,
    review: 'The nuance in flavor balancing—combining French technique with Indian soul—is executed flawlessly. The Smoked Paneer Steak is pure magic.',
    visitType: 'Chef\'s Table',
    date: 'September 2026'
  },
  {
    id: 't4',
    name: 'Ananya Verma',
    role: 'Design Director',
    rating: 5,
    review: 'From the warm minimalist interior to the acoustic ambience and incredible dessert, every minute at Ember & Olive felt like an editorial memory.',
    visitType: 'Weekend Brunch',
    date: 'September 2026'
  }
];
