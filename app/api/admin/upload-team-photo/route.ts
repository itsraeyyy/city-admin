import { NextRequest, NextResponse } from "next/server";
import { uploadDocument } from "@/lib/uploads";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Sanitize filename and create a unique path
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const folderPath = `team/${timestamp}-${safeName}`;

        const url = await uploadDocument({
            folderPath,
            file
        });

        return NextResponse.json({ url });
    } catch (error) {
        console.error("Team photo upload error:", error);
        return NextResponse.json(
            { error: "Failed to upload image" },
            { status: 500 }
        );
    }
}
