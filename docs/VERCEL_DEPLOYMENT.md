# 🚀 Vercel Deployment Guide - Library Management System

Complete guide to deploying your Next.js library management system to Vercel with PostgreSQL database.

---

## 📋 Overview

Your app has two main components:
1. **Next.js Application** → Deploys to Vercel
2. **PostgreSQL Database** → Deploys separately (Vercel Postgres, Supabase, or other)

**They are NOT in the same directory/project** - The database is hosted separately and your app connects to it via connection string.

---

## 🗄️ Database Options

### **Option 1: Vercel Postgres (Recommended)**
- ✅ Integrated with Vercel
- ✅ Easy setup
- ✅ Free tier available
- ✅ Auto-scaling

### **Option 2: Supabase**
- ✅ Free tier (500MB)
- ✅ Full PostgreSQL features
- ✅ Built-in auth (optional)
- ✅ Good for production

### **Option 3: Railway**
- ✅ Simple setup
- ✅ Free tier
- ✅ PostgreSQL + Redis

### **Option 4: Neon**
- ✅ Serverless Postgres
- ✅ Free tier
- ✅ Auto-scaling

---

## 🚀 Deployment Steps

### **Step 1: Prepare Your Repository**

1. **Push to GitHub** (if not already):
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/library-management.git
git push -u origin main
```

2. **Ensure `.gitignore` includes**:
```
.env
.env.local
node_modules/
.next/
```

---

### **Step 2: Set Up Database (Vercel Postgres)**

#### **2.1: Create Vercel Postgres Database**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Choose a name: `library-management-db`
6. Select region (closest to your users)
7. Click **Create**

#### **2.2: Get Database Connection String**

After creation, you'll see:
- `POSTGRES_URL` - Full connection string
- `POSTGRES_PRISMA_URL` - Prisma-optimized URL
- `POSTGRES_URL_NON_POOLING` - Direct connection

**Copy these values** - you'll need them!

---

### **Step 3: Deploy to Vercel**

#### **3.1: Import Project**

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Click **Import Project**
3. Select your GitHub repository
4. Click **Import**

#### **3.2: Configure Project**

**Framework Preset**: Next.js (auto-detected)

**Root Directory**: `./` (leave as is)

**Build Command**: 
```bash
prisma generate && next build
```

**Install Command**:
```bash
npm install
```

---

### **Step 4: Environment Variables**

Add these environment variables in Vercel:

#### **Required Variables**:

```env
# Database (from Vercel Postgres)
DATABASE_URL="your-postgres-prisma-url-here"

# NextAuth
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="generate-a-random-secret-here"

# Google OAuth (if using)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

#### **How to Add in Vercel**:

1. In Vercel project settings
2. Go to **Environment Variables**
3. Add each variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Your Postgres Prisma URL
   - **Environments**: Production, Preview, Development
4. Click **Save**

#### **Generate NEXTAUTH_SECRET**:

Run locally:
```bash
openssl rand -base64 32
```

Or use online generator: https://generate-secret.vercel.app/32

---

### **Step 5: Run Database Migrations**

After deployment, you need to set up the database schema.

#### **Option A: Using Vercel CLI** (Recommended)

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Login**:
```bash
vercel login
```

3. **Link project**:
```bash
vercel link
```

4. **Pull environment variables**:
```bash
vercel env pull .env.local
```

5. **Run migrations**:
```bash
npx prisma migrate deploy
```

6. **Seed database** (optional):
```bash
npm run db:seed
```

#### **Option B: Using Prisma Studio**

1. Go to your Vercel Postgres dashboard
2. Click **Data** tab
3. Use the SQL editor to run migrations manually
4. Or use Prisma Studio:
```bash
npx prisma studio
```

---

### **Step 6: Verify Deployment**

1. **Check build logs** in Vercel dashboard
2. **Visit your app**: `https://your-app.vercel.app`
3. **Test features**:
   - Sign in
   - Browse books
   - Test AI features
   - Check database connection

---

## 📝 Environment File Changes

### **Local Development (.env)**

```env
# Database - Local PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/library_management"

# NextAuth - Local
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-local-secret"

# Google OAuth (same for both)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### **Production (Vercel Environment Variables)**

```env
# Database - Vercel Postgres
DATABASE_URL="postgres://default:xxx@xxx-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require&pgbouncer=true&connect_timeout=15"

# NextAuth - Production URL
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="different-production-secret"

# Google OAuth (same as local)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### **Key Differences**:

| Variable | Local | Production |
|----------|-------|------------|
| `DATABASE_URL` | localhost:5432 | Vercel Postgres URL |
| `NEXTAUTH_URL` | http://localhost:3000 | https://your-app.vercel.app |
| `NEXTAUTH_SECRET` | Local secret | Production secret (different!) |

---

## 🔧 Project Configuration Updates

### **1. Update `package.json`**

Ensure these scripts exist:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "postinstall": "prisma generate",
    "db:migrate": "prisma migrate deploy",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

### **2. Update `prisma/schema.prisma`**

Ensure connection pooling is configured:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // Optional: for migrations
}
```

### **3. Create `vercel.json`** (Optional)

```json
{
  "buildCommand": "prisma generate && next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

---

## 🎯 Complete Deployment Checklist

### **Before Deployment**:
- [ ] Code pushed to GitHub
- [ ] `.env` in `.gitignore`
- [ ] Database created (Vercel Postgres)
- [ ] Environment variables ready
- [ ] `NEXTAUTH_SECRET` generated

### **During Deployment**:
- [ ] Project imported to Vercel
- [ ] Environment variables added
- [ ] Build successful
- [ ] Database migrations run

### **After Deployment**:
- [ ] App accessible at Vercel URL
- [ ] Database connected
- [ ] Sign in works
- [ ] AI features work
- [ ] Seed data added (optional)

---

## 🔍 Troubleshooting

### **Build Fails**

**Error**: `Prisma Client not generated`
```bash
# Solution: Ensure postinstall script exists
"postinstall": "prisma generate"
```

**Error**: `DATABASE_URL not found`
```bash
# Solution: Add DATABASE_URL in Vercel environment variables
```

### **Database Connection Fails**

**Error**: `Can't reach database server`
```bash
# Solution: Check DATABASE_URL format
# Should include: ?sslmode=require&pgbouncer=true
```

**Error**: `Too many connections`
```bash
# Solution: Use POSTGRES_PRISMA_URL instead of POSTGRES_URL
# Prisma URL includes connection pooling
```

### **NextAuth Errors**

**Error**: `NEXTAUTH_URL not set`
```bash
# Solution: Add NEXTAUTH_URL in Vercel
NEXTAUTH_URL="https://your-app.vercel.app"
```

**Error**: `Invalid callback URL`
```bash
# Solution: Update Google OAuth settings
# Add: https://your-app.vercel.app/api/auth/callback/google
```

---

## 🌐 Google OAuth Setup for Production

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **Credentials**
4. Edit your OAuth 2.0 Client
5. Add **Authorized redirect URIs**:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```
6. Save

---

## 📊 Database Management

### **View Data**:
```bash
# Using Prisma Studio
npx prisma studio
```

### **Run Migrations**:
```bash
# Deploy migrations
npx prisma migrate deploy

# Create new migration
npx prisma migrate dev --name migration_name
```

### **Seed Database**:
```bash
# Seed production database
npm run db:seed
```

### **Backup Database**:
```bash
# Export data
pg_dump $DATABASE_URL > backup.sql

# Import data
psql $DATABASE_URL < backup.sql
```

---

## 🎉 Summary

### **What Happens**:

1. **Your Code** → Pushed to GitHub
2. **Vercel** → Builds and deploys Next.js app
3. **Database** → Hosted separately (Vercel Postgres)
4. **Connection** → App connects via `DATABASE_URL`

### **File Structure**:

```
Your Repository (GitHub)
├── app/
├── components/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── .env (gitignored)
├── .env.example (committed)
└── package.json

Vercel (Hosting)
├── Deployed App
└── Environment Variables

Vercel Postgres (Separate)
└── Database Tables
```

### **Environment Variables**:

**Local** (.env):
- `DATABASE_URL` → localhost
- `NEXTAUTH_URL` → localhost:3000

**Production** (Vercel):
- `DATABASE_URL` → Vercel Postgres URL
- `NEXTAUTH_URL` → your-app.vercel.app

---

## 🚀 Quick Deploy Commands

```bash
# 1. Push to GitHub
git push origin main

# 2. Deploy to Vercel (auto-deploys on push)
# Or manually:
vercel --prod

# 3. Run migrations
vercel env pull .env.local
npx prisma migrate deploy

# 4. Seed database (optional)
npm run db:seed
```

---

**Your app is now live! 🎉**

Visit: `https://your-app.vercel.app`
