import { Navbar } from '../components/layout/Navbar';
import { AnnouncementBar } from '../components/layout/AnnouncementBar';
import { Footer } from '../components/layout/Footer';
import { ScrollProgress } from '../components/ui/ScrollProgress';
import { BackToTop } from '../components/ui/BackToTop';
import { OrderDrawer } from '../components/order/OrderDrawer';
import { Link, useLocation } from 'react-router-dom';

export const LegalPage = () => {
  const location = useLocation();
  const path = location.pathname;

  const getPolicyContent = () => {
    switch (path) {
      case '/privacy':
        return {
          title: 'Privacy Policy',
          updated: 'October 2026',
          content: (
            <div className="space-y-4 text-stone-800 leading-relaxed">
              <p>
                At Olive & Restro, we consider the privacy of our dining guests to be of paramount importance. This document describes the personal information received and collected by our website and booking platforms.
              </p>
              <h2 className="text-lg font-bold text-stone-900 pt-2 border-b border-stone-200 pb-1">1. Personal Information Collection</h2>
              <p>
                When making a reservation, placing an order, or contacting us, we collect contact credentials (name, phone number, email) and dining preferences solely to fulfill your hospitality experience.
              </p>
              <h2 className="text-lg font-bold text-stone-900 pt-2 border-b border-stone-200 pb-1">2. Payment Security</h2>
              <p>
                We do not store complete payment credentials, credit card numbers, or banking PINs on our servers. All transactions utilize bank-grade encryption protocols through certified payment processing gateways.
              </p>
            </div>
          ),
        };

      case '/reservation-policy':
        return {
          title: 'Table Reservation Policy',
          updated: 'October 2026',
          content: (
            <div className="space-y-4 text-stone-800 leading-relaxed">
              <p>
                To provide an unhurried, exceptional dining experience for all guests, Olive & Restro operates with the following table policies:
              </p>
              <h2 className="text-lg font-bold text-stone-900 pt-2 border-b border-stone-200 pb-1">1. Table Holding Period</h2>
              <p>
                Reserved tables are held for a maximum of 15 minutes past the scheduled booking time. If your party anticipates a delay due to traffic in Vijay Nagar, please notify our front desk via phone or our online portal.
              </p>
              <h2 className="text-lg font-bold text-stone-900 pt-2 border-b border-stone-200 pb-1">2. Private Dining Enclaves</h2>
              <p>
                Private dining enclaves (parties of 8 to 14) require a 24-hour advance reservation. A dedicated server and custom printed menus are provided for private room experiences.
              </p>
            </div>
          ),
        };

      case '/cancellation-policy':
        return {
          title: 'Cancellation & Modification Policy',
          updated: 'October 2026',
          content: (
            <div className="space-y-4 text-stone-800 leading-relaxed">
              <p>
                We appreciate that dining plans may change. We ask for prompt notification so we may welcome waitlisted guests:
              </p>
              <h2 className="text-lg font-bold text-stone-900 pt-2 border-b border-stone-200 pb-1">1. General Dining</h2>
              <p>
                Standard table reservations can be modified or cancelled without penalty at any time up to 2 hours prior to the reservation time slot via our online portal or phone call.
              </p>
              <h2 className="text-lg font-bold text-stone-900 pt-2 border-b border-stone-200 pb-1">2. Chef's Tasting & Events</h2>
              <p>
                Due to seasonal market sourcing, Chef's Table and Degustation Menu bookings request at least 12 hours notice for cancellation.
              </p>
            </div>
          ),
        };

      case '/refund-policy':
        return {
          title: 'Online Orders & Refund Policy',
          updated: 'October 2026',
          content: (
            <div className="space-y-4 text-stone-800 leading-relaxed">
              <p>
                Our culinary team takes immense pride in every takeaway and delivered dish:
              </p>
              <h2 className="text-lg font-bold text-stone-900 pt-2 border-b border-stone-200 pb-1">1. Quality Guarantee</h2>
              <p>
                If an item is damaged during transit, missing an ordered accompaniment, or fails our stringent temperature and quality standard, please notify us within 60 minutes of delivery.
              </p>
              <h2 className="text-lg font-bold text-stone-900 pt-2 border-b border-stone-200 pb-1">2. Resolution & Refunds</h2>
              <p>
                Eligible order adjustments will be refunded to your original payment method within 3–5 business days or credited as an Olive & Restro dining voucher.
              </p>
            </div>
          ),
        };

      case '/accessibility':
        return {
          title: 'Digital & Physical Accessibility',
          updated: 'October 2026',
          content: (
            <div className="space-y-4 text-stone-800 leading-relaxed">
              <p>
                Olive & Restro is committed to ensuring accessibility for all guests, in accordance with WCAG 2.1 Level AA standards and universal hospitality principles.
              </p>
              <h2 className="text-lg font-bold text-stone-900 pt-2 border-b border-stone-200 pb-1">1. Digital Accessibility</h2>
              <p>
                Our web interfaces feature semantic HTML, visible keyboard navigation focus rings, descriptive ARIA landmarks, and full support for reduced-motion display preferences.
              </p>
              <h2 className="text-lg font-bold text-stone-900 pt-2 border-b border-stone-200 pb-1">2. Physical Facility Accessibility</h2>
              <p>
                Our dining pavilion in Scheme 54, Vijay Nagar, Indore is equipped with wheelchair-accessible entrances, wide corridors, and accessible restrooms.
              </p>
            </div>
          ),
        };

      default:
        return {
          title: 'Terms & Conditions',
          updated: 'October 2026',
          content: (
            <div className="space-y-4 text-stone-800 leading-relaxed">
              <p>
                Welcome to Olive & Restro. By accessing our website, making a reservation, or ordering from our culinary menu, you agree to these terms of service.
              </p>
              <h2 className="text-lg font-bold text-stone-900 pt-2 border-b border-stone-200 pb-1">1. Respectful Dining Environment</h2>
              <p>
                We maintain an elegant, welcoming atmosphere. We reserve the right to refuse service to any individual exhibiting disruptive or disrespectful behavior toward our staff or fellow diners.
              </p>
            </div>
          ),
        };
    }
  };

  const { title, updated, content } = getPolicyContent();

  return (
    <div className="min-h-screen bg-stone-950 text-stone-900 font-sans selection:bg-amber-200 selection:text-stone-900">
      <ScrollProgress />
      <AnnouncementBar onReserveClick={() => {}} onMenuClick={() => window.location.href = '/menu'} />
      <Navbar onReserveClick={() => {}} />

      <main className="py-12 lg:py-16 max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between text-xs text-stone-400">
          <Link to="/" className="hover:text-stone-200 transition-colors">
            ← Back to Home
          </Link>
          <div className="flex gap-2 text-stone-500">
            <Link to="/" className="hover:text-stone-300">Home</Link>
            <span>/</span>
            <span className="text-stone-300">{title}</span>
          </div>
        </div>

        {/* White Translucent Document Card */}
        <article className="bg-white/95 backdrop-blur-md text-stone-900 border border-stone-200 shadow-2xl p-6 sm:p-12 lg:p-16">
          <header className="border-b border-stone-300 pb-6 mb-8">
            <h1 className="text-3xl sm:text-4xl font-sans font-bold text-stone-900 tracking-tight mb-2">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mb-1">
              Effective Date: {updated} | Last Modified: {updated}
            </p>
            <p className="text-xs text-stone-500">
              Olive & Restro Hospitality LLP • Vijay Nagar, Indore, Madhya Pradesh, India
            </p>
          </header>

          <div className="text-sm sm:text-base leading-relaxed text-stone-800">
            {content}
          </div>

          <footer className="mt-12 pt-6 border-t border-stone-200 flex flex-wrap gap-4 text-xs text-stone-600">
            <Link to="/privacy" className="underline hover:text-stone-900">Privacy Policy</Link>
            <span>·</span>
            <Link to="/terms" className="underline hover:text-stone-900">Terms & Conditions</Link>
            <span>·</span>
            <Link to="/reservation-policy" className="underline hover:text-stone-900">Reservation Policy</Link>
            <span>·</span>
            <Link to="/cancellation-policy" className="underline hover:text-stone-900">Cancellation Policy</Link>
            <span>·</span>
            <Link to="/refund-policy" className="underline hover:text-stone-900">Refund Policy</Link>
          </footer>
        </article>
      </main>

      <Footer onOpenPrivacy={() => {}} onOpenTerms={() => {}} onReserveClick={() => {}} />
      <OrderDrawer />
      <BackToTop />
    </div>
  );
};
