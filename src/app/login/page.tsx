"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, GraduationCap, Code2, MessageSquareText } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registerNumber: f.get("registerNumber"), password: f.get("password"), remember: f.get("remember") === "on" }),
      });
      const data = await res.json().catch(() => null) as { error?: string } | null;
      if (res.ok) router.push("/dashboard");
      else setError(data?.error ?? "Sign in failed. Please try again.");
    } catch {
      setError("Unable to reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-[#f7f8fc] lg:grid-cols-2">
      <section className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-white to-violet-50/60 p-6 sm:p-10">
        <div className="pointer-events-none absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-indigo-100/60 blur-3xl" />
        <form onSubmit={onSubmit} className="page-transition relative w-full max-w-sm space-y-6">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-navy-800 to-violet-700 text-white shadow-lg shadow-violet-200"><GraduationCap size={23} /></span>
            <div>
              <p className="text-sm font-semibold text-navy-800">Bharathi Institute of Technology</p>
              <p className="text-xs text-slate-500">Department of Computer Applications</p>
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">Student workspace</p>
            <h1 className="text-3xl font-semibold tracking-tight text-navy-900">Welcome back</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">Sign in to share feedback on your courses and faculty.</p>
          </div>
          <label className="block text-sm font-medium">Register number
            <input name="registerNumber" required placeholder="MCA2026001" className="input mt-1.5" autoComplete="username" />
          </label>
          <label className="block text-sm font-medium">Password
            <span className="relative mt-1.5 block">
              <input name="password" type={show ? "text" : "password"} required className="input pr-11" autoComplete="current-password" />
              <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy-700">
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
          </label>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" name="remember" className="accent-royal-500" /> Remember me</label>
            <a href="#" className="text-royal-600 hover:underline">Forgot password?</a>
          </div>
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button className="btn-primary w-full" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
          <p className="text-center text-sm text-slate-500">
            New student? <Link href="/signup" className="text-royal-600 hover:underline">Create an account</Link>
          </p>
          <p className="text-center text-sm text-slate-500">Trouble signing in? <a href="/support" className="text-royal-600 hover:underline">Contact support</a></p>
        </form>
      </section>
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#101932] via-[#202459] to-[#5536a2] p-12 text-white lg:flex lg:flex-col lg:justify-center xl:p-20">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-violet-400/25 blur-3xl" />
        <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-blue-400/15 blur-3xl" />
        <div className="absolute right-16 top-16 h-36 w-36 rounded-full border border-white/[0.08]" />
        <div className="absolute right-24 top-24 h-20 w-20 rounded-full border border-white/[0.08]" />
        <div className="relative max-w-lg space-y-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-xs font-medium text-violet-100"><MessageSquareText size={14} /> A better campus starts with you</span>
          <h2 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">Your feedback shapes the next MCA batch.</h2>
          <p className="max-w-md text-sm leading-7 text-indigo-100/80">Rate faculty, review courses and share campus ideas. Your thoughtful feedback helps make every semester better.</p>
          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-3"><Code2 size={18} className="text-violet-200" /> Semester IV: Python, Web Technologies, Cloud, ML</p>
            <p className="flex items-center gap-3"><MessageSquareText size={18} className="text-violet-200" /> Your voice makes a difference</p>
          </div>
        </div>
      </section>
    </main>
  );
}
