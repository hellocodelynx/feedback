"use client";
import { useEffect, useState } from "react";

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
    const form = new FormData(e.currentTarget);
    const ratings = Object.fromEntries(
      ratingLabels[category].map((label, index) => [label, Number(form.get(`rating-${index}`))]),
    );
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
    return <p role="status" className="rounded-xl bg-green-50 p-5 text-green-800">Your feedback has been submitted. Thank you.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="card max-w-2xl space-y-5 p-6">
      <h1 className="text-2xl font-semibold text-navy-900">{title[category]}</h1>
      {category !== "general" && (
        <label className="block text-sm font-medium">
          {category === "faculty" ? "Faculty member" : "Subject"}
          <select required value={selected} onChange={(e) => setSelected(e.target.value)} className="input mt-1.5" disabled={loading}>
            <option value="">Select an option</option>
            {choices.map((choice) => <option key={choice.value} value={choice.value}>{choice.label}</option>)}
          </select>
        </label>
      )}
      {ratingLabels[category].map((label, index) => (
        <label key={label} className="block text-sm font-medium">
          {label}
          <select name={`rating-${index}`} required defaultValue="" className="input mt-1.5">
            <option value="" disabled>Choose a rating</option>
            {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} - {["", "Poor", "Fair", "Good", "Very good", "Excellent"][value]}</option>)}
          </select>
        </label>
      ))}
      <label className="block text-sm font-medium">What is working well?
        <textarea name="likes" maxLength={2000} className="input mt-1.5 min-h-20" />
      </label>
      <label className="block text-sm font-medium">What could be improved?
        <textarea name="improvements" maxLength={2000} className="input mt-1.5 min-h-20" />
      </label>
      <label className="block text-sm font-medium">Additional comments
        <textarea name="comments" maxLength={2000} className="input mt-1.5 min-h-20" />
      </label>
      {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <button className="btn-primary" disabled={loading || (category !== "general" && choices.length === 0)}>
        {loading ? "Loading..." : "Submit feedback"}
      </button>
    </form>
  );
}
