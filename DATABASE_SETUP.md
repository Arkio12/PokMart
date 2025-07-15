# Database Setup Guide

This guide will help you set up the database for your Pokemon E-commerce application both locally and on Vercel.

## Current Issue Fixed

The main issue was that SQLite databases don't work on Vercel's serverless environment. This has been resolved by:

1. ✅ Updated Prisma schema to use PostgreSQL for production
2. ✅ Created proper migrations for PostgreSQL
3. ✅ Updated Vercel configuration for database deployment
4. ✅ Added development scripts for both SQLite and PostgreSQL

## Local Development Setup

### Option 1: SQLite (Easiest for development)

1. Use the development SQLite database:
```bash
# Use the development schema with SQLite
npm run db:dev:sqlite

# Seed the database
npm run db:dev:seed
```

### Option 2: PostgreSQL (Matches production)

1. Install PostgreSQL locally
2. Create a database named `pokemon_ecommerce`
3. Update the `.env` file with your PostgreSQL connection string:
```
DATABASE_URL="postgresql://username:password@localhost:5432/pokemon_ecommerce"
```

4. Run migrations and seed:
```bash
npm run db:migrate
npm run db:seed
```

## Vercel Production Setup

### 1. Set up a PostgreSQL Database

Choose one of these options:

**Option A: Vercel Postgres (Recommended)**
- Go to your Vercel project dashboard
- Navigate to Storage tab
- Create a new Postgres database
- Vercel will automatically set the `DATABASE_URL` environment variable

**Option B: External PostgreSQL (Supabase, PlanetScale, etc.)**
- Create a PostgreSQL database on your preferred provider
- Copy the connection string
- Add it to your Vercel environment variables as `DATABASE_URL`

### 2. Environment Variables

Add these environment variables in your Vercel dashboard:

```
DATABASE_URL=your_postgresql_connection_string
PRISMA_GENERATE_DATAPROXY=true
```

### 3. Deploy

The deployment will automatically:
1. Generate Prisma client
2. Run database migrations
3. Build the Next.js application

## Database Schema

The database includes the following tables:
- `pokemon` - Store Pokemon data with stats
- `pokemon_types` - Pokemon type relationships
- `users` - User accounts
- `carts` - Shopping carts
- `cart_items` - Items in carts
- `orders` - Order history
- `order_items` - Items in orders

## Available Scripts

- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed the database with Pokemon data
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio
- `npm run db:migrate:prod` - Deploy migrations to production
- `npm run db:dev:sqlite` - Use SQLite for development
- `npm run db:dev:seed` - Seed SQLite development database

## Troubleshooting

### Local Development Issues

1. **PostgreSQL connection error**
   - Make sure PostgreSQL is running
   - Check your connection string in `.env`
   - Try using SQLite instead: `npm run db:dev:sqlite`

2. **Migration errors**
   - Reset the database: `npm run db:reset`
   - Push schema changes: `npm run db:push`

### Production Issues

1. **Database connection failed**
   - Verify `DATABASE_URL` is set correctly in Vercel
   - Check if your database allows connections from Vercel's IP ranges

2. **Migration failed during deployment**
   - Manually run migrations: `npx prisma migrate deploy`
   - Check database logs for specific errors

3. **Seeding failed**
   - The seed script will only run if the database is empty
   - Check if data already exists in the database

## Next Steps

1. **Set up your PostgreSQL database** (Vercel Postgres recommended)
2. **Add DATABASE_URL to Vercel environment variables**
3. **Redeploy your application**
4. **Verify the database is working** by checking the application

Your database should now be properly configured for both development and production!
