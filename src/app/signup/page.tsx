"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <main className="grid min-h-screen place-items-center bg-slate-50 p-6">
      <form onSubmit={onSubmit} className="card w-full max-w-md space-y-5 p-8">
        <div>
          <h1 className="text-2xl font-semibold text-navy-900">Create your student account</h1>
          <p className="mt-1 text-sm text-slate-500">Register to access the MCA feedback portal.</p>
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
          Already registered? <Link href="/login" className="text-royal-600 hover:underline">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
