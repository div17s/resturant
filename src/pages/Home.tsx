import { useState, useEffect } from 'react';
import { AnnouncementBar } from '../components/layout/AnnouncementBar';
import { Navbar } from '../components/layout/Navbar';
import { Hero } from '../components/sections/Hero';
import { PromoBanner } from '../components/sections/PromoBanner';
import { OurStory } from '../components/sections/OurStory';
import { OurSpeciality } from '../components/sections/OurSpeciality';
import { SignatureMenu } from '../components/sections/SignatureMenu';
import { DiningExperiences } from '../components/sections/DiningExperiences';
import { VisualBreak } from '../components/sections/VisualBreak';
import { Testimonials } from '../components/sections/Testimonials';
import { Reservation } from '../components/sections/Reservation';
import { Footer } from '../components/layout/Footer';

import { ReservationModal } from '../components/modals/ReservationModal';
import { DishDetailModal } from '../components/modals/DishDetailModal';
import { LegalModal } from '../components/modals/LegalModal';
import { ConciergeModal } from '../components/modals/ConciergeModal';
import { OrderDrawer } from '../components/order/OrderDrawer';

import { ScrollProgress } from '../components/ui/ScrollProgress';
import { BackToTop } from '../components/ui/BackToTop';
import { CookieConsent } from '../components/ui/CookieConsent';

import { MenuItem } from '../data/menuData';
import { useNavigate } from 'react-router-dom';
import { ScrollReveal } from '../components/ui/ScrollReveal';

export const Home = () => {
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | 'accessibility' | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, []);

  const handleOpenReservation = () => {
    setIsReservationOpen(true);
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-stone-950">
      
      {/* Scroll Progress Bar */}
      <ScrollProgress />

      {/* Top Announcement Bar */}
      <AnnouncementBar
        onReserveClick={handleOpenReservation}
        onMenuClick={() => handleScrollToSection('menu')}
      />

      {/* Main Sticky Navbar */}
      <Navbar onReserveClick={handleOpenReservation} />

      <main>
        {/* 2. Hero Section */}
        <Hero
          onReserveClick={handleOpenReservation}
          onExploreMenuClick={() => handleScrollToSection('menu')}
          onOpenConcierge={() => setIsConciergeOpen(true)}
        />

        {/* Promo Offer Banner */}
        <ScrollReveal animation="fade-up">
          <PromoBanner onClaimOffer={handleOpenReservation} />
        </ScrollReveal>

        {/* 3. Our Speciality Section */}
        <ScrollReveal animation="fade-up">
          <OurSpeciality />
        </ScrollReveal>

        {/* 4. Signature Menu Section */}
        <ScrollReveal animation="fade-up">
          <SignatureMenu
            onSelectDish={(dish) => setSelectedDish(dish)}
            onOpenFullMenuModal={() => navigate('/menu')}
          />
        </ScrollReveal>

        {/* 5. What They Say? Reviews Section */}
        <ScrollReveal animation="fade-up">
          <Testimonials />
        </ScrollReveal>

        {/* 6. Our Story Section */}
        <ScrollReveal animation="fade-up">
          <OurStory onReserveClick={handleOpenReservation} />
        </ScrollReveal>

        {/* 6. Dining Experiences Section */}
        <ScrollReveal animation="fade-up">
          <DiningExperiences onReserveClick={handleOpenReservation} />
        </ScrollReveal>

        {/* 8. Full-Width Visual Break */}
        <ScrollReveal animation="fade-up">
          <VisualBreak />
        </ScrollReveal>

        {/* 11. Reservation Section */}
        <ScrollReveal animation="fade-up">
          <Reservation />
        </ScrollReveal>
      </main>

      {/* 16. Footer */}
      <Footer
        onOpenPrivacy={() => setLegalModal('privacy')}
        onOpenTerms={() => setLegalModal('terms')}
        onReserveClick={handleOpenReservation}
      />

      {/* Floating Utilities */}
      <BackToTop />
      <CookieConsent />

      {/* Modals & Drawers */}
      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
      />

      <DishDetailModal
        dish={selectedDish}
        onClose={() => setSelectedDish(null)}
        onReserveClick={handleOpenReservation}
      />

      <LegalModal
        isOpen={!!legalModal}
        type={legalModal}
        onClose={() => setLegalModal(null)}
      />

      <OrderDrawer />

      {/* Schema.org JSON-LD Structured Data for Local Business / Restaurant SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Restaurant',
            name: 'Olive & Restro',
            image: 'https://oliveandrestro.com/assets/images/hero_banner.jpg',
            '@id': 'https://oliveandrestro.com',
            url: 'https://oliveandrestro.com',
            priceRange: '₹₹₹',
            servesCuisine: ['Contemporary Indian', 'European Fusion'],
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Scheme No. 54, Vijay Nagar',
              addressLocality: 'Indore',
              addressRegion: 'Madhya Pradesh',
              postalCode: '452010',
              addressCountry: 'IN',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 22.7533,
              longitude: 75.8937,
            },
            openingHoursSpecification: [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
                opens: '12:00',
                closes: '22:30',
              },
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Friday', 'Saturday', 'Sunday'],
                opens: '12:00',
                closes: '23:30',
              },
            ],
            acceptsReservations: 'True',
          }),
        }}
      />

      {/* Digital Concierge Modal */}
      <ConciergeModal
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
        onOpenReservation={handleOpenReservation}
        onOpenMenu={() => navigate('/menu')}
      />
    </div>
  );
};
