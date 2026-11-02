"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, User, Users, BookOpen, Star, ClipboardList, Building2,
  History, Bell, LogOut, PanelLeftClose, PanelLeftOpen, X,
} from "lucide-react";

const items = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/profile", label: "My profile", icon: User },
  { href: "/faculty", label: "Faculty directory", icon: Users },
  { href: "/subjects", label: "My subjects", icon: BookOpen },
  { href: "/faculty-feedback", label: "Faculty feedback", icon: Star },
  { href: "/course-feedback", label: "Course feedback", icon: ClipboardList },
  { href: "/general-feedback", label: "Campus feedback", icon: Building2 },
  { href: "/feedback-history", label: "Feedback history", icon: History },
  { href: "/notifications", label: "Notifications", icon: Bell },
];

type SidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const path = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-navy-950/45 backdrop-blur-sm lg:hidden"
        />
      )}
      <aside className={`sidebar-panel fixed inset-y-0 left-0 z-50 flex w-[min(84vw,286px)] flex-col border-r border-white/10 bg-[#111b35] text-slate-300 shadow-2xl transition-[transform,width] duration-300 ease-out lg:sticky lg:z-20 lg:h-screen lg:translate-x-0 lg:shadow-none ${mobileOpen ? "translate-x-0" : "-translate-x-full"} ${collapsed ? "lg:w-[82px]" : "lg:w-[264px]"}`}>
        <div className={`flex h-[76px] items-center justify-between border-b border-white/[0.07] px-5 ${collapsed ? "lg:justify-center lg:px-3" : ""}`}>
          <Link href="/dashboard" onClick={onClose} className={`flex min-w-0 items-center gap-3 ${collapsed ? "lg:justify-center" : ""}`}>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-400 to-indigo-500 text-white shadow-lg shadow-violet-950/30">
              <span className="font-bold tracking-tight">M</span>
            </span>
            <span className={`min-w-0 ${collapsed ? "lg:hidden" : ""}`}>
              <span className="block truncate text-sm font-semibold tracking-wide text-white">MCA Feedback</span>
              <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">Student portal</span>
            </span>
          </Link>
          <button type="button" onClick={onClose} aria-label="Close navigation" className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden">
            <X size={18} />
          </button>
          <button type="button" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} className="hidden rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:inline-flex">
            {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
          </button>
        </div>

        <div className="px-5 pb-2 pt-7">
          <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 ${collapsed ? "lg:hidden" : ""}`}>Workspace</p>
        </div>
        <nav aria-label="Main navigation" className="flex-1 space-y-1 overflow-y-auto px-3 pb-5">
          {items.map(({ href, label, icon: Icon }) => {
            const active = path === href || path.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition duration-200 ${collapsed ? "lg:justify-center lg:px-0" : ""} ${active ? "bg-violet-500/15 text-white" : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-100"}`}
              >
                {active && <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-violet-400" />}
                <Icon size={18} strokeWidth={active ? 2.2 : 1.8} className={`shrink-0 transition-colors ${active ? "text-violet-300" : "text-slate-500 group-hover:text-slate-200"}`} />
                <span className={collapsed ? "lg:hidden" : ""}>{label}</span>
                {active && !collapsed && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_10px_rgba(196,181,253,.8)]" />}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/[0.07] p-3">
          <div className={`mb-3 flex items-center gap-3 rounded-xl bg-white/[0.04] p-3 ${collapsed ? "lg:hidden" : ""}`}>
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 text-xs font-semibold text-white">ST</div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-slate-200">Student account</p>
              <p className="mt-0.5 text-[10px] text-slate-500">Feedback workspace</p>
            </div>
          </div>
          <button type="button" onClick={logout} title={collapsed ? "Sign out" : undefined} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-400 transition hover:bg-rose-400/10 hover:text-rose-200 ${collapsed ? "lg:justify-center lg:px-0" : ""}`}>
            <LogOut size={18} className="shrink-0" /><span className={collapsed ? "lg:hidden" : ""}>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
