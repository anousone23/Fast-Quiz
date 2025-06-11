import { createClient } from "@/utils/supabase/client";

export async function checkCoinClient() {
  const supabase = createClient();
  const userId = (await supabase.auth.getSession()).data.session?.user.id;

  if (!userId) {
    throw new Error("No user is logged in");
  }

  // Step 2: Get current coin balance
  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("coins")
    .eq("id", userId)
    .maybeSingle();

  if (fetchError) {
    throw new Error("Failed to fetch profile: " + fetchError.message);
  }

  if (profile?.coins < 10) {
    throw new Error("You do not have enough coins");
  }
}
