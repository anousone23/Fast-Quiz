import { createClient } from "@/utils/supabase/client";

export async function getSettings() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    console.log("Error from getSettings", (error as Error).message);
  }
}
