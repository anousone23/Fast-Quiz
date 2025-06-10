"use server";

import { BASE_URL } from "@/lib/constant";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function loginAction() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${BASE_URL}/auth/callback`,
      scopes: [
        "https://www.googleapis.com/auth/forms",
        "https://www.googleapis.com/auth/forms.body",
        "https://www.googleapis.com/auth/drive.file",
      ].join(" "),
    },
  });

  if (error) throw new Error(error.message);

  if (data.url) {
    redirect(data.url);
  }
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  return redirect("/login");
}
