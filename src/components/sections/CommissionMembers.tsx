"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LeaderCategory } from "@/types";
import { HiUser, HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useTranslations } from 'next-intl';

interface CommissionMembersProps {
    categories: LeaderCategory[];
}

export function CommissionMembers({ categories }: CommissionMembersProps) {
    const t = useTranslations();

    // Map category IDs to translation keys
    const getCategoryTitle = (categoryId: string) => {
        const titleMap: Record<string, string> = {
            "commission-committee": t('leaders.commissionCommittee'),
            "management": t('leaders.managementMembers'),
            "work-leadership": t('leaders.workLeadership'),
            "monitoring-committees": t('leaders.monitoringCommittees'),
        };
        return titleMap[categoryId] || categories.find(c => c.id === categoryId)?.title || '';
    };

    // Map member titles to translation keys
    const getMemberTitle = (title: string) => {
        // Map based on key phrases in the title
        if (title.includes('ኮሚቴ ሰብሳቢ') && !title.includes('ኮሚሽን ኮሚቴ')) {
            return t('leaders.titleCommissionChair');
        }
        if (title.includes('ሰብሳቢ') && title.includes('ፅ/ቤት')) {
            return t('leaders.titleOfficeChair');
        }
        if (title.includes('ፀሀፊና') || title.includes('Secretary')) {
            return t('leaders.titleSecretary');
        }
        if (title.includes('የኢንስፔክሽን ዘርፍ') || title.includes('Inspection Sector')) {
            return t('leaders.titleInspectionHead');
        }
        if (title.includes('ም/ሰብሳቢ') || title.includes('Deputy')) {
            return t('leaders.titleDeputyChair');
        }
        if (title.includes('የተቋም ግንባታ') || title.includes('Institution Building')) {
            return t('leaders.titleInstitutionChair');
        }
        if (title.includes('የአካላትና') || title.includes('Bodies and Members Rights')) {
            return t('leaders.titleRightsChair');
        }
        if (title.includes('ፖርቲ ገንዘብ') || title.includes('Party Finance')) {
            return t('leaders.titleFinanceChair');
        }
        // Fallback to original title if no match
        return title;
    };

    const scrollSlider = (id: string, direction: "left" | "right") => {
        const slider = document.getElementById(id);
        if (slider) {
            const scrollAmount = slider.clientWidth * 0.8;
            slider.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <section id="members" className="relative py-20 md:py-32 space-y-24 scroll-mt-32 overflow-hidden bg-slate-50/50">
            {/* Branded background reusing hero image behind members */}
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/herobg.png"
                    alt="Background"
                    fill
                    className="object-cover object-left opacity-[0.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-slate-50/50" />
            </div>

            <div className="mx-auto max-w-7xl px-6 relative z-10">
                <div className="text-center space-y-6 mb-20 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-blue-50 border border-blue-100/50 text-blue-600 text-sm font-semibold tracking-wide"
                    >
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                        {t('leaders.meetTheLeaders')}
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-slate-900 leading-[1.1] tracking-tight"
                    >
                        {t('leaders.membersSubtitle')}
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto"
                    />
                </div>

                <div className="space-y-24">
                    {categories.map((category, catIdx) => (
                        <div key={category.id} className="space-y-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="flex items-end gap-6 px-4 pb-4 border-b border-slate-200"
                            >
                                <div className="space-y-1">
                                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{getCategoryTitle(category.id)}</h3>
                                    {category.id === "commission-committee" && (
                                        <p className="text-sm font-medium text-slate-500">{t('leaders.commissionCommitteeCount')}</p>
                                    )}
                                </div>
                            </motion.div>

                            {/* Slider Container */}
                            <div className="relative group">
                                {/* Navigation Buttons */}
                                <button
                                    onClick={() => scrollSlider(`slider-${category.id}`, "left")}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -ml-5 md:-ml-8 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-xl border border-slate-100 text-slate-700 transition-all hover:bg-blue-600 hover:text-white hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-500/20 opacity-0 group-hover:opacity-100"
                                    aria-label="Scroll left"
                                >
                                    <HiChevronLeft className="h-6 w-6" />
                                </button>
                                <button
                                    onClick={() => scrollSlider(`slider-${category.id}`, "right")}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 -mr-5 md:-mr-8 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-xl border border-slate-100 text-slate-700 transition-all hover:bg-blue-600 hover:text-white hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-500/20 opacity-0 group-hover:opacity-100"
                                    aria-label="Scroll right"
                                >
                                    <HiChevronRight className="h-6 w-6" />
                                </button>

                                {/* Scrollable Area */}
                                <div
                                    id={`slider-${category.id}`}
                                    className="flex overflow-x-auto pb-12 pt-4 gap-8 px-4 snap-x snap-mandatory no-scrollbar scroll-smooth"
                                >
                                    {category.leaders.map((leader, idx) => (
                                        <motion.div
                                            key={`${leader.name}-${idx}`}
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                                            className="flex-none w-72 md:w-80 snap-center relative"
                                        >
                                            <div className="group/card h-full bg-white rounded-[2rem] p-3 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 border border-slate-100 hover:border-blue-100 hover:-translate-y-2">
                                                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] bg-slate-100 mb-5">
                                                    {leader.photo ? (
                                                        <Image
                                                            src={leader.photo}
                                                            alt={leader.name}
                                                            fill
                                                            className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                                                            <HiUser className="h-24 w-24 text-slate-300" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />

                                                    {/* Social/Role overlay on hover */}
                                                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full transition-transform duration-300 group-hover/card:translate-y-0">
                                                        <p className="text-white text-sm font-medium leading-tight opacity-90 backdrop-blur-sm bg-white/10 p-2 rounded-lg border border-white/10">
                                                            {getMemberTitle(leader.title)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="px-2 pb-2 text-center">
                                                    <h4 className="text-xl font-bold text-slate-900 group-hover/card:text-blue-600 transition-colors mb-1.5 line-clamp-1">
                                                        {leader.name}
                                                    </h4>
                                                    <p className="text-sm font-medium text-slate-500 line-clamp-2 h-10 leading-relaxed">
                                                        {getMemberTitle(leader.title)}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Fade edges/gradient for scroll cue */}
                                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none md:block hidden" />
                                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none md:block hidden" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
