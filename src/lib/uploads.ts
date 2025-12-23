import { getSupabaseServerClient } from "./supabaseServer";
import { requiredEnv, publicEnv } from "./env";
import type { DocumentUploadRecord } from "@/types";

export async function uploadDocument(args: {
  folderPath: string;
  file: File;
}): Promise<string> {
  try {
    const supabaseAdmin = await getSupabaseServerClient();
    const bucketName = "documents";

    console.log("Supabase Storage Upload Details:", {
      bucketName,
      key: args.folderPath,
      fileName: args.file.name,
      fileSize: args.file.size,
    });

    const fileBuffer = await args.file.arrayBuffer();
    const contentType = args.file.type || "application/octet-stream";

    const { data, error } = await supabaseAdmin
      .storage
      .from(bucketName)
      .upload(args.folderPath, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      throw error;
    }

    const { data: publicUrlData } = supabaseAdmin
      .storage
      .from(bucketName)
      .getPublicUrl(args.folderPath);

    const publicUrl = publicUrlData.publicUrl;
    console.log("Supabase upload successful, returning public URL:", publicUrl);

    return publicUrl;
  } catch (error) {
    console.error("uploadDocument error:", error);
    throw error;
  }
}

// Alias for backward compatibility if needed, but verify usage
export const uploadDocumentToR2 = uploadDocument;


import { getCurrentUserWoredaId } from "./supabaseServer";

export async function saveDocumentMetadata(args: {
  categoryId: string;
  subcategoryCode: string;
  year: string;
  fileName: string;
  r2Url: string;
  uploaderId: string;
}): Promise<DocumentUploadRecord> {
  // Get woreda_id from current user's metadata (Option 2)
  const woredaId = await getCurrentUserWoredaId();
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("uploads")
    .insert({
      woreda_id: woredaId,
      category_id: args.categoryId,
      subcategory_code: args.subcategoryCode,
      year: args.year,
      file_name: args.fileName,
      r2_url: args.r2Url,
      uploader_id: args.uploaderId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save metadata: ${error.message}`);
  }

  if (!data) {
    throw new Error("Failed to save metadata: No data returned from database.");
  }

  return data;
}

export async function getDocumentsForWoreda(
  woredaId: string
): Promise<DocumentUploadRecord[]> {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase
    .from("document_uploads")
    .select("*")
    .eq("woreda_id", woredaId)
    .order("year", { ascending: false })
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getDocumentsForCurrentWoreda(): Promise<DocumentUploadRecord[]> {
  // Get woreda_id from current user's metadata (Option 2)
  const woredaId = await getCurrentUserWoredaId();
  return getDocumentsForWoreda(woredaId);
}

