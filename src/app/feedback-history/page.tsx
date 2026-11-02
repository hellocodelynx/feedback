import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Building2, CheckCircle2, ClipboardList, History, MessageSquareText, Star } from "lucide-react";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Feedback } from "@/models/Feedback";

export const dynamic = "force-dynamic";

const categoryDetails = {
  faculty: { label: "Faculty feedback", icon: Star, color: "bg-violet-100 text-violet-700" },
  course: { label: "Course feedback", icon: ClipboardList, color: "bg-sky-100 text-sky-700" },
  general: { label: "Campus feedback", icon: Building2, color: "bg-amber-100 text-amber-700" },
} as const;

export default async function FeedbackHistoryPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  await connectDB();
  const feedback = await Feedback.find({ student: session.sub, status: "Submitted" })
    .select("category subject submittedAt")
    .sort({ submittedAt: -1 })
    .lean();

  const facultyCount = feedback.filter((item) => item.category === "faculty").length;
  const courseCount = feedback.filter((item) => item.category === "course").length;
  const campusCount = feedback.filter((item) => item.category === "general").length;

  return (
    <div className="space-y-7">
      <header className="relative isolate overflow-hidden rounded-[26px] bg-gradient-to-br from-[#18213e] via-[#28265d] to-[#5540a4] px-6 py-7 text-white shadow-xl shadow-indigo-950/10 sm:px-8 sm:py-9">
        <div className="absolute -right-10 -top-20 -z-10 h-64 w-64 rounded-full bg-violet-300/20 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-[11px] font-medium tracking-wide text-violet-100"><History size={13} /> YOUR CONTRIBUTIONS</p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Feedback history</h1>
            <p className="mt-2 text-sm text-indigo-100/80">A record of the feedback you’ve shared with your department.</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-medium backdrop-blur">
            <CheckCircle2 size={16} /> {feedback.length} submitted
          </span>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "All submissions", value: feedback.length, icon: MessageSquareText, tone: "bg-violet-50 text-violet-700" },
          { label: "Faculty feedback", value: facultyCount, icon: Star, tone: "bg-sky-50 text-sky-700" },
          { label: "Course feedback", value: courseCount, icon: ClipboardList, tone: "bg-amber-50 text-amber-700" },
          { label: "Campus feedback", value: campusCount, icon: Building2, tone: "bg-emerald-50 text-emerald-700" },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="card flex items-center gap-4 p-5">
            <span className={`grid h-11 w-11 place-items-center rounded-2xl ${tone}`}><Icon size={19} /></span>
            <div><p className="text-xl font-semibold text-navy-900">{value}</p><p className="mt-0.5 text-xs font-medium text-slate-500">{label}</p></div>
          </div>
        ))}
      </div>

      <section className="card overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-semibold text-navy-900">Your submissions</h2>
            <p className="mt-1 text-xs text-slate-500">Most recent feedback appears first.</p>
          </div>
          <span className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 sm:inline-flex">Private responses</span>
        </div>
        {feedback.length ? (
          <ul className="divide-y divide-slate-100/80 px-5 sm:px-6">
            {feedback.map((item) => {
              const details = categoryDetails[item.category as keyof typeof categoryDetails] ?? categoryDetails.general;
              const Icon = details.icon;
              return (
                <li key={String(item._id)} className="flex items-center gap-4 py-4 transition hover:bg-slate-50/60">
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${details.color}`}><Icon size={18} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-navy-900">{details.label}{item.subject ? ` · ${item.subject}` : ""}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.submittedAt ? new Date(item.submittedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "Submitted"}</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-700"><CheckCircle2 size={12} /> Submitted</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-violet-50 text-violet-600"><History size={24} /></span>
            <h3 className="mt-4 font-semibold text-navy-900">Your story starts here</h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">Once you submit feedback, you’ll find a private record of it here.</p>
            <Link href="/faculty-feedback" className="btn-primary mt-5">Share feedback <ArrowRight size={15} /></Link>
          </div>
        )}
      </section>
    </div>
  );
}
