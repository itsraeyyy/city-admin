import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { parseEthiopianDate, ethiopianToGregorian } from "@/lib/ethiopianCalendar";

export async function POST(request: NextRequest) {
  try {
    // Authentication is handled by middleware
    const body = await request.json();
    const { appointmentId, rescheduledDateEthiopian, rescheduledTime, reason } = body;

    if (!appointmentId || !rescheduledDateEthiopian) {
      return NextResponse.json(
        { error: "Appointment ID and rescheduled date are required" },
        { status: 400 }
      );
    }

    // Validate and convert Ethiopian date
    let gregorianDate: Date;
    try {
      const ethDate = parseEthiopianDate(rescheduledDateEthiopian);
      gregorianDate = ethiopianToGregorian(ethDate);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid Ethiopian date format" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("appointments")
      .update({
        status: "rescheduled",
        rescheduled_date_ethiopian: rescheduledDateEthiopian,
        rescheduled_date_gregorian: gregorianDate.toISOString().split('T')[0],
        rescheduled_time: rescheduledTime || null,
        admin_reason: reason || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", appointmentId)
      .select()
      .single();

    if (error) {
      console.error("Error rescheduling appointment:", error);
      return NextResponse.json(
        { error: "Failed to reschedule appointment" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, appointment: data });
  } catch (error) {
    console.error("Error in reschedule appointment route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

