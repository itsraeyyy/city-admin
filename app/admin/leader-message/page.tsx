import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { LeaderMessageForm } from "@/components/admin/LeaderMessageForm";

export default async function LeaderMessagePage() {
    const supabase = await getSupabaseServerClient();

    // Fetch existing message to populate form
    const { data: messages } = await supabase
        .from("leader_messages")
        .select("*")
        .limit(1);

    const initialData = messages && messages.length > 0 ? messages[0] : null;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Leader Message</h1>
                <p className="text-slate-500 mt-2">Update the message displayed from the leader on the home page.</p>
            </div>

            <LeaderMessageForm initialData={initialData} />
        </div>
    );
}
