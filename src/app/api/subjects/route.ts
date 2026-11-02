import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Subject } from "@/models/Subject";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  await connectDB();
  const subjects = await Subject.find().select("code name semester faculty").populate("faculty", "name").sort({ semester: 1, name: 1 }).lean();
  return NextResponse.json({ subjects });
}
