"use client";

import { useTranslations } from 'next-intl';

interface FooterProps {
  woredaName: string;
}

export function Footer({ woredaName }: FooterProps) {
  const t = useTranslations('footer');

  return (
    <footer className="border-t border-slate-100 bg-white py-12">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-900">
            {woredaName}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Official Government Portal
          </p>
        </div>

        <div className="flex gap-8 text-sm text-slate-600">
          <a href="#" className="hover:text-[#4169E1] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[#4169E1] transition-colors">Terms</a>
          <a href="#" className="hover:text-[#4169E1] transition-colors">Contact</a>
        </div>

        <div className="text-xs text-slate-400">
          © {new Date().getFullYear()} All rights reserved.
        </div>
      </div>
    </footer>
  );
}
