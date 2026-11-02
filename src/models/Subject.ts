import { Schema, model, models } from "mongoose";

const SubjectSchema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  semester: { type: Number, required: true },
  faculty: { type: Schema.Types.ObjectId, ref: "Faculty" },
}, { timestamps: true });

export const Subject = models.Subject || model("Subject", SubjectSchema);
