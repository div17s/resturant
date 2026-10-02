import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { MenuItem } from '../../data/menuData';
import { Button } from '../ui/Button';
import { Utensils, GlassWater, AlertCircle, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { useToast } from '../ui/ToastNotification';

interface DishDetailModalProps {
  dish: MenuItem | null;
  onClose: () => void;
  onReserveClick: () => void;
}

export const DishDetailModal = ({ dish, onClose, onReserveClick }: DishDetailModalProps) => {
  if (!dish) return null;

  const { addToCart, setIsCartOpen } = useOrder();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<{ id: string; name: string; price: number }[]>([]);

  const toggleAddon = (addon: { id: string; name: string; price: number }) => {
    setSelectedAddons((prev) =>
      prev.some((a) => a.id === addon.id) ? prev.filter((a) => a.id !== addon.id) : [...prev, addon]
    );
  };

  const handleAddToCart = () => {
    addToCart(dish, quantity, selectedAddons);
    showToast(`Added ${quantity}x ${dish.name} to your bag`, 'success');
    onClose();
    setIsCartOpen(true);
  };

  const renderSpiceIndicator = (level?: number) => {
    if (!level) return <span className="text-stone-400">Non-Spicy / Mild</span>;
    return (
      <span className="text-xs text-amber-300 font-mono">
        {level === 1 ? 'Mild Spice' : level === 2 ? 'Medium Spiced' : 'Bold & Spiced'}
      </span>
    );
  };

  return (
    <Modal isOpen={!!dish} onClose={onClose} title={dish.name} maxWidth="max-w-xl">
      <div className="space-y-6">
        {/* Large Dish Image */}
        <div className="relative h-64 rounded-xl overflow-hidden bg-stone-950 border border-stone-800">
          <img 
            src={dish.image} 
            alt={dish.name} 
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80";
            }}
            className="w-full h-full object-cover" 
          />
          <div className="absolute top-3 right-3 bg-stone-950/90 text-amber-400 font-serif font-bold text-lg px-3 py-1 rounded border border-amber-900/40">
            {dish.price}
          </div>
        </div>

        {/* Description & Badges */}
        <div>
          <p className="text-stone-300 text-sm font-light leading-relaxed mb-4">
            {dish.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {dish.vegetarian ? (
              <span className="inline-flex items-center gap-1 text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded">
                ● Vegetarian
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs bg-rose-950 text-rose-300 border border-rose-800 px-2.5 py-1 rounded">
                ● Non-Vegetarian
              </span>
            )}

            {dish.chefPick && (
              <span className="inline-flex items-center text-xs bg-stone-900 text-amber-300 border border-amber-800/80 px-2.5 py-1 rounded font-mono uppercase tracking-wider">
                Chef's Recommendation
              </span>
            )}

            {dish.popular && (
              <span className="inline-flex items-center gap-1 text-xs bg-stone-800 text-stone-200 border border-stone-700 px-2.5 py-1 rounded">
                Guest Favorite
              </span>
            )}
          </div>

          {/* Spice & Allergen Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs bg-stone-950 p-3.5 rounded-lg border border-stone-800">
            <div>
              <span className="text-stone-500 block mb-1 uppercase font-mono text-[10px]">Spice Level</span>
              {renderSpiceIndicator(dish.spiceLevel)}
            </div>
            <div>
              <span className="text-stone-500 block mb-1 uppercase font-mono text-[10px]">Allergens Noted</span>
              <span className="text-stone-300">
                {dish.allergens && dish.allergens.length > 0 ? dish.allergens.join(', ') : 'No common allergens'}
              </span>
            </div>
          </div>

          {/* Ingredients list */}
          {dish.ingredients && (
            <div className="bg-stone-950 p-3.5 rounded-lg border border-stone-800 mb-4">
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5" /> Curated Ingredients
              </h4>
              <ul className="flex flex-wrap gap-1.5 text-xs text-stone-300">
                {dish.ingredients.map((ing, idx) => (
                  <li key={idx} className="bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                    {ing}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sommelier Pairing */}
          {dish.pairing && (
            <div className="bg-amber-950/20 p-3.5 rounded-lg border border-amber-900/30 mb-4">
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
                <GlassWater className="w-3.5 h-3.5" /> Recommended Wine Pairing
              </h4>
              <p className="text-xs text-stone-300 italic">
                {dish.pairing}
              </p>
            </div>
          )}

          {/* Optional Add-ons */}
          {dish.addons && dish.addons.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-mono uppercase text-stone-400 mb-2">Enhance Your Dish</h4>
              <div className="space-y-2">
                {dish.addons.map((addon) => {
                  const isChecked = selectedAddons.some((a) => a.id === addon.id);
                  return (
                    <label
                      key={addon.id}
                      className="flex items-center justify-between p-2.5 rounded bg-stone-950 border border-stone-800 text-xs cursor-pointer hover:border-stone-700"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleAddon(addon)}
                          className="rounded border-stone-700 text-amber-500 focus:ring-0"
                        />
                        <span className="text-stone-200">{addon.name}</span>
                      </div>
                      <span className="text-amber-400 font-mono">+₹{addon.price}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-800">
          <div className="flex items-center gap-3 bg-stone-950 border border-stone-800 rounded px-3 py-1.5 w-full sm:w-auto justify-center">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="text-stone-400 hover:text-white"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-sm px-2 text-stone-200">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="text-stone-400 hover:text-white"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={handleAddToCart}
              className="flex-1 sm:flex-initial bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs py-2.5 px-4 flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Order Bag
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onClose();
                onReserveClick();
              }}
              className="flex-1 sm:flex-initial border-stone-700 text-stone-300 text-xs py-2.5 px-4"
            >
              Reserve Table
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
