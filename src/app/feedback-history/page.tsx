import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Feedback } from "@/models/Feedback";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function FeedbackHistoryPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  await connectDB();
  const feedback = await Feedback.find({ student: session.sub, status: "Submitted" })
    .select("category subject submittedAt")
    .sort({ submittedAt: -1 })
    .lean();

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold text-navy-900">Feedback history</h1>
        <p className="mt-1 text-sm text-slate-500">Your submitted feedback. Responses remain private.</p>
      </header>
      {feedback.length ? (
        <ul className="card divide-y divide-slate-100 px-5">
          {feedback.map((item) => (
            <li key={String(item._id)} className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="font-medium capitalize text-navy-900">{item.category} feedback{item.subject ? ` - ${item.subject}` : ""}</p>
                <p className="text-xs text-slate-500">{item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : "Submitted"}</p>
              </div>
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs text-green-700">Submitted</span>
            </li>
          ))}
        </ul>
      ) : <p className="card p-5 text-sm text-slate-500">You have not submitted any feedback yet.</p>}
    </div>
  );
}
