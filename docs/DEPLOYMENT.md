# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Production Database**: PostgreSQL database (recommended: Neon, Supabase, or Railway)
3. **Google OAuth Credentials**: Production OAuth app
4. **AI API Keys**: OpenAI or Anthropic (optional)

## Production Database Setup

### Option 1: Neon (Recommended)
```bash
# 1. Create account at https://neon.tech
# 2. Create new project
# 3. Copy connection string
# Format: postgresql://user:password@host/database?sslmode=require
```

### Option 2: Supabase
```bash
# 1. Create account at https://supabase.com
# 2. Create new project
# 3. Go to Settings > Database
# 4. Copy connection string (Transaction pooler)
```

### Option 3: Railway
```bash
# 1. Create account at https://railway.app
# 2. New Project > Provision PostgreSQL
# 3. Copy DATABASE_URL from variables
```

## Environment Variables

### Required Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# NextAuth
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Google OAuth (Production)
GOOGLE_CLIENT_ID="your-production-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-production-client-secret"
```

### Optional Variables

```bash
# AI Features
AI_PROVIDER="openai"  # or "claude"
OPENAI_API_KEY="sk-..."
# or
ANTHROPIC_API_KEY="sk-ant-..."
```

## Vercel Deployment Steps

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/library-management.git
git push -u origin main
```

### 2. Import to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### 3. Add Environment Variables
In Vercel dashboard:
1. Go to **Settings** > **Environment Variables**
2. Add all required variables (see above)
3. Set for **Production**, **Preview**, and **Development**

### 4. Run Database Migration
After first deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run migration
vercel env pull .env.production
npx prisma migrate deploy
```

Or use Vercel's built-in Postgres (if available):
```bash
vercel postgres create
```

### 5. Deploy
```bash
# Automatic deployment
git push origin main

# Or manual deployment
vercel --prod
```

## Google OAuth Setup for Production

### 1. Create Production OAuth App
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Authorized redirect URIs:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```
7. Copy **Client ID** and **Client Secret**

### 2. Update Environment Variables
Add to Vercel:
```bash
GOOGLE_CLIENT_ID="production-client-id"
GOOGLE_CLIENT_SECRET="production-client-secret"
NEXTAUTH_URL="https://your-app.vercel.app"
```

## Build Optimizations

### 1. Next.js Config
Already optimized in `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations enabled by default
  reactStrictMode: true,
  swcMinify: true,
}
```

### 2. Prisma Optimization
Add to `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma generate && next build"
  }
}
```

### 3. Image Optimization
If using images, add to `next.config.js`:
```javascript
images: {
  domains: ['lh3.googleusercontent.com'], // Google profile images
  formats: ['image/avif', 'image/webp'],
}
```

## Security Considerations

### 1. Environment Variables
✅ **Never commit `.env` files**
- Add to `.gitignore`:
  ```
  .env
  .env.local
  .env.production
  ```

### 2. NEXTAUTH_SECRET
Generate secure secret:
```bash
openssl rand -base64 32
```

### 3. Database Security
✅ Use SSL connections (included in connection strings)
✅ Enable connection pooling for serverless
✅ Set appropriate connection limits

### 4. API Rate Limiting
Consider adding rate limiting for production:
```bash
npm install @upstash/ratelimit @upstash/redis
```

### 5. CORS Configuration
Already handled by Next.js API routes.

### 6. Content Security Policy
Add to `next.config.js`:
```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
      ],
    },
  ];
}
```

## Post-Deployment Checklist

- [ ] Database migrations applied
- [ ] Environment variables set
- [ ] Google OAuth configured with production URL
- [ ] Test authentication flow
- [ ] Create initial ADMIN user
- [ ] Test book creation
- [ ] Test borrow/return flow
- [ ] Test AI features (if enabled)
- [ ] Monitor Vercel logs
- [ ] Set up error tracking (optional: Sentry)

## Creating First Admin User

After deployment, manually set first user as ADMIN:

### Option 1: Prisma Studio
```bash
npx prisma studio
# Navigate to User table
# Find your user (sign in first)
# Change role to ADMIN
```

### Option 2: Direct Database Query
```sql
UPDATE users 
SET role = 'ADMIN' 
WHERE email = 'your-email@example.com';
```

### Option 3: Database GUI
Use your database provider's GUI (Neon, Supabase, Railway)

## Monitoring & Maintenance

### Vercel Analytics
Enable in Vercel dashboard:
- **Analytics**: Track page views and performance
- **Speed Insights**: Monitor Core Web Vitals

### Database Monitoring
- Monitor connection pool usage
- Set up alerts for high query times
- Regular backups (automatic with Neon/Supabase)

### Logs
```bash
# View deployment logs
vercel logs

# View function logs
vercel logs --follow
```

## Troubleshooting

### Build Failures
```bash
# Check build logs in Vercel dashboard
# Common issues:
# - Missing environment variables
# - Prisma generation failed
# - TypeScript errors
```

### Database Connection Issues
```bash
# Verify DATABASE_URL format
# Check SSL mode: ?sslmode=require
# Verify database is accessible from Vercel
```

### OAuth Issues
```bash
# Verify NEXTAUTH_URL matches deployment URL
# Check Google OAuth redirect URIs
# Ensure NEXTAUTH_SECRET is set
```

## Scaling Considerations

### Database Connection Pooling
For serverless, use connection pooling:
```bash
# Neon provides automatic pooling
# Or use PgBouncer
DATABASE_URL="postgresql://user:password@pooler-host:5432/db"
```

### Caching Strategy
Consider adding Redis for:
- Session storage
- API response caching
- Rate limiting

### CDN Configuration
Vercel automatically provides:
- Edge caching
- Global CDN
- Automatic HTTPS

## Cost Optimization

### Vercel Free Tier Limits
- 100GB bandwidth/month
- Unlimited deployments
- Serverless function execution time limits

### Database Costs
- **Neon Free**: 0.5GB storage, 1 compute hour/day
- **Supabase Free**: 500MB database, 2GB bandwidth
- **Railway**: $5/month minimum

### AI API Costs
- **OpenAI**: Pay per token
- **Claude**: Pay per token
- Monitor usage in respective dashboards

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [NextAuth.js Deployment](https://next-auth.js.org/deployment)
