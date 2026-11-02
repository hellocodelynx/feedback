import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Faculty } from "@/models/Faculty";
import { Feedback } from "@/models/Feedback";
import { Student } from "@/models/Student";
import { Subject } from "@/models/Subject";

const schema = z.object({
  category: z.enum(["faculty", "course", "general"]),
  target: z.string().trim().optional(),
  ratings: z.record(z.string(), z.number().int().min(1).max(5)),
  likes: z.string().trim().max(2000).optional(),
  improvements: z.string().trim().max(2000).optional(),
  comments: z.string().trim().max(2000).optional(),
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  await connectDB();
  const feedback = await Feedback.find({ student: session.sub, status: "Submitted" })
    .select("category faculty subject ratings likes improvements comments submittedAt")
    .populate("faculty", "name")
    .sort({ submittedAt: -1 })
    .lean();
  return NextResponse.json({ feedback });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { category, target, ratings, likes, improvements, comments } = parsed.data;
  if (Object.keys(ratings).length === 0) {
    return NextResponse.json({ error: "Provide at least one rating." }, { status: 400 });
  }
  if (category !== "general" && !target) {
    return NextResponse.json({ error: "Choose a faculty member or subject." }, { status: 400 });
  }

  try {
    await connectDB();
    const student = await Student.findById(session.sub).select("semester");
    if (!student) return NextResponse.json({ error: "Student account not found." }, { status: 404 });

    let facultyId;
    let subjectCode;
    if (category === "faculty") {
      const faculty = await Faculty.findById(target).select("_id");
      if (!faculty) return NextResponse.json({ error: "Faculty member not found." }, { status: 404 });
      facultyId = faculty._id;
    } else if (category === "course") {
      const subject = await Subject.findOne({ code: target }).select("code semester");
      if (!subject || (student.semester && subject.semester !== student.semester)) {
        return NextResponse.json({ error: "Subject not found for your semester." }, { status: 404 });
      }
      subjectCode = subject.code;
    }

    await Feedback.create({
      refId: crypto.randomUUID(),
      category,
      student: student._id,
      ...(facultyId ? { faculty: facultyId } : {}),
      ...(subjectCode ? { subject: subjectCode } : {}),
      ratings,
      likes,
      improvements,
      comments,
      status: "Submitted",
      submittedAt: new Date(),
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      return NextResponse.json({ error: "You have already submitted this feedback." }, { status: 409 });
    }
    console.error("Feedback submission failed:", error);
    return NextResponse.json({ error: "Unable to save feedback right now." }, { status: 500 });
  }
}
