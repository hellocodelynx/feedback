import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { COOKIE, signToken } from "@/lib/auth";
import { Student } from "@/models/Student";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  registerNumber: z.string().trim().min(3, "Enter your register number").max(30),
  email: z.string().trim().email("Enter a valid email address").optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { name, registerNumber, email, password } = parsed.data;
  try {
    await connectDB();
    const student = await Student.create({
      name,
      registerNumber: registerNumber.toUpperCase(),
      ...(email ? { email } : {}),
      passwordHash: await bcrypt.hash(password, 12),
    });

    const res = NextResponse.json({ ok: true }, { status: 201 });
    res.cookies.set(COOKIE, signToken({ sub: String(student._id), registerNumber: student.registerNumber }), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      return NextResponse.json({ error: "That register number is already registered." }, { status: 409 });
    }
    console.error("Student registration failed:", error);
    return NextResponse.json({ error: "Unable to create your account right now." }, { status: 500 });
  }
}
