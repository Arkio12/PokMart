const { createClient } = require('@supabase/supabase-js');

// Use the same values as in your .env file
const supabaseUrl = 'https://mkrsejfgwvbnhohvojzn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rcnNlamZnd3ZibmhvaHZvanotbiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzIxMDE3MjU5LCJleHAiOjIwMzY1OTMyNTl9.K4zUqN-3bvJ0cUZDqrFOJUXqWLfBjNaHDmQYQAGD7Y0';

async function testSupabaseConnection() {
  console.log('🔗 Testing Supabase connection...\n');
  
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test connection by listing tables
    console.log('📊 Testing database connection...');
    const { data: tables, error } = await supabase
      .from('pokemon')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Connection failed:', error.message);
      console.log('Error details:', error);
      return;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('📋 Sample data:', tables);
    
    // Test all tables
    console.log('\n🔍 Testing all tables...');
    const tablesToTest = ['pokemon', 'pokemon_types', 'users', 'cart_items'];
    
    for (const table of tablesToTest) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ ${table}: ${error.message}`);
        } else {
          console.log(`✅ ${table}: OK (${data?.length || 0} rows)`);
        }
      } catch (err) {
        console.log(`❌ ${table}: ${err.message}`);
      }
    }
    
  } catch (err) {
    console.log('❌ Connection error:', err.message);
  }
}

testSupabaseConnection();
