import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const documentId = searchParams.get("id");

        if (!documentId) {
            return NextResponse.json(
                { error: "Document ID is required" },
                { status: 400 }
            );
        }

        const supabase = await getSupabaseServerClient();

        // Get document details first
        const { data: document, error: fetchError } = await supabase
            .from("uploads")
            .select("*")
            .eq("id", documentId)
            .single();

        if (fetchError || !document) {
            return NextResponse.json(
                { error: "Document not found" },
                { status: 404 }
            );
        }

        // Delete from Storage (Supabase)
        try {
            const fileUrl = document.r2_url;
            // Extract path from Supabase URL
            // Format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
            // We need <path>

            let path = "";
            const bucketName = "documents"; // Should match bucket name in uploads.ts

            if (fileUrl && fileUrl.includes(bucketName)) {
                // Simple extraction strategy: find bucket name and take everything after
                const parts = fileUrl.split(`/${bucketName}/`);
                if (parts.length > 1) {
                    path = parts[1];
                }
            }

            if (path) {
                // Decode URI component just in case
                path = decodeURIComponent(path);

                console.log(`Deleting file from Supabase Storage: ${path}`);
                const { error: storageError } = await supabase
                    .storage
                    .from(bucketName)
                    .remove([path]);

                if (storageError) {
                    console.error("Error deleting from Supabase Storage:", storageError);
                    // We continue to delete from DB even if storage fails
                } else {
                    console.log("File deleted from Supabase Storage");
                }
            } else {
                console.log("Could not extract path from URL (might be legacy R2 URL), skipping storage deletion:", fileUrl);
            }

        } catch (error) {
            console.error("Error in storage deletion process:", error);
        }

        // Delete from database
        const { error: deleteError } = await supabase
            .from("uploads")
            .delete()
            .eq("id", documentId);

        if (deleteError) {
            return NextResponse.json(
                { error: "Failed to delete document from database" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in delete document route:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
