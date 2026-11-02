import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BookOpen, CheckCircle2, Clock, GraduationCap, Sparkles, Users } from "lucide-react";
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
    <div className="space-y-7">
      <header className="relative isolate overflow-hidden rounded-[26px] bg-gradient-to-br from-[#111b35] via-[#202459] to-[#5434a4] px-6 py-7 text-white shadow-xl shadow-indigo-950/10 sm:px-8 sm:py-9">
        <div className="absolute -right-10 -top-24 -z-10 h-72 w-72 rounded-full bg-violet-400/25 blur-3xl" />
        <div className="absolute -bottom-36 right-1/4 -z-10 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-[11px] font-medium tracking-wide text-violet-100">
              <Sparkles size={13} /> YOUR STUDENT WORKSPACE
            </p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Welcome back, {student.name.split(" ")[0]}</h1>
            <p className="mt-2 text-sm leading-6 text-indigo-100/80">
              {student.semester ? `Semester ${student.semester}` : student.year ?? "Student"}{student.academicYear ? ` · Academic year ${student.academicYear}` : ""}.
              {" "}{pending.length ? `You have ${pending.length} feedback form${pending.length === 1 ? "" : "s"} to complete.` : "You are up to date on feedback."}
            </p>
          </div>
          <Link href="/profile" className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15">
            <GraduationCap size={17} /> View profile <ArrowRight size={15} />
          </Link>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total faculty", value: faculty.length, icon: Users, tone: "bg-sky-50 text-sky-700" },
          { label: "Total subjects", value: subjects.length, icon: BookOpen, tone: "bg-violet-50 text-violet-700" },
          { label: "Pending feedback", value: pending.length, icon: Clock, tone: "bg-amber-50 text-amber-700" },
          { label: "Submitted feedback", value: done, icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-700" },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="card flex items-center gap-4 p-5 sm:p-5">
            <span className={`grid h-12 w-12 place-items-center rounded-2xl ${tone}`}><Icon size={20} /></span>
            <div><p className="text-2xl font-semibold tracking-tight text-navy-900">{value}</p><p className="mt-0.5 text-xs font-medium text-slate-500">{label}</p></div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="card p-5 sm:p-6 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-navy-900">Pending feedback forms</h2>
              <p className="mt-1 text-xs text-slate-500">Share your perspective with your department.</p>
            </div>
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">{pending.length} pending</span>
          </div>
          {pending.length ? (
            <ul className="divide-y divide-slate-100/80">
              {pending.map((item) => (
                <li key={item.id} className="group flex items-center justify-between gap-4 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">{item.label}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.detail}</p>
                  </div>
                  <Link href={item.href} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-violet-700 transition hover:bg-violet-50">
                    Give feedback <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : <p className="rounded-xl bg-emerald-50/70 px-4 py-5 text-sm text-emerald-800">There are no feedback forms available yet. You’re all caught up.</p>}
        </section>
        <section className="card flex flex-col items-center p-5 sm:p-6">
          <div className="mb-2 w-full">
            <h2 className="font-semibold text-navy-900">Submission progress</h2>
            <p className="mt-1 text-xs text-slate-500">Your feedback journey at a glance.</p>
          </div>
          <ProgressDonut done={done} total={totalForms} />
          <p className="mt-1 text-sm font-medium text-slate-600">{done} of {totalForms} forms submitted</p>
        </section>
      </div>

      <section className="card grid gap-4 p-5 text-sm sm:grid-cols-3 sm:p-6">
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
