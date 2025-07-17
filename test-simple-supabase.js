const { createClient } = require('@supabase/supabase-js');

// Use environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mkrsejfgwvbnhohvojzn.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rcnNlamZnd3ZibmhvaHZvanotbiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzIxMDE3MjU5LCJleHAiOjIwMzY1OTMyNTl9.K4zUqN-3bvJ0cUZDqrFOJUXqWLfBjNaHDmQYQAGD7Y0';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key (first 20 chars):', supabaseKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('Testing basic Supabase connection...');
    
    // Test basic connectivity
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Auth error:', error);
    } else {
      console.log('✅ Basic connection successful');
    }

    // Try to list tables
    console.log('\nTesting table access...');
    const { data: tables, error: tablesError } = await supabase
      .from('pokemon')
      .select('*')
      .limit(1);
    
    if (tablesError) {
      console.error('❌ Table access error:', tablesError);
      console.log('This might mean the tables don\'t exist or RLS policies are blocking access');
    } else {
      console.log('✅ Table access successful');
      console.log('Sample data:', tables);
    }
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
  }
}

testConnection();
