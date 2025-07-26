import React, { useState } from 'react';
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  CreditCard,
  MapPin,
  Clock,
  Tag,
  ArrowRight
} from 'lucide-react';

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Organic Turmeric Powder",
      price: 299,
      originalPrice: 399,
      quantity: 2,
      image: "🌿",
      supplier: "Green Valley Farms",
      inStock: true
    },
    {
      id: 2,
      name: "Fresh Curry Leaves",
      price: 89,
      originalPrice: 120,
      quantity: 1,
      image: "🍃",
      supplier: "Nature's Best",
      inStock: true
    },
    {
      id: 3,
      name: "Premium Basmati Rice",
      price: 680,
      originalPrice: 750,
      quantity: 1,
      image: "🌾",
      supplier: "Golden Harvest",
      inStock: true
    }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'welcome10') {
      setAppliedPromo('WELCOME10');
      setPromoCode('');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
  const promoDiscount = appliedPromo ? subtotal * 0.1 : 0;
  const deliveryFee = subtotal > 500 ? 0 : 50;
  const total = subtotal - promoDiscount + deliveryFee;

  const CartItem = ({ item }: { item: typeof cartItems[0] }) => (
    <div className="metal-glass-card">
      <div className="flex gap-lg">
        <div className="w-20 h-20 bg-gradient-to-br from-sage-silver-light to-sage-silver rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
          {item.image}
        </div>
        
        <div className="flex-1">
          <h3 className="heading-metal heading-metal-sm mb-xs">{item.name}</h3>
          <p className="text-metal text-sm mb-sm">by {item.supplier}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-sm">
              <span className="heading-metal text-metal-accent">₹{item.price}</span>
              <span className="text-metal line-through text-sm">₹{item.originalPrice}</span>
            </div>
            
            <div className="flex items-center gap-md">
              <div className="flex items-center gap-sm">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="btn-metal p-xs"
                >
                  <Minus size={14} />
                </button>
                <span className="text-metal font-medium min-w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="btn-metal p-xs"
                >
                  <Plus size={14} />
                </button>
              </div>
              
              <button
                onClick={() => removeItem(item.id)}
                className="btn-metal p-xs text-red-400 hover:bg-red-500/10"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (cartItems.length === 0) {
    return (
      <div className="container py-16">
        <div className="metal-glass-card text-center py-16">
          <ShoppingBag size={64} className="text-metal-accent mx-auto mb-lg" />
          <h2 className="heading-metal heading-metal-lg mb-md">Your cart is empty</h2>
          <p className="text-metal mb-xl">Start shopping to add items to your cart</p>
          <button className="btn-metal btn-metal-primary">
            Start Shopping
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-sm mb-xl">
        <ShoppingBag size={24} className="text-metal-accent" />
        <h1 className="heading-metal heading-metal-xl">Shopping Cart</h1>
        <span className="badge-metal">{cartItems.length} items</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-xl">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
          
          {/* Promo Code */}
          <div className="metal-glass-card">
            <h3 className="heading-metal heading-metal-sm mb-md flex items-center gap-sm">
              <Tag size={16} />
              Promo Code
            </h3>
            {appliedPromo ? (
              <div className="flex items-center justify-between p-md bg-green-500/10 rounded-lg border border-green-500/20">
                <span className="text-green-400 font-medium">{appliedPromo} Applied!</span>
                <button
                  onClick={() => setAppliedPromo(null)}
                  className="btn-metal p-xs"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ) : (
              <div className="flex gap-md">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="input-metal flex-1"
                />
                <button onClick={applyPromoCode} className="btn-metal btn-metal-primary">
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="metal-glass-card sticky top-8">
            <h3 className="heading-metal heading-metal-md mb-lg">Order Summary</h3>
            
            <div className="space-y-3 mb-lg">
              <div className="flex justify-between">
                <span className="text-metal">Subtotal</span>
                <span className="text-metal">₹{subtotal}</span>
              </div>
              
              <div className="flex justify-between text-green-400">
                <span>You Save</span>
                <span>-₹{savings}</span>
              </div>
              
              {appliedPromo && (
                <div className="flex justify-between text-green-400">
                  <span>Promo Discount (10%)</span>
                  <span>-₹{promoDiscount.toFixed(0)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-metal">Delivery Fee</span>
                <span className="text-metal">
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              
              <div className="border-t border-border-primary pt-3">
                <div className="flex justify-between">
                  <span className="heading-metal">Total</span>
                  <span className="heading-metal text-metal-accent">₹{total.toFixed(0)}</span>
                </div>
              </div>
            </div>

            {deliveryFee > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-md mb-lg">
                <p className="text-amber-400 text-sm">
                  Add ₹{500 - subtotal} more for free delivery!
                </p>
              </div>
            )}

            <div className="space-y-md mb-lg">
              <div className="flex items-center gap-sm text-metal">
                <Clock size={16} />
                <span className="text-sm">Delivery in 2-4 hours</span>
              </div>
              <div className="flex items-center gap-sm text-metal">
                <MapPin size={16} />
                <span className="text-sm">Deliver to current location</span>
              </div>
            </div>

            <button className="btn-metal btn-metal-primary w-full mb-md">
              <CreditCard size={16} />
              Proceed to Checkout
            </button>
            
            <button className="btn-metal w-full">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
