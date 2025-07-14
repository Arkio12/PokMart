import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const pokemon = await prisma.pokemon.findMany({
      include: {
        types: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the data to match your existing Pokemon interface
    const transformedPokemon = pokemon.map((p) => ({
      id: p.id,
      name: p.name,
      image: p.image,
      price: p.price,
      description: p.description,
      inStock: p.inStock,
      featured: p.featured,
      type: p.types.map((t) => t.type),
      stats: {
        hp: p.hp,
        attack: p.attack,
        defense: p.defense,
        speed: p.speed,
      },
    }));

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

    const pokemon = await prisma.pokemon.create({
      data: {
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
        types: {
          create: types.map((type: string) => ({ type })),
        },
      },
      include: {
        types: true,
      },
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
    const { id, name, image, price, description, inStock, featured, hp, attack, defense, speed, types } = body;

    // First, delete existing types
    await prisma.pokemonType.deleteMany({
      where: { pokemonId: id },
    });

    // Then update the pokemon with new data
    const pokemon = await prisma.pokemon.update({
      where: { id },
      data: {
        name,
        image,
        price,
        description,
        inStock,
        featured,
        hp,
        attack,
        defense,
        speed,
        types: {
          create: types.map((type: string) => ({ type })),
        },
      },
      include: {
        types: true,
      },
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
