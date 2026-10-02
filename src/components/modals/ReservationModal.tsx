import { useState, FormEvent, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Calendar, Clock, Users, User, Phone, Mail, CheckCircle2, CalendarPlus, Edit3, Trash2, Wifi, Battery, Signal, X } from 'lucide-react';
import { reservationService, AvailabilityStatus, ReservationRecord } from '../../services/reservationService';
import { useToast } from '../ui/ToastNotification';
import { analytics } from '../../services/analyticsService';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReservationModal = ({ isOpen, onClose }: ReservationModalProps) => {
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

  const [availabilityState, setAvailabilityState] = useState<AvailabilityStatus | 'idle' | 'checking'>('idle');
  const [availabilityMessage, setAvailabilityMessage] = useState('');

  useEffect(() => {
    if (!formData.date || !formData.time || !formData.guests) {
      setAvailabilityState('idle');
      setAvailabilityMessage('');
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
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [formData.date, formData.time, formData.guests]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Required';
    if (!formData.phone.trim()) newErrors.phone = 'Required';
    if (!formData.email.trim()) newErrors.email = 'Required';
    if (!formData.date) newErrors.date = 'Required';
    if (!formData.time) newErrors.time = 'Required';
    if (!formData.guests) newErrors.guests = 'Required';

    const guestCount = parseInt(formData.guests, 10);
    if (isNaN(guestCount) || guestCount < 1 || guestCount > 16) {
      newErrors.guests = 'Required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fill all required fields.', 'error');
      return;
    }

    if (availabilityState === 'unavailable') {
      showToast('Selected slot is fully booked.', 'error');
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
      showToast(`Table confirmed for ${created.fullName}!`, 'success');
    } catch {
      showToast('Unable to complete reservation.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadICS = () => {
    if (!confirmedReservation) return;
    const { date, time, fullName, tableAllocated, guests } = confirmedReservation;
    const startStr = `${date.replace(/-/g, '')}T${time.replace(':', '')}00`;
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Ember & Olive//Dining Reservation//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Dinner at Ember & Olive (${fullName})`,
      `DESCRIPTION:Table Reservation for ${guests} guests at Ember & Olive Indore. Table: ${tableAllocated}.`,
      'LOCATION:Ember & Olive, Scheme 54, Vijay Nagar, Indore',
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
    showToast('Calendar invite downloaded.', 'success');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      
      {/* Normal Clean Modal Container - Wide Full Horizontal on Web View */}
      <div className="relative w-full max-w-lg md:max-w-4xl lg:max-w-5xl xl:max-w-6xl bg-white border border-stone-200 rounded-none shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Top Header with Close */}
        <div className="bg-stone-50 px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-between border-b border-stone-200 shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-normal text-stone-900">
              Reserve <span className="text-amber-600 italic">Your Table</span>
            </h2>
            <p className="text-xs text-stone-500 font-sans mt-0.5">Please provide your party details to check live availability</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer border border-stone-200"
            aria-label="Close form"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white text-stone-900 flex flex-col justify-between space-y-6">

          {confirmedReservation ? (
            <div className="py-6 text-center flex flex-col items-center my-auto max-w-md mx-auto">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded bg-stone-100 border border-stone-200 text-xs font-mono text-amber-700 mb-2">
                REF: {confirmedReservation.id}
              </span>
              <h3 className="text-2xl font-sans font-bold text-stone-900 mb-1">Reservation Confirmed!</h3>
              <p className="text-stone-600 text-sm mb-6 max-w-xs">
                Table reserved for <strong className="text-stone-900">{confirmedReservation.guests} guests</strong> on {confirmedReservation.date} at {confirmedReservation.time}.
              </p>
              <div className="flex gap-3 w-full">
                <Button
                  onClick={handleDownloadICS}
                  className="flex-1 bg-[#f5be38] hover:bg-amber-400 text-stone-950 font-semibold text-xs py-3 rounded-none"
                >
                  <CalendarPlus className="w-3.5 h-3.5 mr-1.5 inline" /> Add to Calendar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setConfirmedReservation(null);
                    setFormData({
                      fullName: '',
                      phone: '',
                      email: '',
                      date: '',
                      time: '',
                      guests: '',
                      occasion: '',
                      specialRequest: '',
                    });
                    setAvailabilityState('idle');
                  }}
                  className="border-stone-300 text-stone-700 hover:bg-stone-100 text-xs py-3 rounded-none"
                >
                  <Edit3 className="w-3.5 h-3.5 mr-1.5 inline" /> New Booking
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1 (Personal Details) - Horizontal 3 Columns on Web View */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-300 rounded-none pl-9 pr-3 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                      />
                    </div>
                    {errors.fullName && <span className="text-rose-500 text-[11px] mt-0.5 block">{errors.fullName}</span>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Phone *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                      <input
                        type="tel"
                        required
                        placeholder="Mobile number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-300 rounded-none pl-9 pr-3 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                      />
                    </div>
                    {errors.phone && <span className="text-rose-500 text-[11px] mt-0.5 block">{errors.phone}</span>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-300 rounded-none pl-9 pr-3 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                      />
                    </div>
                    {errors.email && <span className="text-rose-500 text-[11px] mt-0.5 block">{errors.email}</span>}
                  </div>
                </div>
              </div>

              {/* Row 2 (Booking Parameters) - Horizontal 4 Columns on Web View */}
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Date */}
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Date *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-300 rounded-none pl-9 pr-3 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                      />
                    </div>
                    {errors.date && <span className="text-rose-500 text-[11px] mt-0.5 block">{errors.date}</span>}
                  </div>

                  {/* Time Slot */}
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Time Slot *</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                      <select
                        required
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-300 rounded-none pl-9 pr-3 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors cursor-pointer"
                      >
                        <option value="" disabled>Select Time Slot</option>
                        <option value="12:30">12:30 PM (Lunch)</option>
                        <option value="13:30">1:30 PM (Lunch)</option>
                        <option value="19:00">7:00 PM (Dinner)</option>
                        <option value="19:30">7:30 PM (Dinner)</option>
                        <option value="20:30">8:30 PM (Dinner)</option>
                        <option value="21:30">9:30 PM (Dinner)</option>
                      </select>
                    </div>
                    {errors.time && <span className="text-rose-500 text-[11px] mt-0.5 block">{errors.time}</span>}
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Guests *</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                      <select
                        required
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-300 rounded-none pl-9 pr-3 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors cursor-pointer"
                      >
                        <option value="" disabled>Select Guests</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.guests && <span className="text-rose-500 text-[11px] mt-0.5 block">{errors.guests}</span>}
                  </div>

                  {/* Occasion */}
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Occasion (Optional)</label>
                    <select
                      value={formData.occasion}
                      onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-none px-3 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors cursor-pointer"
                    >
                      <option value="" disabled>Select Occasion</option>
                      <option value="Casual Dining">Casual Dining</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Anniversary">Anniversary</option>
                      <option value="Business Dinner">Business Dinner</option>
                      <option value="Family Gathering">Family Gathering</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 3 (Special Request) */}
              <div>
                <label className="block text-[11px] font-medium text-stone-700 mb-1">Special Requests (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. window seating, high chair for infant, dietary allergies..."
                  value={formData.specialRequest}
                  onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-none px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                />
              </div>

              {/* Availability Feedback badge (shown ONLY when user selects date, time, and guests) */}
              {availabilityState !== 'idle' && availabilityState !== 'checking' && formData.date && formData.time && formData.guests && (
                <div className={`text-xs px-4 py-2.5 rounded-none flex items-center justify-between ${
                  availabilityState === 'available' ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-rose-50 text-rose-800 border border-rose-300'
                }`}>
                  <span className="font-medium">{availabilityMessage || (availabilityState === 'available' ? 'Selected slot is available!' : 'Slot fully booked')}</span>
                  <span className="text-[11px] opacity-75">Live Table Status</span>
                </div>
              )}

              {/* Bottom Action Bar */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200">
                <p className="text-xs text-stone-500 hidden sm:block">
                  Instant confirmation • No reservation fee
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting || availabilityState === 'unavailable'}
                  className="w-full sm:w-auto sm:min-w-[260px] bg-[#f5be38] hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold py-3 px-8 rounded-none text-xs uppercase tracking-wider shadow transition-transform active:scale-95 cursor-pointer"
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm Table Reservation'}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
