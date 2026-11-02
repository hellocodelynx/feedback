"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bell, ChevronRight, GraduationCap, Menu } from "lucide-react";
import Sidebar from "./Sidebar";

const pageTitles: Record<string, string> = {
  "/dashboard": "Overview",
  "/profile": "My profile",
  "/faculty": "Faculty directory",
  "/subjects": "My subjects",
  "/faculty-feedback": "Faculty feedback",
  "/course-feedback": "Course feedback",
  "/general-feedback": "Campus feedback",
  "/feedback-history": "Feedback history",
  "/notifications": "Notifications",
  "/support": "Help & support",
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (isAuthPage) return <>{children}</>;

  const title = pageTitles[pathname] ?? "Student portal";

  return (
    <div className="app-backdrop flex min-h-screen">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="relative min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur-xl sm:px-7 lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open navigation" className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:border-violet-200 hover:text-violet-700 lg:hidden">
              <Menu size={18} />
            </button>
            <div className="flex min-w-0 items-center gap-2 text-sm">
              <span className="hidden text-slate-400 sm:inline">Workspace</span>
              <ChevronRight size={14} className="hidden text-slate-300 sm:block" />
              <span className="truncate font-semibold text-slate-800">{title}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 rounded-xl bg-violet-50/80 px-3 py-2 text-xs font-medium text-violet-700 md:flex">
              <GraduationCap size={15} />
              <span>MCA Student Portal</span>
            </div>
            <Link href="/notifications" aria-label="View notifications" className="relative grid h-9 w-9 place-items-center rounded-xl border border-slate-200/80 bg-white text-slate-500 transition hover:border-violet-200 hover:text-violet-700">
              <Bell size={17} />
            </Link>
            <Link href="/profile" aria-label="View profile" className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-semibold text-white shadow-md shadow-violet-200 transition hover:scale-105">
              ST
            </Link>
          </div>
        </header>
        <main className="page-transition mx-auto w-full max-w-[1600px] p-4 sm:p-7 lg:px-10 lg:py-9">{children}</main>
        <footer className="px-5 pb-5 pt-1 text-center text-[11px] text-slate-400 sm:text-left sm:px-10">
          MCA Student Feedback Portal <span className="mx-1.5">·</span> Your voice helps us improve
        </footer>
      </div>
    </div>
  );
}
