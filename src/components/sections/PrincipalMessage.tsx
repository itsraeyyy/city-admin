"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { HiUser, HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

interface LeaderMessage {
    id: string;
    title: string;
    name: string;
    message: string;
    photo_url: string | null;
}

export function PrincipalMessage() {
    const [messages, setMessages] = useState<LeaderMessage[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const supabase = supabaseBrowser;

    useEffect(() => {
        const fetchMessages = async () => {
            const { data } = await supabase
                .from("leader_messages")
                .select("*")
                .order("created_at", { ascending: false });

            if (data) {
                setMessages(data);
            }
            setLoading(false);
        };

        fetchMessages();
    }, []);

    const nextMessage = () => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
    };

    const prevMessage = () => {
        setCurrentIndex((prev) => (prev - 1 + messages.length) % messages.length);
    };

    // Auto-advance
    useEffect(() => {
        if (messages.length <= 1) return;
        const timer = setInterval(nextMessage, 8000);
        return () => clearInterval(timer);
    }, [messages.length]);

    if (loading) return null; // Or a skeleton
    if (messages.length === 0) return null;

    const currentMessage = messages[currentIndex];

    return (
        <section id="message" className="relative py-12 md:py-24 scroll-mt-32 overflow-hidden bg-slate-50/50">
            {/* Soft background reusing hero image */}
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/herobg.png"
                    alt="Background"
                    fill
                    className="object-cover opacity-10"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/90 to-white" />
            </div>

            <div className="mx-auto max-w-7xl px-6 relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentMessage.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                        className="grid gap-12 lg:grid-cols-2 items-center"
                    >
                        {/* Left: Large Photo */}
                        <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:mx-0 overflow-hidden rounded-[40px] bg-gradient-to-br from-blue-100 to-purple-100 shadow-2xl group">
                            {currentMessage.photo_url ? (
                                <Image
                                    src={currentMessage.photo_url}
                                    alt={currentMessage.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-6 text-slate-400">
                                        <HiUser className="h-40 w-40" />
                                    </div>
                                </div>
                            )}
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/20 to-transparent" />

                            {/* Name Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                                <motion.h2
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-3xl font-bold mb-2"
                                >
                                    {currentMessage.name}
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-lg font-medium opacity-90 text-blue-100"
                                >
                                    {currentMessage.title}
                                </motion.p>
                            </div>
                        </div>

                        {/* Right: Text Content */}
                        <div className="space-y-8 text-center lg:text-left relative">
                            {/* Message Heading */}
                            <div className="inline-flex items-center gap-3 rounded-full bg-blue-50 px-5 py-2.5 text-blue-600 border border-blue-100">
                                <span className="relative flex h-3 w-3">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                                    <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500" />
                                </span>
                                <span className="text-sm font-bold uppercase tracking-wider">
                                    Message from {currentMessage.title}
                                </span>
                            </div>

                            {/* Quote Content */}
                            <blockquote className="relative">
                                {/* Decorative Quotes */}
                                <span className="absolute -top-6 -left-4 text-8xl text-blue-100 font-serif opacity-50 select-none">"</span>

                                <p className="text-xl md:text-2xl font-medium leading-relaxed text-slate-700 lg:text-3xl relative z-10">
                                    {currentMessage.message}
                                </p>
                            </blockquote>

                            {/* Decorative Line */}
                            <div className="pt-4">
                                <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto lg:mx-0" />
                            </div>

                            {/* Navigation Controls */}
                            {messages.length > 1 && (
                                <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
                                    <button
                                        onClick={prevMessage}
                                        className="p-3 rounded-full bg-white text-slate-600 shadow-md hover:bg-slate-50 hover:text-indigo-600 transition-all border border-slate-100"
                                    >
                                        <HiChevronLeft className="w-6 h-6" />
                                    </button>
                                    <div className="flex gap-2">
                                        {messages.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentIndex(idx)}
                                                className={`h-2.5 rounded-full transition-all ${idx === currentIndex
                                                    ? 'w-8 bg-indigo-600'
                                                    : 'w-2.5 bg-slate-300 hover:bg-indigo-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        onClick={nextMessage}
                                        className="p-3 rounded-full bg-white text-slate-600 shadow-md hover:bg-slate-50 hover:text-indigo-600 transition-all border border-slate-100"
                                    >
                                        <HiChevronRight className="w-6 h-6" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
