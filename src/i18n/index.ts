import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Common
      welcome: 'Welcome',
      loading: 'Loading...',
      error: 'Something went wrong',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      close: 'Close',
      retry: 'Retry',
      
      // Navigation
      home: 'Home',
      suppliers: 'Suppliers',
      naattuKits: 'Naattu Kits',
      orders: 'Orders',
      chat: 'Chat',
      profile: 'Profile',
      
      // Authentication
      login: 'Login',
      logout: 'Logout',
      signUp: 'Sign Up',
      phoneNumber: 'Phone Number',
      enterOtp: 'Enter OTP',
      verifyOtp: 'Verify OTP',
      resendOtp: 'Resend OTP',
      
      // Home Page
      tagline: 'Native Supply. Real Time.',
      searchPlaceholder: 'Search for supplies...',
      nearbySuppliers: 'Nearby Suppliers',
      featuredKits: 'Featured Naattu Kits',
      quickActions: 'Quick Actions',
      reorderYesterday: 'Reorder Yesterday',
      
      // Suppliers
      suppliersNearby: 'Suppliers Nearby',
      verified: 'Verified',
      online: 'Online',
      offline: 'Offline',
      rating: 'Rating',
      reviews: 'reviews',
      deliveryRadius: 'Delivery Radius',
      minimumOrder: 'Minimum Order',
      
      // Products
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      addToCart: 'Add to Cart',
      price: 'Price',
      quantity: 'Quantity',
      total: 'Total',
      
      // Naattu Kits
      tiffinKit: 'Tiffin Kit',
      teaKit: 'Tea Stall Kit',
      chaatKit: 'Chaat Kit',
      juiceKit: 'Juice Kit',
      snacksKit: 'Snacks Kit',
      kitIncludes: 'Kit Includes',
      customizeKit: 'Customize Kit',
      buyKit: 'Buy Kit',
      
      // Cart & Orders
      cart: 'Cart',
      checkout: 'Checkout',
      orderSummary: 'Order Summary',
      subtotal: 'Subtotal',
      deliveryFee: 'Delivery Fee',
      grandTotal: 'Grand Total',
      placeOrder: 'Place Order',
      orderPlaced: 'Order Placed Successfully',
      trackOrder: 'Track Order',
      orderHistory: 'Order History',
      
      // Order Status
      pending: 'Pending',
      confirmed: 'Confirmed',
      preparing: 'Preparing',
      ready: 'Ready for Pickup',
      outForDelivery: 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      
      // Chat
      typeMessage: 'Type a message...',
      send: 'Send',
      typing: 'typing...',
      userOnline: 'Online',
      lastSeen: 'Last seen',
      
      // Quick Phrases
      hello: 'Hello!',
      goodMorning: 'Good morning!',
      whatStock: 'What\'s in stock today?',
      priceBest: 'What\'s your best price?',
      deliveryTime: 'When can you deliver?',
      thankYou: 'Thank you!',
      
      // Group Orders
      buyTogether: 'Buy Together',
      groupOrder: 'Group Order',
      joinGroup: 'Join Group',
      createGroup: 'Create Group',
      participantsNeeded: 'participants needed',
      minimumAmount: 'Minimum Amount',
      timeLeft: 'Time Left',
      groupDiscount: 'Group Discount',
      
      // Payments
      paymentMethod: 'Payment Method',
      upi: 'UPI',
      cash: 'Cash on Delivery',
      card: 'Card',
      payNow: 'Pay Now',
      paymentSuccessful: 'Payment Successful',
      paymentFailed: 'Payment Failed',
      
      // Profile
      editProfile: 'Edit Profile',
      businessName: 'Business Name',
      businessType: 'Business Type',
      location: 'Location',
      language: 'Language',
      notifications: 'Notifications',
      
      // Notifications
      newMessage: 'New message from',
      orderConfirmed: 'Order confirmed',
      orderReady: 'Order ready for pickup',
      orderDelivered: 'Order delivered',
      supplierOnline: 'Supplier is now online',
      
      // Errors
      networkError: 'Network error. Please check your connection.',
      serverError: 'Server error. Please try again later.',
      notFound: 'Item not found',
      unauthorized: 'Please login to continue',
      validationError: 'Please check your input',
      
      // Empty States
      noSuppliers: 'No suppliers found in your area',
      noProducts: 'No products available',
      noOrders: 'No orders yet',
      noMessages: 'No messages yet',
      emptyCart: 'Your cart is empty',
    }
  },
  ta: {
    translation: {
      // Common
      welcome: 'வரவேற்கிறோம்',
      loading: 'ஏற்றுகிறது...',
      error: 'ஏதோ தவறு நடந்தது',
      search: 'தேடு',
      filter: 'வடிகட்டு',
      sort: 'வரிசைப்படுத்து',
      save: 'சேமி',
      cancel: 'ரத்து',
      confirm: 'உறுதி',
      delete: 'நீக்கு',
      edit: 'திருத்து',
      view: 'பார்',
      close: 'மூடு',
      retry: 'மீண்டும் முயற்சி',
      
      // Navigation
      home: 'முகப்பு',
      suppliers: 'சப்ளையர்கள்',
      naattuKits: 'நாட்டு கிட்கள்',
      orders: 'ஆர்டர்கள்',
      chat: 'அரட்டை',
      profile: 'சுயவிவரம்',
      
      // Authentication
      login: 'உள்நுழை',
      logout: 'வெளியேறு',
      signUp: 'பதிவு செய்',
      phoneNumber: 'மொபைல் எண்',
      enterOtp: 'OTP உள்ளிடு',
      verifyOtp: 'OTP சரிபார்',
      resendOtp: 'OTP மீண்டும் அனுப்பு',
      
      // Home Page
      tagline: 'நாட்டு சப்ளை. நேரடி நேரம்.',
      searchPlaceholder: 'பொருட்களை தேடுங்கள்...',
      nearbySuppliers: 'அருகிலுள்ள சப்ளையர்கள்',
      featuredKits: 'சிறப்பு நாட்டு கிட்கள்',
      quickActions: 'விரைவு செயல்கள்',
      reorderYesterday: 'நேற்று மீண்டும் ஆர்டர்',
      
      // Suppliers
      suppliersNearby: 'அருகிலுள்ள சப்ளையர்கள்',
      verified: 'சரிபார்க்கப்பட்டது',
      online: 'ஆன்லைன்',
      offline: 'ஆஃப்லைன்',
      rating: 'மதிப்பீடு',
      reviews: 'விமர்சனங்கள்',
      deliveryRadius: 'டெலிவரி வட்டம்',
      minimumOrder: 'குறைந்தபட்ச ஆர்டர்',
      
      // Products
      inStock: 'இருப்பில் உள்ளது',
      outOfStock: 'இருப்பில் இல்லை',
      addToCart: 'கார்ட்டில் சேர்',
      price: 'விலை',
      quantity: 'அளவு',
      total: 'மொத்தம்',
      
      // Naattu Kits
      tiffinKit: 'டிபன் கிட்',
      teaKit: 'டீ கடை கிட்',
      chaatKit: 'சாட் கிட்',
      juiceKit: 'ஜூஸ் கிட்',
      snacksKit: 'சிற்றுண்டி கிட்',
      kitIncludes: 'கிட்டில் அடங்கியவை',
      customizeKit: 'கிட்டை மாற்று',
      buyKit: 'கிட் வாங்கு',
      
      // Cart & Orders
      cart: 'கார்ட்',
      checkout: 'செக்அவுட்',
      orderSummary: 'ஆர்டர் சுருக்கம்',
      subtotal: 'துணை மொத்தம்',
      deliveryFee: 'டெலிவரி கட்டணம்',
      grandTotal: 'மொத்த தொகை',
      placeOrder: 'ஆர்டர் செய்',
      orderPlaced: 'ஆர்டர் வெற்றிகரமாக வைக்கப்பட்டது',
      trackOrder: 'ஆர்டரை கண்காணி',
      orderHistory: 'ஆர்டர் வரலாறு',
      
      // Order Status
      pending: 'நிலுவையில்',
      confirmed: 'உறுதி',
      preparing: 'தயாரிக்கிறது',
      ready: 'எடுக்க தயார்',
      outForDelivery: 'டெலிவரிக்கு வெளியே',
      delivered: 'டெலிவர் செய்யப்பட்டது',
      cancelled: 'ரத்து',
      
      // Chat
      typeMessage: 'செய்தி தட்டச்சு செய்யுங்கள்...',
      send: 'அனுப்பு',
      typing: 'தட்டச்சு செய்கிறது...',
      userOnline: 'ஆன்லைன்',
      lastSeen: 'கடைசியாக பார்த்தது',
      
      // Quick Phrases
      hello: 'வணக்கம்!',
      goodMorning: 'காலை வணக்கம்!',
      whatStock: 'இன்று என்ன ஸ்டாக் இருக்கு?',
      priceBest: 'உங்களோட பெஸ்ட் பிரைஸ் என்ன?',
      deliveryTime: 'எப்போ டெலிவர் பண்ணலாம்?',
      thankYou: 'நன்றி!',
      
      // Group Orders
      buyTogether: 'சேர்ந்து வாங்கு',
      groupOrder: 'குழு ஆர்டர்',
      joinGroup: 'குழுவில் சேர்',
      createGroup: 'குழு உருவாக்கு',
      participantsNeeded: 'பங்கேற்பாளர்கள் தேவை',
      minimumAmount: 'குறைந்தபட்ச தொகை',
      timeLeft: 'மீதமுள்ள நேரம்',
      groupDiscount: 'குழு தள்ளுபடி',
      
      // Payments
      paymentMethod: 'பணம் செலுத்தும் முறை',
      upi: 'UPI',
      cash: 'பணம் டெலிவரியில்',
      card: 'கார்ட்',
      payNow: 'இப்போது பணம் செலுத்து',
      paymentSuccessful: 'பணம் செலுத்துதல் வெற்றி',
      paymentFailed: 'பணம் செலுத்துதல் தோல்வி',
      
      // Profile
      editProfile: 'சுயவிவரத்தை திருத்து',
      businessName: 'வணிக பெயர்',
      businessType: 'வணிக வகை',
      location: 'இடம்',
      language: 'மொழி',
      notifications: 'அறிவிப்புகள்',
      
      // Notifications
      newMessage: 'புதிய செய்தி',
      orderConfirmed: 'ஆர்டர் உறுதி',
      orderReady: 'ஆர்டர் எடுக்க தயார்',
      orderDelivered: 'ஆர்டர் டெலிவர்',
      supplierOnline: 'சப்ளையர் இப்போது ஆன்லைன்',
      
      // Errors
      networkError: 'நெட்வொர்க் பிழை. உங்கள் இணைப்பை சரிபார்க்கவும்.',
      serverError: 'சர்வர் பிழை. பின்னர் முயற்சிக்கவும்.',
      notFound: 'உருப்படி கிடைக்கவில்லை',
      unauthorized: 'தொடர உள்நுழைக',
      validationError: 'உங்கள் உள்ளீட்டை சரிபார்க்கவும்',
      
      // Empty States
      noSuppliers: 'உங்கள் பகுதியில் சப்ளையர்கள் இல்லை',
      noProducts: 'பொருட்கள் கிடைக்கவில்லை',
      noOrders: 'இன்னும் ஆர்டர்கள் இல்லை',
      noMessages: 'இன்னும் செய்திகள் இல்லை',
      emptyCart: 'உங்கள் கார்ட் காலியாக உள்ளது',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ta', // Tamil first
    debug: import.meta.env.DEV,

    interpolation: {
      escapeValue: false // React already does escaping
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'naattumarket-language'
    }
  });

export default i18n;
