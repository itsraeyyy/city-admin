"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiHome, HiQrCode, HiDocumentArrowUp, HiDocumentText, HiLockClosed } from "react-icons/hi2";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: HiHome },
  { href: "/admin/upload", label: "Upload", icon: HiDocumentArrowUp },
  { href: "/admin/documents", label: "Documents", icon: HiDocumentText },
  { href: "/admin/qr-generator", label: "QR Gen", icon: HiQrCode },
  { href: "/admin/requests", label: "Requests", icon: HiQrCode },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-screen w-64 flex-col border-r border-slate-200 bg-white fixed left-0 top-0 z-40">
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4169E1]/10">
            <HiLockClosed className="h-5 w-5 text-[#4169E1]" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Admin Portal
            </p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive
                    ? "bg-[#4169E1] text-white shadow-md shadow-blue-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-[#4169E1]"
                  }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-200 p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-[#4169E1]"
          >
            <HiHome className="h-5 w-5" />
            Public Site
          </Link>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white px-4 pb-safe pt-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${isActive
                    ? "text-[#4169E1]"
                    : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                <Icon className={`h-6 w-6 ${isActive ? "scale-110" : ""}`} />
                <span className={`text-[10px] font-medium transition-all duration-300 ${isActive ? "opacity-100 max-h-4" : "opacity-0 max-h-0 overflow-hidden"
                  }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
