import "dotenv/config";
import { config } from "dotenv";
config({ path: ".env.local" });
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../src/lib/db";
import { Faculty } from "../src/models/Faculty";
import { Student } from "../src/models/Student";
import { Subject } from "../src/models/Subject";

const faculty = [
  { name: "Dr. Priya Sharma", designation: "Associate Professor", subject: "Database Management Systems", experienceYears: 12, isMentor: true, semester: 4 },
  { name: "Prof. Aravind Kumar", designation: "Assistant Professor", subject: "Java Programming", experienceYears: 8, semester: 4 },
  { name: "Ms. Divya Lakshmi", designation: "Assistant Professor", subject: "Python Programming", experienceYears: 6, semester: 4 },
  { name: "Mr. Karthik Raj", designation: "Assistant Professor", subject: "Software Engineering", experienceYears: 7, semester: 4 },
  { name: "Dr. Meena R", designation: "Associate Professor", subject: "Data Structures and Algorithms", experienceYears: 10, semester: 4 },
  { name: "Mr. Sanjay Kumar", designation: "Assistant Professor", subject: "Web Technologies", experienceYears: 5, semester: 4 },
];

async function main() {
  await connectDB();
  await Faculty.bulkWrite(faculty.map((member) => ({
    updateOne: {
      filter: { name: member.name },
      update: { $set: member },
      upsert: true,
    },
  })));
  const facultyDocs = await Faculty.find({ name: { $in: faculty.map((member) => member.name) } });
  const facultyBySubject = new Map(facultyDocs.map((member) => [member.subject, member]));
  const subjects = [
    { code: "DBMS", name: "Database Management Systems", facultyName: "Dr. Priya Sharma" },
    { code: "JAVA", name: "Java Programming", facultyName: "Prof. Aravind Kumar" },
    { code: "PYTHON", name: "Python Programming", facultyName: "Ms. Divya Lakshmi" },
    { code: "SE", name: "Software Engineering", facultyName: "Mr. Karthik Raj" },
    { code: "DSA", name: "Data Structures and Algorithms", facultyName: "Dr. Meena R" },
    { code: "WEB", name: "Web Technologies", facultyName: "Mr. Sanjay Kumar" },
  ];
  await Subject.bulkWrite(subjects.map(({ code, name, facultyName }) => ({
    updateOne: {
      filter: { code },
      update: { $set: { code, name, semester: 4, faculty: facultyBySubject.get(facultyName)?._id } },
      upsert: true,
    },
  })));

  const mentor = facultyBySubject.get("Database Management Systems");
  await Student.updateOne(
    { registerNumber: "MCA2026001" },
    {
      $setOnInsert: {
        registerNumber: "MCA2026001",
        passwordHash: await bcrypt.hash("Welcome@123", 12),
        name: "Arjun Kumar",
        email: "arjun.kumar@example.edu",
        mobile: "+91 98765 43210",
        admissionYear: 2025,
        academicYear: "2026-2027",
        year: "II Year",
        semester: 4,
        section: "A",
        mentor: mentor?._id,
        skills: ["React", "Node.js"],
        languages: ["Java", "Python"],
        databases: ["MongoDB", "MySQL"],
      },
    },
    { upsert: true },
  );
  console.log("Seeded faculty, subjects, and demo student. Login: MCA2026001 / Welcome@123");
}
main()
  .catch((error) => {
    console.error("Database seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
