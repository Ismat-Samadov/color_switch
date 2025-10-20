# GoToJob - Job Application & Posting Platform

A modern full-stack job posting and application platform built with Next.js 15, featuring secure file uploads to Cloudflare R2, PostgreSQL database with Neon, and NextAuth authentication.

## Features

- **For Job Seekers (Applicants)**
  - Browse and search job listings
  - View detailed job descriptions
  - Apply to jobs with CV upload
  - Track application status

- **For Employers**
  - Create and manage company profiles
  - Post job openings
  - Manage job listings
  - View applications

- **Authentication & Security**
  - Email/password authentication with NextAuth.js
  - Role-based access control (Applicant/Employer)
  - Secure file uploads to Cloudflare R2
  - Protected API routes

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: NextAuth.js v5
- **File Storage**: Cloudflare R2
- **Hosting**: Vercel (Hobby Plan)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Neon PostgreSQL database
- Cloudflare R2 bucket
- Vercel account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd gotojob
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Database
DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require

# Cloudflare R2
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=gotojob-cvs
R2_PUBLIC_URL=https://your-bucket.r2.cloudflarestorage.com

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

4. Generate database schema:
```bash
npm run db:generate
```

5. Push schema to database:
```bash
npm run db:push
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## Environment Setup Guide

### 1. Setting up Neon Database

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project
3. Copy the connection string
4. Add it to your `.env` as `DATABASE_URL`

### 2. Setting up Cloudflare R2

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to R2 Object Storage
3. Create a new bucket (e.g., `gotojob-cvs`)
4. Go to "Manage R2 API Tokens"
5. Create a new API token with Read & Write permissions
6. Copy the credentials to your `.env`:
   - Account ID
   - Access Key ID
   - Secret Access Key
7. Configure public access for the bucket if needed and set `R2_PUBLIC_URL`

### 3. Setting up NextAuth Secret

Generate a secure secret:
```bash
openssl rand -base64 32
```

Add it to your `.env` as `NEXTAUTH_SECRET`

## Deployment to Vercel

1. Push your code to GitHub

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)

3. Click "New Project" and import your repository

4. Configure environment variables in Vercel:
   - Go to Project Settings → Environment Variables
   - Add all variables from your `.env` file
   - Update `NEXTAUTH_URL` to your production domain

5. Deploy:
```bash
git push origin main
```

Vercel will automatically deploy your application.

### Important Vercel Settings

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node Version**: 18.x or higher

## Database Management

### Generate migration files:
```bash
npm run db:generate
```

### Apply migrations:
```bash
npm run db:migrate
```

### Push schema changes directly:
```bash
npm run db:push
```

### Open Drizzle Studio (Database GUI):
```bash
npm run db:studio
```

## Project Structure

```
gotojob/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Employer dashboard
│   │   └── jobs/              # Job listing & details
│   ├── components/            # React components
│   ├── db/                    # Database schema & connection
│   └── lib/                   # Utility functions
├── drizzle/                   # Database migrations
├── public/                    # Static files
└── ...config files
```

## API Routes

- `POST /api/auth/signup` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth handlers
- `GET/POST /api/companies` - Company management
- `GET/POST /api/jobs` - Job listings
- `GET/PATCH/DELETE /api/jobs/[id]` - Individual job operations
- `GET/POST /api/applications` - Job applications

## Features to Add (Future)

- Search and filter functionality for jobs
- Email notifications for applications
- Application status management for employers
- User profile pages
- Company logo uploads
- Advanced job search filters
- Application analytics
- Resume parsing

## Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Check if your IP is allowed in Neon's connection settings
- Ensure SSL mode is set to `require`

### R2 Upload Failures
- Verify all R2 credentials are correct
- Check bucket permissions
- Ensure the bucket name matches your configuration

### Authentication Issues
- Make sure `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your domain
- Clear browser cookies and try again

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
