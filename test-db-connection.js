const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Try to count users
    const userCount = await prisma.user.count();
    console.log(`✅ User count: ${userCount}`);
    
    // Try to count pokemon
    const pokemonCount = await prisma.pokemon.count();
    console.log(`✅ Pokemon count: ${pokemonCount}`);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
