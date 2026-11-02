"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, User, Briefcase, Users, BookOpen, Star, ClipboardList, Building2, History, Bell, LifeBuoy, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "My Profile", icon: User },
  { href: "/portfolio", label: "My Portfolio", icon: Briefcase },
  { href: "/faculty", label: "Faculty Directory", icon: Users },
  { href: "/subjects", label: "My Subjects", icon: BookOpen },
  { href: "/faculty-feedback", label: "Faculty Feedback", icon: Star },
  { href: "/course-feedback", label: "Course Feedback", icon: ClipboardList },
  { href: "/general-feedback", label: "General Feedback", icon: Building2 },
  { href: "/feedback-history", label: "Feedback History", icon: History },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/support", label: "Help & Support", icon: LifeBuoy },
];

export default function Sidebar() {
  const path = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <aside className={`sticky top-0 flex h-screen shrink-0 flex-col bg-navy-900 text-navy-100 transition-[width] ${collapsed ? "w-[72px]" : "w-64"}`}>
      <div className="flex items-center justify-between px-4 py-5">
        {!collapsed && <span className="text-sm font-semibold text-white">MCA Feedback</span>}
        <button onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar" className="rounded-lg p-1.5 hover:bg-white/10">
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {items.map(({ href, label, icon: Icon }) => {
          const active = path === href || path.startsWith(href + "/");
          return (
            <Link key={href} href={href} title={label}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active ? "bg-royal-500 text-white" : "hover:bg-white/10"}`}>
              <Icon size={18} className="shrink-0" />{!collapsed && label}
            </Link>
          );
        })}
      </nav>
      <button onClick={logout} className="m-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-white/10">
        <LogOut size={18} />{!collapsed && "Logout"}
      </button>
    </aside>
  );
}
