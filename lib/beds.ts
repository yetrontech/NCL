import { createClient } from "@supabase/supabase-js";

/** Open beds across every house. Null when the public count is not available yet. */
export async function loadBedsRemaining(): Promise<number | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  const supabase = createClient(url, anonKey);
  const listed = await supabase.rpc("admin_list_houses");
  const houses = listed.data?.houses;
  if (!listed.error && Array.isArray(houses) && houses.length > 0) {
    const remaining = houses.reduce((sum, house) => {
      const capacity = Number(house?.capacity);
      const living = Number(house?.residents ?? house?.occupied);
      if (!Number.isFinite(capacity)) return sum;
      const taken = Number.isFinite(living) ? living : 0;
      return sum + Math.max(capacity - taken, 0);
    }, 0);
    return Math.max(0, Math.floor(remaining));
  }

  const { data, error } = await supabase.rpc("public_beds_remaining");
  if (error || typeof data !== "number" || !Number.isFinite(data)) return null;
  return Math.max(0, Math.floor(data));
}
