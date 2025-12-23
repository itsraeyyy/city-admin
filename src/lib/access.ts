import { randomUUID } from "crypto";
import { getSupabaseServerClient } from "./supabaseServer";
import { publicEnv } from "./env";
import { getCurrentUserWoredaId } from "./supabaseServer";
import type { QrRequestRecord, TemporaryAccessRecord } from "@/types";

const EXPIRE_HOURS = 2;

export async function recordQrAccessRequest(args: {
  code: string;
  ipAddress: string;
}): Promise<QrRequestRecord | null> {
  const { code, ipAddress } = args;
  const woredaId = publicEnv.NEXT_PUBLIC_WOREDA_ID;
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    console.error("❌ Cannot record QR request: Supabase client not available");
    return null;
  }

  // First, check if a request with this code already exists
  const { data: existingRequest, error: fetchError } = await supabase
    .from("qr_requests")
    .select("*")
    .eq("code", code)
    .eq("woreda_id", woredaId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fetchError) {
    console.error("❌ Error checking existing QR request:", fetchError);
  }

  // If request already exists, return it instead of creating duplicate
  if (existingRequest) {
    console.log("ℹ️ QR request already exists:", existingRequest.id);
    return existingRequest;
  }

  console.log("📝 Recording new QR request:", { code, ipAddress, woredaId });

  const { data, error } = await supabase
    .from("qr_requests")
    .insert({
      woreda_id: woredaId,
      code,
      ip_address: ipAddress,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("❌ Error recording QR request:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return null;
  }

  console.log("✅ QR request recorded successfully:", data?.id);
  return data;
}


export async function listRecentQrRequests(
  limit = 10
): Promise<QrRequestRecord[]> {
  // Get woreda_id from current user's metadata (Option 2)
  const woredaId = await getCurrentUserWoredaId();
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return [];
  }
  const { data } = await supabase
    .from("qr_requests")
    .select("*")
    .eq("woreda_id", woredaId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}

export async function approveAccessRequest(requestId: string): Promise<{
  temporaryAccess?: TemporaryAccessRecord;
  error?: string;
}> {
  try {
    // Get woreda_id from current user's metadata (Option 2)
    const woredaId = await getCurrentUserWoredaId();
    const token = randomUUID();
    const expiresAt = new Date(
      Date.now() + EXPIRE_HOURS * 60 * 60 * 1000
    ).toISOString();

    const supabase = await getSupabaseServerClient();

    // First, create the temporary access token
    const { data: tokenData, error: tokenError } = await supabase
      .from("temporary_access")
      .insert({
        request_id: requestId,
        woreda_id: woredaId,
        token,
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (tokenError) {
      console.error("❌ Error creating temporary access:", tokenError);
      return { error: tokenError.message };
    }

    // Then, update the QR request status
    const { error: updateError } = await supabase
      .from("qr_requests")
      .update({
        status: "approved",
        temporary_access_token: token,
      })
      .eq("id", requestId);

    if (updateError) {
      console.error("❌ Error updating QR request status:", updateError);
      return { error: updateError.message };
    }

    console.log("✅ Request approved successfully:", requestId);
    return { temporaryAccess: tokenData ?? undefined };
  } catch (error) {
    console.error("❌ Unexpected error approving request:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

export async function denyAccessRequest(requestId: string): Promise<{
  success?: boolean;
  error?: string;
}> {
  try {
    const supabase = await getSupabaseServerClient();

    const { error: updateError } = await supabase
      .from("qr_requests")
      .update({
        status: "denied",
      })
      .eq("id", requestId);

    if (updateError) {
      console.error("❌ Error denying QR request:", updateError);
      return { error: updateError.message };
    }

    console.log("✅ Request denied successfully:", requestId);
    return { success: true };
  } catch (error) {
    console.error("❌ Unexpected error denying request:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

export async function getQrRequestByCode(

  code: string
): Promise<QrRequestRecord | null> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return null;
  }
  const { data } = await supabase
    .from("qr_requests")
    .select("*")
    .eq("code", code)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return data ?? null;
}

export async function validateTemporaryAccess(
  token: string
): Promise<TemporaryAccessRecord | null> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.error("❌ Cannot validate access: Supabase client not available");
    return null;
  }

  console.log("🔍 Validating temporary access token:", token.substring(0, 10) + "...");

  const { data, error } = await supabase
    .from("temporary_access")
    .select("*")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (error) {
    console.error("❌ Error validating temporary access:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return null;
  }

  if (data) {
    console.log("✅ Temporary access validated successfully:", data.id);
  } else {
    console.log("⚠️ No valid temporary access found for token");
  }

  return data ?? null;
}

