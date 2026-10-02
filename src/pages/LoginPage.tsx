import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  ChevronLeft,
  Eye, 
  EyeOff,
  User as UserIcon,
  Phone
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/ToastNotification';

const LOGIN_BG_IMAGE = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=85';
const LOGIN_BG_FALLBACK = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1600';

const CLUB_MEMBERS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
];

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, loginWithGoogle } = useAuth();
  const { showToast } = useToast();
  
  const [isRegisterMode, setIsRegisterMode] = useState(() => {
    return new URLSearchParams(location.search).get('mode') === 'register';
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Login form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const from = location.state?.from?.pathname || '/';

  // Security: Client-side lockout simulation for repeated failed logins
  useEffect(() => {
    if (loginAttempts >= 5) {
      setIsLocked(true);
      showToast('Too many failed attempts. Locked for 30s.', 'error');
      const timer = setTimeout(() => {
        setLoginAttempts(0);
        setIsLocked(false);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [loginAttempts]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      showToast('Welcome back! Authentication successful.', 'success');
      navigate(from, { replace: true });
    } catch (err: any) {
      setLoginAttempts(prev => prev + 1);
      showToast(err.message || 'Access denied.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerData.name.trim()) {
      showToast('Please enter your full name.', 'error');
      return;
    }

    if (!registerData.email.trim()) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    if (registerData.password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'error');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      showToast('Passwords do not match. Please check again.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await register(
        registerData.name,
        registerData.email,
        registerData.password,
        registerData.phone
      );
      showToast(`Welcome ${registerData.name}! Your account has been created.`, 'success');
      navigate(from, { replace: true });
    } catch (err: any) {
      showToast(err.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      showToast('Connected with Google successfully.', 'success');
      navigate(from, { replace: true });
    } catch {
      showToast('Google sign-in encountered an issue.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen bg-stone-950 flex flex-col lg:flex-row font-sans selection:bg-amber-500 selection:text-stone-950 overflow-y-auto lg:overflow-hidden relative">
      
      {/* Background Image for Mobile (Overlay) */}
      <div className="lg:hidden absolute inset-0 z-0 pointer-events-none">
        <img 
          src={LOGIN_BG_IMAGE}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = LOGIN_BG_FALLBACK;
          }}
          alt="Culinary Delights" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/40 to-stone-950" />
      </div>

      {/* Left Side: Visual Experience (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-stone-900 items-center justify-center overflow-hidden h-full">
        <img 
          src={LOGIN_BG_IMAGE}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = LOGIN_BG_FALLBACK;
          }}
          alt="Culinary Delights" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/40 to-stone-950" />
        
        <div className="relative z-10 p-8 xl:p-12 max-w-lg">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-amber-400 mb-4 xl:mb-6 hover:text-amber-300 transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs sm:text-sm font-medium uppercase tracking-wider">Back to Restaurant</span>
          </Link>
          
          <div className="mb-4 xl:mb-6">
            <h1 className="text-3xl xl:text-5xl font-serif text-white font-normal leading-tight mb-3">
              A Journey of <br />
              <span className="italic text-amber-200">Flavours & Moments.</span>
            </h1>
            <p className="text-stone-300 font-light leading-relaxed text-xs xl:text-sm">
              Join our exclusive circle of food enthusiasts. Enjoy priority reservations, 
              personalized menu recommendations, and seasonal surprises.
            </p>
          </div>
          
          <div className="flex items-center gap-4 xl:gap-6 pt-4 xl:pt-6 border-t border-white/10">
            <div className="flex -space-x-2.5">
              {CLUB_MEMBERS.map((avatarUrl, i) => (
                <div key={i} className="w-7 h-7 xl:w-8 xl:h-8 rounded-full border-2 border-stone-900 bg-stone-800 overflow-hidden shadow">
                  <img 
                    src={avatarUrl} 
                    alt={`Dining Club Member ${i + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="text-[10px] xl:text-xs text-stone-400 font-light">
              <span className="text-stone-200 font-medium">2,000+ members</span> <br />
              savoring the difference daily.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Auth Form Container */}
      <div className="flex-1 flex flex-col justify-center items-center p-3 sm:p-4 lg:p-5 bg-transparent lg:bg-stone-950 h-full overflow-y-auto relative z-10">
        <div className="w-full max-w-[440px] my-auto">
          
          {/* Mobile Logo / Branding */}
          <div className="lg:hidden mb-3 text-center flex flex-col items-center gap-1">
            <Link to="/" className="text-xl sm:text-2xl font-serif text-stone-100 tracking-[0.06em] uppercase">
              OLIVE & RESTRO
            </Link>
            <Link to="/" className="text-[11px] text-amber-500 hover:text-amber-400 flex items-center gap-1 transition-colors uppercase tracking-widest font-medium">
              <ChevronLeft className="w-3 h-3" />
              Back to Home
            </Link>
          </div>

          <div className="bg-stone-950/85 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
            {/* Desktop Back Button inside Card */}
            <div className="hidden lg:block absolute top-3 left-4 z-20">
              <Link to="/" className="text-[10px] text-stone-500 hover:text-amber-500 flex items-center gap-1 transition-colors uppercase tracking-widest font-bold">
                <ChevronLeft className="w-3 h-3" />
                Back
              </Link>
            </div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/0 via-amber-500 to-amber-500/0 opacity-50" />

            {/* Auth Switcher Tabs */}
            <div className="flex rounded-xl bg-stone-900/80 p-1 border border-stone-800 mb-3 mt-2.5 lg:mt-0.5">
              <button
                type="button"
                onClick={() => setIsRegisterMode(false)}
                className={`flex-1 py-1.5 text-[11px] font-semibold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  !isRegisterMode
                    ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsRegisterMode(true)}
                className={`flex-1 py-1.5 text-[11px] font-semibold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  isRegisterMode
                    ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Register
              </button>
            </div>
            
            <div className="text-center mb-2.5">
              <h2 className="text-lg sm:text-xl font-sans font-semibold text-white mb-0.5 tracking-tight uppercase">
                {isRegisterMode ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-stone-400 text-[10.5px] font-light">
                {isRegisterMode 
                  ? 'First time here? Fill details to create your account.' 
                  : 'Please enter your login details to continue.'}
              </p>
            </div>

            {/* REGISTER FORM */}
            {isRegisterMode ? (
              <form onSubmit={handleRegisterSubmit} className="space-y-2">
                {/* Full Name */}
                <div className="space-y-0.5">
                  <label className="text-[9px] uppercase tracking-wider font-semibold text-stone-400 block ml-1">Full Name *</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-600 group-focus-within:text-amber-500 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="e.g. Priya Sharma"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-1.5 px-3 pl-8 text-stone-100 text-xs focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/10 transition-all placeholder:text-stone-700"
                    />
                  </div>
                </div>

                {/* Email & Phone in 2-Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Email Field */}
                  <div className="space-y-0.5">
                    <label className="text-[9px] uppercase tracking-wider font-semibold text-stone-400 block ml-1">Email *</label>
                    <div className="relative group">
                      <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-600 group-focus-within:text-amber-500 transition-colors" />
                      <input 
                        type="email" 
                        placeholder="user@gmail.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-1.5 px-2.5 pl-8 text-stone-100 text-xs focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/10 transition-all placeholder:text-stone-700"
                      />
                    </div>
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-0.5">
                    <label className="text-[9px] uppercase tracking-wider font-semibold text-stone-400 block ml-1">Phone</label>
                    <div className="relative group">
                      <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-600 group-focus-within:text-amber-500 transition-colors" />
                      <input 
                        type="tel" 
                        placeholder="+91 98765..."
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-1.5 px-2.5 pl-8 text-stone-100 text-xs focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/10 transition-all placeholder:text-stone-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Password & Confirm Password in 2-Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Password Field */}
                  <div className="space-y-0.5">
                    <label className="text-[9px] uppercase tracking-wider font-semibold text-stone-400 block ml-1">Password *</label>
                    <div className="relative group">
                      <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-600 group-focus-within:text-amber-500 transition-colors" />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Min 6 chars"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        required
                        minLength={6}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-1.5 px-7 pl-8 text-stone-100 text-xs focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/10 transition-all placeholder:text-stone-700"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-300 transition-colors p-0.5"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-0.5">
                    <label className="text-[9px] uppercase tracking-wider font-semibold text-stone-400 block ml-1">Confirm *</label>
                    <div className="relative group">
                      <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-600 group-focus-within:text-amber-500 transition-colors" />
                      <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="Repeat pwd"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        required
                        minLength={6}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-1.5 px-7 pl-8 text-stone-100 text-xs focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/10 transition-all placeholder:text-stone-700"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-300 transition-colors p-0.5"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Create Account Button */}
                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#f1592a] hover:bg-[#d84a1e] text-white font-bold py-2 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] mt-1 shadow-lg shadow-orange-950/20 text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </Button>

                {/* Social Sign up */}
                <div className="relative py-0.5 flex items-center">
                  <div className="flex-grow border-t border-stone-800"></div>
                  <span className="flex-shrink mx-3 text-[8px] text-stone-600 uppercase tracking-widest font-bold">or register with</span>
                  <div className="flex-grow border-t border-stone-800"></div>
                </div>

                <div className="flex justify-center">
                  <button 
                    type="button" 
                    onClick={handleGoogleAuth}
                    disabled={isLoading}
                    className="bg-white hover:bg-stone-100 w-full max-w-[170px] py-1.5 rounded-xl flex items-center justify-center transition-all border border-stone-200 shadow-sm group cursor-pointer"
                    aria-label="Register with Google"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      <span className="text-stone-700 font-medium text-xs">Google</span>
                    </div>
                  </button>
                </div>

                {/* Back to Sign In Link */}
                <p className="text-center text-[10px] text-stone-400 pt-0.5">
                  Already have an account?{' '}
                  <button 
                    type="button" 
                    onClick={() => setIsRegisterMode(false)}
                    className="text-amber-500 hover:text-amber-400 font-bold transition-colors cursor-pointer"
                  >
                    Sign In here
                  </button>
                </p>
              </form>
            ) : (
              /* LOGIN FORM */
              <form onSubmit={handleLoginSubmit} className="space-y-3">
                {/* Email Field */}
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider font-semibold text-stone-400 block ml-1">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-600 group-focus-within:text-amber-500 transition-colors" />
                    <input 
                      type="email" 
                      placeholder="username@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 pl-8 text-stone-100 text-xs sm:text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/10 transition-all placeholder:text-stone-700"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[9px] uppercase tracking-wider font-semibold text-stone-400">Password</label>
                    <button 
                      type="button" 
                      onClick={() => showToast('Enter your registered email and contact support to reset password.', 'info')}
                      className="text-[9px] text-stone-500 hover:text-amber-400 transition-colors font-medium cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-600 group-focus-within:text-amber-500 transition-colors" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-7 pl-8 text-stone-100 text-xs sm:text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/10 transition-all placeholder:text-stone-700"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-300 transition-colors p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Sign In Button */}
                <Button 
                  type="submit"
                  disabled={isLoading || isLocked}
                  className="w-full bg-[#f1592a] hover:bg-[#d84a1e] text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] mt-1 shadow-lg shadow-orange-950/20 text-xs sm:text-sm uppercase tracking-wider disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </Button>

                {/* Social Logins */}
                <div className="relative py-1 flex items-center">
                  <div className="flex-grow border-t border-stone-800"></div>
                  <span className="flex-shrink mx-3 text-[8px] text-stone-600 uppercase tracking-widest font-bold">or continue with</span>
                  <div className="flex-grow border-t border-stone-800"></div>
                </div>

                <div className="flex justify-center">
                  <button 
                    type="button" 
                    onClick={handleGoogleAuth}
                    disabled={isLoading}
                    className="bg-white hover:bg-stone-100 w-full max-w-[170px] py-1.5 rounded-xl flex items-center justify-center transition-all border border-stone-200 shadow-sm group cursor-pointer"
                    aria-label="Login with Google"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      <span className="text-stone-700 font-medium text-xs">Google</span>
                    </div>
                  </button>
                </div>

                {/* Registration Link */}
                <p className="text-center text-[10px] text-stone-500 pt-0.5">
                  Don't have an account yet?{' '}
                  <button 
                    type="button" 
                    onClick={() => setIsRegisterMode(true)}
                    className="text-amber-500 hover:text-amber-400 font-bold transition-colors cursor-pointer"
                  >
                    Register for Free
                  </button>
                </p>
              </form>
            )}

          </div>
          
          {/* Simple Footer Links */}
          <div className="mt-2.5 flex items-center justify-center gap-4 text-[9px] text-stone-600 uppercase tracking-widest font-semibold">
            <Link to="/privacy" className="hover:text-stone-400 transition-colors">Privacy</Link>
            <span className="w-1 h-1 rounded-full bg-stone-800" />
            <Link to="/terms" className="hover:text-stone-400 transition-colors">Terms</Link>
            <span className="w-1 h-1 rounded-full bg-stone-800" />
            <Link to="/contact" className="hover:text-stone-400 transition-colors">Help</Link>
          </div>

        </div>
      </div>

    </div>
  );
};
