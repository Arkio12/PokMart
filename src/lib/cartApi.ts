import { CartItem } from '@/types';

// Database operations for cart persistence
export async function saveCartToDatabase(userId: string, items: CartItem[]): Promise<void> {
  try {
    console.log('Saving cart to database:', { userId, itemCount: items.length, items });
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        items,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to save cart:', response.status, errorText);
      throw new Error(`Failed to save cart: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Cart saved successfully:', result);
  } catch (error) {
    console.error('Error saving cart to database:', error);
    // Don't throw the error to prevent breaking the UI
  }
}

export async function loadCartFromDatabase(userId: string): Promise<CartItem[]> {
  try {
    console.log('📥 Loading cart from database for user:', userId);
    const url = `/api/cart?userId=${userId}`;
    console.log('🔗 Fetching from URL:', url);
    
    const response = await fetch(url);
    console.log('📡 Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to load cart:', response.status, errorText);
      throw new Error(`Failed to load cart: ${response.status}`);
    }

    const data = await response.json();
    console.log('📦 Raw cart data received:', data);
    console.log('📦 Cart items array:', data.items);
    console.log('📦 Number of items:', data.items?.length || 0);
    
    const items = data.items || [];
    console.log('✅ Returning cart items:', items);
    return items;
  } catch (error) {
    console.error('❌ Error loading cart from database:', error);
    return [];
  }
}

export async function clearCartFromDatabase(userId: string): Promise<void> {
  try {
    const response = await fetch('/api/cart', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to clear cart');
    }
  } catch (error) {
    console.error('Error clearing cart from database:', error);
  }
}
