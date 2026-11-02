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
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="flex items-center justify-center bg-white p-8">
        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-5">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-700 text-white"><GraduationCap size={22} /></span>
            <div>
              <p className="text-sm font-semibold text-navy-800">Bharathi Institute of Technology</p>
              <p className="text-xs text-slate-500">Department of Computer Applications</p>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-navy-900">MCA Student Feedback Portal</h1>
            <p className="mt-1 text-sm text-slate-500">Welcome back. Sign in to share feedback on your courses and faculty.</p>
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
      <section className="relative hidden overflow-hidden bg-navy-900 p-12 text-white lg:flex lg:flex-col lg:justify-center">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-royal-500/30 blur-3xl" />
        <div className="relative max-w-md space-y-6">
          <h2 className="text-3xl font-semibold leading-snug">Your feedback shapes the next MCA batch.</h2>
          <p className="text-navy-100">Rate faculty, review courses and report campus issues. Responses stay anonymous to faculty.</p>
          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-3"><Code2 size={18} className="text-royal-100" /> Semester IV: Python, Web Technologies, Cloud, ML</p>
            <p className="flex items-center gap-3"><MessageSquareText size={18} className="text-royal-100" /> Three feedback forms are waiting for you</p>
          </div>
        </div>
      </section>
    </main>
  );
}
