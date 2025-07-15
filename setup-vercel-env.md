# Vercel Environment Variables Setup

## Step 1: Create a PostgreSQL Database

### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project "PokMart"
3. Go to "Storage" tab
4. Click "Create Database"
5. Choose "Postgres"
6. Follow the setup wizard

### Option B: External PostgreSQL (Alternative)
- **Railway**: https://railway.app/
- **Supabase**: https://supabase.com/
- **PlanetScale**: https://planetscale.com/

## Step 2: Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your "PokMart" project
3. Go to "Settings" → "Environment Variables"
4. Add these variables:

### Required Variables:
```
DATABASE_URL
Value: postgresql://username:password@host:port/database
(Get this from your PostgreSQL provider)

NEXTAUTH_SECRET
Value: your-super-secret-production-key-here
(Generate a random 32+ character string)

NEXTAUTH_URL
Value: https://your-app.vercel.app
(Replace with your actual Vercel app URL)

NODE_ENV
Value: production
```

### Database Connection Fix:
If you're getting "prisma://" protocol errors, you need to:

1. **Use Regular PostgreSQL URL Format:**
   ```
   DATABASE_URL=postgresql://username:password@host:port/database
   ```
   
2. **NOT the Prisma format:**
   ```
   DATABASE_URL=prisma://...
   ```

3. **For Vercel Postgres:**
   - Go to Vercel Dashboard → Storage → Create Database
   - Copy the "Connection String" (not the "Prisma URL")
   - Use the regular PostgreSQL connection string

### Optional Variables:
```
NEXT_PUBLIC_APP_URL
Value: https://your-app.vercel.app
(Same as NEXTAUTH_URL)
```

## Step 3: Apply Database Migrations

After setting up the database and environment variables:

1. Install Vercel CLI (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Link your project:
   ```bash
   vercel link
   ```

4. Pull environment variables locally:
   ```bash
   vercel env pull .env.production
   ```

5. Run migrations on production database:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

## Step 4: Deploy

1. Push your changes:
   ```bash
   git add .
   git commit -m "Update environment configuration"
   git push origin main
   ```

2. Vercel will automatically redeploy

## Troubleshooting

- If you get database connection errors, verify your DATABASE_URL is correct
- Check Vercel Function logs for specific error messages
- Ensure all environment variables are set in the Vercel dashboard
- Make sure your PostgreSQL database is accessible from Vercel's servers
