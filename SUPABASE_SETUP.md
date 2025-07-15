# Supabase Setup Guide

## Problem
Your application is currently configured to use Supabase, but the API keys are invalid, which is causing the "Failed to update stock status" error in the inventory management.

## Solution
You need to either create a new Supabase project or get the correct API keys from your existing project.

## Steps to Fix

### Option 1: Create a New Supabase Project

1. **Go to [Supabase](https://supabase.com)**
2. **Sign up/Login** to your account
3. **Create a new project**
   - Click "New Project"
   - Choose an organization
   - Name your project (e.g., "pokemon-ecommerce")
   - Set a strong database password
   - Choose a region close to you
   - Click "Create new project"

4. **Wait for the project to initialize** (this takes a few minutes)

5. **Get your API keys**
   - Go to Settings → API
   - Copy the "Project URL" and "anon public" key

6. **Set up the database schema**
   - Go to SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase-schema.sql`
   - Run the query to create tables and sample data

7. **Update your environment variables**
   - Update your `.env` file with the new values:
   ```
   NEXT_PUBLIC_SUPABASE_URL="your-project-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   ```

### Option 2: Get Keys from Existing Project

If you already have a Supabase project:

1. **Login to Supabase**
2. **Find your project**
3. **Go to Settings → API**
4. **Copy the Project URL and anon public key**
5. **Update your `.env` file**

## Testing the Connection

After updating your environment variables:

1. **Test the connection**:
   ```bash
   node test-supabase-connection.js
   ```

2. **If successful, restart your development server**:
   ```bash
   npm run dev
   ```

## Database Schema

The `supabase-schema.sql` file contains:
- **Tables**: pokemon, pokemon_types, users, cart_items, orders, order_items
- **Sample data**: 8 Pokemon with types
- **Policies**: For anonymous access (development mode)
- **Triggers**: For automatic timestamp updates

## Current Environment Variables

Your `.env` file should look like this:
```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="your-actual-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-actual-anon-key"

# Database Configuration (commented out for Supabase)
# DATABASE_URL="file:./prisma/dev.db"
```

## Files Updated

The following files have been updated to use Supabase instead of Prisma:
- `src/app/api/pokemon/[id]/route.ts` - Individual Pokemon operations
- `src/app/api/pokemon/route.ts` - Already using Supabase
- `src/app/api/users/route.ts` - Already using Supabase
- `src/app/api/cart/route.ts` - Already using Supabase

## Next Steps

1. Set up your Supabase project
2. Run the schema SQL
3. Update your environment variables
4. Test the connection
5. Restart your development server
6. Try the inventory management again

The inventory management should now work correctly with the "Mark In Stock" / "Mark Out of Stock" buttons.
