import { CartItem } from '@/types';

// Database operations for cart persistence
export async function saveCartToDatabase(userId: string, items: CartItem[]): Promise<void> {
  try {
    // Validate items before sending
    const validItems = items.filter(item => 
      item.pokemon && 
      item.pokemon.id && 
      item.pokemon.name && 
      typeof item.pokemon.price === 'number' && 
      typeof item.quantity === 'number' &&
      item.quantity > 0
    );
    
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        items: validItems,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to save cart: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    // Re-throw the error so the calling code can handle it
    throw error;
  }
}

export async function loadCartFromDatabase(userId: string): Promise<CartItem[]> {
  try {
    const url = `/api/cart?userId=${userId}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to load cart: ${response.status}`);
    }

    const data = await response.json();
    const items = data.items || [];
    return items;
  } catch (error) {
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
    // Silent error handling
  }
}
