# Vercel Deployment Guide for Mosque Donation Project

This guide will help you deploy the mosque donation project to Vercel with PostgreSQL database and Cloudinary for file uploads.

## Prerequisites

1. **GitHub Account** - Your project should be pushed to GitHub
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **PostgreSQL Database** - We recommend [Supabase](https://supabase.com) (free tier available)
4. **Cloudinary Account** - Sign up at [cloudinary.com](https://cloudinary.com) (free tier available)

## Step 1: Setup PostgreSQL Database (Supabase)

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up with your GitHub account
   - Create a new project

2. **Get Database URL**
   - In your Supabase dashboard, go to Settings → Database
   - Copy the "URI" connection string (it looks like: `postgresql://...`)
   - Save this for later as `DATABASE_URL`

## Step 2: Setup Cloudinary for File Uploads

1. **Create Cloudinary Account**
   - Go to [cloudinary.com](https://cloudinary.com)
   - Sign up for a free account
   - Go to your Dashboard

2. **Get API Credentials**
   - Copy your `Cloud Name`
   - Copy your `API Key`  
   - Copy your `API Secret`
   - Save these for environment variables

## Step 3: Prepare Your Project

1. **Update Environment Variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your values:
   ```env
   # Database (PostgreSQL)
   DATABASE_URL="postgresql://your-supabase-url"
   
   # NextAuth
   NEXTAUTH_URL="https://your-project.vercel.app"
   NEXTAUTH_SECRET="generate-a-32-character-secret-key"
   
   # Admin Credentials
   ADMIN_EMAIL="admin@mosque.com"
   ADMIN_PASSWORD="your-secure-password"
   
   # Site Configuration  
   NEXT_PUBLIC_SITE_URL="https://your-project.vercel.app"
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   ```

2. **Generate a Strong Secret**
   ```bash
   # Generate a secure 32-character secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Test Build Locally**
   ```bash
   npm run build
   ```

## Step 4: Push to GitHub

1. **Initialize Git** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub Repository**
   - Go to [github.com](https://github.com)
   - Create a new repository
   - Follow the instructions to push your code

3. **Push Code**
   ```bash
   git remote add origin https://github.com/yourusername/mosque-donation.git
   git branch -M main
   git push -u origin main
   ```

## Step 5: Deploy to Vercel

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the mosque-donation repository

2. **Configure Environment Variables**
   In Vercel project settings, add these environment variables:
   
   ```
   DATABASE_URL = postgresql://your-supabase-connection-string
   NEXTAUTH_URL = https://your-project.vercel.app
   NEXTAUTH_SECRET = your-32-character-secret
   ADMIN_EMAIL = admin@mosque.com
   ADMIN_PASSWORD = your-secure-password
   NEXT_PUBLIC_SITE_URL = https://your-project.vercel.app
   CLOUDINARY_CLOUD_NAME = your-cloud-name
   CLOUDINARY_API_KEY = your-api-key
   CLOUDINARY_API_SECRET = your-api-secret
   NODE_ENV = production
   ```

3. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

## Step 6: Setup Database Schema

1. **Install Prisma CLI Locally**
   ```bash
   npm install -g prisma
   ```

2. **Deploy Database Schema**
   ```bash
   # Set your database URL temporarily
   export DATABASE_URL="your-postgresql-connection-string"
   
   # Push schema to database
   npx prisma db push
   
   # Generate Prisma client
   npx prisma generate
   ```

3. **Create Initial Admin User** (Optional)
   You can create the admin user through the Supabase dashboard or via Prisma Studio:
   ```bash
   npx prisma studio
   ```

## Step 7: Update Domain Settings

1. **Custom Domain** (Optional)
   - In Vercel project settings, go to "Domains"
   - Add your custom domain
   - Update `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to use your domain

2. **Update Environment Variables**
   - Replace all `your-project.vercel.app` URLs with your actual domain

## Step 8: Test Your Deployment

1. **Visit Your Site**
   - Go to `https://your-project.vercel.app`
   - Test the landing page
   - Test admin login at `/admin/login`

2. **Test File Uploads**
   - Login to admin panel
   - Try uploading images
   - Verify they appear on the landing page

3. **Test Database Operations**
   - Update mosque content
   - Add progress images
   - Test donation functionality

## Troubleshooting

### Common Issues

1. **Build Fails**
   ```bash
   # Check build logs in Vercel dashboard
   # Common fixes:
   - Ensure all environment variables are set
   - Check TypeScript errors
   - Verify Prisma schema
   ```

2. **Database Connection Issues**
   ```bash
   # Verify DATABASE_URL format:
   postgresql://user:password@host:port/database?schema=public
   ```

3. **File Upload Issues**
   - Verify Cloudinary credentials
   - Check environment variables are set correctly
   - Ensure NODE_ENV=production is set

4. **NextAuth Issues**
   - Verify NEXTAUTH_SECRET is set and strong (32+ characters)
   - Ensure NEXTAUTH_URL matches your domain exactly
   - Check that cookies are allowed

### Environment Variables Checklist

Make sure all these are set in Vercel:
- [ ] `DATABASE_URL`
- [ ] `NEXTAUTH_URL` 
- [ ] `NEXTAUTH_SECRET`
- [ ] `ADMIN_EMAIL`
- [ ] `ADMIN_PASSWORD`
- [ ] `NEXT_PUBLIC_SITE_URL`
- [ ] `CLOUDINARY_CLOUD_NAME`
- [ ] `CLOUDINARY_API_KEY`
- [ ] `CLOUDINARY_API_SECRET`
- [ ] `NODE_ENV=production`

## Post-Deployment

1. **Setup Analytics** (Optional)
   - Add Vercel Analytics
   - Setup Google Analytics

2. **Setup Monitoring**
   - Monitor performance in Vercel dashboard
   - Setup error tracking (e.g., Sentry)

3. **Backup Strategy**
   - Regular database backups via Supabase
   - Consider automated backups

4. **Security**
   - Change default admin password
   - Setup proper CORS if needed
   - Review security headers

## Support

If you encounter issues:

1. Check Vercel build logs
2. Check browser console for errors  
3. Verify all environment variables
4. Test database connectivity
5. Review Cloudinary upload logs

## Cost Considerations

**Free Tiers Available:**
- Vercel: 100GB bandwidth, unlimited projects
- Supabase: 500MB database, 5GB file storage
- Cloudinary: 25 monthly credits (25,000 images)

**Estimated Costs for Production:**
- Vercel Pro: $20/month (if needed for more bandwidth)
- Supabase Pro: $25/month (if more storage needed)
- Cloudinary: Pay-as-you-go after free tier

This should handle a moderate traffic mosque donation website within free tiers initially.