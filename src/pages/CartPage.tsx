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
  ArrowRight,
  MessageCircle,
  X
} from 'lucide-react';
import '../styles/cart.css';
import OrderChat from '../components/OrderChat';
import ChatButton from '../components/ChatButton';

const CartPage: React.FC = () => {
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [hasNewMessages, setHasNewMessages] = useState<{[key: number]: boolean}>({1: true, 2: true});
  const [directChat, setDirectChat] = useState(false);
  const [showGlobalChat, setShowGlobalChat] = useState(false);
  
  // Function to open chat directly with supplier
  const openChatWithSupplier = (itemId: number) => {
    setActiveChat(itemId);
    setHasNewMessages(prev => ({...prev, [itemId]: false}));
    setDirectChat(true);
    setShowGlobalChat(false); // Close global chat if open
  };
  
  // Function to open global chat
  const openGlobalChat = () => {
    setShowGlobalChat(true);
    setDirectChat(false); // Close any direct chat if open
    setActiveChat(null);
  };
  
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
    <div className="cart-item metal-glass-card">
      <div className="flex gap-4">
        <div className="w-20 h-20 bg-gradient-to-br from-sage-silver-light to-sage-silver rounded-lg flex items-center justify-center text-2xl flex-shrink-0 cart-item-image">
          {item.image}
        </div>
        
        <div className="flex-1 cart-item-details">
          <h3 className="heading-metal heading-metal-sm mb-xs cart-item-name">{item.name}</h3>
          <div className="flex items-center gap-2 mb-sm">
            <span className="text-metal text-sm">by {item.supplier}</span>
            <ChatButton
              onClick={() => openChatWithSupplier(item.id)}
              hasNewMessages={hasNewMessages[item.id]}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-sm">
              <span className="heading-metal text-metal-accent cart-item-price">₹{item.price}</span>
              <span className="text-metal line-through text-sm">₹{item.originalPrice}</span>
            </div>
            
            <div className="flex items-center gap-md">
              <div className="flex items-center gap-sm cart-item-quantity">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="btn-metal p-xs quantity-button"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="text-metal font-medium min-w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="btn-metal p-xs quantity-button"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
              
              <button
                onClick={() => removeItem(item.id)}
                className="btn-metal p-xs text-red-400 hover:bg-red-500/10 cart-item-remove"
                aria-label="Remove item"
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
    <div className="container cart-page">
      <div className="cart-header">
        <h1 className="cart-title heading-metal heading-metal-xl">Shopping Cart</h1>
        <span className="badge-metal">{cartItems.length} items</span>
      </div>

      {/* Direct Chat modal overlay - now using the enhanced OrderChat component */}
      {activeChat && directChat && (
        <OrderChat 
          orderId="ORD-123456"
          supplierId={activeChat}
          supplierName={cartItems.find(item => item.id === activeChat)?.supplier || "Supplier"}
          startOpen={true}
          onClose={() => setActiveChat(null)}
          minimizable={true}
        />
      )}

      <div className="cart-container">
        {/* Cart Items */}
        <div className="cart-items">
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
          
          {/* Promo Code */}
          <div className="metal-glass-card promo-code-section">
            <h3 className="heading-metal heading-metal-sm mb-3 flex items-center gap-2">
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
              <div className="promo-form">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="promo-input"
                />
                <button onClick={applyPromoCode} className="promo-button">
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="cart-summary metal-glass-card sticky top-8">
          <h3 className="summary-title heading-metal-md">Order Summary</h3>
            
          <div className="space-y-3 mb-4">
            <div className="summary-line">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
              
            <div className="summary-line text-green-400">
              <span>You Save</span>
              <span>-₹{savings}</span>
            </div>
              
            {appliedPromo && (
              <div className="summary-line text-green-400">
                <span>Promo Discount (10%)</span>
                <span>-₹{promoDiscount.toFixed(0)}</span>
              </div>
            )}
              
            <div className="summary-line">
              <span>Delivery Fee</span>
              <span>
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
              </span>
            </div>
              
            <div className="summary-line summary-line-total">
              <span>Total</span>
              <span className="heading-metal text-metal-accent">₹{total.toFixed(0)}</span>
            </div>
          </div>

          {deliveryFee > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-4">
              <p className="text-amber-400 text-sm">
                Add ₹{500 - subtotal} more for free delivery!
              </p>
            </div>
          )}

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-metal">
              <Clock size={16} />
              <span className="text-sm">Delivery in 2-4 hours</span>
            </div>
            <div className="flex items-center gap-2 text-metal">
              <MapPin size={16} />
              <span className="text-sm">Deliver to current location</span>
            </div>
          </div>

          <button className="checkout-button">
            <ShoppingBag size={16} />
            Proceed to Checkout
          </button>
          
          <button className="continue-shopping w-full mt-3">
            Continue Shopping
          </button>
        </div>
      </div>

      {/* Floating chat button for global support */}
      {!directChat && !showGlobalChat && (
        <ChatButton
          onClick={openGlobalChat}
          hasNewMessages={Object.values(hasNewMessages).some(Boolean)}
          type="floating"
        />
      )}

      {/* Global chat modal */}
      {showGlobalChat && (
        <OrderChat 
          orderId="SUPPORT"
          supplierId={0}
          supplierName="Customer Support"
          startOpen={true}
          onClose={() => setShowGlobalChat(false)}
          minimizable={true}
        />
      )}
    </div>
  );
};

export default CartPage;
