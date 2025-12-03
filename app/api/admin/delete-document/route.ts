import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

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

        const supabase = getSupabaseAdminClient();

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

        // Delete from R2
        try {
            const uploadUrl = process.env.CLOUDFLARE_R2_UPLOAD_URL;
            if (!uploadUrl) {
                throw new Error("CLOUDFLARE_R2_UPLOAD_URL not configured");
            }

            const urlObj = new URL(uploadUrl);
            const endpoint = `https://${urlObj.hostname}`;
            const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || "woreda-documents";

            const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
            const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

            if (!accessKeyId || !secretAccessKey) {
                throw new Error("R2 credentials not configured");
            }

            // Extract the key from the R2 URL
            const r2Url = document.r2_url;
            let key = "";

            if (r2Url.includes('.r2.dev')) {
                const r2UrlObj = new URL(r2Url);
                key = r2UrlObj.pathname.substring(1); // Remove leading slash

                // Remove bucket name if it's in the path
                if (key.startsWith(bucketName + '/')) {
                    key = key.substring(bucketName.length + 1);
                }
            }

            const s3Client = new S3Client({
                region: "auto",
                endpoint: endpoint,
                credentials: {
                    accessKeyId: accessKeyId,
                    secretAccessKey: secretAccessKey,
                },
                forcePathStyle: true,
            });

            const deleteCommand = new DeleteObjectCommand({
                Bucket: bucketName,
                Key: key,
            });

            await s3Client.send(deleteCommand);
        } catch (r2Error) {
            console.error("Error deleting from R2:", r2Error);
            // Continue with database deletion even if R2 deletion fails
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
