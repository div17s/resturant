import { useState, FormEvent } from 'react';
import { useOrder, OrderState } from '../../context/OrderContext';
import { X, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2, Bike, ChefHat, Check, AlertCircle, CreditCard, QrCode, Banknote } from 'lucide-react';
import { Button } from '../ui/Button';
import { orderService, OrderRecord } from '../../services/orderService';
import { paymentService } from '../../services/paymentService';
import { useToast } from '../ui/ToastNotification';
import { analytics } from '../../services/analyticsService';
import { useNavigate } from 'react-router-dom';

export const OrderDrawer = () => {
  const navigate = useNavigate();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    clearCart,
  } = useOrder();

  const { showToast } = useToast();

  const [address, setAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'cart' | 'checkout' | 'tracking'>('cart');
  const [currentOrder, setCurrentOrder] = useState<OrderRecord | null>(null);
  const [deliveryUnavailableNotice, setDeliveryUnavailableNotice] = useState(false);

  const gst = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + gst;

  const handleProceedToCheckout = () => {
    setDeliveryUnavailableNotice(true);
    showToast(
      "We couldn't place your order at this moment. Online delivery is currently unavailable at your location.",
      'error'
    );
  };

  const handlePlaceOrder = async (e: FormEvent) => {
    e.preventDefault();
    setDeliveryUnavailableNotice(true);
    showToast(
      "We couldn't place your order at this moment. Online delivery is currently unavailable at your location.",
      'error'
    );
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex justify-end font-sans">
      <div onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm transition-opacity" />

      <div className="relative w-full max-w-md bg-stone-900 border-l border-stone-800 text-stone-100 flex flex-col h-full z-10 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between bg-stone-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-serif text-amber-100 font-medium leading-none">
                {step === 'tracking' ? 'Live Order Status' : 'Your Dining Bag'}
              </h3>
              <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-1">Olive & Restro Indore</p>
            </div>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-none">
          
          {step === 'cart' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex items-center gap-3">
                <Bike className="w-5 h-5 text-emerald-500" />
                <p className="text-xs text-stone-300">Fast Delivery to <span className="text-white font-bold">Vijay Nagar</span> in 45 mins</p>
              </div>

              {cart.length === 0 ? (
                <div className="py-24 text-center flex flex-col items-center">
                  <div className="w-24 h-24 bg-stone-800/30 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-12 h-12 text-stone-700" />
                  </div>
                  <h4 className="text-xl font-serif text-stone-400">Your bag is empty</h4>
                  <p className="text-sm text-stone-600 mt-2 max-w-[200px]">Add some authentic flavors to your order.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                    <h4 className="text-xs font-bold text-stone-500 uppercase tracking-widest">Order Items</h4>
                    <span className="text-[10px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full font-bold">{cart.length} Items</span>
                  </div>
                  
                  <div className="space-y-5">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 group animate-in slide-in-from-bottom-2 duration-300">
                        <div className="relative shrink-0">
                          <img 
                            src={item.menuItem.image} 
                            alt={item.menuItem.name} 
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80";
                            }}
                            className="w-20 h-20 rounded-2xl object-cover border border-stone-800 shadow-xl" 
                          />
                          <span className="absolute -top-2 -right-2 bg-white text-stone-950 text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-stone-900 shadow-lg">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <h5 className="text-sm font-medium text-stone-100 truncate">{item.menuItem.name}</h5>
                            <span className="text-sm font-bold text-white">₹{item.menuItem.numericPrice * item.quantity}</span>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center bg-stone-950 border border-stone-800 rounded-xl p-1 shadow-inner">
                              <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 text-stone-500 hover:text-white transition-colors"><Minus className="w-3.5 h-3.5" /></button>
                              <span className="text-xs font-bold text-stone-200 px-3">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 text-stone-500 hover:text-white transition-colors"><Plus className="w-3.5 h-3.5" /></button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-[10px] text-stone-600 hover:text-rose-500 font-bold transition-colors uppercase tracking-wider">Remove</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {cart.length > 0 && (
                <div className="space-y-5 pt-4">
                  <h4 className="text-xs font-bold text-stone-500 uppercase tracking-widest border-b border-stone-800 pb-3">Bill Details</h4>
                  <div className="bg-stone-950/40 rounded-3xl border border-stone-800 p-6 space-y-4 shadow-xl">
                    <div className="flex justify-between text-sm text-stone-400">
                      <span>Item Total</span>
                      <span className="text-stone-100">₹{cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-sm text-stone-400">
                      <span className="flex items-center gap-2">Taxes & Charges <AlertCircle className="w-3 h-3 opacity-30" /></span>
                      <span className="text-stone-100">₹{gst}</span>
                    </div>
                    <div className="flex justify-between text-sm text-stone-400 pb-2 border-b border-stone-800/50">
                      <span>Delivery Fee</span>
                      <span className="text-emerald-500 font-bold">FREE</span>
                    </div>
                    <div className="pt-2 flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-stone-600 font-bold mb-1">To Pay</span>
                        <span className="text-3xl font-sans text-stone-100 font-bold leading-none">₹{grandTotal}</span>
                      </div>
                      <div className="text-[9px] text-stone-600 italic">Inclusive of all taxes</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'checkout' && (
            <form onSubmit={handlePlaceOrder} className="space-y-10 animate-in slide-in-from-right-8 duration-500">
              {!(localStorage.getItem('customer_logged_in') === 'true' || localStorage.getItem('auth_token')) && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                    <p className="text-xs text-amber-200">First complete your signin/signup process before placing an order.</p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/login');
                    }}
                    className="w-full bg-amber-500 text-stone-950 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider"
                  >
                    Sign In / Sign Up Now
                  </Button>
                </div>
              )}

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-xs font-bold shadow-lg shadow-amber-500/20">1</div>
                  <h4 className="text-base font-serif text-white">Delivery Address</h4>
                </div>
                
                <div className="space-y-4 pl-11">
                  <input type="text" required placeholder="Full Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full bg-stone-950 border border-stone-800 rounded-2xl px-5 py-4 text-sm text-stone-100 focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-stone-700" />
                  <input type="tel" required placeholder="Phone Number" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full bg-stone-950 border border-stone-800 rounded-2xl px-5 py-4 text-sm text-stone-100 focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-stone-700" />
                  <textarea required rows={3} placeholder="Full Address (Flat, Street, Landmark in Vijay Nagar)" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-stone-950 border border-stone-800 rounded-2xl px-5 py-4 text-sm text-stone-100 focus:outline-none focus:border-amber-500/50 transition-all resize-none placeholder:text-stone-700" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-xs font-bold shadow-lg shadow-amber-500/20">2</div>
                  <h4 className="text-base font-serif text-white">Payment Method</h4>
                </div>
                
                <div className="space-y-3 pl-11">
                  <label className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer group ${paymentMethod === 'upi' ? 'border-amber-500 bg-amber-500/5' : 'border-stone-800 bg-stone-950 hover:border-stone-700'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${paymentMethod === 'upi' ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-500'}`}>
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Razorpay Secure</p>
                        <p className="text-[10px] text-stone-500 mt-0.5">UPI, Cards, Netbanking</p>
                      </div>
                    </div>
                    <input type="radio" name="payment" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="sr-only" />
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'upi' ? 'border-amber-500 bg-amber-500 scale-110 shadow-lg shadow-amber-500/20' : 'border-stone-700'}`}>
                      {paymentMethod === 'upi' && <Check className="w-4 h-4 text-stone-950 stroke-[3.5]" />}
                    </div>
                  </label>

                  <label className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer group ${paymentMethod === 'cod' ? 'border-amber-500 bg-amber-500/5' : 'border-stone-800 bg-stone-950 hover:border-stone-700'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${paymentMethod === 'cod' ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-500'}`}>
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Cash on Delivery</p>
                        <p className="text-[10px] text-stone-500 mt-0.5">Pay at your doorstep</p>
                      </div>
                    </div>
                    <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="sr-only" />
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'cod' ? 'border-amber-500 bg-amber-500 scale-110 shadow-lg shadow-amber-500/20' : 'border-stone-700'}`}>
                      {paymentMethod === 'cod' && <Check className="w-4 h-4 text-stone-950 stroke-[3.5]" />}
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={isProcessing} className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-black py-5 rounded-2xl shadow-2xl transition-all active:scale-[0.97] flex items-center justify-center gap-3 text-sm uppercase tracking-widest">
                  {isProcessing ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-3 border-stone-950/30 border-t-stone-950 rounded-full animate-spin" />
                      Verifying Gateway...
                    </div>
                  ) : (
                    <>
                      <span>Place Secure Order · ₹{grandTotal}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
                <div className="mt-6 flex flex-col items-center gap-2 opacity-50">
                  <div className="flex items-center gap-3">
                    <div className="h-px w-8 bg-stone-700" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-stone-500">Industry Standard Encryption</span>
                    <div className="h-px w-8 bg-stone-700" />
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
            </form>
          )}

          {step === 'tracking' && currentOrder && (
            <div className="space-y-10 py-8 text-center animate-in zoom-in-95 duration-700">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center text-emerald-500 mx-auto shadow-2xl">
                  <ChefHat className="w-12 h-12" />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 border-2 border-emerald-500/10 rounded-full animate-ping pointer-events-none" />
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-4 py-1.5 rounded-full uppercase tracking-[0.4em]">Success</span>
                <h4 className="text-3xl font-serif text-stone-100">Feast in Progress</h4>
                <p className="text-xs text-stone-500 max-w-[260px] mx-auto leading-relaxed">
                  Our master chefs have received your order and are crafting your meal with authentic spices.
                </p>
              </div>

              <div className="bg-stone-950 border border-stone-800 rounded-[32px] p-8 text-left relative overflow-hidden shadow-2xl">
                <div className="space-y-8 relative">
                  <div className="absolute left-[9px] top-2 bottom-2 w-px bg-stone-800" />
                  <div className="flex gap-5 items-start relative">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 z-10 border-4 border-stone-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]"><Check className="w-3 h-3 text-stone-950 stroke-[4]" /></div>
                    <div><p className="text-xs font-bold text-white uppercase tracking-wider">Confirmed</p><p className="text-[10px] text-stone-500 mt-1">Kitchen has accepted your request</p></div>
                  </div>
                  <div className="flex gap-5 items-start relative">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-stone-950 ${['preparing', 'ready', 'out_for_delivery'].includes(currentOrder.orderStatus) ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-stone-800'}`}>{['ready', 'out_for_delivery'].includes(currentOrder.orderStatus) ? <Check className="w-3 h-3 text-stone-950 stroke-[4]" /> : <div className="w-2 h-2 rounded-full bg-stone-950 animate-pulse" />}</div>
                    <div><p className={`text-xs font-bold uppercase tracking-wider ${['preparing', 'ready', 'out_for_delivery'].includes(currentOrder.orderStatus) ? 'text-white' : 'text-stone-600'}`}>Preparing</p><p className="text-[10px] text-stone-500 mt-1">Authentic slow-cooking in progress</p></div>
                  </div>
                  <div className="flex gap-5 items-start relative">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-stone-950 ${['out_for_delivery'].includes(currentOrder.orderStatus) ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-stone-800'}`}>{currentOrder.orderStatus === 'delivered' ? <Check className="w-3 h-3 text-stone-950 stroke-[4]" /> : null}</div>
                    <div><p className={`text-xs font-bold uppercase tracking-wider ${['out_for_delivery'].includes(currentOrder.orderStatus) ? 'text-white' : 'text-stone-600'}`}>Dispatch</p><p className="text-[10px] text-stone-500 mt-1">Rider dispatched to Vijay Nagar</p></div>
                  </div>
                </div>
              </div>
              <Button onClick={() => setIsCartOpen(false)} className="w-full bg-stone-800 hover:bg-stone-700 text-stone-200 py-4 rounded-2xl border border-stone-700 transition-all font-bold text-xs uppercase tracking-widest">Close Tracker</Button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {step === 'cart' && cart.length > 0 && (
          <div className="p-6 border-t border-stone-800 bg-stone-950 shadow-[0_-20px_40px_rgba(0,0,0,0.6)]">
            {deliveryUnavailableNotice && (
              <div className="mb-4 p-4 bg-amber-950/40 border border-amber-500/40 rounded-xl space-y-2 text-left animate-in fade-in">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-semibold text-amber-300">
                      Delivery Currently Unavailable
                    </h5>
                    <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                      We couldn't place your order at this moment. Online delivery service is currently unavailable at your location. Please join us for dine-in or book a table.
                    </p>
                  </div>
                </div>
                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      const el = document.getElementById('reservation');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        navigate('/#reservation');
                      }
                    }}
                    className="text-xs bg-[#f5be38] hover:bg-amber-400 text-stone-950 font-semibold px-3 py-1.5 rounded transition-colors cursor-pointer"
                  >
                    Book a Table Instead
                  </button>
                  <a
                    href="tel:+917314982233"
                    className="text-xs border border-stone-700 bg-stone-900 text-stone-300 font-medium px-3 py-1.5 rounded hover:text-white transition-colors"
                  >
                    Call +91 (731) 498-2233
                  </a>
                </div>
              </div>
            )}

            <Button
              onClick={handleProceedToCheckout}
              className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-black py-5 flex items-center justify-center gap-4 text-sm rounded-2xl shadow-2xl transition-all active:scale-[0.97] uppercase tracking-widest cursor-pointer"
            >
              PROCEED TO CHECKOUT
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-stone-600">
                <div className="w-1 h-1 bg-stone-700 rounded-full" />
                <span className="text-[9px] uppercase tracking-widest font-bold">Secure</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <div className="w-1 h-1 bg-stone-700 rounded-full" />
                <span className="text-[9px] uppercase tracking-widest font-bold">Fresh</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <div className="w-1 h-1 bg-stone-700 rounded-full" />
                <span className="text-[9px] uppercase tracking-widest font-bold">Fast</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
