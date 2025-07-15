const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function deployDatabase() {
  try {
    console.log('🚀 Starting database deployment...');
    
    // Run migrations
    console.log('📦 Running database migrations...');
    await execAsync('npx prisma migrate deploy');
    console.log('✅ Migrations completed successfully');
    
    // Check if database needs seeding
    const { stdout } = await execAsync('npx prisma db seed --preview-feature');
    console.log('🌱 Database seeding result:', stdout);
    
    console.log('🎉 Database deployment completed successfully!');
  } catch (error) {
    console.error('❌ Database deployment failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  deployDatabase();
}

module.exports = deployDatabase;
