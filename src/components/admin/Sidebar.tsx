"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { HiHome, HiQrCode, HiDocumentArrowUp, HiDocumentText, HiLockClosed, HiArrowRightOnRectangle, HiUserCircle, HiChartBar, HiCalendar } from "react-icons/hi2";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useState } from "react";

const navItems = [
  { href: "/admin/dashboard", label: "dashboard", icon: HiChartBar },
  { href: "/admin/upload", label: "upload", icon: HiDocumentArrowUp },
  { href: "/admin/documents", label: "documents", icon: HiDocumentText },
  { href: "/admin/qr-generator", label: "generateQR", icon: HiQrCode },
  { href: "/admin/requests", label: "qrRequests", icon: HiQrCode },
  { href: "/admin/appointments", label: "appointments", icon: HiCalendar },
];

export function Sidebar() {
  const t = useTranslations('admin');
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabaseBrowser.auth.signOut();
      router.push("/admin/login");
    } catch (error) {
      console.error("Error logging out:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-screen w-64 flex-col fixed left-0 top-0 z-40 bg-white border-r border-slate-200 shadow-xl">
        {/* Header */}
        <div className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5" />
          <div className="relative flex h-20 items-center gap-4 px-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">
                {t('administrator')}
              </p>
              <p className="text-xs font-medium text-slate-500 truncate">
                {t('secureAdminPortal')}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`group relative flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className={`relative z-10 h-5 w-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"}`} />
                  <span className="relative z-10">{t(item.label)}</span>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="relative z-10 ml-auto h-2 w-2 rounded-full bg-white"
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="border-t border-slate-200 p-4 space-y-2 bg-slate-50/50">
          <Link
            href="/"
            className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-all hover:bg-white hover:text-blue-600 hover:shadow-sm"
          >
            <HiHome className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            <span>{t('publicSite')}</span>
            <HiArrowRightOnRectangle className="h-4 w-4 ml-auto text-slate-400 group-hover:text-blue-600 transition-colors" />
          </Link>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 text-sm font-bold text-white shadow-lg transition-all hover:from-red-700 hover:to-red-800 hover:shadow-xl disabled:opacity-50"
          >
            <HiArrowRightOnRectangle className="h-5 w-5" />
            <span>{isLoggingOut ? t('loggingOut') : t('logout')}</span>
          </motion.button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-lg px-2 pb-safe pt-2 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all duration-300 min-w-[60px] ${
                  isActive
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveIndicator"
                    className="absolute inset-0 rounded-2xl bg-blue-50"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={`relative z-10 h-6 w-6 ${isActive ? "text-blue-600 scale-110" : ""} transition-transform`} />
                <span className={`relative z-10 text-[10px] font-bold transition-all duration-300 ${
                  isActive ? "opacity-100 max-h-4 text-blue-600" : "opacity-0 max-h-0 overflow-hidden"
                }`}>
                  {t(item.label)}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
