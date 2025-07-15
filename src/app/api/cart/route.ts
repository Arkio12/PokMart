import { NextRequest, NextResponse } from 'next/server';
import { supabaseHelpers } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    console.log('GET /api/cart - userId:', userId);

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Ensure user exists
    let user = await supabaseHelpers.getUserById(userId);
    if (!user) {
      console.log('User not found, creating user:', userId);
      user = await supabaseHelpers.createUser({
        id: userId,
        email: `user-${userId}@temp.com`,
        name: 'User',
      });
    }

    // Get cart items
    const cartItems = await supabaseHelpers.getCartItems(userId);

    // Transform cart items to match frontend format
    const items = cartItems.map(item => ({
      id: item.id,
      pokemon: item.pokemon,
      quantity: item.quantity,
    }));

    console.log('Returning cart items:', items.length);
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, items } = await request.json();

    console.log('POST /api/cart - userId:', userId, 'items:', items?.length);

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Validate items array
    if (items && !Array.isArray(items)) {
      return NextResponse.json({ error: 'Items must be an array' }, { status: 400 });
    }

    // Validate each item
    if (items) {
      for (const item of items) {
        if (!item.pokemon || !item.pokemon.id || !item.pokemon.name || typeof item.pokemon.price !== 'number' || typeof item.quantity !== 'number') {
          console.error('Invalid item:', item);
          return NextResponse.json({ error: 'Invalid item format' }, { status: 400 });
        }
      }
    }

    // Save cart using supabase helper
    await supabaseHelpers.saveCart(userId, items || []);

    console.log('Cart saved successfully for user:', userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving cart:', error);
    return NextResponse.json({ error: 'Failed to save cart', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Clear cart using supabase helper
    await supabaseHelpers.clearCart(userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
  }
}
