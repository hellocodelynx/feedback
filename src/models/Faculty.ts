import { Schema, model, models } from "mongoose";

const FacultySchema = new Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  department: { type: String, default: "Computer Applications" },
  subject: { type: String, required: true },
  experienceYears: Number,
  qualification: String, intro: String, email: String, office: String,
  semester: Number, isMentor: { type: Boolean, default: false }, photo: String,
}, { timestamps: true });

export const Faculty = models.Faculty || model("Faculty", FacultySchema);
