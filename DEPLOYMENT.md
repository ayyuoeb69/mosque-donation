# Vercel Deployment Checklist

## ✅ Pre-Deployment Steps

### 1. Database Setup
- [ ] Create PostgreSQL database (Vercel Postgres, Supabase, PlanetScale, etc.)
- [ ] Get your connection string
- [ ] Test connection locally

### 2. Environment Variables
- [ ] `DATABASE_URL` - Your PostgreSQL connection string
- [ ] `NEXTAUTH_URL` - Your Vercel domain (https://your-app.vercel.app)
- [ ] `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`

### 3. Local Testing
- [ ] Run `npm run migrate-to-postgres` to migrate from SQLite
- [ ] Test all functionality locally with PostgreSQL
- [ ] Ensure Prisma client generates correctly

## 🚀 Deployment Steps

### 1. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### 2. Configure Vercel
- [ ] Add environment variables in Vercel dashboard
- [ ] Set build command: `npm run build`
- [ ] Set install command: `npm install`

### 3. Database Migration
```bash
# Connect to your production database
npx prisma migrate deploy
```

## 🔧 Troubleshooting

### Common Issues

#### Prisma Client Generation Error
- **Problem**: "Prisma has detected that this project was built on Vercel"
- **Solution**: ✅ Already fixed with updated build script and vercel.json

#### Database Connection Issues
- **Problem**: Can't connect to PostgreSQL
- **Solution**: 
  - Check DATABASE_URL format
  - Ensure database is accessible from Vercel
  - Verify firewall settings

#### Build Failures
- **Problem**: Build fails during prisma generate
- **Solution**:
  - Check Prisma schema syntax
  - Ensure all dependencies are in package.json
  - Verify database connection string

## 📱 Post-Deployment

### 1. Verify Functionality
- [ ] Test landing page loads
- [ ] Test admin login
- [ ] Test donation form
- [ ] Test image uploads

### 2. Monitor
- [ ] Check Vercel function logs
- [ ] Monitor database performance
- [ ] Set up error tracking

### 3. Security
- [ ] Change default admin password
- [ ] Review environment variables
- [ ] Set up proper CORS if needed

## 🔄 Updates

### For Future Deployments
1. Push changes to your repository
2. Vercel will automatically redeploy
3. Run `npx prisma migrate deploy` if schema changes

### Rollback
- Use Vercel's rollback feature in dashboard
- Or redeploy previous commit: `vercel --prod`

## 📞 Support

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test database connection
4. Check Prisma schema syntax
