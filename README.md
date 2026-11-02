# MCA Student Feedback Management System

Next.js (App Router) · TypeScript · MongoDB/Mongoose · Tailwind · JWT + bcrypt · Zod · Recharts · Lucide · Poppins

## Run
```bash
npm install
npm run seed                       # seeds faculty, subjects, and MCA2026001 / Welcome@123
npm run dev                        # .env.local uses mongodb://127.0.0.1:27017/
```

Make sure your local MongoDB server is running before seeding or signing in. New students
can create accounts from the sign-in page; passwords are stored as bcrypt hashes. The local
`.env.local` file is ignored by Git; change `JWT_SECRET` before deploying.

## Done
Student, faculty, subject, and feedback data are stored in MongoDB collections. Dashboard,
profile, faculty directory, subjects, feedback forms, and feedback history use database data.
The seed command updates the demo records without deleting existing student accounts.
