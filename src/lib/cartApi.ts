import { CartItem } from '@/types';

// Database operations for cart persistence
export async function saveCartToDatabase(userId: string, items: CartItem[]): Promise<void> {
  try {
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
      throw new Error('Failed to save cart');
    }
  } catch (error) {
    console.error('Error saving cart to database:', error);
  }
}

export async function loadCartFromDatabase(userId: string): Promise<CartItem[]> {
  try {
    const response = await fetch(`/api/cart?userId=${userId}`);

    if (!response.ok) {
      throw new Error('Failed to load cart');
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error loading cart from database:', error);
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
