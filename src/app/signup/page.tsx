"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, ShieldCheck, Sparkles } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          registerNumber: form.get("registerNumber"),
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      const data = await res.json().catch(() => null) as { error?: string } | null;
      if (!res.ok) {
        setError(data?.error ?? "Unable to create your account.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Unable to reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-[#f7f8fc] lg:grid-cols-[1fr_0.9fr]">
      <section className="relative flex items-center justify-center overflow-hidden p-5 sm:p-10">
        <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-violet-100/70 blur-3xl" />
        <form onSubmit={onSubmit} className="page-transition card relative w-full max-w-lg space-y-5 p-6 sm:p-9">
          <div className="mb-2 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-navy-800 to-violet-700 text-white shadow-lg shadow-violet-200"><GraduationCap size={22} /></span>
            <div><p className="text-sm font-semibold text-navy-900">MCA Feedback Portal</p><p className="text-xs text-slate-500">Student account registration</p></div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">Get started</p>
            <h1 className="text-2xl font-semibold tracking-tight text-navy-900 sm:text-3xl">Create your account</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">Register to access your student feedback workspace.</p>
          </div>
          <label className="block text-sm font-medium">Full name
            <input name="name" required minLength={2} maxLength={100} className="input mt-1.5" autoComplete="name" />
          </label>
          <label className="block text-sm font-medium">Register number
            <input name="registerNumber" required minLength={3} maxLength={30} className="input mt-1.5" autoComplete="username" />
          </label>
          <label className="block text-sm font-medium">Email (optional)
            <input name="email" type="email" className="input mt-1.5" autoComplete="email" />
          </label>
          <label className="block text-sm font-medium">Password
            <input name="password" type="password" required minLength={6} maxLength={100} className="input mt-1.5" autoComplete="new-password" />
          </label>
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button className="btn-primary w-full" disabled={loading}>{loading ? "Creating account..." : "Create account"}</button>
          <p className="text-center text-sm text-slate-500">
            Already registered? <Link href="/login" className="font-medium text-royal-600 hover:underline">Sign in</Link>
          </p>
        </form>
      </section>
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#101932] via-[#202459] to-[#5536a2] p-12 text-white lg:flex lg:flex-col lg:justify-center xl:p-20">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-violet-400/25 blur-3xl" />
        <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-blue-400/15 blur-3xl" />
        <div className="relative max-w-lg space-y-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-xs font-medium text-violet-100"><Sparkles size={14} /> Your student voice matters</span>
          <h2 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">A better learning experience starts here.</h2>
          <p className="text-sm leading-7 text-indigo-100/80">One student workspace for your courses, faculty feedback and campus ideas. Your perspective helps your department grow.</p>
          <p className="flex items-center gap-2 text-sm text-violet-100"><ShieldCheck size={18} /> Your feedback is handled with care.</p>
        </div>
      </section>
    </main>
  );
}
