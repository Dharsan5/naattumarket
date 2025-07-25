import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { AppState, User, Location, Cart, Notification } from '../types';
import { auth } from '../lib/supabase';
import { socketManager } from '../utils/socket';

// Action types
type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LANGUAGE'; payload: 'en' | 'ta' }
  | { type: 'SET_LOCATION'; payload: Location | null }
  | { type: 'SET_CART'; payload: Cart | null }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'LOGOUT' };

// Initial state
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  language: 'ta', // Tamil first
  location: null,
  cart: null,
  notifications: [],
  isLoading: true,
  error: null,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload,
      };
    case 'SET_LOCATION':
      return {
        ...state,
        location: action.payload,
      };
    case 'SET_CART':
      return {
        ...state,
        cart: action.payload,
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cart: null,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
        language: state.language,
        location: state.location,
      };
    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  login: (phone: string) => Promise<{ success: boolean; error?: string }>;
  verifyOTP: (phone: string, token: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  getCurrentLocation: () => Promise<Location | null>;
  addToCart: (item: any) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItem: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { i18n } = useTranslation();

  // Initialize app
  useEffect(() => {
    initializeApp();
  }, []);

  // Language change effect
  useEffect(() => {
    i18n.changeLanguage(state.language);
    localStorage.setItem('naattumarket-language', state.language);
  }, [state.language, i18n]);

  // Auth state change listener
  useEffect(() => {
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Fetch user profile from your database
        const userProfile = await fetchUserProfile(session.user.id);
        dispatch({ type: 'SET_USER', payload: userProfile });
        
        // Connect to real-time updates
        socketManager.connect();
      } else if (event === 'SIGNED_OUT') {
        dispatch({ type: 'LOGOUT' });
        socketManager.disconnect();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function initializeApp() {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Check existing session
      const { session } = await auth.getSession();
      if (session?.user) {
        const userProfile = await fetchUserProfile(session.user.id);
        dispatch({ type: 'SET_USER', payload: userProfile });
        socketManager.connect();
      }

      // Get saved language preference
      const savedLanguage = localStorage.getItem('naattumarket-language') as 'en' | 'ta' | null;
      if (savedLanguage) {
        dispatch({ type: 'SET_LANGUAGE', payload: savedLanguage });
      }

      // Get location permission and current location
      const location = await getCurrentLocation();
      if (location) {
        dispatch({ type: 'SET_LOCATION', payload: location });
      }

      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('App initialization error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize app' });
    }
  }

  async function fetchUserProfile(_userId: string): Promise<User | null> {
    // Implement user profile fetching from your database
    // This is a placeholder - you'll need to implement the actual API call
    return null;
  }

  async function login(phone: string) {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const { error } = await auth.signInWithOTP(phone);
      
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        return { success: false, error: error.message };
      }

      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }

  async function verifyOTP(phone: string, token: string) {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const { data, error } = await auth.verifyOTP(phone, token);
      
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        return { success: false, error: error.message };
      }

      if (data.user) {
        const userProfile = await fetchUserProfile(data.user.id);
        dispatch({ type: 'SET_USER', payload: userProfile });
        socketManager.connect();
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'OTP verification failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }

  async function logout() {
    try {
      await auth.signOut();
      dispatch({ type: 'LOGOUT' });
      socketManager.disconnect();
    } catch (error) {
      console.error('Logout error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to logout' });
    }
  }

  async function getCurrentLocation(): Promise<Location | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Reverse geocoding to get address (you can use any geocoding service)
            const location: Location = {
              id: 'current',
              latitude,
              longitude,
              address: 'Current Location',
              city: 'Unknown',
              state: 'Unknown',
              zipCode: 'Unknown'
            };
            resolve(location);
          } catch (error) {
            resolve({
              id: 'current',
              latitude,
              longitude,
              address: 'Current Location',
              city: 'Unknown',
              state: 'Unknown',
              zipCode: 'Unknown'
            });
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  function addToCart(item: any) {
    // Implement add to cart logic
    console.log('Adding to cart:', item);
  }

  function removeFromCart(itemId: string) {
    // Implement remove from cart logic
    console.log('Removing from cart:', itemId);
  }

  function updateCartItem(itemId: string, quantity: number) {
    // Implement update cart item logic
    console.log('Updating cart item:', itemId, quantity);
  }

  function clearCart() {
    dispatch({ type: 'CLEAR_CART' });
  }

  function addNotification(notification: Omit<Notification, 'id' | 'createdAt'>) {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
  }

  function removeNotification(id: string) {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }

  function markNotificationAsRead(id: string) {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  }

  const contextValue: AppContextType = {
    state,
    dispatch,
    login,
    verifyOTP,
    logout,
    getCurrentLocation,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    addNotification,
    removeNotification,
    markNotificationAsRead,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use app context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
