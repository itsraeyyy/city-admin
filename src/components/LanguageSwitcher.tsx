"use client";

import { useEffect, useState, useTransition } from "react";
import { HiLanguage } from "react-icons/hi2";

const languages = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "am", name: "Amharic", nativeName: "አማርኛ" },
    { code: "om", name: "Oromifa", nativeName: "Afaan Oromoo" },
];

export function LanguageSwitcher() {
    const [isPending, startTransition] = useTransition();
    const [currentLocale, setCurrentLocale] = useState("en");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Only run on client side after mount
        const locale = document.cookie
            .split('; ')
            .find(row => row.startsWith('NEXT_LOCALE='))
            ?.split('=')[1] || 'en';
        setCurrentLocale(locale);
        setMounted(true);
    }, []);

    const changeLanguage = (locale: string) => {
        startTransition(() => {
            // Set cookie for locale
            document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
            // Reload to apply new locale
            window.location.reload();
        });
    };

    // Render a placeholder during SSR to avoid hydration mismatch
    if (!mounted) {
        return (
            <div className="relative group">
                <button
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                    disabled
                >
                    <HiLanguage className="h-4 w-4" />
                    <span className="hidden sm:inline">English</span>
                </button>
            </div>
        );
    }

    return (
        <div className="relative group">
            <button
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                disabled={isPending}
            >
                <HiLanguage className="h-4 w-4" />
                <span className="hidden sm:inline">
                    {languages.find(l => l.code === currentLocale)?.nativeName || "English"}
                </span>
            </button>

            <div className="absolute right-0 top-full mt-2 hidden w-48 rounded-2xl border border-slate-200 bg-white shadow-xl group-hover:block">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full px-4 py-3 text-left text-sm transition first:rounded-t-2xl last:rounded-b-2xl hover:bg-slate-50 ${currentLocale === lang.code ? "bg-blue-50 font-semibold text-blue-600" : "text-slate-700"
                            }`}
                        disabled={isPending}
                    >
                        <div className="font-medium">{lang.nativeName}</div>
                        <div className="text-xs text-slate-500">{lang.name}</div>
                    </button>
                ))}
            </div>
        </div>
    );
}
