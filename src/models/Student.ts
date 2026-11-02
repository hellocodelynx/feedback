import { Schema, model, models } from "mongoose";

const StudentSchema = new Schema({
  registerNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  name: { type: String, required: true },
  email: String, mobile: String, dob: Date, gender: String,
  address: String, city: String, state: String, pincode: String,
  college: { type: String, default: "Bharathi Institute of Technology" },
  degree: { type: String, default: "Master of Computer Applications" },
  department: { type: String, default: "Computer Applications" },
  admissionYear: Number, academicYear: String, year: String, semester: Number, section: String,
  mentor: { type: Schema.Types.ObjectId, ref: "Faculty" },
  skills: [String], languages: [String], databases: [String], frameworks: [String], interests: [String],
  careerObjective: String, linkedin: String, github: String, about: String, photo: String,
}, { timestamps: true });

export const Student = models.Student || model("Student", StudentSchema);
