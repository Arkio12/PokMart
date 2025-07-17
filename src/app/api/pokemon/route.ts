import { supabaseHelpers } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Fetching Pokemon from database...');
    const pokemon = await supabaseHelpers.getAllPokemon();

    console.log(`Found ${pokemon.length} Pokemon in database`);
    
    // Transform the data to match your existing Pokemon interface
    const transformedPokemon = pokemon.map((p: any) => ({
      id: p.id,
      name: p.name,
      image: p.image,
      price: p.price,
      description: p.description,
      inStock: p.inStock,
      featured: p.featured,
      hidden: p.hidden || false,
      stock_quantity: p.stock_quantity,
      type: p.types?.map((t: any) => t.type) || [],
      stats: {
        hp: p.hp,
        attack: p.attack,
        defense: p.defense,
        speed: p.speed,
      },
    }));

    console.log('Transformed Pokemon data for API response');
    return NextResponse.json(transformedPokemon);
  } catch (error) {
    console.error('Error fetching Pokemon:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Pokemon' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, image, price, description, inStock, featured, hp, attack, defense, speed, types } = body;

    const pokemon = await supabaseHelpers.createPokemon({
      name,
      image,
      price,
      description,
      inStock: inStock ?? true,
      featured: featured ?? false,
      hp,
      attack,
      defense,
      speed,
      types: types || [],
    });

    return NextResponse.json(pokemon);
  } catch (error) {
    console.error('Error creating Pokemon:', error);
    return NextResponse.json(
      { error: 'Failed to create Pokemon' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, image, price, description, inStock, featured, hidden, hp, attack, defense, speed, types } = body;

    const pokemon = await supabaseHelpers.updatePokemon(id, {
      name,
      image,
      price,
      description,
      inStock,
      featured,
      hidden,
      hp,
      attack,
      defense,
      speed,
      types: types || [],
    });

    return NextResponse.json(pokemon);
  } catch (error) {
    console.error('Error updating Pokemon:', error);
    return NextResponse.json(
      { error: 'Failed to update Pokemon' },
      { status: 500 }
    );
  }
}
