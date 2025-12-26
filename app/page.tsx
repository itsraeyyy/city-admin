import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { NewsSection } from "@/components/sections/NewsSection";
import { PrincipalMessage } from "@/components/sections/PrincipalMessage";
import { CommissionMembers } from "@/components/sections/CommissionMembers";
import { Footer } from "@/components/Footer";
import { woredaLeadership } from "@/data/leaders";
import { publicEnv } from "@/lib/env";
import { getCommissionMembers } from "@/lib/data/team";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export const revalidate = 0; // Ensure dynamic data

export default async function Home() {
    const commissionCategories = await getCommissionMembers();
    const supabase = await getSupabaseServerClient();

    // Fetch dynamic leader message
    const { data: messages } = await supabase
        .from("leader_messages")
        .select("*")
        .limit(1);

    const dbLeaderMessage = messages?.[0];

    const principal = dbLeaderMessage ? {
        name: dbLeaderMessage.name,
        title: dbLeaderMessage.title,
        photo: dbLeaderMessage.photo_url || woredaLeadership.principal.photo,
        speech: dbLeaderMessage.message
    } : woredaLeadership.principal;

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
            <HeroSection />

            {/* Administrator Message */}
            <PrincipalMessage principal={principal} />

            {/* News Section (Server Component) - Placed right above Members list */}
            <NewsSection />

            {/* Commission Members Section */}
            <CommissionMembers categories={commissionCategories} />

            {/* Footer */}
            <Footer woredaName={publicEnv.NEXT_PUBLIC_WOREDA_NAME} />
        </div>
    );
}
