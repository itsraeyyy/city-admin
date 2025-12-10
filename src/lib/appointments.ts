import { getSupabaseAdminClient } from "./supabaseAdmin";
import { getCurrentUserWoredaId } from "./supabaseServer";
import { publicEnv } from "./env";
import { AppointmentRecord } from "@/types";
import { ethiopianToGregorian, parseEthiopianDate } from "./ethiopianCalendar";

/**
 * Generate a unique appointment code
 */
export function generateAppointmentCode(): string {
  const prefix = "APT";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Create a new appointment request
 */
export async function createAppointmentRequest(args: {
  requesterName: string;
  requesterEmail?: string;
  requesterPhone?: string;
  reason: string;
  requestedDateEthiopian: string;
  requestedTime?: string;
}): Promise<{ appointment: AppointmentRecord | null; error?: string }> {
  try {
    const woredaId = publicEnv.NEXT_PUBLIC_WOREDA_ID;
    const uniqueCode = generateAppointmentCode();

    // Parse Ethiopian date and convert to Gregorian
    const ethDate = parseEthiopianDate(args.requestedDateEthiopian);
    if (!ethDate) {
      return { appointment: null, error: "Invalid Ethiopian date format" };
    }

    const gregorianDate = ethiopianToGregorian(
      ethDate.year,
      ethDate.month,
      ethDate.day
    );

    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("appointments")
      .insert({
        woreda_id: woredaId,
        unique_code: uniqueCode,
        requester_name: args.requesterName,
        requester_email: args.requesterEmail,
        requester_phone: args.requesterPhone,
        reason: args.reason,
        requested_date_ethiopian: args.requestedDateEthiopian,
        requested_date_gregorian: gregorianDate.toISOString().split("T")[0],
        requested_time: args.requestedTime,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating appointment:", error);
      return { appointment: null, error: error.message };
    }

    return { appointment: data as AppointmentRecord };
  } catch (error) {
    console.error("Error creating appointment:", error);
    return {
      appointment: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get appointment by unique code
 */
export async function getAppointmentByCode(
  code: string
): Promise<AppointmentRecord | null> {
  try {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("unique_code", code)
      .single();

    if (error || !data) {
      return null;
    }

    return data as AppointmentRecord;
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return null;
  }
}

/**
 * Get all appointments for current woreda (admin)
 */
export async function getAppointmentsForCurrentWoreda(): Promise<
  AppointmentRecord[]
> {
  try {
    const woredaId = await getCurrentUserWoredaId();
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("woreda_id", woredaId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching appointments:", error);
      return [];
    }

    return (data || []) as AppointmentRecord[];
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
}

/**
 * Update appointment status (admin)
 */
export async function updateAppointmentStatus(args: {
  appointmentId: string;
  status: "accepted" | "rejected" | "rescheduled";
  adminReason?: string;
  rescheduledDateEthiopian?: string;
  rescheduledTime?: string;
}): Promise<{ appointment: AppointmentRecord | null; error?: string }> {
  try {
    const supabase = getSupabaseAdminClient();

    let rescheduledDateGregorian: string | undefined;
    if (args.rescheduledDateEthiopian) {
      const ethDate = parseEthiopianDate(args.rescheduledDateEthiopian);
      if (ethDate) {
        const gregorianDate = ethiopianToGregorian(
          ethDate.year,
          ethDate.month,
          ethDate.day
        );
        rescheduledDateGregorian = gregorianDate.toISOString().split("T")[0];
      }
    }

    const updateData: any = {
      status: args.status,
      admin_reason: args.adminReason,
    };

    if (args.status === "rescheduled") {
      updateData.rescheduled_date_ethiopian = args.rescheduledDateEthiopian;
      updateData.rescheduled_date_gregorian = rescheduledDateGregorian;
      updateData.rescheduled_time = args.rescheduledTime;
    }

    const { data, error } = await supabase
      .from("appointments")
      .update(updateData)
      .eq("id", args.appointmentId)
      .select()
      .single();

    if (error) {
      console.error("Error updating appointment:", error);
      return { appointment: null, error: error.message };
    }

    return { appointment: data as AppointmentRecord };
  } catch (error) {
    console.error("Error updating appointment:", error);
    return {
      appointment: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

