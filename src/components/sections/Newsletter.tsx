import { useState, FormEvent } from 'react';
import { Button } from '../ui/Button';
import { Mail, CheckCircle2 } from 'lucide-react';
import { useToast } from '../ui/ToastNotification';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubscribed(true);
      showToast('Successfully subscribed to Ember & Olive Journal.', 'success');
    }, 1000);
  };

  return (
    <section className="py-20 bg-stone-950 text-stone-100 border-b border-stone-800">
      <div className="max-w-4xl mx-auto px-6 text-center">
        
        <div className="bg-stone-900 border border-stone-800/80 rounded-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          
          <div className="max-w-xl mx-auto">
            <span className="text-amber-500 text-xs font-mono uppercase tracking-widest mb-2 block">
              THE RESTRO JOURNAL
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-stone-100 mb-3">
              Stay in the <span className="italic text-amber-200">Know</span>
            </h2>
            <p className="text-stone-400 font-light text-sm sm:text-base mb-8">
              Seasonal menus, special acoustic evenings, and private stories directly from our kitchen team.
            </p>

            {subscribed ? (
              <div className="flex items-center justify-center gap-2 p-4 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl font-medium text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>You are subscribed. Welcome to our table.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="w-5 h-5 text-stone-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-12 pr-4 py-3.5 text-stone-100 text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-stone-500"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold px-8 py-3.5 shrink-0"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </form>
            )}

            {error && <p className="text-rose-400 text-xs mt-3">{error}</p>}

            <p className="text-[11px] text-stone-500 mt-4 font-light">
              We respect your privacy. Unsubscribe at any time with one click.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
