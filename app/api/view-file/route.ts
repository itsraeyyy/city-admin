import { NextResponse } from "next/server";
import { validateTemporaryAccess } from "@/lib/access";
import { getDocumentsForWoreda } from "@/lib/uploads";

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

    // Fetch the file
    let fileResponse: Response | null = null;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      console.log(`Fetching file from: ${fileUrl}`);
      const res = await fetch(fileUrl, {
        method: "GET",
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: controller.signal,
      });

      if (res.ok) {
        fileResponse = res;
      } else {
        console.warn(`Failed to fetch file: ${fileUrl} (${res.status})`);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') throw err;
      console.warn(`Error fetching file: ${fileUrl}`, err);
    } finally {
      clearTimeout(timeoutId);
    }

    if (!fileResponse || !fileResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch file from storage. The file may not be accessible." },
        { status: 404 }
      );
    }

    console.log(`Successfully fetched file`);

    // 4. Return the file
    const fileBuffer = await fileResponse.arrayBuffer();
    const contentType = fileResponse.headers.get("content-type") || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${encodeURIComponent(document.file_name)}"`,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Cache-Control": "public, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });


  } catch (error) {
    console.error("Error in view-file route:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
