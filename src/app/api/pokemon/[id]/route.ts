import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const pokemon = await prisma.pokemon.findUnique({
      where: { id: params.id },
      include: {
        types: true,
      },
    });

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
      type: pokemon.types.map((t) => t.type),
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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { name, image, price, description, inStock, featured, hp, attack, defense, speed, types } = body;

    console.log(`Updating Pokemon ${params.id} with data:`, { inStock, ...body });

    // First, check if the Pokemon exists
    const existingPokemon = await prisma.pokemon.findUnique({
      where: { id: params.id },
    });

    if (!existingPokemon) {
      console.error(`Pokemon with id ${params.id} not found`);
      return NextResponse.json(
        { error: 'Pokemon not found' },
        { status: 404 }
      );
    }

    // First, delete existing types if types are being updated
    if (types) {
      await prisma.pokemonType.deleteMany({
        where: { pokemonId: params.id },
      });
    }

    // Build the update data object dynamically
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (image !== undefined) updateData.image = image;
    if (price !== undefined) updateData.price = price;
    if (description !== undefined) updateData.description = description;
    if (inStock !== undefined) updateData.inStock = inStock;
    if (featured !== undefined) updateData.featured = featured;
    if (hp !== undefined) updateData.hp = hp;
    if (attack !== undefined) updateData.attack = attack;
    if (defense !== undefined) updateData.defense = defense;
    if (speed !== undefined) updateData.speed = speed;

    // Add types if provided
    if (types) {
      updateData.types = {
        create: types.map((type: string) => ({ type })),
      };
    }

    console.log('Update data:', updateData);

    // Update the pokemon
    const pokemon = await prisma.pokemon.update({
      where: { id: params.id },
      data: updateData,
      include: {
        types: true,
      },
    });

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
      type: pokemon.types.map((t) => t.type),
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
      { error: 'Failed to update Pokemon', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.pokemon.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Pokemon deleted successfully' });
  } catch (error) {
    console.error('Error deleting Pokemon:', error);
    return NextResponse.json(
      { error: 'Failed to delete Pokemon' },
      { status: 500 }
    );
  }
}
