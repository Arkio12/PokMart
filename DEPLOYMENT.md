# Vercel Deployment Guide

## Current Issue
The app works locally but fails on Vercel due to database configuration mismatch.

## Root Cause
- **Local**: Uses SQLite (`file:./prisma/dev.db`)
- **Vercel**: Expects PostgreSQL but no database is configured

## Solutions

### Option 1: Set up PostgreSQL (Recommended)

1. **Create a PostgreSQL database:**
   - **Vercel Postgres**: Go to your Vercel dashboard → Storage → Create Database
   - **Alternative**: Use Railway, Supabase, or PlanetScale

2. **Set Environment Variables in Vercel:**
   - Go to your Vercel dashboard
   - Navigate to Settings → Environment Variables
   - Add these variables:
     ```
     DATABASE_URL=postgresql://username:password@host:port/database
     NEXTAUTH_SECRET=your-production-secret
     NEXTAUTH_URL=https://your-app.vercel.app
     ```

3. **Run migrations on production database:**
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

### Option 2: Use SQLite on Vercel (Not Recommended)

1. Change `prisma/schema.prisma` datasource to:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. Set `DATABASE_URL="file:./prisma/prod.db"` in Vercel environment variables

## After Setup

1. Commit and push changes
2. Vercel will automatically redeploy
3. Check deployment logs for any remaining issues

## Troubleshooting

- Check Vercel Function logs for specific errors
- Ensure all environment variables are set
- Verify database connection string is correct
- Make sure migrations are applied to production database
