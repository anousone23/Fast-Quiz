import { createClient } from "@/utils/supabase/server";

export async function addCoin({
  userId,
  amount,
}: {
  userId: string;
  amount: number;
}) {
  const supabase = await createClient();

  if (!userId) {
    throw new Error("No user is logged in");
  }

  // Get current coin balance
  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("coins")
    .eq("id", userId)
    .maybeSingle();

  if (fetchError) {
    throw new Error("Failed to fetch profile: " + fetchError.message);
  }

  const currentCoins = profile?.coins ?? 0;
  const newCoins = currentCoins + amount;

  //Update coins
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ coins: newCoins })
    .eq("id", userId)
    .select("*");

  if (updateError) {
    throw new Error("Failed to update coins: " + updateError.message);
  }
}

export async function checkCoin() {
  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

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

export async function removeCoin() {
  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

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

  const currentCoins = profile?.coins ?? 0;
  const newCoins = currentCoins - 10;

  // Step 3: Update coins
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ coins: newCoins })
    .eq("id", userId)
    .select("*");

  if (updateError) {
    throw new Error("Failed to update coins: " + updateError.message);
  }
}
