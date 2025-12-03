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

    // Convert upload URL to public URL if needed
    let publicUrl = fileUrl;

    // If URL is using upload endpoint (.r2.cloudflarestorage.com), convert to public URL
    if (fileUrl.includes('.r2.cloudflarestorage.com')) {
      const publicUrlBase = process.env.CLOUDFLARE_R2_PUBLIC_URL;

      // Check if public URL is correctly configured
      if (!publicUrlBase || publicUrlBase.includes('.r2.cloudflarestorage.com')) {
        console.error("❌ CLOUDFLARE_R2_PUBLIC_URL is not configured correctly.");
        return NextResponse.json({
          publicUrl: null,
          fileName: document.file_name,
          isAccessible: false,
          error: "Configuration Error",
          message: "The server is not configured with a valid Public R2 URL. Please set CLOUDFLARE_R2_PUBLIC_URL to your Public R2.dev domain (e.g., https://pub-xxxx.r2.dev) in .env.local."
        });
      }

      // Extract the path from the upload URL
      try {
        const urlObj = new URL(fileUrl);
        let path = urlObj.pathname;

        // Remove leading slash if present
        if (path.startsWith('/')) {
          path = path.substring(1);
        }

        const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || "woreda-documents";

        // The path from the upload URL typically includes the bucket name (e.g. /bucket-name/path/to/file)
        // But the public URL (if it's a bucket-specific subdomain) maps to the bucket root, so we shouldn't include the bucket name in the path.

        // Remove bucket name from path if it starts with it
        // path currently has leading slash removed, so it looks like "bucket-name/path/to/file"
        if (path.startsWith(bucketName + '/')) {
          path = path.substring(bucketName.length + 1);
        }

        // Construct public URL
        // We assume CLOUDFLARE_R2_PUBLIC_URL points to the root of the bucket
        const base = publicUrlBase.endsWith('/') ? publicUrlBase.slice(0, -1) : publicUrlBase;
        publicUrl = `${base}/${path}`;
      } catch (urlError) {
        console.error("❌ Error parsing URL:", urlError);
        return NextResponse.json(
          { error: "Invalid file URL format." },
          { status: 400 }
        );
      }
    } else if (fileUrl.includes('.r2.dev') || fileUrl.includes('pub-')) {
      // Already a public URL, but verify it's correct format

      try {
        const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || "woreda-documents";
        const urlObj = new URL(publicUrl);
        let path = urlObj.pathname;

        if (path.startsWith('/')) path = path.substring(1);

        // If the path starts with the bucket name, remove it
        if (path.startsWith(bucketName + '/')) {
          console.warn("⚠️  Bucket name found in public URL path, removing it...");
          path = path.substring(bucketName.length + 1);
        }

        // Fix double encoding issues (e.g. %2520 -> %20 -> space)
        // We decode the path to get the raw characters, then encode only the necessary parts if needed
        // But for R2, we usually want the raw path if we are constructing the URL
        try {
          path = decodeURIComponent(path);
        } catch (e) {
          console.warn("Failed to decode path:", path);
        }

        // Re-construct the URL
        // We need to ensure spaces are encoded as %20, but not double encoded
        const parts = path.split('/');
        // encodeURIComponent doesn't encode ( ) ! ' * ~
        // Microsoft Office Viewer might struggle with ( and ) in the URL
        const encodedPath = parts.map(p =>
          encodeURIComponent(p)
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
        ).join('/');

        const base = urlObj.origin;
        publicUrl = `${base}/${encodedPath}`;

        // Fix for the specific double-encoded case mentioned
        // If the original URL had %2520, it means it was double encoded.
        // We want the final URL to have %20, not %2520
      } catch (e) {
        console.error("Error parsing existing public URL:", e);
      }
    } else {
      console.warn("⚠️  Unknown URL format, using as-is:", publicUrl);
    }

    // Verify the public URL is accessible (quick check)
    let isAccessible = false;
    let accessibilityError: string | null = null;

    try {
      const testResponse = await fetch(publicUrl, {
        method: "HEAD",
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(5000),
      });

      if (!testResponse.ok) {
        // Even if the HEAD check fails (e.g. 403 or 404), we should still let the client try.
        // R2 sometimes returns 404 for HEAD but 200 for GET, or blocks server-side requests.
        console.warn("⚠️ Public URL HEAD check failed, but returning as accessible to let client try.");
        console.warn("   URL:", publicUrl);
        console.warn("   Status:", testResponse.status, testResponse.statusText);
        isAccessible = true; // Force true to allow client to try
      } else {
        isAccessible = true;
      }
    } catch (testError: any) {
      console.warn("⚠️ Public URL check error (network/timeout), returning as accessible to let client try.");
      console.warn("   Error:", testError.message);
      isAccessible = true; // Force true to allow client to try
    }

    // Return the public URL with accessibility status
    return NextResponse.json({
      publicUrl: publicUrl,
      fileName: document.file_name,
      isAccessible: isAccessible,
      error: accessibilityError,
      message: !isAccessible
        ? "The file is not publicly accessible. Please ensure 'Public R2.dev Subdomain' is enabled in Cloudflare R2 settings and CLOUDFLARE_R2_PUBLIC_URL is set correctly."
        : null
    });

  } catch (error) {
    console.error("Error in get-public-file-url route:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

