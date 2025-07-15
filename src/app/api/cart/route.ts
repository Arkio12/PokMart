import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    console.log('GET /api/cart - userId:', userId);

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // First ensure the user exists in database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.log('User not found, creating user:', userId);
      await prisma.user.create({
        data: {
          id: userId,
          email: `user-${userId}@temp.com`, // Temporary email
          name: 'User', // Temporary name
        },
      });
    }

    // Get or create cart for user
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            pokemon: true,
          },
        },
      },
    });

    if (!cart) {
      console.log('Cart not found, creating cart for user:', userId);
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              pokemon: true,
            },
          },
        },
      });
    }

    // Transform cart items to match frontend format
    const items = cart.items.map(item => ({
      id: item.id,
      pokemon: item.pokemon,
      quantity: item.quantity,
    }));

    console.log('Returning cart items:', items.length);
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart', details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, items } = await request.json();

    console.log('POST /api/cart - userId:', userId, 'items:', items?.length);

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // First ensure the user exists in database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.log('User not found, creating user:', userId);
      await prisma.user.create({
        data: {
          id: userId,
          email: `user-${userId}@temp.com`, // Temporary email
          name: 'User', // Temporary name
        },
      });
    }

    // Get or create cart for user
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      console.log('Cart not found, creating cart for user:', userId);
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Clear existing cart items
    console.log('Clearing existing cart items for cart:', cart.id);
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // Add new cart items
    if (items && items.length > 0) {
      console.log('Adding new cart items:', items.length);
      const cartItemsData = items.map((item: any) => ({
        cartId: cart.id,
        pokemonId: item.pokemon.id,
        quantity: item.quantity,
      }));
      
      console.log('Cart items data:', cartItemsData);
      
      await prisma.cartItem.createMany({
        data: cartItemsData,
      });
    }

    console.log('Cart saved successfully for user:', userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving cart:', error);
    return NextResponse.json({ error: 'Failed to save cart', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Find cart for user
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (cart) {
      // Clear all cart items
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
  }
}
