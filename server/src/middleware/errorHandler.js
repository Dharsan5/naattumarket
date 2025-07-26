export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.stack);

  // Default error
  let error = { ...err };
  error.message = err.message;

  // Supabase PostgreSQL errors
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique constraint violation
        error = { message: 'Duplicate field value entered', statusCode: 400 };
        break;
      case '23503': // Foreign key constraint violation
        error = { message: 'Referenced resource not found', statusCode: 400 };
        break;
      case '23502': // Not null constraint violation
        error = { message: 'Required field missing', statusCode: 400 };
        break;
      case 'PGRST116': // PostgREST table/view not found
        error = { message: 'Resource not found', statusCode: 404 };
        break;
      case 'PGRST106': // PostgREST no rows returned
        error = { message: 'Resource not found', statusCode: 404 };
        break;
      default:
        error = { message: 'Database error', statusCode: 500 };
    }
  }

  // Supabase Auth errors
  if (err.message?.includes('Invalid login credentials')) {
    error = { message: 'Invalid email or password', statusCode: 401 };
  }

  if (err.message?.includes('Email not confirmed')) {
    error = { message: 'Please verify your email address', statusCode: 401 };
  }

  if (err.message?.includes('signup_disabled')) {
    error = { message: 'Registration is currently disabled', statusCode: 403 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = { message: 'Invalid token', statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    error = { message: 'Token expired', statusCode: 401 };
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }

  // Cast errors
  if (err.name === 'CastError') {
    error = { message: 'Invalid ID format', statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    status: 'error',
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      code: err.code 
    })
  });
};
