import { supabaseHelpers } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const pokemon = await supabaseHelpers.getPokemonById(id);

    if (!pokemon) {
      return NextResponse.json(
        { error: 'Pokemon not found' },
        { status: 404 }
      );
    }

    // Transform the data to match your existing Pokemon interface
    const transformedPokemon = {
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.image,
      price: pokemon.price,
      description: pokemon.description,
      inStock: pokemon.inStock,
      featured: pokemon.featured,
      hidden: pokemon.hidden || false,
      type: pokemon.types?.map((t: any) => t.type) || [],
      stats: {
        hp: pokemon.hp,
        attack: pokemon.attack,
        defense: pokemon.defense,
        speed: pokemon.speed,
      },
    };

    return NextResponse.json(transformedPokemon);
  } catch (error) {
    console.error('Error fetching Pokemon:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Pokemon' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, image, price, description, inStock, featured, hidden, hp, attack, defense, speed, types } = body;

    console.log(`Updating Pokemon ${id} with data:`, { inStock, hidden, ...body });

    // First, check if the Pokemon exists
    const existingPokemon = await supabaseHelpers.getPokemonById(id);

    if (!existingPokemon) {
      console.error(`Pokemon with id ${id} not found`);
      return NextResponse.json(
        { error: 'Pokemon not found' },
        { status: 404 }
      );
    }

    // Build the update data object dynamically
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (image !== undefined) updateData.image = image;
    if (price !== undefined) updateData.price = price;
    if (description !== undefined) updateData.description = description;
    if (inStock !== undefined) updateData.inStock = inStock;
    if (featured !== undefined) updateData.featured = featured;
    if (hidden !== undefined) updateData.hidden = hidden;
    if (hp !== undefined) updateData.hp = hp;
    if (attack !== undefined) updateData.attack = attack;
    if (defense !== undefined) updateData.defense = defense;
    if (speed !== undefined) updateData.speed = speed;
    if (types !== undefined) updateData.types = types;
    
    // Handle stock_quantity field
    if (body.stock_quantity !== undefined) {
      updateData.stock_quantity = body.stock_quantity;
    }

    console.log('Update data:', updateData);

    // Update the pokemon using Supabase
    const pokemon = await supabaseHelpers.updatePokemon(id, updateData);

    console.log('Pokemon updated successfully:', pokemon);

    // Transform the data to match your existing Pokemon interface
    const transformedPokemon = {
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.image,
      price: pokemon.price,
      description: pokemon.description,
      inStock: pokemon.inStock,
      featured: pokemon.featured,
      hidden: pokemon.hidden || false,
      type: pokemon.types?.map((t: any) => t.type) || [],
      stats: {
        hp: pokemon.hp,
        attack: pokemon.attack,
        defense: pokemon.defense,
        speed: pokemon.speed,
      },
    };

    return NextResponse.json(transformedPokemon);
  } catch (error) {
    console.error('Error updating Pokemon:', error);
    return NextResponse.json(
      { error: 'Failed to update Pokemon', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await supabaseHelpers.deletePokemon(id);

    return NextResponse.json({ message: 'Pokemon deleted successfully' });
  } catch (error) {
    console.error('Error deleting Pokemon:', error);
    return NextResponse.json(
      { error: 'Failed to delete Pokemon' },
      { status: 500 }
    );
  }
}
