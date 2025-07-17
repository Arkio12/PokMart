import { supabaseHelpers } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId, items } = await request.json();

    if (!userId || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    console.log('Processing checkout for user:', userId);
    console.log('Items:', items);

    // Step 1: Validate stock availability for all items
    const stockValidation = [];
    for (const item of items) {
      const pokemon = await supabaseHelpers.getPokemonById(item.pokemon.id);
      if (!pokemon) {
        return NextResponse.json(
          { error: `Pokemon ${item.pokemon.name} not found` },
          { status: 404 }
        );
      }

      const currentStock = pokemon.stock_quantity || 0;
      const requestedQuantity = item.quantity;

      if (currentStock < requestedQuantity) {
        return NextResponse.json(
          { 
            error: `Insufficient stock for ${pokemon.name}. Available: ${currentStock}, Requested: ${requestedQuantity}`,
            insufficientStock: true,
            item: pokemon.name,
            available: currentStock,
            requested: requestedQuantity
          },
          { status: 400 }
        );
      }

      stockValidation.push({
        pokemonId: pokemon.id,
        currentStock,
        requestedQuantity,
        newStock: currentStock - requestedQuantity
      });
    }

    // Step 2: Process the checkout (decrease stock quantities)
    const updatedItems = [];
    for (const validation of stockValidation) {
      const newStock = validation.newStock;
      const newInStockStatus = newStock > 0;

      console.log(`Updating ${validation.pokemonId}: ${validation.currentStock} -> ${newStock}`);

      // Update the stock quantity and in-stock status
      const updatedPokemon = await supabaseHelpers.updatePokemon(validation.pokemonId, {
        stock_quantity: newStock,
        inStock: newInStockStatus
      });

      updatedItems.push({
        id: validation.pokemonId,
        name: updatedPokemon.name,
        previousStock: validation.currentStock,
        newStock: newStock,
        quantityPurchased: validation.requestedQuantity
      });
    }

    // Step 3: Calculate total amount
    const total = items.reduce((sum, item) => sum + (item.pokemon.price * item.quantity), 0);

    // Step 4: Create order record
    const order = await supabaseHelpers.createOrder({
      userId,
      items,
      total,
      status: 'processing'
    });

    // Step 5: Clear the user's cart after successful checkout
    await supabaseHelpers.clearCart(userId);

    console.log('Checkout completed successfully');
    console.log('Order created:', order);
    console.log('Updated items:', updatedItems);

    return NextResponse.json({
      success: true,
      message: 'Checkout completed successfully',
      orderId: order.id,
      total: total,
      itemsUpdated: updatedItems.length,
      stockUpdates: updatedItems
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { 
        error: 'Checkout failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
