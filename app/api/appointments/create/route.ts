import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { publicEnv } from "@/lib/env";
import { parseEthiopianDate, ethiopianToGregorian } from "@/lib/ethiopianCalendar";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      requesterName,
      requesterEmail,
      requesterPhone,
      reason,
      requestedDateEthiopian,
      requestedDateGregorian,
      requestedTime,
    } = body;

    // Validate required fields
    if (!requesterName || !reason || !requestedDateEthiopian) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate Ethiopian date format
    const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!datePattern.test(requestedDateEthiopian)) {
      return NextResponse.json(
        { error: "Invalid date format. Use DD/MM/YYYY" },
        { status: 400 }
      );
    }

    // Parse and validate Ethiopian date
    let gregorianDate: Date;
    try {
      const ethDate = parseEthiopianDate(requestedDateEthiopian);
      gregorianDate = ethiopianToGregorian(ethDate);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid Ethiopian date" },
        { status: 400 }
      );
    }

    // Generate unique code (8 characters: APT + 5 random alphanumeric)
    const uniqueCode = `APT${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const supabase = getSupabaseAdminClient();
    const woredaId = publicEnv.NEXT_PUBLIC_WOREDA_ID;

    // Insert appointment
    const { data, error } = await supabase
      .from("appointments")
      .insert({
        woreda_id: woredaId,
        unique_code: uniqueCode,
        requester_name: requesterName,
        requester_email: requesterEmail || null,
        requester_phone: requesterPhone || null,
        reason: reason,
        requested_date_ethiopian: requestedDateEthiopian,
        requested_date_gregorian: gregorianDate.toISOString().split('T')[0],
        requested_time: requestedTime || null,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating appointment:", error);
      return NextResponse.json(
        { error: "Failed to create appointment" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      uniqueCode: data.unique_code,
      appointmentId: data.id,
    });
  } catch (error) {
    console.error("Error in create appointment route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
