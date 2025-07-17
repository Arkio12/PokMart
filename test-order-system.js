// Simple test script to verify the order system works
// Run this with: node test-order-system.js

async function testOrderSystem() {
  const baseUrl = 'http://localhost:3000'; // Adjust if your app runs on a different port
  
  console.log('Testing Order System...\n');
  
  try {
    // Test 1: Create a test order by simulating checkout
    console.log('1. Testing checkout API...');
    const checkoutResponse = await fetch(`${baseUrl}/api/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'test-user-123',
        items: [
          {
            pokemon: {
              id: 'pikachu',
              name: 'Pikachu',
              price: 49.99
            },
            quantity: 1
          }
        ]
      })
    });
    
    const checkoutData = await checkoutResponse.json();
    console.log('Checkout response:', checkoutData);
    
    // Test 2: Fetch all orders
    console.log('\n2. Testing orders API...');
    const ordersResponse = await fetch(`${baseUrl}/api/orders`);
    const ordersData = await ordersResponse.json();
    console.log('Orders response:', ordersData);
    
    // Test 3: Get order stats
    console.log('\n3. Testing order stats API...');
    const statsResponse = await fetch(`${baseUrl}/api/orders/stats`);
    const statsData = await statsResponse.json();
    console.log('Stats response:', statsData);
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testOrderSystem();
