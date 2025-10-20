# Testing Guide for GoToJob

The development server is now running at http://localhost:3000

## Test Plan

### 1. Test Home Page
- [ ] Open http://localhost:3000
- [ ] Verify home page loads with "Welcome to GoToJob" heading
- [ ] Check navigation header with logo and menu items
- [ ] Click "Browse Jobs" button
- [ ] Click "Get Started" button

### 2. Test Employer Authentication Flow

#### Sign Up as Employer
- [ ] Go to http://localhost:3000/auth/signup
- [ ] Fill in the form:
  - Name: Test Employer
  - Email: employer@test.com
  - Password: password123
  - Role: "Post jobs"
- [ ] Click "Create account"
- [ ] Should redirect to sign in page

#### Sign In as Employer
- [ ] Go to http://localhost:3000/auth/signin
- [ ] Enter credentials:
  - Email: employer@test.com
  - Password: password123
- [ ] Click "Sign in"
- [ ] Should redirect to home page
- [ ] Verify header shows email and "Dashboard" link

### 3. Test Company Creation

- [ ] Click "Dashboard" in header (or go to /dashboard)
- [ ] Should see message: "You need to create a company before posting a job"
- [ ] Click "Create a company" link
- [ ] Fill in company form:
  - Company Name: Tech Innovations Inc.
  - Website: https://techinnovations.com
  - Description: We build amazing software products
- [ ] Click "Create Company"
- [ ] Should redirect to job creation page

### 4. Test Job Posting

- [ ] Fill in job form:
  - Company: Select "Tech Innovations Inc."
  - Job Title: Senior Frontend Developer
  - Location: Remote
  - Job Type: Full-time
  - Salary Range: $100,000 - $150,000
  - Description: We are looking for an experienced frontend developer...
  - Requirements: 5+ years of React experience, TypeScript expert...
- [ ] Click "Post Job"
- [ ] Should redirect to dashboard
- [ ] Verify job appears in dashboard with:
  - Job title
  - Company name
  - Location
  - Active status (green badge)
  - Posted date

### 5. Test Public Job Listing

- [ ] Click "Browse Jobs" in header (or go to /jobs)
- [ ] Verify the job you created appears in the listing
- [ ] Check job card shows:
  - Title
  - Company name
  - Location
  - Job type
  - Salary (if provided)
  - Description preview
  - Posted date

### 6. Test Job Details Page

- [ ] Click on the job card
- [ ] Should navigate to /jobs/[id]
- [ ] Verify job details page shows:
  - Full job title
  - Company name
  - Location, type, salary
  - Full description
  - Full requirements
  - Company description
  - "Apply Now" button (if signed in as applicant)

### 7. Test Applicant Authentication Flow

#### Sign Out
- [ ] Click "Sign Out" in header
- [ ] Should redirect to home page
- [ ] Header should show "Sign In" and "Sign Up" buttons

#### Sign Up as Applicant
- [ ] Go to /auth/signup
- [ ] Fill in form:
  - Name: Test Applicant
  - Email: applicant@test.com
  - Password: password123
  - Role: "Apply for jobs"
- [ ] Click "Create account"
- [ ] Should redirect to sign in page

#### Sign In as Applicant
- [ ] Sign in with applicant credentials
- [ ] Verify header shows email (no "Dashboard" link)

### 8. Test Job Application (IMPORTANT - CV Upload)

- [ ] Go to /jobs and click on a job
- [ ] Click "Apply Now" or "Apply for this Position"
- [ ] Should navigate to /jobs/[id]/apply
- [ ] Fill in application form:
  - Cover Letter: I am very interested in this position... (optional)
  - Resume/CV: Upload a PDF file (create a test PDF if needed)
- [ ] Click "Submit Application"
- [ ] Should see success message
- [ ] Should redirect to job details page

#### Test File Upload Validation
- [ ] Try to submit without a CV - should show error
- [ ] Try to upload a file larger than 10MB - should show error
- [ ] Try to upload a .txt file - should show "Only PDF and Word documents allowed"
- [ ] Upload a valid PDF/DOCX - should work

### 9. Test Application Already Submitted

- [ ] Try to apply to the same job again
- [ ] Should show error: "You have already applied to this job"

### 10. Test Employer Viewing Applications (Future Feature)

This is not yet implemented but can be added:
- Employers should be able to view applications for their jobs
- See applicant details and download CVs

### 11. Test Error Handling

#### Database Connection
- [ ] Check browser console for any database errors
- [ ] All pages should load without 500 errors

#### Authentication Errors
- [ ] Try signing in with wrong password
- [ ] Should show "Invalid email or password"
- [ ] Try signing up with existing email
- [ ] Should show "User with this email already exists"

#### Authorization Errors
- [ ] Sign in as applicant
- [ ] Try to access /dashboard directly
- [ ] Should redirect to home page (or show forbidden message)

### 12. Test Responsive Design

- [ ] Open browser dev tools (F12)
- [ ] Toggle device toolbar (mobile view)
- [ ] Test on different screen sizes:
  - Mobile (375px)
  - Tablet (768px)
  - Desktop (1280px)
- [ ] Verify all pages are responsive and usable

### 13. Test Dark Mode

- [ ] Toggle system dark mode
- [ ] Verify all pages adapt correctly
- [ ] Check text contrast and readability

### 14. Test Navigation

- [ ] Click logo - should go to home page
- [ ] Click "Browse Jobs" - should go to /jobs
- [ ] Click "Dashboard" (as employer) - should go to /dashboard
- [ ] Use browser back/forward buttons - should work correctly

### 15. Verify Cloudflare R2 Upload

After uploading a CV:
- [ ] Go to Cloudflare R2 dashboard
- [ ] Navigate to your "gotojob" bucket
- [ ] Verify the CV file is in the "cvs/" folder
- [ ] File name should have timestamp and random string
- [ ] File should be accessible via the R2 public URL

### 16. Verify Database Records

Option 1 - Use Drizzle Studio:
```bash
npm run db:studio
```
- [ ] Open http://localhost:4983 (or the port shown)
- [ ] Check "gotojob" schema
- [ ] Verify tables:
  - users: Should have 2 records (employer + applicant)
  - companies: Should have 1 record
  - jobs: Should have 1 record
  - applications: Should have 1 record with CV URL

Option 2 - Use Neon Dashboard:
- [ ] Go to Neon console
- [ ] Navigate to your project
- [ ] Open SQL Editor
- [ ] Run queries to verify data:
```sql
SELECT * FROM gotojob.users;
SELECT * FROM gotojob.companies;
SELECT * FROM gotojob.jobs;
SELECT * FROM gotojob.applications;
```

## Common Issues & Solutions

### Server Won't Start
- Check if port 3000 is already in use
- Kill the process: `lsof -ti:3000 | xargs kill -9`
- Try again: `npm run dev`

### Database Connection Failed
- Verify DATABASE_URL in .env
- Check Neon dashboard - is the project active?
- Try: `npm run db:push` again

### R2 Upload Fails
- Verify all R2 credentials in .env
- Check bucket permissions in Cloudflare
- Look at browser console for specific error

### Authentication Not Working
- Clear browser cookies
- Check NEXTAUTH_SECRET is set
- Restart dev server

### TypeScript Errors
- Run: `npm run build` to see all errors
- Check browser console for runtime errors

## Performance Checks

- [ ] Home page loads in < 2 seconds
- [ ] Job listing loads all jobs quickly
- [ ] File upload completes in reasonable time
- [ ] No console errors or warnings
- [ ] All images load correctly

## Success Criteria

✅ All authentication flows work
✅ Employers can create companies and post jobs
✅ Applicants can browse and apply to jobs
✅ CV files upload successfully to R2
✅ Database records are created correctly
✅ No console errors
✅ UI is responsive and looks good
✅ Dark mode works properly

## Next Steps After Testing

If all tests pass:
1. Review the code and make any customizations
2. Add more features (search, filters, etc.)
3. Set up environment for production
4. Deploy to Vercel (see DEPLOYMENT.md)

If tests fail:
1. Note which test failed
2. Check browser console for errors
3. Check server logs in terminal
4. Refer to troubleshooting section in README.md
