import { IUser } from "@/types";
import { createClient } from "@/utils/supabase/client";

export async function getUserProfilesClient() {
  try {
    const supabase = createClient();
    const userId = (await supabase.auth.getSession()).data.session?.user.id;

    if (!userId) throw new Error("User is not logged in");

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data as IUser;
  } catch (error) {
    console.log("Error from getUserClient", (error as Error).message);
  }
}
