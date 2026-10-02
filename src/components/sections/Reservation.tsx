import { useState, FormEvent, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Calendar, Clock, Users, User, Phone, Mail, CheckCircle2, MessageSquare, AlertCircle, CalendarPlus, Edit3, Trash2 } from 'lucide-react';
import { reservationService, AvailabilityStatus, ReservationRecord } from '../../services/reservationService';
import { useToast } from '../ui/ToastNotification';
import { analytics } from '../../services/analyticsService';

export const Reservation = () => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    guests: '',
    occasion: '',
    specialRequest: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<ReservationRecord | null>(null);

  // Availability check states
  const [availabilityState, setAvailabilityState] = useState<AvailabilityStatus | 'idle' | 'checking'>('idle');
  const [availabilityMessage, setAvailabilityMessage] = useState('');

  // Check availability when date, time, or guest count changes
  useEffect(() => {
    if (!formData.date || !formData.time || !formData.guests) {
      setAvailabilityState('idle');
      return;
    }

    let isMounted = true;
    setAvailabilityState('checking');

    const timer = setTimeout(async () => {
      try {
        const result = await reservationService.checkAvailability(
          formData.date,
          formData.time,
          parseInt(formData.guests, 10) || 2
        );
        if (isMounted) {
          setAvailabilityState(result.status);
          setAvailabilityMessage(result.message);
        }
      } catch {
        if (isMounted) {
          setAvailabilityState('available');
        }
      }
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [formData.date, formData.time, formData.guests]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+\s-]{10,14}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Enter a valid 10-digit mobile number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.date) {
      newErrors.date = 'Reservation date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Date cannot be in the past';
      }
    }

    if (!formData.guests) {
      newErrors.guests = 'Party size is required';
    } else {
      const guestCount = parseInt(formData.guests, 10);
      if (isNaN(guestCount) || guestCount < 1 || guestCount > 16) {
        newErrors.guests = 'Guests must be between 1 and 16';
      }
    }

    if (!formData.time) {
      newErrors.time = 'Time slot is required';
    }

    if (!formData.occasion) {
      newErrors.occasion = 'Occasion is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please resolve form errors before proceeding.', 'error');
      return;
    }

    if (availabilityState === 'unavailable') {
      showToast('Selected slot is fully booked. Please choose another time.', 'error');
      return;
    }

    setIsSubmitting(true);
    analytics.track('reservation_started', {
      guests: formData.guests,
      date: formData.date,
      time: formData.time,
    });

    try {
      const created = await reservationService.createReservation({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        date: formData.date,
        time: formData.time,
        guests: parseInt(formData.guests, 10),
        occasion: formData.occasion,
        specialRequest: formData.specialRequest,
      });

      setConfirmedReservation(created);
      showToast(`Table confirmed for ${created.fullName}! Reference: ${created.id}`, 'success');
    } catch (err) {
      showToast('Unable to complete reservation. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelReservation = async () => {
    if (!confirmedReservation) return;
    const confirm = window.confirm(`Are you sure you want to cancel reservation ${confirmedReservation.id}?`);
    if (!confirm) return;

    await reservationService.cancelReservation(confirmedReservation.id, 'User requested cancellation');
    showToast(`Reservation ${confirmedReservation.id} has been cancelled.`, 'info');
    setConfirmedReservation(null);
  };

  const handleDownloadICS = () => {
    if (!confirmedReservation) return;
    const { date, time, fullName, tableAllocated, guests } = confirmedReservation;
    const startStr = `${date.replace(/-/g, '')}T${time.replace(':', '')}00`;
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Olive & Restro//Dining Reservation//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Dinner at Olive & Restro (${fullName})`,
      `DESCRIPTION:Table Reservation for ${guests} guests at Olive & Restro Indore. Table: ${tableAllocated}.`,
      'LOCATION:Olive & Restro, Scheme 54, Vijay Nagar, Indore, Madhya Pradesh 452010',
      `DTSTART:${startStr}`,
      `DTEND:${startStr}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `EmberOlive-${confirmedReservation.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Calendar invite (.ics) downloaded.', 'success');
  };

  return (
    <section id="reservation" className="py-16 sm:py-20 lg:py-24 bg-stone-950 text-stone-100 border-b border-stone-800 relative overflow-hidden">
      {/* Subtle warm backdrop texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-900/40 via-stone-950 to-stone-950 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-white tracking-wide">
            Table Reservation
          </h2>
        </div>

        {/* Form Container (Clean Minimalist Stacked / Wide Horizontal Form on Web View) */}
        <div className="max-w-5xl lg:max-w-6xl mx-auto bg-white border border-stone-200 rounded-none shadow-2xl overflow-hidden text-stone-900">
          
          {confirmedReservation ? (
            /* CONFIRMED STATE */
            <div className="p-8 sm:p-12 text-center flex flex-col items-center bg-white max-w-xl mx-auto">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-5">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <span className="inline-block px-3 py-1 rounded-none bg-stone-100 border border-stone-200 text-[11px] font-mono text-amber-700 mb-3">
                REF: {confirmedReservation.id}
              </span>

              <h3 className="text-2xl sm:text-3xl font-sans font-semibold text-stone-900 mb-2">
                Reservation Confirmed
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm font-light max-w-sm mx-auto mb-6 leading-relaxed">
                Thank you, <strong className="text-stone-900 font-medium">{confirmedReservation.fullName}</strong>. Your table has been reserved. A confirmation SMS & email have been sent to <strong className="text-stone-900 font-medium">{confirmedReservation.email}</strong>.
              </p>

              {/* Summary */}
              <div className="w-full bg-stone-50 border border-stone-200 rounded-none p-5 text-left space-y-2.5 mb-6 text-xs sm:text-sm">
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Date & Slot</span>
                  <span className="font-medium text-amber-700">{confirmedReservation.date} at {confirmedReservation.time}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Party Size</span>
                  <span className="text-stone-800">{confirmedReservation.guests} Guests</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Table Allocated</span>
                  <span className="text-amber-800 font-medium">{confirmedReservation.tableAllocated}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Occasion</span>
                  <span className="text-stone-800">{confirmedReservation.occasion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Location</span>
                  <span className="text-stone-800">Vijay Nagar, Indore</span>
                </div>
              </div>

              {/* Customer Actions */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  onClick={handleDownloadICS}
                  className="flex-1 bg-[#f5be38] hover:bg-amber-400 text-stone-950 font-semibold text-xs py-3 rounded-none flex items-center justify-center gap-2"
                >
                  <CalendarPlus className="w-4 h-4" />
                  Add to Calendar
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setConfirmedReservation(null)}
                  className="border-stone-300 text-stone-700 hover:bg-stone-100 text-xs py-3 rounded-none flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  New Booking
                </Button>
              </div>

              <button
                onClick={handleCancelReservation}
                className="text-xs text-stone-400 hover:text-rose-600 pt-4 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Cancel this reservation
              </button>
            </div>
          ) : (
            /* WIDE HORIZONTAL FORM DESIGN ON WEB VIEW */
            <form onSubmit={handleSubmit} className="bg-white">
              
              {/* Row 1: Guest Contact (3 Columns on Web View) */}
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-stone-200 border-b border-stone-200">
                {/* Full Name */}
                <div className="relative p-5">
                  <label className="block text-[11px] uppercase font-sans font-semibold text-stone-600 mb-1.5 tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 px-3.5 py-2.5 text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                  />
                  {errors.fullName && (
                    <span className="text-rose-500 text-xs mt-1 block">{errors.fullName}</span>
                  )}
                </div>

                {/* Phone */}
                <div className="relative p-5">
                  <label className="block text-[11px] uppercase font-sans font-semibold text-stone-600 mb-1.5 tracking-wider">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 px-3.5 py-2.5 text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                  />
                  {errors.phone && (
                    <span className="text-rose-500 text-xs mt-1 block">{errors.phone}</span>
                  )}
                </div>

                {/* Email */}
                <div className="relative p-5">
                  <label className="block text-[11px] uppercase font-sans font-semibold text-stone-600 mb-1.5 tracking-wider">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 px-3.5 py-2.5 text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                  />
                  {errors.email && (
                    <span className="text-rose-500 text-xs mt-1 block">{errors.email}</span>
                  )}
                </div>
              </div>

              {/* Row 2: Booking Parameters (4 Columns on Web View) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-200 border-b border-stone-200">
                {/* Date */}
                <div className="p-5">
                  <label className="block text-[11px] uppercase font-sans font-semibold text-stone-600 mb-1.5 tracking-wider">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 px-3.5 py-2.5 text-stone-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-colors cursor-pointer"
                  />
                  {errors.date && (
                    <span className="text-rose-500 text-xs mt-1 block">{errors.date}</span>
                  )}
                </div>

                {/* Time Slot */}
                <div className="p-5">
                  <label className="block text-[11px] uppercase font-sans font-semibold text-stone-600 mb-1.5 tracking-wider">
                    Time Slot *
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 px-3.5 py-2.5 text-stone-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-colors cursor-pointer"
                  >
                    <option value="" disabled>Select Time</option>
                    <option value="12:30">12:30 PM (Lunch)</option>
                    <option value="13:30">01:30 PM (Lunch)</option>
                    <option value="19:00">07:00 PM (Dinner)</option>
                    <option value="19:30">07:30 PM (Dinner)</option>
                    <option value="20:00">08:00 PM (Dinner)</option>
                    <option value="20:30">08:30 PM (Dinner)</option>
                    <option value="21:30">09:30 PM (Late Dinner)</option>
                  </select>
                  {errors.time && (
                    <span className="text-rose-500 text-xs mt-1 block">{errors.time}</span>
                  )}
                </div>

                {/* Guests */}
                <div className="p-5">
                  <label className="block text-[11px] uppercase font-sans font-semibold text-stone-600 mb-1.5 tracking-wider">
                    Guests *
                  </label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 px-3.5 py-2.5 text-stone-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-colors cursor-pointer"
                  >
                    <option value="" disabled>Select Guests</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                  {errors.guests && (
                    <span className="text-rose-500 text-xs mt-1 block">{errors.guests}</span>
                  )}
                </div>

                {/* Occasion */}
                <div className="p-5">
                  <label className="block text-[11px] uppercase font-sans font-semibold text-stone-600 mb-1.5 tracking-wider">
                    Occasion (Optional)
                  </label>
                  <select
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 px-3.5 py-2.5 text-stone-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-colors cursor-pointer"
                  >
                    <option value="" disabled>Select Occasion</option>
                    <option value="Casual Dining">Casual Dining</option>
                    <option value="Birthday Celebration">Birthday</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Business Dinner">Business</option>
                    <option value="Chef's Tasting">Chef's Table</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Special Request */}
              <div className="p-5 border-b border-stone-200">
                <label className="block text-[11px] uppercase font-sans font-semibold text-stone-600 mb-1.5 tracking-wider">
                  Special Requests (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. quiet corner table, infant high chair, dietary allergies..."
                  value={formData.specialRequest}
                  onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 px-3.5 py-2.5 text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                />
              </div>

              {/* Live status check bar & CTA in horizontal flex */}
              <div className="p-5 sm:p-6 bg-stone-50 flex flex-col md:flex-row items-center justify-between gap-4">
                {formData.date && formData.time && formData.guests && availabilityState !== 'idle' && availabilityState !== 'available' ? (
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-700">
                    <span className={`w-2.5 h-2.5 rounded-full inline-block ${
                      availabilityState === 'limited' ? 'bg-amber-500' :
                      availabilityState === 'unavailable' ? 'bg-rose-500' : 'bg-stone-400 animate-pulse'
                    }`}></span>
                    <span className="font-medium">
                      {availabilityState === 'checking' && 'Checking live availability...'}
                      {availabilityState === 'limited' && 'Limited tables available'}
                      {availabilityState === 'unavailable' && 'Fully booked for this slot'}
                    </span>
                  </div>
                ) : (
                  <div />
                )}

                {/* Submit CTA Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || availabilityState === 'unavailable'}
                  className="w-full md:w-auto md:min-w-[280px] bg-[#f5be38] hover:bg-amber-400 active:bg-amber-500 text-stone-950 font-bold uppercase tracking-widest text-xs sm:text-sm py-4 px-8 rounded-none flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer md:ml-auto"
                >
                  {isSubmitting ? (
                    'CONFIRMING RESERVATION...'
                  ) : (
                    <>
                      <span>CONFIRM RESERVATION</span>
                      <span className="text-base font-bold">→</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};
