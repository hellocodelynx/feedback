import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Bell, CalendarDays, Check, CircleCheck, ClipboardCheck, MapPin, Phone, UserRound } from "lucide-react";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { getMissingProfileFields, requiredProfileFields } from "@/lib/profile";
import { Student } from "@/models/Student";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  await connectDB();
  const student = await Student.findById(session.sub).select("mobile dob gender address city state pincode year semester section academicYear").lean();
  if (!student) redirect("/login");

  const missingFields = getMissingProfileFields(student);
  const completedFields = requiredProfileFields.length - missingFields.length;

  return (
    <div className="space-y-7">
      <header className="relative isolate overflow-hidden rounded-[26px] bg-gradient-to-br from-[#18213e] via-[#28265d] to-[#5540a4] px-6 py-7 text-white shadow-xl shadow-indigo-950/10 sm:px-8 sm:py-9">
        <div className="absolute -right-10 -top-20 -z-10 h-64 w-64 rounded-full bg-violet-300/20 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-[11px] font-medium tracking-wide text-violet-100"><Bell size={13} /> ACCOUNT UPDATES</p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Notifications</h1>
            <p className="mt-2 text-sm text-indigo-100/80">Helpful reminders to keep your student account up to date.</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-medium backdrop-blur">
            {missingFields.length ? <><Bell size={16} /> {missingFields.length} action needed</> : <><CircleCheck size={16} /> All caught up</>}
          </span>
        </div>
      </header>

      <section className="card overflow-hidden">
        <div className={`flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 ${missingFields.length ? "bg-gradient-to-r from-amber-50/80 to-white" : "bg-gradient-to-r from-emerald-50/80 to-white"}`}>
          <div className="flex items-start gap-4">
            <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${missingFields.length ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
              {missingFields.length ? <ClipboardCheck size={21} /> : <CircleCheck size={21} />}
            </span>
            <div className="min-w-0">
              <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${missingFields.length ? "text-amber-700" : "text-emerald-700"}`}>{missingFields.length ? "Profile reminder" : "Profile status"}</p>
              <h2 className="mt-1 text-lg font-semibold text-navy-900">{missingFields.length ? "Finish setting up your profile" : "Your profile is complete"}</h2>
              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-600">
                {missingFields.length
                  ? `Add a few details so your student records stay current. ${missingFields.length} ${missingFields.length === 1 ? "field is" : "fields are"} left.`
                  : "You’ve provided all required personal and academic details. Thanks for keeping your account up to date."}
              </p>
            </div>
          </div>
          {missingFields.length > 0 && (
            <Link href="/profile" className="btn-primary shrink-0">Complete profile <ArrowRight size={15} /></Link>
          )}
        </div>
        <div className="border-t border-slate-100 p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-navy-900">Personal and academic details</h3>
              <p className="mt-1 text-xs text-slate-500">Your information checklist</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">{completedFields} / {requiredProfileFields.length} complete</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Mobile number", key: "mobile", icon: Phone },
              { label: "Date of birth", key: "dob", icon: CalendarDays },
              { label: "Gender", key: "gender", icon: UserRound },
              { label: "Address", key: "address", icon: MapPin },
              { label: "City", key: "city", icon: MapPin },
              { label: "State", key: "state", icon: MapPin },
              { label: "Pincode", key: "pincode", icon: MapPin },
              { label: "Year", key: "year", icon: CalendarDays },
              { label: "Semester", key: "semester", icon: CalendarDays },
              { label: "Section", key: "section", icon: UserRound },
              { label: "Academic year", key: "academicYear", icon: CalendarDays },
            ].map(({ label, key, icon: Icon }) => {
              const complete = !missingFields.some((field) => field.key === key);
              return (
                <div key={key} className={`flex items-center gap-3 rounded-xl border px-3 py-3 ${complete ? "border-emerald-100/80 bg-emerald-50/40" : "border-amber-100/80 bg-amber-50/40"}`}>
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${complete ? "bg-white text-emerald-600" : "bg-white text-amber-600"}`}>
                    {complete ? <Check size={15} /> : <Icon size={15} />}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-700">{label}</span>
                  <span className={`text-[10px] font-semibold ${complete ? "text-emerald-700" : "text-amber-700"}`}>{complete ? "Done" : "Missing"}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
