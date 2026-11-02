import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { COOKIE, signToken } from "@/lib/auth";
import { Student } from "@/models/Student";

const schema = z.object({
  registerNumber: z.string().trim().min(3, "Enter your register number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const { registerNumber, password, remember } = parsed.data;

  try {
    await connectDB();
    const student = await Student.findOne({ registerNumber: registerNumber.toUpperCase() }).select("+passwordHash");
    const ok = student && (await bcrypt.compare(password, student.passwordHash));
    if (!ok) return NextResponse.json({ error: "Register number or password is incorrect" }, { status: 401 });

    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE, signToken({ sub: String(student._id), registerNumber: student.registerNumber }), {
      httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/",
      ...(remember ? { maxAge: 60 * 60 * 24 * 7 } : {}),
    });
    return res;
  } catch (error) {
    console.error("Login request failed:", error);
    return NextResponse.json(
      { error: "Unable to sign in right now. Check that MongoDB is running and try again." },
      { status: 500 },
    );
  }
}
