import { useState, FormEvent } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { AnnouncementBar } from '../components/layout/AnnouncementBar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { ReservationModal } from '../components/modals/ReservationModal';
import { LegalModal } from '../components/modals/LegalModal';
import { OrderDrawer } from '../components/order/OrderDrawer';
import { ScrollProgress } from '../components/ui/ScrollProgress';
import { BackToTop } from '../components/ui/BackToTop';
import { useToast } from '../components/ui/ToastNotification';

export const ContactPage = () => {
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);
  const { showToast } = useToast();

  const [inquiryData, setInquiryData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inquiryData.name || !inquiryData.email || !inquiryData.message) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      showToast('Thank you! Your message has been received.', 'success');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-stone-950">
      <ScrollProgress />

      <AnnouncementBar
        onReserveClick={() => setIsReservationOpen(true)}
        onMenuClick={() => window.location.href = '/menu'}
      />

      <Navbar onReserveClick={() => setIsReservationOpen(true)} />

      {/* Header - Only Contact in white normal text */}
      <section className="py-12 sm:py-16 bg-stone-950 border-b border-stone-800 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-white tracking-wide">
            Contact
          </h1>
        </div>
      </section>

      {/* Contact Content Grid - Clean Human HTML Design with White Background & No Icons */}
      <section className="bg-white text-stone-900 py-16 sm:py-20 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Contact Info & Hours (No Icons, Clean Human Typography) */}
            <div className="lg:col-span-5 space-y-8">
              
              <div className="border border-stone-200 p-8 bg-stone-50/50 space-y-6">
                <div>
                  <h2 className="text-2xl font-serif text-stone-900 font-medium mb-1">
                    Ember & Olive
                  </h2>
                  <p className="text-xs text-stone-500 uppercase tracking-widest">
                    Fine Dining & Curated Experiences
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-stone-200">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Location Address
                  </p>
                  <p className="text-sm text-stone-800 leading-relaxed">
                    Scheme No. 54, Opposite Fortune Landmark, Near AB Road, Vijay Nagar, Indore, Madhya Pradesh 452010
                  </p>
                </div>

                <div className="space-y-1.5 pt-4 border-t border-stone-200">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Concierge & Events Email
                  </p>
                  <p className="text-sm">
                    <a 
                      href="mailto:hello@oliveandrestro.com" 
                      className="text-stone-900 font-medium hover:underline"
                    >
                      hello@oliveandrestro.com
                    </a>
                  </p>
                </div>

                <div className="space-y-1.5 pt-4 border-t border-stone-200">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Valet & Accessibility
                  </p>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Complimentary valet parking available at our main portico entrance. Wheelchair accessible dining hall & private rooms.
                  </p>
                </div>
              </div>

              {/* Hours Box */}
              <div className="border border-stone-200 p-8 bg-stone-50/50 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
                  Dining Hours
                </h3>
                <div className="text-sm space-y-3 divide-y divide-stone-200">
                  <div className="flex justify-between pt-2">
                    <span className="text-stone-600">Monday – Thursday</span>
                    <span className="font-medium text-stone-900">12:00 PM – 10:30 PM</span>
                  </div>
                  <div className="flex justify-between pt-3">
                    <span className="text-stone-600">Friday – Sunday</span>
                    <span className="font-medium text-stone-900">12:00 PM – 11:30 PM</span>
                  </div>
                  <div className="flex justify-between pt-3">
                    <span className="text-stone-600">Sunday Jazz Brunch</span>
                    <span className="font-medium text-stone-900">12:30 PM – 4:00 PM</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right: Message Form (Normal HTML Design on White Background, No Icons) */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-10 border border-stone-200 shadow-sm">
              <h2 className="text-2xl font-serif font-medium text-stone-900 mb-2">
                Send a Message
              </h2>
              <p className="text-stone-600 text-sm mb-8 leading-relaxed">
                For private dining enclaves, press inquiries, or special celebration arrangements.
              </p>

              {submitted ? (
                <div className="py-12 text-center space-y-4 border border-emerald-200 bg-emerald-50/50 p-8">
                  <h3 className="text-xl font-medium text-stone-900">
                    Message Received
                  </h3>
                  <p className="text-stone-600 text-sm max-w-md mx-auto">
                    Thank you, <strong className="text-stone-900">{inquiryData.name}</strong>. Our guest relations manager will connect with you within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setInquiryData({
                        name: '',
                        email: '',
                        phone: '',
                        subject: 'General Inquiry',
                        message: '',
                      });
                    }}
                    className="mt-4 px-6 py-2.5 text-xs uppercase tracking-wider font-medium text-stone-900 border border-stone-300 hover:bg-stone-100 transition-colors"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Priya Sharma"
                        value={inquiryData.name}
                        onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                        className="w-full bg-white border border-stone-300 rounded px-3.5 py-2.5 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. priya@example.com"
                        value={inquiryData.email}
                        onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })}
                        className="w-full bg-white border border-stone-300 rounded px-3.5 py-2.5 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="Phone number"
                        value={inquiryData.phone}
                        onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
                        className="w-full bg-white border border-stone-300 rounded px-3.5 py-2.5 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                        Inquiry Type
                      </label>
                      <select
                        value={inquiryData.subject}
                        onChange={(e) => setInquiryData({ ...inquiryData, subject: e.target.value })}
                        className="w-full bg-white border border-stone-300 rounded px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors"
                      >
                        <option value="General Inquiry">General Dining Inquiry</option>
                        <option value="Private Dining">Private Dining Room (Up to 14)</option>
                        <option value="Full Restaurant Buyout">Full Restaurant Buyout</option>
                        <option value="Chef's Table">Chef's Tasting Reservation</option>
                        <option value="Press & Media">Press & Collaborations</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Describe your event date, anticipated guests, or questions..."
                      value={inquiryData.message}
                      onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
                      className="w-full bg-white border border-stone-300 rounded px-3.5 py-2.5 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-stone-900 hover:bg-stone-800 text-white font-medium py-3 rounded text-sm transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending Message...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer
        onOpenPrivacy={() => setLegalModal('privacy')}
        onOpenTerms={() => setLegalModal('terms')}
        onReserveClick={() => setIsReservationOpen(true)}
      />

      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
      />

      <LegalModal
        isOpen={!!legalModal}
        type={legalModal}
        onClose={() => setLegalModal(null)}
      />

      <OrderDrawer />
      <BackToTop />
    </div>
  );
};
