import { NextResponse } from "next/server";
import { validateTemporaryAccess } from "@/lib/access";
import { getDocumentsForWoreda } from "@/lib/uploads";

/**
 * This endpoint validates access and returns the direct R2 public URL
 * for Office documents. Microsoft Office Online Viewer requires a publicly
 * accessible URL, so we can't use our authenticated proxy.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get("url");
    const token = searchParams.get("token");

    if (!fileUrl || !token) {
      return NextResponse.json(
        { error: "File URL and token are required." },
        { status: 400 }
      );
    }

    // Validate the temporary access token
    const accessRecord = await validateTemporaryAccess(token);
    if (!accessRecord) {
      return NextResponse.json(
        { error: "Invalid or expired access token." },
        { status: 401 }
      );
    }

    // Verify the file belongs to the user's woreda
    const documents = await getDocumentsForWoreda(accessRecord.woreda_id);
    const document = documents.find((doc) => doc.r2_url === fileUrl);

    if (!document) {
      return NextResponse.json(
        { error: "File not found or access denied." },
        { status: 404 }
      );
    }

    // For Supabase Storage, the URL stored is already a public URL.
    // We can simply return it.
    const publicUrl = fileUrl;

    // Check accessibility (optional, but good for verification)
    let isAccessible = true;
    try {
      const testResponse = await fetch(publicUrl, {
        method: "HEAD",
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(5000),
      });
      if (!testResponse.ok) {
        console.warn("⚠️ Public URL HEAD check failed.", testResponse.status);
        // We still return it as accessible to let the client try, 
        // as HEAD requests might be blocked while GET works.
      }
    } catch (e) {
      console.warn("⚠️ Public URL check error:", e);
    }

    return NextResponse.json({
      publicUrl: publicUrl,
      fileName: document.file_name,
      isAccessible: true,
      error: null,
      message: null
    });

  } catch (error) {
    console.error("Error in get-public-file-url route:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
