import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { getMissingProfileFields } from "@/lib/profile";
import { Student } from "@/models/Student";
import ProfileForm from "./ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  await connectDB();
  const student = await Student.findById(session.sub)
    .select("name registerNumber email mobile dob gender address city state pincode year semester section academicYear college degree department skills languages databases frameworks interests careerObjective linkedin github about photo")
    .lean();
  if (!student) redirect("/login");

  const initialValues = {
    mobile: student.mobile ?? "",
    dob: student.dob ? new Date(student.dob).toISOString().slice(0, 10) : "",
    gender: student.gender ?? "",
    address: student.address ?? "",
    city: student.city ?? "",
    state: student.state ?? "",
    pincode: student.pincode ?? "",
    year: student.year ?? "",
    semester: student.semester?.toString() ?? "",
    section: student.section ?? "",
    academicYear: student.academicYear ?? "",
    college: student.college ?? "",
    degree: student.degree ?? "",
    department: student.department ?? "",
    skills: student.skills?.join(", ") ?? "",
    languages: student.languages?.join(", ") ?? "",
    databases: student.databases?.join(", ") ?? "",
    frameworks: student.frameworks?.join(", ") ?? "",
    interests: student.interests?.join(", ") ?? "",
    careerObjective: student.careerObjective ?? "",
    linkedin: student.linkedin ?? "",
    github: student.github ?? "",
    about: student.about ?? "",
    photo: student.photo ?? "",
  };
  const missingFields = getMissingProfileFields(initialValues);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold text-navy-900">My profile</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your personal, academic, and portfolio information.</p>
      </header>
      <section className={`rounded-xl border p-4 ${missingFields.length ? "border-amber-200 bg-amber-50" : "border-green-200 bg-green-50"}`}>
        <p className={`text-sm font-semibold ${missingFields.length ? "text-amber-900" : "text-green-900"}`}>
          {missingFields.length ? `Profile incomplete · ${missingFields.length} required ${missingFields.length === 1 ? "field" : "fields"} missing` : "Your profile is complete"}
        </p>
        {missingFields.length > 0 && (
          <p className="mt-1 text-sm text-amber-800">Please add: {missingFields.map((field) => field.label).join(", ")}.</p>
        )}
      </section>
      <section className="card grid gap-4 p-5 text-sm sm:grid-cols-3">
        <div><p className="text-xs text-slate-500">Name</p><p className="mt-1 font-medium text-navy-900">{student.name}</p></div>
        <div><p className="text-xs text-slate-500">Register number</p><p className="mt-1 font-medium text-navy-900">{student.registerNumber}</p></div>
        <div><p className="text-xs text-slate-500">Email</p><p className="mt-1 font-medium text-navy-900">{student.email || "Not provided"}</p></div>
      </section>
      <ProfileForm initialValues={initialValues} />
    </div>
  );
}
