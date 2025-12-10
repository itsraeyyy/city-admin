import { NextResponse } from "next/server";
import { updateAppointmentStatus } from "@/lib/appointments";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      appointmentId,
      status,
      adminReason,
      rescheduledDateEthiopian,
      rescheduledTime,
    } = body;

    if (!appointmentId || !status) {
      return NextResponse.json(
        { error: "Appointment ID and status are required" },
        { status: 400 }
      );
    }

    if (!["accepted", "rejected", "rescheduled"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    if (status === "rescheduled" && !rescheduledDateEthiopian) {
      return NextResponse.json(
        { error: "Rescheduled date is required for rescheduling" },
        { status: 400 }
      );
    }

    const result = await updateAppointmentStatus({
      appointmentId,
      status: status as "accepted" | "rejected" | "rescheduled",
      adminReason,
      rescheduledDateEthiopian,
      rescheduledTime,
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      appointment: result.appointment,
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

