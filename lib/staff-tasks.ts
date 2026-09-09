import { createClient } from "@supabase/supabase-js";

export async function ensureReviewTask(
  kind: "application" | "referral",
  id: string
): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return;

  try {
    const supabase = createClient(url, anonKey);
    const { error } = await supabase.rpc("staff_ensure_review_task", {
      p_kind: kind,
      p_id: id,
    });
    if (error) {
      console.warn("Review task skipped:", error.message);
    }
  } catch (error) {
    console.warn("Review task skipped:", error);
  }
}
