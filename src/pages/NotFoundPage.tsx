import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between font-sans selection:bg-amber-500 selection:text-stone-950">
      <Navbar onReserveClick={() => {}} />

      <main className="max-w-2xl mx-auto px-6 py-24 text-center my-auto">
        <div className="w-16 h-16 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-500 mx-auto mb-6">
          <Compass className="w-8 h-8" />
        </div>

        <span className="text-amber-500 text-xs font-mono uppercase tracking-widest block mb-2">
          ERROR 404 · PAGE NOT LOCATED
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif text-stone-100 font-light mb-4">
          This Course Does <span className="italic text-amber-200">Not Exist</span>
        </h1>
        <p className="text-stone-400 font-light text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
          The requested page may have been moved or is no longer part of our current dining repertoire.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <Button className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold px-6 py-3 text-xs">
              Return to Dining Room
            </Button>
          </Link>
          <Link to="/menu">
            <Button variant="outline" className="border-stone-700 text-stone-200 text-xs py-3 px-6">
              Explore Our Menu
            </Button>
          </Link>
        </div>
      </main>

      <Footer onOpenPrivacy={() => {}} onOpenTerms={() => {}} onReserveClick={() => {}} />
    </div>
  );
};
