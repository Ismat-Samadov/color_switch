# GoToJob - Job Application & Posting Platform

<div align="center">

**A modern full-stack job posting and application platform built with Next.js 15**

[Live Demo](https://gotojob-zeta.vercel.app) • [Report Bug](https://github.com/Ismat-Samadov/gotojob/issues) • [Request Feature](https://github.com/Ismat-Samadov/gotojob/issues)

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com)

</div>

---

## 📸 Screenshots

### Landing Page
![Landing Page](./screenshots/landing.png)

### Sign Up
![Sign Up](./screenshots/sign%20up.png)

### Browse Jobs
![Browse Jobs](./screenshots/browse%20jobs.png)

### For Applicants - Track Applications
![My Applications](./screenshots/applied%20jobs%20for%20applicants.png)

### For Employers - Manage Job Postings
![Posted Jobs](./screenshots/posted%20jobs%20for%20hr.png)

---

## ✨ Features

### For Job Seekers
- 🔍 Browse and search job listings
- 📄 Apply with CV upload (PDF, DOC, DOCX)
- 📝 Optional cover letter submission
- 📊 Track application status in real-time
- 🎯 View detailed job descriptions and requirements

### For Employers
- 🏢 Create and manage company profiles
- 📝 Post job openings with detailed descriptions
- 👥 View and manage applications
- 🎨 Track all posted jobs in one dashboard
- ✅ Review applicant CVs and information

### Security & Authentication
- 🔐 Secure email/password authentication
- 👤 Role-based access control (Applicant/Employer)
- 🔒 Protected API routes
- 📁 Secure file storage with Cloudflare R2

---

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Database** | PostgreSQL (Neon) |
| **ORM** | Drizzle ORM |
| **Authentication** | NextAuth.js v5 |
| **File Storage** | Cloudflare R2 |
| **Hosting** | Vercel |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Neon PostgreSQL database
- Cloudflare R2 bucket
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Ismat-Samadov/gotojob.git
cd gotojob
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file:
```env
# Database
DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require

# Cloudflare R2
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=gotojob
R2_PUBLIC_URL=https://your-bucket.r2.dev

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
```

4. **Initialize database**
```bash
npm run db:push
```

5. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Project Structure

```
gotojob/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── applications/ # Application management
│   │   │   ├── companies/    # Company CRUD
│   │   │   └── jobs/         # Job management
│   │   ├── auth/             # Auth pages (sign in/up)
│   │   ├── dashboard/        # User dashboards
│   │   │   ├── applications/ # Applicant dashboard
│   │   │   └── jobs/        # Employer dashboard
│   │   └── jobs/            # Public job listings
│   ├── components/          # React components
│   ├── db/                 # Database config & schema
│   └── lib/                # Utilities & helpers
├── public/                 # Static assets
└── screenshots/           # App screenshots
```

---

## 🔧 Configuration

### Database Schema

The application uses PostgreSQL with the following tables:
- **users** - User accounts with role-based access
- **companies** - Company profiles for employers
- **jobs** - Job postings
- **applications** - Job applications with CV links

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | User registration |
| `/api/auth/[...nextauth]` | GET/POST | NextAuth handlers |
| `/api/companies` | GET/POST | Company management |
| `/api/jobs` | GET/POST | Job listings |
| `/api/jobs/[id]` | GET/PATCH/DELETE | Individual job operations |
| `/api/applications` | GET/POST | Application submissions |

---

## 🎨 Key Features Explained

### CV Upload with Cloudflare R2
Files are securely uploaded to Cloudflare R2 (S3-compatible) with unique filenames:
```typescript
cvs/timestamp-randomstring.pdf
```

### Role-Based Access
- **Applicants**: Browse jobs, submit applications, track status
- **Employers**: Post jobs, view applications, manage listings

### Real-time Application Tracking
Applicants can see application status:
- 🟡 Pending
- 🔵 Reviewing
- 🟢 Accepted
- 🔴 Rejected

---

## 🚢 Deployment

### Deploy to Vercel

1. Push to GitHub:
```bash
git push origin main
```

2. Import on [Vercel](https://vercel.com)

3. Add environment variables in Vercel dashboard

4. Deploy! ✨

Detailed guide: See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📊 Database Management

```bash
# Generate migrations
npm run db:generate

# Apply migrations
npm run db:migrate

# Push schema directly
npm run db:push

# Open Drizzle Studio (Database GUI)
npm run db:studio
```

---

## 🧪 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Ismat Samadov**

- GitHub: [@Ismat-Samadov](https://github.com/Ismat-Samadov)

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting
- Neon for database
- Cloudflare for R2 storage
- All contributors and users

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

[Report Bug](https://github.com/Ismat-Samadov/gotojob/issues) • [Request Feature](https://github.com/Ismat-Samadov/gotojob/issues)

</div>
