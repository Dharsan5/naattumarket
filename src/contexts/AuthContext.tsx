import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, authService } from '../services/authService';

// Authentication state types
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Authentication actions
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Auth context
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  updateProfileImage: (file: File) => Promise<boolean>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const response = await authService.getProfile();
          if (response.success && response.data) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
          } else {
            localStorage.removeItem('auth_token');
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        } catch (error) {
          localStorage.removeItem('auth_token');
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await authService.login({ email, password });
      
      if (response.success && response.data) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
        return true;
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: response.error || 'Login failed' });
        return false;
      }
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error instanceof Error ? error.message : 'Login failed' 
      });
      return false;
    }
  };

  // Signup function
  const signup = async (userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // All users register as customers by default
      const role = 'customer';
      const response = await authService.register({
        ...userData,
        role
      });
      
      if (response.success && response.data) {
        // For signup flow, we don't automatically log in the user
        dispatch({ type: 'SET_LOADING', payload: false });
        return true;
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: response.error || 'Registration failed' });
        return false;
      }
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error instanceof Error ? error.message : 'Registration failed' 
      });
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Update profile function
  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const response = await authService.updateProfile(userData);
      
      if (response.success && response.data) {
        dispatch({ type: 'UPDATE_PROFILE', payload: response.data });
        return true;
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: response.error || 'Profile update failed' });
        return false;
      }
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error instanceof Error ? error.message : 'Profile update failed' 
      });
      return false;
    }
  };
  
  // Update profile image function
  const updateProfileImage = async (file: File): Promise<boolean> => {
    try {
      // Import here to avoid circular dependency
      const { CloudinaryService } = await import('../services/cloudinaryService');
      const response = await CloudinaryService.uploadProfileImage(file);
      
      if (response.success && response.data && state.user) {
        // Update the user object with the new avatar URL
        dispatch({ 
          type: 'UPDATE_PROFILE', 
          payload: { 
            ...state.user, 
            avatar_url: response.data.secure_url 
          } 
        });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Profile image update error:', error);
      return false;
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    updateProfile,
    updateProfileImage,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
