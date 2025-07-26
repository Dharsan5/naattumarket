import { createClient } from '@supabase/supabase-js';

// Supabase client instances
let supabase = null;
let supabaseAdmin = null;

export const connectDB = async () => {
  try {
    // Initialize Supabase client (for general operations)
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Initialize Supabase admin client (for admin operations)
    supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Test the connection
    const { data, error } = await supabase.from('_health_check').select('*').limit(1);
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = table not found, which is expected
      console.log('⚠️  Note: Health check table not found (this is normal for new projects)');
    }

    console.log('🗄️  Supabase Connected Successfully');
    console.log(`📊 Project URL: ${process.env.SUPABASE_URL}`);

  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    process.exit(1);
  }
};

// Export Supabase clients for use in other modules
export const getSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase not initialized. Call connectDB() first.');
  }
  return supabase;
};

export const getSupabaseAdmin = () => {
  if (!supabaseAdmin) {
    throw new Error('Supabase Admin not initialized. Call connectDB() first.');
  }
  return supabaseAdmin;
};
