const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mkrsejfgwvbnhohvojzn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rcnNlamZnd3ZibmhvaHZvanotbiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzIxMDE3MjU5LCJleHAiOjIwMzY1OTMyNTl9.K4zUqN-3bvJ0cUZDqrFOJUXqWLfBjNaHDmQYQAGD7Y0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase.from('pokemon').select('*').limit(1);
    
    if (error) {
      console.error('Error connecting to Supabase:', error);
      
      // Try to check if tables exist
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (tablesError) {
        console.error('Cannot check tables:', tablesError);
      } else {
        console.log('Available tables:', tables);
      }
    } else {
      console.log('✅ Connection successful!');
      console.log('Sample data:', data);
    }
  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

testConnection();
