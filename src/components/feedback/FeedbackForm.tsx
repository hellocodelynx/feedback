"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardList, Heart, MessageSquareText, Send, Sparkles, Star } from "lucide-react";

type Category = "faculty" | "course" | "general";
type Choice = { value: string; label: string };
type FeedbackFormProps = { category: Category };
type ChoiceData = {
  faculty?: { _id: string; name: string; subject: string }[];
  subjects?: { code: string; name: string }[];
};

const ratingLabels: Record<Category, string[]> = {
  faculty: ["Subject knowledge", "Communication", "Availability"],
  course: ["Course content", "Learning resources", "Workload balance"],
  general: ["Campus facilities", "Student support", "Overall experience"],
};

const title: Record<Category, string> = {
  faculty: "Faculty feedback",
  course: "Course feedback",
  general: "General feedback",
};

export default function FeedbackForm({ category }: FeedbackFormProps) {
  const [choices, setChoices] = useState<Choice[]>([]);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(category !== "general");
  const [submitted, setSubmitted] = useState(false);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const missingRatings = ratingLabels[category].filter((label) => !ratings[label]);

  useEffect(() => {
    if (category === "general") return;
    const endpoint = category === "faculty" ? "/api/faculty" : "/api/subjects";
    fetch(endpoint)
      .then(async (res) => {
        const data = await res.json().catch(() => null) as ChoiceData & { error?: string } | null;
        if (!res.ok) throw new Error(data?.error ?? "Unable to load feedback options.");
        const options = category === "faculty"
          ? (data?.faculty ?? []).map((item) => ({ value: item._id, label: `${item.name} - ${item.subject}` }))
          : (data?.subjects ?? []).map((item) => ({ value: item.code, label: item.name }));
        setChoices(options);
      })
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Unable to load feedback options."))
      .finally(() => setLoading(false));
  }, [category]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (missingRatings.length) {
      setError("Please rate each category before submitting.");
      return;
    }
    const form = new FormData(e.currentTarget);
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          ...(category !== "general" ? { target: selected } : {}),
          ratings,
          likes: form.get("likes"),
          improvements: form.get("improvements"),
          comments: form.get("comments"),
        }),
      });
      const data = await res.json().catch(() => null) as { error?: string } | null;
      if (!res.ok) {
        setError(data?.error ?? "Unable to submit feedback.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Unable to reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <section role="status" className="card mx-auto max-w-2xl overflow-hidden text-center">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-6 py-10 text-white">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-white/20 bg-white/15"><CheckCircle2 size={32} /></span>
          <h1 className="mt-5 text-2xl font-semibold">Feedback submitted</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-emerald-50">Thank you for taking the time to help improve your learning experience.</p>
        </div>
        <div className="p-6">
          <Link href="/feedback-history" className="btn-primary">View feedback history <ArrowRight size={16} /></Link>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <header className="relative isolate overflow-hidden rounded-[26px] bg-gradient-to-br from-[#18213e] via-[#28265d] to-[#5540a4] px-6 py-7 text-white shadow-xl shadow-indigo-950/10 sm:px-8 sm:py-9">
        <div className="absolute -right-10 -top-20 -z-10 h-64 w-64 rounded-full bg-violet-300/20 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <span className="hidden h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/10 sm:grid">
            {category === "general" ? <Heart size={22} /> : category === "faculty" ? <Star size={22} /> : <ClipboardList size={22} />}
          </span>
          <div>
            <p className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-violet-200"><Sparkles size={13} /> Your voice matters</p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title[category]}</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100/80">Your honest feedback helps us make meaningful improvements. Responses are kept private.</p>
          </div>
        </div>
      </header>

      <form onSubmit={onSubmit} className="card mx-auto max-w-4xl overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-7">
          <div>
            <h2 className="font-semibold text-navy-900">Your feedback</h2>
            <p className="mt-1 text-xs text-slate-500">A few quick ratings and any details you’d like to share.</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-[11px] font-semibold text-violet-700"><MessageSquareText size={13} /> Private</span>
        </div>

        <div className="space-y-7 p-5 sm:p-7">
          {category !== "general" && (
            <label className="block text-sm font-medium">
              {category === "faculty" ? "Faculty member" : "Subject"}
              <select required value={selected} onChange={(e) => setSelected(e.target.value)} className="input mt-2" disabled={loading}>
                <option value="">Select an option</option>
                {choices.map((choice) => <option key={choice.value} value={choice.value}>{choice.label}</option>)}
              </select>
            </label>
          )}

          <fieldset>
            <legend className="text-sm font-semibold text-navy-900">Rate your experience</legend>
            <p className="mt-1 text-xs text-slate-500">Choose one score for each category. 5 is excellent.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {ratingLabels[category].map((label) => {
                const score = ratings[label] ?? 0;
                return (
                  <div key={label} className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 transition hover:border-violet-200 hover:bg-violet-50/40">
                    <p className="text-sm font-medium text-slate-800">{label}</p>
                    <div className="mt-3 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          aria-label={`${label}: ${value} out of 5`}
                          aria-pressed={score === value}
                          onClick={() => {
                            setRatings((current) => ({ ...current, [label]: value }));
                            setError("");
                          }}
                          className={`grid h-9 w-9 place-items-center rounded-lg transition duration-150 hover:scale-110 ${score >= value ? "text-amber-500" : "text-slate-300 hover:text-amber-400"}`}
                        >
                          <Star size={19} fill={score >= value ? "currentColor" : "none"} strokeWidth={1.8} />
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-[11px] font-medium text-violet-700">
                      {score ? ["", "Needs improvement", "Fair", "Good", "Very good", "Excellent"][score] : "Select a rating"}
                    </p>
                  </div>
                );
              })}
            </div>
          </fieldset>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium">What is working well?
              <textarea name="likes" maxLength={2000} placeholder="Share what you appreciate…" className="input mt-2 min-h-28 resize-y" />
            </label>
            <label className="block text-sm font-medium">What could be improved?
              <textarea name="improvements" maxLength={2000} placeholder="Tell us what could be better…" className="input mt-2 min-h-28 resize-y" />
            </label>
            <label className="block text-sm font-medium md:col-span-2">Additional comments <span className="font-normal text-slate-400">(optional)</span>
              <textarea name="comments" maxLength={2000} placeholder="Anything else you’d like us to know?" className="input mt-2 min-h-24 resize-y" />
            </label>
          </div>
          {error && <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <div className="flex flex-col-reverse items-start justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
            <p className="text-xs text-slate-500">{missingRatings.length ? `${missingRatings.length} rating${missingRatings.length === 1 ? "" : "s"} remaining` : "All ratings complete — ready to submit"}</p>
            <button className="btn-primary w-full sm:w-auto" disabled={loading || (category !== "general" && choices.length === 0)}>
              <Send size={15} />{loading ? "Loading..." : "Submit feedback"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
