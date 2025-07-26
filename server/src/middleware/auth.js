import { getSupabase } from '../config/database.js';

// Middleware to verify Supabase JWT token
export const authenticateUser = async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Access token required'
      });
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired token'
      });
    }

    // Get user profile from database
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
    }

    // Attach user data to request object
    req.user = user;
    req.userProfile = userProfile;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Authentication failed',
      error: error.message
    });
  }
};

// Middleware to check if user is a supplier
export const requireSupplier = (req, res, next) => {
  if (!req.userProfile || req.userProfile.user_type !== 'supplier') {
    return res.status(403).json({
      status: 'error',
      message: 'Supplier access required'
    });
  }
  next();
};

// Middleware to check if user is an admin
export const requireAdmin = (req, res, next) => {
  if (!req.userProfile || req.userProfile.user_type !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Admin access required'
    });
  }
  next();
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (!error && user) {
        const { data: userProfile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        req.user = user;
        req.userProfile = userProfile;
      }
    }
    
    next();
  } catch (error) {
    console.error('Optional auth error:', error);
    next(); // Continue without authentication
  }
};
