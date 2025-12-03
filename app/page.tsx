"use client";

import { useTranslations } from 'next-intl';
import Image from "next/image";
import Link from "next/link";
import { HiLockClosed, HiArrowRight, HiArrowDown } from "react-icons/hi2";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LeadersSection } from "@/components/sections/LeadersSection";
import { Footer } from "@/components/Footer";
import { woredaLeadership } from "@/data/leaders";
import { publicEnv } from "@/lib/env";
import { motion } from "framer-motion";

export default function Home() {
    const t = useTranslations();

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Professional Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                            <Image
                                src="/images.jpg"
                                alt="Logo"
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div>
                            <span className="block text-sm font-bold text-slate-900">
                                {publicEnv.NEXT_PUBLIC_WOREDA_NAME}
                            </span>
                            <span className="block text-xs text-slate-500">Official Portal</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <Link
                            href="/admin/login"
                            className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-[#4169E1] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-[#3557c7] hover:shadow-lg"
                        >
                            <HiLockClosed className="h-4 w-4" />
                            {t('common.adminLogin')}
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section - Text Only, Modern & Clean */}
            <section className="relative flex min-h-[80vh] items-center justify-center bg-slate-50 pt-20">
                <div className="mx-auto max-w-4xl px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <h1 className="text-5xl font-bold leading-tight text-slate-900 lg:text-7xl">
                            Welcome to <span className="text-[#4169E1]">{publicEnv.NEXT_PUBLIC_WOREDA_NAME}</span>
                        </h1>

                        <p className="mx-auto max-w-2xl text-xl leading-relaxed text-slate-600">
                            A hub of transparent governance, community development, and digital innovation.
                            We are dedicated to serving our citizens with integrity and efficiency.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 pt-8">
                            <button
                                onClick={() => scrollToSection('members')}
                                className="group inline-flex items-center gap-2 rounded-full bg-[#4169E1] px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-[#3557c7] hover:scale-105"
                            >
                                View Members
                                <HiArrowDown className="h-5 w-5 transition-transform group-hover:translate-y-1" />
                            </button>

                            <button
                                onClick={() => scrollToSection('message')}
                                className="inline-flex items-center gap-2 rounded-full border-2 border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:border-[#4169E1] hover:text-[#4169E1]"
                            >
                                Leader's Message
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Background decorative elements */}
                <div className="absolute top-1/2 left-10 h-64 w-64 -translate-y-1/2 rounded-full bg-blue-100 blur-3xl opacity-50 pointer-events-none" />
                <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-purple-100 blur-3xl opacity-50 pointer-events-none" />
            </section>

            {/* Leaders & Members Section */}
            <section className="py-24 bg-white">
                <div className="mx-auto max-w-7xl px-6">
                    <LeadersSection
                        principal={woredaLeadership.principal}
                        categories={woredaLeadership.categories}
                    />
                </div>
            </section>

            {/* Minimal Footer */}
            <Footer woredaName={publicEnv.NEXT_PUBLIC_WOREDA_NAME} />
        </div>
    );
}
