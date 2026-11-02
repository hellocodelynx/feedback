import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Student } from "@/models/Student";

const optionalText = (max: number) => z.string().trim().max(max).optional();
const schema = z.object({
  mobile: optionalText(30),
  dob: z.string().date().or(z.literal("")).optional(),
  gender: optionalText(50),
  address: optionalText(300),
  city: optionalText(100),
  state: optionalText(100),
  pincode: optionalText(20),
  year: optionalText(30),
  semester: z.number().int().min(1).max(8).nullable().optional(),
  section: optionalText(30),
  academicYear: optionalText(30),
  college: optionalText(150),
  degree: optionalText(100),
  department: optionalText(100),
  skills: z.array(z.string().trim().min(1).max(50)).max(30).optional(),
  languages: z.array(z.string().trim().min(1).max(50)).max(30).optional(),
  databases: z.array(z.string().trim().min(1).max(50)).max(30).optional(),
  frameworks: z.array(z.string().trim().min(1).max(50)).max(30).optional(),
  interests: z.array(z.string().trim().min(1).max(50)).max(30).optional(),
  careerObjective: optionalText(1000),
  linkedin: optionalText(300),
  github: optionalText(300),
  about: optionalText(2000),
  photo: optionalText(1000),
});

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please sign in to update your profile." }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid profile information." }, { status: 400 });
  }

  try {
    await connectDB();
    const { dob, ...profileFields } = parsed.data;
    const updates = {
      ...profileFields,
      ...(dob !== undefined ? { dob: dob ? new Date(`${dob}T00:00:00.000Z`) : null } : {}),
    };
    const student = await Student.findByIdAndUpdate(
      session.sub,
      { $set: updates },
      { new: true, runValidators: true },
    ).select("_id");
    if (!student) return NextResponse.json({ error: "Student account not found." }, { status: 404 });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Student profile update failed:", error);
    return NextResponse.json({ error: "Unable to update your profile right now." }, { status: 500 });
  }
}
