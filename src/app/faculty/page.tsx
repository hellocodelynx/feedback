import { connectDB } from "@/lib/db";
import { Faculty } from "@/models/Faculty";
import Link from "next/link";
import { ArrowRight, BookOpen, Mail, Sparkles, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FacultyPage() {
  await connectDB();
  const faculty = await Faculty.find().select("name designation department subject experienceYears qualification intro email office semester").sort({ name: 1 }).lean();

  return (
    <div className="space-y-7">
      <header className="relative isolate overflow-hidden rounded-[26px] bg-gradient-to-br from-[#18213e] via-[#28265d] to-[#5540a4] px-6 py-7 text-white shadow-xl shadow-indigo-950/10 sm:px-8 sm:py-9">
        <div className="absolute -right-10 -top-20 -z-10 h-64 w-64 rounded-full bg-indigo-300/20 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-[11px] font-medium tracking-wide text-violet-100"><Sparkles size={13} /> YOUR ACADEMIC COMMUNITY</p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Faculty directory</h1>
            <p className="mt-2 text-sm text-indigo-100/80">Meet the faculty supporting your MCA journey.</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-medium backdrop-blur">
            <Users size={16} /> {faculty.length} {faculty.length === 1 ? "faculty member" : "faculty members"}
          </span>
        </div>
      </header>
      {faculty.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {faculty.map((member) => (
            <article key={String(member._id)} className="card group relative overflow-hidden p-5">
              <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-violet-50 transition duration-300 group-hover:scale-125 group-hover:bg-violet-100/80" />
              <div className="relative">
                <div className="flex items-start gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-semibold text-white shadow-md shadow-violet-200">
                    {member.name.split(/\s+/).slice(0, 2).map((part: string) => part[0]).join("").toUpperCase()}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <h2 className="truncate font-semibold text-navy-900">{member.name}</h2>
                    <p className="mt-1 truncate text-xs text-slate-500">{member.designation || member.department || "Faculty member"}</p>
                  </div>
                </div>
                <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Teaches</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">{member.subject || "Subject not listed"}</p>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  {member.qualification ? <p className="truncate text-xs text-slate-500">{member.qualification}</p> : <span />}
                  {member.email && (
                    <a className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-violet-50 hover:text-violet-700" href={`mailto:${member.email}`}>
                      <Mail size={14} /> Contact
                    </a>
                  )}
                </div>
                <Link href="/faculty-feedback" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 transition hover:gap-2.5">
                  Give feedback <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="card flex flex-col items-center px-6 py-12 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-violet-50 text-violet-600"><Users size={24} /></span>
          <h2 className="mt-4 font-semibold text-navy-900">No faculty listed yet</h2>
          <p className="mt-1 text-sm text-slate-500">Faculty information will appear here when available.</p>
        </div>
      )}
    </div>
  );
}
