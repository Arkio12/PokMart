const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mkrsejfgwvbnhohvojzn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rcnNlamZnd3ZibmhvaHZvanpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1Mzk2MTQsImV4cCI6MjA2ODExNTYxNH0.FU1018E7wrr-LWNn1SQBdcMTgF9j91JX98jNwC1cV_U';

console.log('Testing API key validity...');
console.log('URL:', supabaseUrl);
console.log('Key (first 50 chars):', supabaseKey.substring(0, 50) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testApiKey() {
  try {
    // Test 1: Basic connection
    console.log('\n1. Testing basic connection...');
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.log('❌ Session error:', sessionError);
    } else {
      console.log('✅ Basic connection works');
    }

    // Test 2: Try to access a simple system table
    console.log('\n2. Testing system table access...');
    const { data: info, error: infoError } = await supabase
      .rpc('version');
    
    if (infoError) {
      console.log('❌ System table error:', infoError);
    } else {
      console.log('✅ System access works');
    }

    // Test 3: Try to list tables
    console.log('\n3. Testing table listing...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(5);
    
    if (tablesError) {
      console.log('❌ Tables listing error:', tablesError);
    } else {
      console.log('✅ Table listing works, found tables:', tables);
    }

    // Test 4: Try to access pokemon table
    console.log('\n4. Testing pokemon table access...');
    const { data: pokemon, error: pokemonError } = await supabase
      .from('pokemon')
      .select('id, name')
      .limit(1);
    
    if (pokemonError) {
      console.log('❌ Pokemon table error:', pokemonError);
      console.log('This might mean:');
      console.log('- Tables were not created successfully');
      console.log('- RLS policies are blocking access');
      console.log('- API key lacks permissions');
    } else {
      console.log('✅ Pokemon table access works:', pokemon);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testApiKey();
