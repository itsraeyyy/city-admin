import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { LeaderMessageForm } from "@/components/admin/LeaderMessageForm";
import { LeaderMessageList } from "@/components/admin/LeaderMessageList";
import Link from "next/link";
import { HiPlus } from "react-icons/hi2";

export default async function LeaderMessagePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const supabase = await getSupabaseServerClient();
    const { id } = await searchParams; // Next.js 15+ searchParams is a promise
    const isEditingOrCreating = id !== undefined || id === 'new';

    // If editing or creating
    if (isEditingOrCreating) {
        let initialData = null;

        if (id && id !== 'new') {
            const { data } = await supabase
                .from("leader_messages")
                .select("*")
                .eq("id", id)
                .single();
            initialData = data;
        }

        return (
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            {initialData ? "Edit Leader Message" : "New Leader Message"}
                        </h1>
                        <p className="text-slate-500 mt-2">
                            {initialData ? "Update existing message details." : "Create a new leader message."}
                        </p>
                    </div>
                    <Link
                        href="/admin/leader-message"
                        className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium border border-slate-200"
                    >
                        Cancel
                    </Link>
                </div>

                <LeaderMessageForm initialData={initialData} />
            </div>
        );
    }

    // List View
    const { data: messages } = await supabase
        .from("leader_messages")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Leader Messages</h1>
                    <p className="text-slate-500 mt-2">Manage messages displayed on the home page slider.</p>
                </div>
                <Link
                    href="/admin/leader-message?id=new"
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                    <HiPlus className="w-5 h-5" />
                    <span>Add New Message</span>
                </Link>
            </div>

            <LeaderMessageList messages={messages || []} />
        </div>
    );
}
