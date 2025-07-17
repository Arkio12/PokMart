const { createClient } = require('@supabase/supabase-js');

// Using your actual Supabase credentials from .env.local
const supabaseUrl = 'https://mkrsejfgwvbnhohvojzn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rcnNlamZnd3ZibmhvaHZvanpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1Mzk2MTQsImV4cCI6MjA2ODExNTYxNH0.FU1018E7wrr-LWNn1SQBdcMTgF9j91JX98jNwC1cV_U';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key (first 20 chars):', supabaseKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...\n');
    
    // Test 1: Check if we can query the pokemon table
    console.log('1. Testing pokemon table access...');
    const { data: pokemon, error: pokemonError } = await supabase
      .from('pokemon')
      .select('id, name, stock_quantity, inStock')
      .limit(5);
    
    if (pokemonError) {
      console.error('❌ Pokemon table error:', pokemonError);
      return;
    }
    
    console.log('✅ Pokemon table access successful!');
    console.log('Sample Pokemon data:');
    pokemon.forEach(p => {
      console.log(`  - ${p.name}: stock_quantity=${p.stock_quantity}, inStock=${p.inStock}`);
    });
    
    // Test 2: Test the checkout scenario
    console.log('\n2. Testing checkout scenario...');
    
    // Find Blastoise
    const { data: blastoise, error: blastoiseError } = await supabase
      .from('pokemon')
      .select('*')
      .eq('name', 'Blastoise')
      .single();
    
    if (blastoiseError) {
      console.error('❌ Error finding Blastoise:', blastoiseError);
      return;
    }
    
    console.log('✅ Found Blastoise:');
    console.log(`  - Current stock: ${blastoise.stock_quantity}`);
    console.log(`  - In stock: ${blastoise.inStock}`);
    
    // Test 3: Simulate updating stock (like in checkout)
    console.log('\n3. Testing stock update...');
    const newStock = blastoise.stock_quantity - 1;
    const newInStockStatus = newStock > 0;
    
    const { data: updatedBlastoise, error: updateError } = await supabase
      .from('pokemon')
      .update({ 
        stock_quantity: newStock,
        inStock: newInStockStatus 
      })
      .eq('id', blastoise.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('❌ Error updating stock:', updateError);
      return;
    }
    
    console.log('✅ Stock update successful!');
    console.log(`  - New stock: ${updatedBlastoise.stock_quantity}`);
    console.log(`  - New in stock status: ${updatedBlastoise.inStock}`);
    
    // Test 4: Restore original stock
    console.log('\n4. Restoring original stock...');
    const { error: restoreError } = await supabase
      .from('pokemon')
      .update({ 
        stock_quantity: blastoise.stock_quantity,
        inStock: blastoise.inStock 
      })
      .eq('id', blastoise.id);
    
    if (restoreError) {
      console.error('❌ Error restoring stock:', restoreError);
      return;
    }
    
    console.log('✅ Stock restored successfully!');
    console.log('\n🎉 All tests passed! Your database is properly configured.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Only run if API keys are provided
if (supabaseUrl === 'YOUR_SUPABASE_URL_HERE' || supabaseKey === 'YOUR_SUPABASE_ANON_KEY_HERE') {
  console.log('❌ Please update the API keys in this file or set environment variables:');
  console.log('   - NEXT_PUBLIC_SUPABASE_URL');
  console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.log('\nYou can get these from your Supabase project dashboard → Settings → API');
} else {
  testDatabaseConnection();
}
