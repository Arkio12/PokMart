import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCart() {
  console.log('🛒 Seeding cart data...');

  // First, let's create a test user if one doesn't exist
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
    },
  });

  // Create a cart for the test user
  const cart = await prisma.cart.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
    },
  });

  // Get some Pokemon to add to cart
  const pokemon = await prisma.pokemon.findMany({
    take: 3,
  });

  if (pokemon.length > 0) {
    // Add some items to the cart
    for (let i = 0; i < pokemon.length; i++) {
      await prisma.cartItem.upsert({
        where: {
          cartId_pokemonId: {
            cartId: cart.id,
            pokemonId: pokemon[i].id,
          },
        },
        update: {
          quantity: i + 1, // Different quantities for testing
        },
        create: {
          cartId: cart.id,
          pokemonId: pokemon[i].id,
          quantity: i + 1,
        },
      });
    }

    console.log(`✅ Added ${pokemon.length} items to cart for user: ${testUser.email}`);
  } else {
    console.log('⚠️  No Pokemon found. Please run the main seed script first.');
  }
}

seedCart()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
