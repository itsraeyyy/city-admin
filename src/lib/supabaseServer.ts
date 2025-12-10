import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { publicEnv, requiredEnv } from "./env";

/**
 * Get a Supabase client for server-side operations that respects the user's session
 * Uses the anon key to properly read user authentication from cookies
 */
export async function getSupabaseServerClient() {
  const cookieStore = await cookies();

  const supabaseUrl = publicEnv.NEXT_PUBLIC_SUPABASE_URL || requiredEnv.SUPABASE_URL();
  const supabaseAnonKey = publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseAnonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is required but not set");
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  return supabase;
}

/**
 * Get the current authenticated user's woreda_id from their user metadata.
 * Falls back to environment variable if not set in user metadata.
 */
export async function getCurrentUserWoredaId(): Promise<string> {
  try {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.user_metadata?.woreda_id) {
      return user.user_metadata.woreda_id;
    }

    // Fallback to environment variable
    return publicEnv.NEXT_PUBLIC_WOREDA_ID;
  } catch (error) {
    // Fallback to environment variable on error
    return publicEnv.NEXT_PUBLIC_WOREDA_ID;
  }
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  try {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Error getting user:", error);
      return null;
    }

    return user;
  } catch (error) {
    console.error("Exception in getCurrentUser:", error);
    return null;
  }
}

