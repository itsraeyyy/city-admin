"use client";

import Image from "next/image";
import { HiPencil, HiTrash, HiUser } from "react-icons/hi2";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LeaderMessage {
    id: string;
    title: string;
    name: string;
    message: string;
    photo_url: string | null;
}

interface LeaderMessageListProps {
    messages: LeaderMessage[];
}

export function LeaderMessageList({ messages }: LeaderMessageListProps) {
    const router = useRouter();
    const supabase = supabaseBrowser;
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this message?")) return;

        setDeletingId(id);
        try {
            const { error } = await supabase
                .from("leader_messages")
                .delete()
                .eq("id", id);

            if (error) throw error;
            router.refresh();
        } catch (error) {
            console.error("Error deleting message:", error);
            alert("Failed to delete message");
        } finally {
            setDeletingId(null);
        }
    };

    if (messages.length === 0) {
        return (
            <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                No leader messages found. Create one to get started.
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {messages.map((msg) => (
                <div key={msg.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="relative h-48 bg-slate-100">
                        {msg.photo_url ? (
                            <Image
                                src={msg.photo_url}
                                alt={msg.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                <HiUser className="w-12 h-12" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                            <h3 className="font-bold truncate">{msg.name}</h3>
                            <p className="text-sm opacity-90 truncate">{msg.title}</p>
                        </div>
                    </div>

                    <div className="p-4 space-y-4">
                        <p className="text-slate-600 text-sm line-clamp-3 h-[4.5em]">
                            {msg.message}
                        </p>

                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                            <button
                                onClick={() => router.push(`/admin/leader-message?id=${msg.id}`)}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                                <HiPencil className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleDelete(msg.id)}
                                disabled={deletingId === msg.id}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {deletingId === msg.id ? (
                                    <span className="w-5 h-5 block border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                                ) : (
                                    <HiTrash className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
