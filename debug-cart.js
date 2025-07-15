// Debug script for cart persistence
// Run this in browser console to test cart functionality

console.log('=== Cart Persistence Debug Script ===');

// Function to test cart API directly
async function testCartAPI() {
  const userId = 'test-user-123';
  
  console.log('1. Testing cart load...');
  try {
    const loadResponse = await fetch(`/api/cart?userId=${userId}`);
    const loadData = await loadResponse.json();
    console.log('Load response:', loadData);
  } catch (error) {
    console.error('Load error:', error);
  }
  
  console.log('2. Testing cart save...');
  try {
    const saveResponse = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        items: [
          {
            id: 'test-item-1',
            pokemon: {
              id: 'test-pokemon-1',
              name: 'Test Pokemon',
              price: 10.99,
              image: 'test.jpg',
              description: 'Test description',
              inStock: true,
              featured: false,
              hp: 100,
              attack: 50,
              defense: 50,
              speed: 50,
              types: []
            },
            quantity: 1
          }
        ]
      }),
    });
    const saveData = await saveResponse.json();
    console.log('Save response:', saveData);
  } catch (error) {
    console.error('Save error:', error);
  }
  
  console.log('3. Testing cart load after save...');
  try {
    const loadResponse2 = await fetch(`/api/cart?userId=${userId}`);
    const loadData2 = await loadResponse2.json();
    console.log('Load after save response:', loadData2);
  } catch (error) {
    console.error('Load after save error:', error);
  }
}

// Function to check current user and cart state
function checkCartState() {
  // Check localStorage for user
  const user = localStorage.getItem('user');
  console.log('Current user in localStorage:', user ? JSON.parse(user) : null);
  
  // Check if cart context is available
  if (window.React && window.React.useContext) {
    console.log('React context available');
  }
}

// Run tests
checkCartState();
testCartAPI();

console.log('=== Debug script complete ===');
