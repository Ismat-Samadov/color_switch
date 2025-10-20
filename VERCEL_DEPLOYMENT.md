# Vercel Deployment Guide

## Issue Fixed ✅

The build error you encountered was caused by environment variable checks happening at build time. This has been fixed with lazy initialization of database and R2 connections.

## Quick Deployment Steps

### 1. Push Code to GitHub

```bash
git add .
git commit -m "Fix Vercel build with lazy initialization"
git push origin main
```

### 2. Import Project on Vercel

1. Go to [vercel.com](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### 3. Configure Environment Variables

**CRITICAL**: You MUST add all environment variables before deploying.

In Vercel Project Settings → Environment Variables, add these for **all environments** (Production, Preview, Development):

```env
DATABASE_URL=postgresql://tg_db_owner:npg_c6ePiOdNjb8G@ep-frosty-voice-a2s9itd4-pooler.eu-central-1.aws.neon.tech/tg_db?sslmode=require&channel_binding=require

R2_ACCOUNT_ID=612eb8c2fbc8d81e98c37a03e49f4a8f
R2_ACCESS_KEY_ID=c4ce225243566cef224170c794723a75
R2_SECRET_ACCESS_KEY=2d7ce396246a63160bfde6a24128f35236300a8440ab0396bb355c85ae6694ef
R2_BUCKET_NAME=gotojob
R2_PUBLIC_URL=https://pub-a21ae1946bcc41ada50902253842182d.r2.dev

NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=a+KynjxQeBCNpyIeM2YUP0iPHZrNfFKtCsbxVSTo1z8=
```

**Important Notes:**
- For `NEXTAUTH_URL`: Use your actual Vercel domain (e.g., `https://gotojob.vercel.app`)
- You can update this after first deployment
- All other values should match your `.env` file

### 4. Deploy

Click "Deploy" and wait for build to complete.

### 5. Update NEXTAUTH_URL

After first deployment:
1. Copy your Vercel domain (e.g., `gotojob-abc123.vercel.app`)
2. Go to Project Settings → Environment Variables
3. Update `NEXTAUTH_URL` to `https://your-actual-domain.vercel.app`
4. Redeploy from Deployments tab

## Vercel Project Settings

### Build & Development Settings

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)
- **Root Directory**: `./` (default)

### Environment Variables Checklist

Make sure ALL these are set:

- [ ] DATABASE_URL
- [ ] R2_ACCOUNT_ID
- [ ] R2_ACCESS_KEY_ID
- [ ] R2_SECRET_ACCESS_KEY
- [ ] R2_BUCKET_NAME
- [ ] R2_PUBLIC_URL
- [ ] NEXTAUTH_URL
- [ ] NEXTAUTH_SECRET

## Troubleshooting

### Build Still Fails

1. **Check Environment Variables**
   - Go to Project Settings → Environment Variables
   - Verify ALL variables are set for Production
   - Click "Redeploy" from Deployments tab

2. **Check Build Logs**
   - Go to Deployments tab
   - Click on failed deployment
   - Read the build logs for specific errors

3. **Clear Build Cache**
   - In Deployments, click "..." menu
   - Select "Redeploy"
   - Check "Use existing Build Cache" = OFF

### Authentication Not Working After Deploy

1. Verify `NEXTAUTH_URL` matches your Vercel domain
2. Make sure it's `https://` not `http://`
3. Clear browser cookies and try again

### Database Connection Errors

1. Verify `DATABASE_URL` is correct
2. Check Neon database is active
3. Test connection locally first

### R2 Upload Fails in Production

1. Verify all R2 credentials in Vercel
2. Check CORS settings in Cloudflare R2
3. Verify bucket exists and has correct permissions

## Post-Deployment Checks

After successful deployment:

1. **Test Home Page**
   - Visit your Vercel URL
   - Should see homepage

2. **Test Sign Up**
   - Try creating an account
   - Check if user is created in Neon DB

3. **Test Job Posting** (as employer)
   - Create company
   - Post a job
   - Verify it appears

4. **Test Job Application** (as applicant)
   - Browse jobs
   - Apply with CV upload
   - Check if file appears in R2 bucket

## Custom Domain (Optional)

### Add Custom Domain

1. Go to Project Settings → Domains
2. Add your domain (e.g., `gotojob.com`)
3. Configure DNS as instructed:

**For Apex Domain** (gotojob.com):
```
Type: A
Name: @
Value: 76.76.21.21
```

**For WWW**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

4. Wait for DNS propagation (5-60 minutes)
5. Update `NEXTAUTH_URL` to your custom domain
6. Redeploy

## Monitoring

### View Logs

Real-time logs:
1. Go to Project
2. Click "Logs" tab
3. Filter by type (Errors, Build, etc.)

### Analytics

Enable Vercel Analytics (free on Hobby plan):
1. Go to Project
2. Analytics tab
3. Enable Vercel Analytics

## Automatic Deployments

Vercel automatically deploys when you:
- Push to `main` branch (Production)
- Push to any branch (Preview deployment)
- Open a Pull Request (Preview deployment)

### Disable Auto-Deployments (optional)

Project Settings → Git:
- Uncheck "Production Branch"
- Deploy manually from Dashboard

## Cost Monitoring

### Vercel Hobby Plan Limits

- Bandwidth: 100 GB/month
- Builds: Unlimited
- Build time: 6000 minutes/month
- Serverless function execution: 100 GB-hours

### Monitor Usage

1. Go to Account → Usage
2. Check current usage
3. Set up usage alerts if needed

## Performance Optimization

### Enable Edge Functions (Optional)

For better performance in different regions:

1. Add to `next.config.ts`:
```typescript
export const runtime = 'edge';
```

2. Note: Edge runtime has limitations
3. Test thoroughly before enabling

### Image Optimization

Next.js automatically optimizes images. To configure:

1. Add to `next.config.ts`:
```typescript
images: {
  domains: ['pub-a21ae1946bcc41ada50902253842182d.r2.dev'],
  formats: ['image/webp'],
},
```

## Security Best Practices

- [ ] Never expose environment variables in client code
- [ ] Rotate `NEXTAUTH_SECRET` periodically
- [ ] Use strong database passwords
- [ ] Keep dependencies updated
- [ ] Enable Vercel's security headers
- [ ] Set up rate limiting for API routes

## Getting Help

### Vercel Support

- Free tier: Community support
- Documentation: https://vercel.com/docs
- GitHub Issues: https://github.com/vercel/next.js/issues

### Common Support Channels

1. Vercel Discord: https://vercel.com/discord
2. Next.js Discussions: https://github.com/vercel/next.js/discussions
3. Stack Overflow: Tag `vercel` or `next.js`

## Success Checklist

After deployment:

- [ ] Build completes successfully
- [ ] Homepage loads on Vercel URL
- [ ] Authentication works (sign up/sign in)
- [ ] Employers can create companies
- [ ] Employers can post jobs
- [ ] Applicants can view jobs
- [ ] Applicants can submit applications
- [ ] CV files upload to R2
- [ ] Database records are created
- [ ] No console errors
- [ ] Custom domain configured (optional)

## Next Steps

Once deployed:

1. Test all features thoroughly
2. Set up monitoring/alerts
3. Configure custom domain
4. Add analytics
5. Implement additional features
6. Set up CI/CD for automated testing

Congratulations! Your GoToJob platform is now live! 🚀
