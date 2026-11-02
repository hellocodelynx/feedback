import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Student } from "@/models/Student";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  await connectDB();
  const student = await Student.findById(session.sub)
    .select("name registerNumber email mobile year semester section academicYear college degree department");
  if (!student) redirect("/login");

  const fields: [string, string | number | undefined][] = [
    ["Name", student.name],
    ["Register number", student.registerNumber],
    ["Email", student.email],
    ["Mobile", student.mobile],
    ["Year", student.year],
    ["Semester", student.semester],
    ["Section", student.section],
    ["Academic year", student.academicYear],
    ["College", student.college],
    ["Degree", student.degree],
    ["Department", student.department],
  ];

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold text-navy-900">My profile</h1>
        <p className="mt-1 text-sm text-slate-500">Your student account information.</p>
      </header>
      <section className="card grid gap-5 p-6 sm:grid-cols-2">
        {fields.map(([label, value]) => (
          <div key={label}><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-sm font-medium text-navy-900">{value || "Not provided"}</p></div>
        ))}
      </section>
    </div>
  );
}
