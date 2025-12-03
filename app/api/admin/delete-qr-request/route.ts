import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";

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

        const supabase = getSupabaseAdminClient();

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

        // Also delete any associated temporary access records
        await supabase
            .from("temporary_access")
            .delete()
            .eq("qr_request_id", requestId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in delete QR request route:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
