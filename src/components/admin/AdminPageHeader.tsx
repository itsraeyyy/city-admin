"use client";

import { HiDocumentArrowUp, HiDocumentText, HiQrCode, HiChartBar, HiCalendar } from "react-icons/hi2";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";

interface AdminPageHeaderProps {
  icon: "upload" | "documents" | "qr" | "requests" | "dashboard" | "appointments";
  titleKey: string;
  descriptionKey: string;
  gradient: string;
}

const iconMap = {
  upload: HiDocumentArrowUp,
  documents: HiDocumentText,
  qr: HiQrCode,
  requests: HiQrCode,
  dashboard: HiChartBar,
  appointments: HiCalendar,
};

export function AdminPageHeader({ icon, titleKey, descriptionKey, gradient }: AdminPageHeaderProps) {
  const t = useTranslations('admin');
  const Icon = iconMap[icon];

  return (
    <section className={`relative overflow-hidden rounded-3xl p-8 md:p-12 text-white shadow-2xl`} style={{
      backgroundImage: `url('/herobg.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-slate-900/60" />

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex items-center gap-6"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30">
          <Icon className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 leading-tight">
            {t(titleKey)}
          </h1>
          <p className="text-lg text-white/90 leading-relaxed max-w-2xl">
            {t(descriptionKey)}
          </p>
        </div>
      </motion.div>
    </section>
  );
}

