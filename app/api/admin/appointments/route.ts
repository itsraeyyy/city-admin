import { NextResponse } from "next/server";
import { getAppointmentsForCurrentWoreda } from "@/lib/appointments";

export async function GET(request: Request) {
  try {
    const appointments = await getAppointmentsForCurrentWoreda();
    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

