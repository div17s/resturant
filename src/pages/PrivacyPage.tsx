import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ReservationModal } from '../components/modals/ReservationModal';

export const PrivacyPage = () => {
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
            <span className="text-stone-300">Privacy Policy</span>
          </div>
        </div>

        {/* White Translucent Document Page */}
        <article className="bg-white/95 backdrop-blur-md text-stone-900 border border-stone-200 shadow-2xl p-6 sm:p-12 lg:p-16">
          
          {/* Document Header */}
          <header className="border-b border-stone-300 pb-6 mb-8">
            <h1 className="text-3xl sm:text-4xl font-sans font-bold text-stone-900 tracking-tight mb-2">
              Privacy Policy
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
                1. Overview and Scope
              </h2>
              <p className="mb-3">
                At Olive & Restro, we recognize the importance of personal data privacy. This Privacy Policy sets out the principles and practices governing the collection, utilization, safeguarding, and disclosure of personal data gathered through our website, online reservation forms, dining feedback, and in-person restaurant visits in Indore.
              </p>
              <p>
                By using our website, making a table reservation, or contacting our guest relations team, you consent to the collection and handling of your data in accordance with this policy and Indian data protection regulations.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-3 pb-1 border-b border-stone-200">
                2. Information We Collect
              </h2>
              <p className="mb-3">
                We only collect information necessary to deliver authentic hospitality and fulfill your dining requests:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>
                  <strong>Contact Information:</strong> Full name, telephone number, and email address provided during booking or account creation.
                </li>
                <li>
                  <strong>Reservation Details:</strong> Booking date, requested time slot, party size, preferred dining section, and special seating requests.
                </li>
                <li>
                  <strong>Dietary and Occasion Preferences:</strong> Dietary preferences (vegetarian, vegan, Jain, gluten-free), allergy alerts, or special event notes (birthdays, anniversaries).
                </li>
                <li>
                  <strong>Technical Browsing Data:</strong> IP address, browser type, device information, and interaction records collected automatically via standard web server logs to maintain platform performance and security.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-3 pb-1 border-b border-stone-200">
                3. How We Use Your Information
              </h2>
              <p className="mb-3">
                We use collected information for genuine hospitality purposes, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Managing, confirming, and updating table reservations.</li>
                <li>Sending SMS or email confirmation receipts and reminders.</li>
                <li>Accommodating culinary requests, food allergies, and seating preferences.</li>
                <li>Responding to customer service inquiries, reviews, and private dining requests.</li>
                <li>Fulfilling legal and accounting requirements under applicable Indian laws.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-3 pb-1 border-b border-stone-200">
                4. Data Protection and Security
              </h2>
              <p className="mb-3">
                We implement industry-standard physical, administrative, and technical safeguards to secure your personal data against unauthorized access, loss, or disclosure. All digital transmission of reservation data is encrypted using Secure Sockets Layer (SSL/TLS) protocols.
              </p>
              <p>
                <strong>No Financial Data Storage:</strong> We do not store complete debit or credit card details, CVVs, or bank account PINs on our servers. All digital payments are processed through certified, PCI-DSS compliant payment gateways.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-3 pb-1 border-b border-stone-200">
                5. Third-Party Disclosures
              </h2>
              <p className="mb-3">
                We value your trust and do not sell, rent, or trade your personal information to third-party marketing companies. Personal data may only be shared with:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Service Providers:</strong> Verified SMS and email communication partners solely for delivering reservation confirmations and updates.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> Law enforcement or government authorities when required by subpoena, court order, or statutory regulations of India.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-3 pb-1 border-b border-stone-200">
                6. Cookies and Tracking Technologies
              </h2>
              <p className="mb-3">
                Our website utilizes standard session cookies to remember your browsing preferences, active cart items, and navigation status. These cookies do not store personally identifying credentials and can be disabled through your individual web browser settings without preventing you from viewing our culinary menus.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-3 pb-1 border-b border-stone-200">
                7. Your Rights and Data Choices
              </h2>
              <p className="mb-3">
                You have the right to request access to the personal data we maintain about you, ask for corrections to outdated information, or request the deletion of your customer profile from our reservation archives, subject to statutory record-keeping requirements.
              </p>
            </section>

            <section className="pt-4 border-t border-stone-300">
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-3">
                8. Contact Our Data Privacy Officer
              </h2>
              <p className="mb-3">
                To exercise your privacy rights, ask questions about our data practices, or request data deletion, please contact:
              </p>
              <div className="bg-stone-50 border border-stone-200 p-4 text-sm text-stone-800 space-y-1">
                <p><strong>Olive & Restro Restaurant</strong></p>
                <p>Attention: Privacy & Compliance Office</p>
                <p>Scheme No. 54, PU-4 Commercial Zone, Behind C21 Mall, Vijay Nagar, Indore, Madhya Pradesh 452010</p>
                <p>Email: <a href="mailto:privacy@oliveandrestro.com" className="text-amber-800 underline">privacy@oliveandrestro.com</a></p>
                <p>Phone: +91 (731) 498-2233</p>
              </div>
            </section>

          </div>

          {/* Document Footer */}
          <footer className="mt-12 pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between text-xs text-stone-500">
            <Link to="/terms" className="text-amber-800 underline hover:text-amber-900">
              View Terms & Conditions
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
