# Quick Start Guide

## What's Been Built

Your job application and posting platform is ready! Here's what's included:

### Core Features
1. **Authentication System**
   - Sign up with email/password
   - Sign in/Sign out
   - Role-based access (Applicant/Employer)

2. **For Applicants**
   - Browse all job listings
   - View detailed job information
   - Apply to jobs with CV upload (stored in Cloudflare R2)
   - Write cover letters

3. **For Employers**
   - Create company profiles
   - Post job openings
   - Manage job listings
   - View applications

4. **Technical Features**
   - Responsive design with Tailwind CSS
   - Dark mode support
   - File upload to Cloudflare R2
   - PostgreSQL database with Drizzle ORM
   - Type-safe with TypeScript
   - Server-side rendering with Next.js 15

## Project Structure

```
gotojob/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── companies/    # Company CRUD
│   │   │   ├── jobs/         # Job CRUD
│   │   │   └── applications/ # Application submissions
│   │   ├── auth/             # Sign in/up pages
│   │   ├── dashboard/        # Employer dashboard
│   │   │   ├── companies/    # Company management
│   │   │   └── jobs/         # Job management
│   │   ├── jobs/             # Public job listings
│   │   ├── layout.tsx        # Root layout with header
│   │   └── page.tsx          # Home page
│   ├── components/           # React components
│   │   └── Header.tsx        # Navigation header
│   ├── db/
│   │   ├── schema.ts         # Database schema
│   │   └── index.ts          # Database connection
│   └── lib/
│       ├── auth.ts           # NextAuth configuration
│       ├── r2.ts             # Cloudflare R2 utilities
│       └── validations.ts    # Zod validation schemas
├── .env.example              # Environment variables template
├── README.md                 # Full documentation
└── DEPLOYMENT.md             # Deployment guide
```

## Next Steps

### 1. Set Up Your Environment

Create a `.env` file:
```bash
cp .env.example .env
```

Fill in your credentials:

#### Neon Database
1. Go to https://console.neon.tech
2. Create a new project
3. Copy connection string to `DATABASE_URL`

#### Cloudflare R2
1. Go to https://dash.cloudflare.com
2. Navigate to R2 Object Storage
3. Create bucket: `gotojob-cvs`
4. Generate API token
5. Add credentials to `.env`

#### NextAuth Secret
```bash
openssl rand -base64 32
```
Add to `.env` as `NEXTAUTH_SECRET`

### 2. Initialize Database

```bash
# Install dependencies (if not done)
npm install

# Push database schema to Neon
npm run db:push
```

### 3. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### 4. Test the Application

1. **Sign Up as Employer**
   - Go to /auth/signup
   - Select "Post jobs" role
   - Create account

2. **Create a Company**
   - After signing in, go to Dashboard
   - You'll be prompted to create a company first
   - Fill in company details

3. **Post a Job**
   - Click "Post New Job" in dashboard
   - Fill in job details
   - Submit

4. **Test as Applicant**
   - Sign out
   - Sign up again with "Apply for jobs" role
   - Browse jobs at /jobs
   - Click on a job and apply with a test PDF

### 5. Deploy to Vercel

See DEPLOYMENT.md for detailed instructions.

Quick deploy:
```bash
# Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# Then import on Vercel
# 1. Go to vercel.com
# 2. Import repository
# 3. Add environment variables
# 4. Deploy
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:generate  # Generate database migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio (DB GUI)
```

## Key Files to Customize

### Branding & Styling
- `src/app/layout.tsx` - Site metadata (title, description)
- `src/app/globals.css` - Global styles and theme colors
- `src/components/Header.tsx` - Navigation and logo

### Database Schema
- `src/db/schema.ts` - Add/modify tables and fields
- Run `npm run db:push` after changes

### Validations
- `src/lib/validations.ts` - Form validation rules

### File Upload Settings
- `src/lib/r2.ts` - File size limits, allowed types
- `next.config.ts` - Body size limit (currently 10MB)

## Common Customizations

### Change File Size Limit
In `next.config.ts`:
```typescript
serverActions: {
  bodySizeLimit: "20mb", // Change from 10mb
}
```

### Add Email Notifications
Install nodemailer or use a service like Resend:
```bash
npm install resend
```

### Add Search Functionality
Modify `/src/app/api/jobs/route.ts` to accept search params:
```typescript
const search = searchParams.get("search");
// Add where clause to filter by search term
```

### Add Job Categories
1. Add category field to schema:
```typescript
category: varchar("category", { length: 50 }),
```
2. Run `npm run db:push`
3. Update job creation form
4. Add filter UI

## Troubleshooting

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Database Connection Issues
- Check `DATABASE_URL` in `.env`
- Verify Neon project is active
- Test connection with `npm run db:studio`

### R2 Upload Failures
- Verify all R2 env variables are set
- Check bucket permissions in Cloudflare
- Test with small file (< 1MB) first

### Authentication Issues
- Clear browser cookies
- Check `NEXTAUTH_URL` matches your domain
- Verify `NEXTAUTH_SECRET` is set

## Getting Help

- Check README.md for full documentation
- Review DEPLOYMENT.md for deployment issues
- Check Vercel logs for production errors
- Review Next.js docs: https://nextjs.org/docs

## What's Not Included (Future Enhancements)

- Email notifications
- Advanced search/filtering
- Application status workflow
- User profile pages
- Company logo uploads
- Analytics dashboard
- Resume parsing
- Automated testing
- Error tracking (Sentry)

These can be added as your project grows!

## Security Notes

- Never commit `.env` to Git (already in `.gitignore`)
- Rotate secrets periodically
- Keep dependencies updated: `npm audit fix`
- Monitor Vercel logs for suspicious activity
- Use environment variables for all sensitive data

## Support

For questions or issues:
1. Review the documentation
2. Check Next.js and Drizzle docs
3. Open an issue on your repository
4. Consult Vercel support for deployment issues

Happy coding! 🚀
