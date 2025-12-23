const ensureEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required but was not provided.`);
  }
  return value;
};

export const publicEnv = {
  // Default to the woreda ID used in Supabase news records so published news
  // appears on the public homepage even without explicit env configuration.
  NEXT_PUBLIC_WOREDA_ID: process.env.NEXT_PUBLIC_WOREDA_ID ?? "prosperity-party-commission",
  NEXT_PUBLIC_WOREDA_NAME: process.env.NEXT_PUBLIC_WOREDA_NAME ?? "የብልጽግና ፓርቲ የኢንስፔክሽንና የሥነምግባር ኮሚሽን",
  NEXT_PUBLIC_WOREDA_LOGO_PATH:
    process.env.NEXT_PUBLIC_WOREDA_LOGO_PATH ?? "/logo.jpg",
  NEXT_PUBLIC_WOREDA_IMAGES_PREFIX:
    process.env.NEXT_PUBLIC_WOREDA_IMAGES_PREFIX ?? "/assets",
  // Default Supabase URL to the known project so SUPABASE_URL is not required
  // for basic public news fetching. In production, override via env vars.
  NEXT_PUBLIC_SUPABASE_URL:
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://oblhonzlkflvoxqymmys.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
};

export const requiredEnv = {
  SUPABASE_URL: () => ensureEnv("SUPABASE_URL"),
  SUPABASE_SERVICE_ROLE_KEY: () => process.env.SUPABASE_SERVICE_ROLE_KEY || "",
};


