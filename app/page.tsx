import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { NewsSection } from "@/components/sections/NewsSection";
import { PrincipalMessage } from "@/components/sections/PrincipalMessage";
import { CommissionMembers } from "@/components/sections/CommissionMembers";
import { Footer } from "@/components/Footer";
import { publicEnv } from "@/lib/env";
import { getCommissionMembers } from "@/lib/data/team";

export const revalidate = 0; // Ensure dynamic data

export default async function Home() {
    const commissionCategories = await getCommissionMembers();

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
            <HeroSection />

            {/* Administrator Message */}
            <PrincipalMessage />

            {/* News Section (Server Component) - Placed right above Members list */}
            <NewsSection />

            {/* Commission Members Section */}
            <CommissionMembers categories={commissionCategories} />

            {/* Footer */}
            <Footer woredaName={publicEnv.NEXT_PUBLIC_WOREDA_NAME} />
        </div>
    );
}
