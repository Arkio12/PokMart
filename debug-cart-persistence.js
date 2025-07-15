// Debug script to test cart persistence
// Run this in the browser console to test cart functionality

console.log('🧪 Cart Persistence Debug Tool');
console.log('============================');

// Test 1: Check if user is logged in
function checkAuthState() {
  console.log('1. Checking authentication state...');
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    console.log('✅ User is logged in:', userData);
    return userData;
  } else {
    console.log('❌ No user found in localStorage');
    return null;
  }
}

// Test 2: Check cart API
async function testCartAPI(userId) {
  console.log('2. Testing cart API...');
  try {
    const response = await fetch(`/api/cart?userId=${userId}`);
    console.log('📡 Cart API Response Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Cart API working:', data);
      return data.items || [];
    } else {
      const errorText = await response.text();
      console.log('❌ Cart API failed:', errorText);
      return [];
    }
  } catch (error) {
    console.log('❌ Cart API error:', error);
    return [];
  }
}

// Test 3: Check localStorage fallback
function checkLocalStorage(userId) {
  console.log('3. Checking localStorage fallback...');
  const localCart = localStorage.getItem(`cart_${userId}`);
  if (localCart) {
    const items = JSON.parse(localCart);
    console.log('✅ Found cart in localStorage:', items);
    return items;
  } else {
    console.log('❌ No cart found in localStorage');
    return [];
  }
}

// Test 4: Test cart operations
async function testCartOperations(userId) {
  console.log('4. Testing cart operations...');
  
  // Test save
  const testItem = {
    id: 'test-item-' + Date.now(),
    pokemon: {
      id: 'test-pokemon',
      name: 'Test Pokemon',
      price: 10.99,
      image: '/test.jpg',
      description: 'Test description'
    },
    quantity: 1
  };
  
  try {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        items: [testItem]
      })
    });
    
    if (response.ok) {
      console.log('✅ Cart save test passed');
      
      // Test load
      const loadResponse = await fetch(`/api/cart?userId=${userId}`);
      if (loadResponse.ok) {
        const data = await loadResponse.json();
        console.log('✅ Cart load test passed:', data.items);
      } else {
        console.log('❌ Cart load test failed');
      }
    } else {
      console.log('❌ Cart save test failed');
    }
  } catch (error) {
    console.log('❌ Cart operations test error:', error);
  }
}

// Run all tests
async function runCartTests() {
  console.log('🚀 Starting cart persistence tests...');
  
  const user = checkAuthState();
  if (!user) {
    console.log('❌ Please log in first to test cart persistence');
    return;
  }
  
  const apiItems = await testCartAPI(user.id);
  const localItems = checkLocalStorage(user.id);
  
  console.log('📊 Summary:');
  console.log('- API items:', apiItems.length);
  console.log('- Local items:', localItems.length);
  
  await testCartOperations(user.id);
  
  console.log('✅ Cart persistence tests completed!');
}

// Export for use
window.debugCart = {
  runCartTests,
  checkAuthState,
  testCartAPI,
  checkLocalStorage,
  testCartOperations
};

console.log('💡 Available functions:');
console.log('- debugCart.runCartTests() - Run all tests');
console.log('- debugCart.checkAuthState() - Check if user is logged in');
console.log('- debugCart.testCartAPI(userId) - Test cart API');
console.log('- debugCart.checkLocalStorage(userId) - Check localStorage');
console.log('- debugCart.testCartOperations(userId) - Test cart operations');
