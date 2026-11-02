import { Schema, model, models } from "mongoose";

// Anonymity: faculty-facing reports must aggregate by faculty/subject only and
// never expose `student`. It is stored only to enforce one submission per target.
const FeedbackSchema = new Schema({
  refId: { type: String, required: true, unique: true },
  category: { type: String, enum: ["faculty", "course", "general"], required: true },
  student: { type: Schema.Types.ObjectId, ref: "Student", required: true, select: false },
  faculty: { type: Schema.Types.ObjectId, ref: "Faculty" },
  subject: String, semester: Number,
  ratings: { type: Map, of: Number },
  likes: String, improvements: String, comments: String,
  status: { type: String, enum: ["Pending", "Draft", "Submitted"], default: "Draft" },
  submittedAt: Date,
}, { timestamps: true });

FeedbackSchema.index({ student: 1, category: 1, faculty: 1, subject: 1 }, { unique: true });
export const Feedback = models.Feedback || model("Feedback", FeedbackSchema);
