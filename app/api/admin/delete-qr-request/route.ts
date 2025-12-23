import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const requestId = searchParams.get("id");

        if (!requestId) {
            return NextResponse.json(
                { error: "Request ID is required" },
                { status: 400 }
            );
        }

        const supabase = await getSupabaseServerClient();

        // Delete the QR request
        const { error: deleteError } = await supabase
            .from("qr_requests")
            .delete()
            .eq("id", requestId);

        if (deleteError) {
            console.error("Error deleting QR request:", deleteError);
            return NextResponse.json(
                { error: "Failed to delete request" },
                { status: 500 }
            );
        }



        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in delete QR request route:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
