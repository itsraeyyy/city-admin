import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(request: NextRequest) {
  try {
    // Authentication is handled by middleware
    const body = await request.json();
    const { appointmentId, reason } = body;

    if (!appointmentId) {
      return NextResponse.json(
        { error: "Appointment ID is required" },
        { status: 400 }
      );
    }

    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase
      .from("appointments")
      .update({
        status: "accepted",
        admin_reason: reason || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", appointmentId)
      .select()
      .single();

    if (error) {
      console.error("Error accepting appointment:", error);
      return NextResponse.json(
        { error: "Failed to accept appointment" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, appointment: data });
  } catch (error) {
    console.error("Error in accept appointment route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

