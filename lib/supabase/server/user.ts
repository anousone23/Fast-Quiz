import { IUser } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function getAuthUserServer() {
  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  const data = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  return data;
}

export async function getUserProfilesServer() {
  try {
    const supabase = await createClient();
    const userId = (await supabase.auth.getUser()).data.user?.id;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data as IUser;
  } catch (error) {
    console.log("Error from getUserProfilesServer", (error as Error).message);
  }
}
