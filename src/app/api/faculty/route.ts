import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Faculty } from "@/models/Faculty";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  await connectDB();
  const faculty = await Faculty.find().select("name designation subject semester").sort({ name: 1 }).lean();
  return NextResponse.json({ faculty });
}
