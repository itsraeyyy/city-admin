"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { motion } from "framer-motion";
import { HiCheckCircle, HiXCircle, HiPhoto, HiPaperAirplane } from "react-icons/hi2";
import { useTranslations } from "next-intl";

interface LeaderMessage {
    id: string;
    title: string;
    name: string;
    message: string;
    photo_url: string | null;
}

interface LeaderMessageFormProps {
    initialData: LeaderMessage | null;
}

export function LeaderMessageForm({ initialData }: LeaderMessageFormProps) {
    const t = useTranslations('admin'); // Assuming 'admin' namespace exists, fallback if not
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.photo_url || null);
    const supabase = supabaseBrowser;

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const name = formData.get("name") as string;
        const message = formData.get("message") as string;
        const photoFile = formData.get("photo") as File;

        try {
            let photoUrl = initialData?.photo_url || null;

            // Handle Photo Upload
            if (photoFile && photoFile.size > 0) {
                const fileExt = photoFile.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from("leader-images")
                    .upload(filePath, photoFile);

                if (uploadError) throw new Error("Failed to upload image: " + uploadError.message);

                const { data: { publicUrl } } = supabase.storage
                    .from("leader-images")
                    .getPublicUrl(filePath);

                photoUrl = publicUrl;
            }

            // Upsert Data
            const payload = {
                title,
                name,
                message,
                photo_url: photoUrl,
                updated_at: new Date().toISOString(),
            };

            let error;
            if (initialData?.id) {
                const { error: updateError } = await supabase
                    .from("leader_messages")
                    .update(payload)
                    .eq("id", initialData.id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from("leader_messages")
                    .insert([payload]);
                error = insertError;
            }

            if (error) throw new Error(error.message);

            setStatus({ type: 'success', message: "Leader message saved successfully!" });

            // Redirect back to list after short delay or immediately refresh
            router.push('/admin/leader-message');
            router.refresh();

        } catch (err) {
            console.error(err);
            setStatus({ type: 'error', message: err instanceof Error ? err.message : "An error occurred" });
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
        >
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Photo Upload Section */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-lg group">
                        {previewUrl ? (
                            <Image
                                src={previewUrl}
                                alt="Leader Preview"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                <HiPhoto className="w-10 h-10" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="text-white text-xs font-bold">Change Photo</span>
                        </div>
                        <input
                            type="file"
                            name="photo"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </div>
                    <p className="text-sm text-slate-500">Click to upload photo</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            defaultValue={initialData?.name}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                            placeholder="e.g. Dr. Abiy Ahmed"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700">Title</label>
                        <input
                            type="text"
                            name="title"
                            defaultValue={initialData?.title}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                            placeholder="e.g. Mayor"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">Message</label>
                    <textarea
                        name="message"
                        defaultValue={initialData?.message}
                        required
                        rows={6}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all resize-y"
                        placeholder="Enter the leader's message..."
                    />
                </div>

                {status && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {status.type === 'success' ? <HiCheckCircle className="w-5 h-5" /> : <HiXCircle className="w-5 h-5" />}
                        <p className="font-medium">{status.message}</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <HiPaperAirplane className="w-5 h-5" />
                            <span>Save Changes</span>
                        </>
                    )}
                </button>

            </form>
        </motion.div>
    );
}
