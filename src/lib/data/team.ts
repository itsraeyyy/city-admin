import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { LeaderCategory } from "@/types";

export async function getCommissionMembers(): Promise<LeaderCategory[]> {
    const supabase = await getSupabaseServerClient();
    const { data: members, error } = await supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true });

    if (error) {
        console.error("Error fetching team members:", JSON.stringify(error, null, 2));
        console.error("Error details:", error.message, error.code, error.details);
        return [];
    }

    if (!members) return [];

    const categoriesMap: Record<string, LeaderCategory> = {
        committee: {
            id: "commission-committee",
            title: "የኮሚሽን ኮሚቴ አባላት", // Fallback title
            leaders: [],
        },
        management: {
            id: "management",
            title: "የኮሚሽን ማኔጅመንት አባላት",
            leaders: [],
        },
        staff: {
            id: "work-leadership",
            title: "ስራ አባላት",
            leaders: [],
        },
    };

    members.forEach((member) => {
        const categoryKey = member.category;
        if (categoriesMap[categoryKey]) {
            categoriesMap[categoryKey].leaders.push({
                name: member.name,
                title: member.role || "",
                photo: member.image_url || "",
            });
        }
    });

    // Return categories in specific order
    return [
        categoriesMap.committee,
        categoriesMap.management,
        categoriesMap.staff,
    ].filter(c => c.leaders.length > 0);
}
