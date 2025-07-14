// Debug script to test stock toggle functionality
// Run this with: node debug-stock.js

const testStockToggle = async () => {
  try {
    // First, get all Pokemon
    console.log('1. Fetching all Pokemon...');
    const response = await fetch('http://localhost:3000/api/pokemon');
    const pokemon = await response.json();
    
    if (!response.ok) {
      console.error('Failed to fetch Pokemon:', pokemon);
      return;
    }
    
    console.log(`Found ${pokemon.length} Pokemon`);
    
    if (pokemon.length === 0) {
      console.log('No Pokemon found. Please seed the database first.');
      return;
    }
    
    // Get the first Pokemon
    const firstPokemon = pokemon[0];
    console.log(`2. Testing with ${firstPokemon.name} (ID: ${firstPokemon.id})`);
    console.log(`   Current stock status: ${firstPokemon.inStock}`);
    
    // Toggle stock status
    console.log('3. Toggling stock status...');
    const toggleResponse = await fetch(`http://localhost:3000/api/pokemon/${firstPokemon.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inStock: !firstPokemon.inStock,
      }),
    });
    
    if (!toggleResponse.ok) {
      const errorText = await toggleResponse.text();
      console.error('Failed to toggle stock:', toggleResponse.status, errorText);
      return;
    }
    
    const updatedPokemon = await toggleResponse.json();
    console.log(`4. Stock toggled successfully!`);
    console.log(`   New stock status: ${updatedPokemon.inStock}`);
    
    // Verify by fetching again
    console.log('5. Verifying update by fetching again...');
    const verifyResponse = await fetch(`http://localhost:3000/api/pokemon/${firstPokemon.id}`);
    const verifiedPokemon = await verifyResponse.json();
    
    console.log(`6. Verification result:`);
    console.log(`   Stock status: ${verifiedPokemon.inStock}`);
    console.log(`   Update persisted: ${verifiedPokemon.inStock === updatedPokemon.inStock ? 'YES' : 'NO'}`);
    
  } catch (error) {
    console.error('Error during test:', error);
  }
};

// Only run if called directly
if (typeof window === 'undefined') {
  testStockToggle();
}
