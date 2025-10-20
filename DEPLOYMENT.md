# Deployment Guide

This guide will walk you through deploying GoToJob to Vercel with all necessary configurations.

## Pre-Deployment Checklist

- [ ] Neon PostgreSQL database created
- [ ] Cloudflare R2 bucket set up
- [ ] All environment variables ready
- [ ] Code pushed to GitHub/GitLab/Bitbucket
- [ ] Database schema pushed (`npm run db:push`)

## Step-by-Step Deployment

### 1. Prepare Your Database

Make sure your database schema is up to date:

```bash
# Generate migration files (if you made schema changes)
npm run db:generate

# Push schema to your Neon database
npm run db:push
```

### 2. Configure Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 3. Set Environment Variables

In Vercel project settings → Environment Variables, add:

#### Database Configuration
```
DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

#### Cloudflare R2 Configuration
```
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=gotojob-cvs
R2_PUBLIC_URL=https://your-bucket.r2.cloudflarestorage.com
```

#### NextAuth Configuration
```
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_generated_secret_from_openssl
```

**Important**:
- Set all variables for "Production", "Preview", and "Development" environments
- For `NEXTAUTH_URL`, use your actual Vercel domain once deployed
- Generate `NEXTAUTH_SECRET` with: `openssl rand -base64 32`

### 4. Deploy

Click "Deploy" and wait for Vercel to build your application.

### 5. Post-Deployment Verification

After deployment completes:

1. Visit your deployed URL
2. Test the following:
   - [ ] Home page loads
   - [ ] Sign up creates a new user
   - [ ] Sign in works
   - [ ] Job browsing works
   - [ ] (Employer) Can create a company
   - [ ] (Employer) Can post a job
   - [ ] (Applicant) Can apply to a job with CV upload

### 6. Custom Domain (Optional)

To add a custom domain:

1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records as instructed by Vercel
4. Update `NEXTAUTH_URL` to use your custom domain

## Vercel Hobby Plan Limits

The Vercel Hobby (free) plan includes:
- Unlimited deployments
- 100 GB bandwidth per month
- Automatic SSL
- Preview deployments for pull requests
- Serverless function execution time: 10 seconds max
- Serverless function size: 50 MB max

**Important Considerations**:
- File uploads are limited by the 10-second execution timeout
- Consider implementing client-side upload directly to R2 for larger files
- Monitor your bandwidth usage in Vercel dashboard

## Cloudflare R2 Configuration for Public Access

If you want CVs to be publicly accessible via direct URLs:

1. Go to your R2 bucket settings
2. Enable "Public Access" or set up a custom domain
3. Update `R2_PUBLIC_URL` environment variable accordingly

For private access (recommended for CVs):
- Keep bucket private
- Use presigned URLs (already implemented in `/src/lib/r2.ts`)

## Database Connection Pooling

Neon automatically handles connection pooling. However, for optimal performance:

1. Use the connection string with pooling enabled
2. In Neon dashboard, check your connection settings
3. Consider upgrading from Neon Free tier if you need more concurrent connections

## Monitoring and Logs

### Vercel Logs
- Go to your project → Deployments
- Click on a deployment to see build and runtime logs
- Use the "Functions" tab to see serverless function logs

### Database Monitoring
- Use Neon dashboard to monitor database performance
- Check query statistics and connection counts

### R2 Metrics
- Check Cloudflare dashboard for R2 usage metrics
- Monitor storage size and request counts

## Troubleshooting

### Build Fails

**Issue**: Build fails with TypeScript errors
- Solution: Run `npm run build` locally first to catch errors

**Issue**: Missing dependencies
- Solution: Make sure `package.json` includes all dependencies

### Runtime Errors

**Issue**: Database connection fails
- Check `DATABASE_URL` is correctly set in Vercel
- Verify Neon database is active
- Check if IP restrictions are configured in Neon

**Issue**: R2 uploads fail
- Verify all R2 environment variables are set
- Check R2 bucket permissions
- Ensure CORS is configured if needed

**Issue**: Authentication not working
- Verify `NEXTAUTH_URL` matches your deployment URL
- Ensure `NEXTAUTH_SECRET` is set
- Clear browser cookies and try again

### Performance Issues

**Issue**: Slow page loads
- Enable Vercel Analytics to identify bottlenecks
- Consider adding caching for job listings
- Optimize images and assets

**Issue**: Function timeout errors
- File uploads might be too large
- Implement direct client-to-R2 uploads for large files
- Consider upgrading to Vercel Pro for longer timeouts

## Continuous Deployment

Vercel automatically deploys when you push to your main branch:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will:
1. Automatically detect the push
2. Build your application
3. Deploy to production
4. Provide a unique URL for each deployment

## Rolling Back

If something goes wrong:

1. Go to Vercel Dashboard → Deployments
2. Find a previous working deployment
3. Click "..." → "Promote to Production"

## Security Best Practices

- [ ] Never commit `.env` files to Git
- [ ] Rotate `NEXTAUTH_SECRET` periodically
- [ ] Use strong passwords for database
- [ ] Regularly update dependencies
- [ ] Monitor Vercel logs for suspicious activity
- [ ] Set up rate limiting if needed
- [ ] Keep R2 bucket private and use presigned URLs

## Cost Estimation

### Vercel Hobby (Free)
- $0/month
- Suitable for personal projects and demos

### Neon Free Tier
- $0/month
- 512 MB storage
- 1 GB data transfer
- Upgrade to Pro if you need more resources

### Cloudflare R2
- First 10 GB storage: Free
- $0.015 per GB/month after that
- Class A operations (writes): $4.50 per million
- Class B operations (reads): $0.36 per million

**Estimated monthly cost for small usage**: $0-5

## Getting Help

If you encounter issues:
1. Check Vercel deployment logs
2. Review Neon database logs
3. Check Cloudflare R2 dashboard
4. Open an issue on the project repository
5. Consult the main README.md for troubleshooting tips

## Next Steps After Deployment

- Set up monitoring and alerts
- Configure custom domain
- Add analytics (Vercel Analytics)
- Implement error tracking (e.g., Sentry)
- Set up automated backups for database
- Configure CI/CD for automated testing
