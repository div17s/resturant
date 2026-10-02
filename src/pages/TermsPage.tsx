import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ReservationModal } from '../components/modals/ReservationModal';

export const TermsPage = () => {
  const [isReservationOpen, setIsReservationOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-900 font-sans selection:bg-amber-200 selection:text-stone-900">
      <Navbar onReserveClick={() => setIsReservationOpen(true)} />

      {/* Main Content Area */}
      <main className="py-10 lg:py-16 px-4 sm:px-6 max-w-4xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between text-xs text-stone-400">
          <Link
            to="/"
            className="hover:text-stone-200 transition-colors"
          >
            ← Back to Home
          </Link>
          <div className="flex gap-2 text-stone-500">
            <Link to="/" className="hover:text-stone-300">Home</Link>
            <span>/</span>
            <span className="text-stone-300">Terms & Conditions</span>
          </div>
        </div>

        {/* White Translucent Document Page */}
        <article className="bg-white/95 backdrop-blur-md text-stone-900 border border-stone-200 shadow-2xl p-6 sm:p-12 lg:p-16">
          
          {/* Document Header */}
          <header className="border-b border-stone-300 pb-6 mb-8">
            <h1 className="text-3xl sm:text-4xl font-sans font-bold text-stone-900 tracking-tight mb-2">
              Terms & Conditions
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mb-1">
              Effective Date: October 1, 2026 | Last Modified: October 2026
            </p>
            <p className="text-xs text-stone-500">
              Entity: Olive & Restro Hospitality LLP • Indore, Madhya Pradesh, India
            </p>
          </header>

          {/* Standard HTML Text Body */}
          <div className="space-y-8 text-sm sm:text-base leading-relaxed text-stone-800">
            
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-3 pb-1 border-b border-stone-200">
                1. Agreement to Terms
              </h2>
              <p className="mb-3">
                Welcome to Olive & Restro. These Terms and Conditions govern your access to and use of our website, digital reservation platform, mobile web services, and in-person dining experiences at our restaurant located in Vijay Nagar, Indore.
              </p>
              <p>
                By browsing our website, reserving a dining table, or placing an order, you confirm that you have read, understood, and agreed to be legally bound by these Terms and our Privacy Policy. If you do not agree to all terms, please discontinue using our digital services.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-3 pb-1 border-b border-stone-200">
                2. Table Reservations and Seating Policy
              </h2>
              <p className="mb-3">
                To provide a gracious dining atmosphere and prompt hospitality for all our patrons, we observe the following reservation terms:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>
                  <strong>Grace Period:</strong> Confirmed reservations are held for 15 minutes past the scheduled booking time. If your party is delayed, please inform our front desk. Tables unclaimed after 15 minutes may be allocated to waiting walk-in guests.
                </li>
                <li>
                  <strong>Seating Duration:</strong> Standard reservation seatings are planned for 90 minutes for groups up to 4 guests, and 120 minutes for larger parties of 5 or more.
                </li>
                <li>
                  <strong>Group Bookings:</strong> Parties larger than 8 guests or private salon dining require a minimum 24-hour advance confirmation and may require a token confirmation advance.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-3 pb-1 border-b border-stone-200">
                3. Cancellation and Rescheduling Policy
              </h2>
              <p className="mb-3">
                We understand that plans can change. If you wish to cancel or modify your reservation, we appreciate timely notice:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Standard Bookings:</strong> Cancellations or amendments are free of charge when requested at least 2 hours before the scheduled dining time.
                </li>
                <li>
                  <strong>Special Events and Tasting Menus:</strong> For festival banquets, private dinners, or curated tasting menus, cancellations require 12 hours advance notice for deposit refunds.
                </li>
                <li>
                  <strong>No-Shows:</strong> Repeated failure to attend confirmed reservations without prior notice may result in restricted online booking privileges.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-3 pb-1 border-b border-stone-200">
                4. Pricing, Billing and Taxes
              </h2>
              <p className="mb-3">
                All prices listed on our menus and online platforms are quoted in Indian Rupees (INR ₹).
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Taxes:</strong> Applicable Goods and Services Tax (GST) is charged on all food and beverage sales in compliance with Government of India regulations.
                </li>
                <li>
                  <strong>Service Charges:</strong> Any service charge included on the bill is voluntary and discretionary. You may request its removal at any time without hesitation.
                </li>
                <li>
                  <strong>Accepted Payment:</strong> We accept cash (INR), UPI (Google Pay, PhonePe, Paytm, BHIM), debit cards, and major credit cards (Visa, Mastercard, RuPay, Amex).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-3 pb-1 border-b border-stone-200">
                5. Dietary Requirements and Allergies
              </h2>
              <p className="mb-3">
                Our kitchen prepares meals using fresh, authentic ingredients. While our culinary team takes strict hygiene and handling precautions, our kitchen processes common allergens including tree nuts, dairy, wheat/gluten, mustard, soy, and shellfish.
              </p>
              <p>
                <strong>Guest Responsibility:</strong> Guests with acute allergies or dietary restrictions must notify their server prior to ordering. Olive & Restro cannot guarantee a completely allergen-free preparation environment.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-3 pb-1 border-b border-stone-200">
                6. Code of Conduct and Right of Admission
              </h2>
              <p className="mb-3">
                To maintain a safe, welcoming, and refined atmosphere for all patrons:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Dress Code:</strong> Smart casual dining attire is encouraged. Beachwear, sleepwear, or inappropriate attire is discouraged.
                </li>
                <li>
                  <strong>Zero Tolerance:</strong> We maintain a strict zero-tolerance policy towards any verbal abuse, harassment, discrimination, or aggressive behavior toward staff members or other guests.
                </li>
                <li>
                  <strong>Right of Admission:</strong> Management reserves the right of admission and the discretion to refuse service or ask individuals to leave if conduct guidelines are violated.
                </li>
                <li>
                  <strong>Outside Food and Drinks:</strong> Outside food and alcohol are strictly prohibited on premises under food safety regulations, with exceptions only for custom celebration cakes arranged in advance.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-3 pb-1 border-b border-stone-200">
                7. Intellectual Property
              </h2>
              <p>
                All trademarks, culinary names, recipes, logos, digital photography, graphics, and website source code are the exclusive intellectual property of Olive & Restro Hospitality LLP. Unauthorized copying, downloading, or commercial exploitation is prohibited under applicable copyright laws.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-3 pb-1 border-b border-stone-200">
                8. Governing Law and Jurisdiction
              </h2>
              <p>
                These Terms and Conditions shall be governed by, and construed in accordance with, the laws of the Republic of India. Any legal disputes arising out of these terms shall be subject to the exclusive jurisdiction of the competent courts in Indore, Madhya Pradesh.
              </p>
            </section>

            <section className="pt-4 border-t border-stone-300">
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-3">
                9. Contact Information
              </h2>
              <p className="mb-3">
                If you have questions, comments, or legal inquiries regarding these Terms and Conditions, please contact us:
              </p>
              <div className="bg-stone-50 border border-stone-200 p-4 text-sm text-stone-800 space-y-1">
                <p><strong>Olive & Restro Restaurant</strong></p>
                <p>Legal & Guest Relations Department</p>
                <p>Scheme No. 54, PU-4 Commercial Zone, Behind C21 Mall, Vijay Nagar, Indore, Madhya Pradesh 452010</p>
                <p>Email: <a href="mailto:contact@oliveandrestro.com" className="text-amber-800 underline">contact@oliveandrestro.com</a></p>
                <p>Phone: +91 (731) 498-2233</p>
              </div>
            </section>

          </div>

          {/* Document Footer */}
          <footer className="mt-12 pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between text-xs text-stone-500">
            <Link to="/privacy" className="text-amber-800 underline hover:text-amber-900">
              View Privacy Policy
            </Link>
            <p>© 2026 Olive & Restro Hospitality LLP. All rights reserved.</p>
          </footer>

        </article>

      </main>

      <Footer onOpenPrivacy={() => {}} onOpenTerms={() => {}} onReserveClick={() => setIsReservationOpen(true)} />
      <ReservationModal isOpen={isReservationOpen} onClose={() => setIsReservationOpen(false)} />
    </div>
  );
};
