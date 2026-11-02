import Link from "next/link";
import { redirect } from "next/navigation";
import { Users, BookOpen, Clock, CheckCircle2 } from "lucide-react";
import ProgressDonut from "@/components/dashboard/ProgressDonut";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Faculty } from "@/models/Faculty";
import { Feedback } from "@/models/Feedback";
import { Student } from "@/models/Student";
import { Subject } from "@/models/Subject";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const session = await getSession();
  if (!session) redirect("/login");
  await connectDB();

  const student = await Student.findById(session.sub).select("name registerNumber semester academicYear year section mentor").populate("mentor", "name");
  if (!student) redirect("/login");

  const semesterFilter = student.semester ? { semester: student.semester } : {};
  const [faculty, subjects, submittedFeedback] = await Promise.all([
    Faculty.find(semesterFilter).select("name subject").sort({ name: 1 }).lean(),
    Subject.find(semesterFilter).select("code name faculty").populate("faculty", "name").sort({ name: 1 }).lean(),
    Feedback.find({ student: student._id, status: "Submitted" }).select("category faculty subject").lean(),
  ]);
  const submittedKeys = new Set(submittedFeedback.map((item) =>
    item.category === "faculty" ? `faculty:${String(item.faculty)}` :
      item.category === "course" ? `course:${item.subject}` : "general",
  ));
  const totalForms = faculty.length + subjects.length + 1;
  const done = submittedKeys.size;
  const pending = [
    ...faculty.filter((item) => !submittedKeys.has(`faculty:${String(item._id)}`)).map((item) => ({
      id: String(item._id), label: item.subject, detail: item.name, href: "/faculty-feedback",
    })),
    ...subjects.filter((item) => !submittedKeys.has(`course:${item.code}`)).map((item) => ({
      id: item.code, label: item.name, detail: "Course feedback", href: "/course-feedback",
    })),
    ...(!submittedKeys.has("general") ? [{ id: "general", label: "Campus experience", detail: "General feedback", href: "/general-feedback" }] : []),
  ];
  const mentor = student.mentor && "name" in student.mentor ? student.mentor.name : "Not assigned";

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-navy-900">Welcome back, {student.name.split(" ")[0]}</h1>
        <p className="text-sm text-slate-500">
          {student.semester ? `Semester ${student.semester}` : student.year ?? "Student"}{student.academicYear ? ` · Academic year ${student.academicYear}` : ""}.
          {" "}{pending.length ? `You have ${pending.length} feedback form${pending.length === 1 ? "" : "s"} to complete.` : "You are up to date on feedback."}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total faculty", value: faculty.length, icon: Users },
          { label: "Total subjects", value: subjects.length, icon: BookOpen },
          { label: "Pending feedback", value: pending.length, icon: Clock },
          { label: "Submitted feedback", value: done, icon: CheckCircle2 },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="card flex items-center gap-4 p-5">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-royal-50 text-royal-600"><Icon size={20} /></span>
            <div><p className="text-2xl font-semibold text-navy-900">{value}</p><p className="text-xs text-slate-500">{label}</p></div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="card p-6 xl:col-span-2">
          <h2 className="mb-4 font-semibold text-navy-900">Pending feedback forms</h2>
          {pending.length ? (
            <ul className="divide-y divide-slate-100">
              {pending.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-4 py-3">
                  <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-slate-500">{item.detail}</p></div>
                  <Link href={item.href} className="btn-ghost !py-1.5">Give feedback</Link>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-slate-500">There are no feedback forms available yet.</p>}
        </section>
        <section className="card flex flex-col items-center p-6">
          <h2 className="mb-4 self-start font-semibold text-navy-900">Submission progress</h2>
          <ProgressDonut done={done} total={totalForms} />
          <p className="mt-3 text-sm text-slate-500">{done} of {totalForms} forms submitted</p>
        </section>
      </div>

      <section className="card grid gap-4 p-6 text-sm sm:grid-cols-3">
        {[
          ["Register number", student.registerNumber],
          ["Section", student.section ?? "Not assigned"],
          ["Mentor", mentor],
        ].map(([label, value]) => (
          <div key={label}><p className="text-xs text-slate-500">{label}</p><p className="font-medium">{value}</p></div>
        ))}
      </section>
    </div>
  );
}
