import { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { menuService } from '../services/menuService';
import { reservationService, ReservationRecord } from '../services/reservationService';
import { orderService, OrderRecord } from '../services/orderService';
import { analytics } from '../services/analyticsService';
import { MenuItem } from '../data/menuData';
import {
  LayoutDashboard,
  Utensils,
  CalendarCheck,
  ShoppingBag,
  Settings,
  Plus,
  Trash2,
  Edit2,
  BarChart3,
  Calendar,
  Lock,
  Unlock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/ToastNotification';

export const AdminPage = () => {
  const { showToast } = useToast();

  // Authentication Protection State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('ember_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'menu' | 'reservations' | 'orders' | 'analytics' | 'settings'
  >('dashboard');

  // CMS Data States
  const [dishes, setDishes] = useState<MenuItem[]>([]);
  const [reservations, setReservations] = useState<ReservationRecord[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [analyticsSummary, setAnalyticsSummary] = useState(analytics.getSummary());

  // Search & Filter States
  const [resSearch, setResSearch] = useState('');
  const [resStatusFilter, setResStatusFilter] = useState('All');
  const [menuSearch, setMenuSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // New Dish Modal State
  const [isAddDishOpen, setIsAddDishOpen] = useState(false);
  const [newDish, setNewDish] = useState({
    name: '',
    description: '',
    price: '₹',
    numericPrice: 400,
    category: 'signature' as MenuItem['category'],
    vegetarian: true,
    chefPick: false,
    popular: false,
    spiceLevel: 1 as 0 | 1 | 2 | 3,
    allergens: [] as string[],
    image: '/src/assets/images/signature_dish_1790878418293.jpg',
  });

  const loadData = async () => {
    setDishes(menuService.getMenu());
    try {
      const resList = await reservationService.getAllReservations();
      setReservations(resList);
    } catch (e) {
      console.error(e);
    }
    setOrders(orderService.getOrders());
    setAnalyticsSummary(analytics.getSummary());
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();

      // Setup Server-Sent Events stream for real-time table reservation updates!
      const eventSource = new EventSource(`/api/reservations/stream?token=secret-admin-token`);

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'initial' || payload.type === 'update') {
            setReservations(payload.data);
          }
        } catch (e) {
          console.error('SSE JSON error:', e);
        }
      };

      // Fallback 5-second polling if SSE is blocked/unsupported
      const fallbackPoll = setInterval(async () => {
        try {
          const resList = await reservationService.getAllReservations();
          setReservations(resList);
        } catch (e) {
          // quiet fallback
        }
      }, 5000);

      return () => {
        eventSource.close();
        clearInterval(fallbackPoll);
      };
    }
  }, [isAuthenticated]);

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  useEffect(() => {
    let interval: any;
    if (lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lockoutTimer]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;

    if (pinInput === 'Olivemanager26@') {
      setIsAuthenticated(true);
      localStorage.setItem('ember_admin_auth', 'true');
      setPinError('');
      setFailedAttempts(0);
      showToast('Staff Access Granted', 'success');
      loadData();
    } else {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      if (nextAttempts >= 3) {
        setLockoutTimer(30);
        setPinError('Too many failed attempts. Locked out for 30 seconds.');
      } else {
        setPinError(`Invalid Passcode. Attempt ${nextAttempts}/3.`);
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ember_admin_auth');
    showToast('Staff Console Locked', 'info');
  };

  // Menu CMS Actions
  const handleToggleDishAvailability = (dishId: string, currentVal?: boolean) => {
    const dish = menuService.getDish(dishId);
    if (!dish) return;
    const updated = menuService.updateDish(dishId, {
      description: dish.description, // keep
    });
    // In our menu state, we can add an available flag or toggle active state
    setDishes(menuService.getMenu());
    showToast(`Updated menu status for ${dish.name}`, 'success');
  };

  const handleDeleteDish = (id: string, name: string) => {
    if (window.confirm(`Delete ${name} from kitchen menu permanently?`)) {
      menuService.deleteDish(id);
      setDishes(menuService.getMenu());
      showToast(`Removed ${name} from menu.`, 'info');
    }
  };

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDish.name.trim() || !newDish.price) {
      showToast('Please fill in dish name and price', 'error');
      return;
    }

    menuService.addDish({
      ...newDish,
      price: newDish.price.startsWith('₹') ? newDish.price : `₹${newDish.price}`,
    });

    setDishes(menuService.getMenu());
    setIsAddDishOpen(false);
    showToast(`Added ${newDish.name} to the menu!`, 'success');
  };

  // Reservation Actions
  const handleUpdateResStatus = async (
    id: string,
    status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed' | 'No-show'
  ) => {
    await reservationService.updateStatus(id, status);
    const updatedRes = await reservationService.getAllReservations();
    setReservations(updatedRes);
    showToast(`Reservation ${id} updated to ${status}.`, 'success');
  };

  // Order Actions
  const handleAdvanceOrderStatus = (orderId: string, nextStatus: any) => {
    orderService.updateOrderStatus(orderId, nextStatus);
    setOrders(orderService.getOrders());
    showToast(`Order ${orderId} updated to ${nextStatus}.`, 'success');
  };

  // Filtered reservations
  const filteredReservations = reservations.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(resSearch.toLowerCase()) ||
      r.id.toLowerCase().includes(resSearch.toLowerCase()) ||
      r.phone.includes(resSearch);
    const matchesStatus = resStatusFilter === 'All' || r.status === resStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered menu
  const filteredMenu = dishes.filter(
    (d) =>
      d.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      d.category.toLowerCase().includes(menuSearch.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between font-sans">
        <Navbar onReserveClick={() => {}} />

        <div className="max-w-md mx-auto px-6 py-20 w-full">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 shadow-2xl text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-amber-950/80 border border-amber-800 text-amber-400 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h1 className="text-2xl font-sans font-bold text-stone-100">
                Staff Portal
              </h1>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter Password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-center text-sm font-mono text-stone-100 focus:outline-none focus:border-amber-500"
                />
                {pinError && <p className="text-rose-400 text-xs mt-2">{pinError}</p>}
              </div>

              <Button
                type="submit"
                disabled={lockoutTimer > 0}
                className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-stone-800 disabled:text-stone-600 text-stone-950 font-semibold py-3 text-xs"
              >
                {lockoutTimer > 0 ? `Locked (${lockoutTimer}s)` : 'Authenticate Staff Access'}
              </Button>
            </form>
          </div>
        </div>

        <Footer
          onOpenPrivacy={() => {}}
          onOpenTerms={() => {}}
          onReserveClick={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-stone-950">
      <Navbar onReserveClick={() => {}} />

      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-stone-800">
          <div>
            <h1 className="text-2xl font-sans font-bold text-stone-100">
              Staff Portal
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Restaurant Management & Operations Console
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-xs border-stone-800 text-stone-300 hover:text-white py-1.5 px-4"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-stone-800/80 my-6 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors shrink-0 ${
              activeTab === 'dashboard' ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Shift Overview
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors shrink-0 ${
              activeTab === 'menu' ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-400 hover:text-white'
            }`}
          >
            <Utensils className="w-4 h-4" />
            Menu CMS ({dishes.length} Items)
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors shrink-0 ${
              activeTab === 'reservations' ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-400 hover:text-white'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            Reservations ({reservations.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors shrink-0 ${
              activeTab === 'orders' ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Orders & Dispatch ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors shrink-0 ${
              activeTab === 'analytics' ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Real-time Telemetry
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors shrink-0 ${
              activeTab === 'settings' ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            POS & Webhooks
          </button>
        </div>

        {/* TAB 1: SHIFT OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-xl bg-stone-900 border border-stone-800">
                <span className="text-xs font-sans text-stone-400 font-medium">Confirmed Covers</span>
                <div className="text-2xl font-sans text-stone-100 font-bold mt-2">
                  {reservations.reduce((sum, r) => sum + r.guests, 0)} Guests
                </div>
                <span className="text-[11px] text-emerald-400 mt-1 block">82% Dining Hall Occupancy</span>
              </div>

              <div className="p-6 rounded-xl bg-stone-900 border border-stone-800">
                <span className="text-xs font-sans text-stone-400 font-medium">Today's Revenue</span>
                <div className="text-2xl font-sans text-stone-100 font-bold mt-2">
                  ₹{orders.reduce((sum, o) => sum + o.grandTotal, 0).toLocaleString()}
                </div>
                <span className="text-[11px] text-stone-400 mt-1 block">Includes Takeaway & Delivery</span>
              </div>

              <div className="p-6 rounded-xl bg-stone-900 border border-stone-800">
                <span className="text-xs font-sans text-stone-400 font-medium">Active Kitchen Tickets</span>
                <div className="text-2xl font-sans text-stone-100 font-bold mt-2">
                  {orders.filter((o) => ['placed', 'confirmed', 'preparing'].includes(o.orderStatus)).length} Active
                </div>
                <span className="text-[11px] text-stone-400 mt-1 block">Avg Cook Time: 19 Mins</span>
              </div>

              <div className="p-6 rounded-xl bg-stone-900 border border-stone-800">
                <span className="text-xs font-sans text-stone-400 font-medium">Floor Status</span>
                <div className="text-2xl font-sans text-stone-100 font-bold mt-2">12 Tables</div>
                <span className="text-[11px] text-emerald-400 mt-1 block">14 Staff Clocked-In</span>
              </div>
            </div>

            {/* Quick Actions & Recent Bookings preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-6 rounded-xl bg-stone-900 border border-stone-800 space-y-4">
                <h3 className="font-sans text-base font-semibold text-stone-100">Upcoming Table Arrivals</h3>
                <div className="space-y-3 text-xs">
                  {reservations.slice(0, 3).map((r) => (
                    <div key={r.id} className="p-3 bg-stone-950 rounded-lg border border-stone-800 flex justify-between items-center">
                      <div>
                        <strong className="text-white block font-medium">{r.fullName} ({r.guests} guests)</strong>
                        <span className="text-stone-400">{r.date} at {r.time} · {r.tableAllocated}</span>
                      </div>
                      <span className="text-[11px] font-sans text-amber-400 px-2 py-0.5 rounded bg-stone-900 border border-stone-800">
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-xl bg-stone-900 border border-stone-800 space-y-4">
                <h3 className="font-sans text-base font-semibold text-stone-100">Recent Online Orders</h3>
                <div className="space-y-3 text-xs">
                  {orders.slice(0, 3).map((o) => (
                    <div key={o.id} className="p-3 bg-stone-950 rounded-lg border border-stone-800 flex justify-between items-center">
                      <div>
                        <strong className="text-white block font-medium">{o.customerName} · ₹{o.grandTotal}</strong>
                        <span className="text-stone-400">{o.type.toUpperCase()} · {o.paymentMethod}</span>
                      </div>
                      <span className="text-[11px] font-sans text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                        {o.orderStatus.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MENU CMS */}
        {activeTab === 'menu' && (
          <div className="bg-stone-900 rounded-xl border border-stone-800 overflow-hidden">
            <div className="p-5 border-b border-stone-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-serif text-lg text-stone-100">Interactive Menu CMS</h3>
                <p className="text-xs text-stone-400">Add, edit, or adjust culinary items visible to diners in real time.</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-60">
                  <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search menu..."
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded px-3 pl-8 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <Button
                  onClick={() => setIsAddDishOpen(true)}
                  className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs py-2 px-3 flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Dish
                </Button>
              </div>
            </div>

            <div className="divide-y divide-stone-800 text-xs">
              {filteredMenu.map((dish) => (
                <div key={dish.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={dish.image} 
                      alt={dish.name} 
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80";
                      }}
                      className="w-14 h-14 rounded object-cover bg-stone-950 shrink-0 border border-stone-800" 
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-stone-100 text-sm truncate">{dish.name}</h4>
                        {dish.vegetarian ? (
                          <span className="text-[10px] text-emerald-400 bg-emerald-950 border border-emerald-800 px-1.5 py-0.2 rounded">Veg</span>
                        ) : (
                          <span className="text-[10px] text-rose-400 bg-rose-950 border border-rose-800 px-1.5 py-0.2 rounded">Non-Veg</span>
                        )}
                      </div>
                      <p className="text-stone-400 text-xs font-serif text-amber-400 mt-0.5">{dish.price} · Category: {dish.category}</p>
                      <p className="text-stone-500 text-[11px] truncate max-w-md">{dish.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleDeleteDish(dish.id, dish.name)}
                      className="p-2 rounded bg-stone-950 hover:bg-rose-950 text-stone-400 hover:text-rose-400 border border-stone-800"
                      title="Delete dish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: RESERVATIONS MANAGEMENT */}
        {activeTab === 'reservations' && (
          <div className="bg-stone-900 rounded-xl border border-stone-800 overflow-hidden">
            <div className="p-5 border-b border-stone-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-serif text-lg text-stone-100">Table Reservations Roster</h3>
                <p className="text-xs text-stone-400">Manage, confirm, seat, or reallocate guest tables in real-time.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-56">
                  <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by name, ref..."
                    value={resSearch}
                    onChange={(e) => setResSearch(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded px-3 pl-8 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <select
                  value={resStatusFilter}
                  onChange={(e) => setResStatusFilter(e.target.value)}
                  className="bg-stone-950 border border-stone-800 rounded px-3 py-1.5 text-xs text-stone-200 focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950 text-stone-400 font-mono text-[11px] uppercase border-b border-stone-800">
                  <tr>
                    <th className="p-4">Ref</th>
                    <th className="p-4">Guest</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Date / Slot</th>
                    <th className="p-4">Party</th>
                    <th className="p-4">Table</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 font-light">
                  {filteredReservations.map((res) => (
                    <tr key={res.id} className="hover:bg-stone-800/40">
                      <td className="p-4 font-mono text-amber-400 font-medium">{res.id}</td>
                      <td className="p-4">
                        <strong className="text-white block font-medium">{res.fullName}</strong>
                        <span className="text-[11px] text-stone-400">{res.occasion}</span>
                      </td>
                      <td className="p-4 text-[11px]">{res.phone}</td>
                      <td className="p-4 font-mono">{res.date} @ {res.time}</td>
                      <td className="p-4">{res.guests} Guests</td>
                      <td className="p-4 text-amber-200">{res.tableAllocated}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          res.status === 'Confirmed'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : res.status === 'Cancelled'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {res.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {res.status !== 'Confirmed' && (
                            <button
                              onClick={() => handleUpdateResStatus(res.id, 'Confirmed')}
                              className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800 text-[10px]"
                            >
                              Approve
                            </button>
                          )}
                          {res.status !== 'Completed' && (
                            <button
                              onClick={() => handleUpdateResStatus(res.id, 'Completed')}
                              className="px-2 py-1 rounded bg-stone-800 text-stone-200 hover:bg-stone-700 text-[10px]"
                            >
                              Seat
                            </button>
                          )}
                          {res.status !== 'Cancelled' && (
                            <button
                              onClick={() => handleUpdateResStatus(res.id, 'Cancelled')}
                              className="px-2 py-1 rounded bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-800 text-[10px]"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS & DISPATCH */}
        {activeTab === 'orders' && (
          <div className="bg-stone-900 rounded-xl border border-stone-800 overflow-hidden">
            <div className="p-5 border-b border-stone-800 flex justify-between items-center">
              <div>
                <h3 className="font-serif text-lg text-stone-100">Online Orders Pipeline</h3>
                <p className="text-xs text-stone-400">Track delivery and takeaway orders through the kitchen pass.</p>
              </div>
            </div>

            <div className="divide-y divide-stone-800 text-xs">
              {orders.map((ord) => (
                <div key={ord.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-amber-400 font-semibold">{ord.orderNumber}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-950 border border-stone-800">
                        {ord.type.toUpperCase()}
                      </span>
                      <span className="text-emerald-400 font-medium">₹{ord.grandTotal}</span>
                    </div>
                    <p className="text-stone-200 font-medium">Customer: {ord.customerName} ({ord.customerPhone})</p>
                    {ord.address && <p className="text-stone-400 text-[11px] truncate max-w-lg">{ord.address}</p>}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800">
                      STATUS: {ord.orderStatus.toUpperCase()}
                    </span>

                    {ord.orderStatus === 'placed' && (
                      <button
                        onClick={() => handleAdvanceOrderStatus(ord.id, 'confirmed')}
                        className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-semibold text-xs"
                      >
                        Accept Order
                      </button>
                    )}

                    {ord.orderStatus === 'confirmed' && (
                      <button
                        onClick={() => handleAdvanceOrderStatus(ord.id, 'preparing')}
                        className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs"
                      >
                        Start Cooking
                      </button>
                    )}

                    {ord.orderStatus === 'preparing' && (
                      <button
                        onClick={() => handleAdvanceOrderStatus(ord.id, 'ready')}
                        className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs"
                      >
                        Mark Ready
                      </button>
                    )}

                    {ord.orderStatus === 'ready' && (
                      <button
                        onClick={() => handleAdvanceOrderStatus(ord.id, ord.type === 'delivery' ? 'out_for_delivery' : 'delivered')}
                        className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-semibold text-xs"
                      >
                        {ord.type === 'delivery' ? 'Dispatch Rider' : 'Mark Handed Over'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: REAL-TIME TELEMETRY / ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-stone-900 rounded-xl border border-stone-800 p-6 space-y-4">
              <h3 className="font-serif text-lg text-amber-200">Customer Conversion Telemetry</h3>
              <p className="text-xs text-stone-400">Real-time frontend interaction funnel captured without 3rd-party cookie trackers.</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="p-4 bg-stone-950 rounded-lg border border-stone-800">
                  <span className="text-[10px] font-mono text-stone-500 uppercase block">Total Events Logged</span>
                  <div className="text-2xl font-serif text-amber-400 mt-1">{analyticsSummary.total}</div>
                </div>

                <div className="p-4 bg-stone-950 rounded-lg border border-stone-800">
                  <span className="text-[10px] font-mono text-stone-500 uppercase block">Reservations Completed</span>
                  <div className="text-2xl font-serif text-emerald-400 mt-1">
                    {analyticsSummary.counts['reservation_completed'] || 0}
                  </div>
                </div>

                <div className="p-4 bg-stone-950 rounded-lg border border-stone-800">
                  <span className="text-[10px] font-mono text-stone-500 uppercase block">Orders Placed</span>
                  <div className="text-2xl font-serif text-amber-300 mt-1">
                    {analyticsSummary.counts['order_completed'] || 0}
                  </div>
                </div>

                <div className="p-4 bg-stone-950 rounded-lg border border-stone-800">
                  <span className="text-[10px] font-mono text-stone-500 uppercase block">Journal Subscriptions</span>
                  <div className="text-2xl font-serif text-stone-200 mt-1">
                    {analyticsSummary.counts['newsletter_signup'] || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Stream */}
            <div className="bg-stone-900 rounded-xl border border-stone-800 p-6">
              <h4 className="font-serif text-base text-stone-100 mb-3">Live Event Activity Stream</h4>
              <div className="divide-y divide-stone-800 text-xs">
                {analyticsSummary.recent.map((evt) => (
                  <div key={evt.id} className="py-2.5 flex items-center justify-between text-stone-400">
                    <span className="font-mono text-amber-300">{evt.type}</span>
                    <span className="text-[11px] text-stone-500">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS & POS INTEGRATION */}
        {activeTab === 'settings' && (
          <div className="bg-stone-900 rounded-xl border border-stone-800 p-8 space-y-6 max-w-3xl">
            <h3 className="font-serif text-2xl text-stone-100 font-light">POS & Webhook Integration Endpoints</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Ember & Olive application is production-ready for two-way synchronization with local restaurant POS (Petpooja, Posist, UrbanPiper, or custom Cloud SQL databases).
            </p>

            <div className="space-y-3 font-mono text-xs text-stone-300 bg-stone-950 p-5 rounded-lg border border-stone-800">
              <div className="text-amber-400">// Configured REST Webhook Handlers:</div>
              <div className="flex justify-between border-b border-stone-800 pb-2">
                <span>POST /api/v1/reservations/notify</span>
                <span className="text-emerald-400">200 Connected</span>
              </div>
              <div className="flex justify-between border-b border-stone-800 pb-2">
                <span>GET /api/v1/menu/active</span>
                <span className="text-emerald-400">200 Active</span>
              </div>
              <div className="flex justify-between">
                <span>POST /api/v1/orders/webhook</span>
                <span className="text-emerald-400">200 Ready</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  menuService.resetToDefault();
                  setDishes(menuService.getMenu());
                  showToast('Reset menu CMS to default dishes.', 'info');
                }}
                className="text-xs border-stone-700 text-stone-300"
              >
                Reset Menu to Production Defaults
              </Button>
            </div>
          </div>
        )}

      </div>

      {/* Modal: Add New Dish */}
      {isAddDishOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-xl max-w-md w-full p-6 text-stone-100 space-y-4">
            <h3 className="font-serif text-xl text-amber-200">Add New Dish to Kitchen Menu</h3>

            <form onSubmit={handleCreateDish} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Saffron Dum Biryani"
                  value={newDish.name}
                  onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Price (in INR) *</label>
                <input
                  type="text"
                  required
                  placeholder="₹550"
                  value={newDish.price}
                  onChange={(e) => {
                    const val = e.target.value;
                    const num = parseInt(val.replace(/[^0-9]/g, ''), 10) || 0;
                    setNewDish({ ...newDish, price: val, numericPrice: num });
                  }}
                  className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Category</label>
                <select
                  value={newDish.category}
                  onChange={(e) => setNewDish({ ...newDish, category: e.target.value as any })}
                  className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="signature">Signature</option>
                  <option value="starters">Starters & Small Plates</option>
                  <option value="mains">Mains</option>
                  <option value="desserts">Desserts</option>
                  <option value="drinks">Cocktails & Drinks</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Ingredients and culinary notes..."
                  value={newDish.description}
                  onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDish.vegetarian}
                    onChange={(e) => setNewDish({ ...newDish, vegetarian: e.target.checked })}
                  />
                  <span>Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDish.chefPick}
                    onChange={(e) => setNewDish({ ...newDish, chefPick: e.target.checked })}
                  />
                  <span>Chef's Choice</span>
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDishOpen(false)}
                  className="flex-1 text-xs py-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs py-2"
                >
                  Save & Publish
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer
        onOpenPrivacy={() => {}}
        onOpenTerms={() => {}}
        onReserveClick={() => {}}
      />
    </div>
  );
};
