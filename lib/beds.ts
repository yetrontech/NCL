import { createClient } from "@supabase/supabase-js";

/** Open beds across every house. Null when the public count is not available yet. */
export async function loadBedsRemaining(): Promise<number | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  const supabase = createClient(url, anonKey);
  const { data, error } = await supabase.rpc("public_beds_remaining");
  if (!error && typeof data === "number" && Number.isFinite(data)) {
    return Math.max(0, Math.floor(data));
  }

  const listed = await supabase.rpc("admin_list_houses");
  const houses = listed.data?.houses;
  if (listed.error || !Array.isArray(houses)) return null;

  const remaining = houses.reduce((sum, house) => {
    const available = Number(house?.available);
    return sum + (Number.isFinite(available) ? available : 0);
  }, 0);
  return Math.max(0, Math.floor(remaining));
}
