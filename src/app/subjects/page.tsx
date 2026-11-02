import { connectDB } from "@/lib/db";
import { Subject } from "@/models/Subject";
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Layers3 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SubjectsPage() {
  await connectDB();
  const subjects = await Subject.find().select("code name semester faculty").populate("faculty", "name").sort({ semester: 1, name: 1 }).lean();

  return (
    <div className="space-y-7">
      <header className="relative isolate overflow-hidden rounded-[26px] bg-gradient-to-br from-[#18213e] via-[#28265d] to-[#5540a4] px-6 py-7 text-white shadow-xl shadow-indigo-950/10 sm:px-8 sm:py-9">
        <div className="absolute -right-10 -top-20 -z-10 h-64 w-64 rounded-full bg-violet-300/20 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-[11px] font-medium tracking-wide text-violet-100"><BookOpen size={13} /> YOUR LEARNING</p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">My subjects</h1>
            <p className="mt-2 text-sm text-indigo-100/80">Explore your courses and the faculty guiding each one.</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-medium backdrop-blur">
            <Layers3 size={16} /> {subjects.length} {subjects.length === 1 ? "course" : "courses"}
          </span>
        </div>
      </header>
      {subjects.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {subjects.map((subject) => {
            const facultyName = subject.faculty && "name" in subject.faculty ? subject.faculty.name : "Not assigned";
            return (
              <article key={subject.code} className="card group relative overflow-hidden p-5">
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[64px] bg-violet-50/80 transition duration-300 group-hover:scale-125 group-hover:bg-violet-100/80" />
                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-700 transition duration-300 group-hover:-rotate-3 group-hover:scale-105"><BookOpen size={20} /></span>
                    <span className="rounded-full border border-violet-100 bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-violet-700">{subject.code}</span>
                  </div>
                  <h2 className="mt-5 min-h-12 text-base font-semibold leading-6 text-navy-900">{subject.name}</h2>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600"><GraduationCap size={15} /></span>
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wide text-slate-400">Faculty</p>
                        <p className="truncate text-xs font-medium text-slate-700">{facultyName}</p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[10px] font-medium text-slate-500">Semester {subject.semester}</span>
                  </div>
                  <Link href="/course-feedback" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 transition hover:gap-2.5">
                    Share course feedback <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="card flex flex-col items-center px-6 py-12 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-violet-50 text-violet-600"><BookOpen size={24} /></span>
          <h2 className="mt-4 font-semibold text-navy-900">No subjects yet</h2>
          <p className="mt-1 text-sm text-slate-500">Your course list will appear here when it is available.</p>
        </div>
      )}
    </div>
  );
}
