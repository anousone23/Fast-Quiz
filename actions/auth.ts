"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://fast-quiz-kappa.vercel.app"
    : "http://localhost:3000";

export async function loginAction() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${BASE_URL}/auth/callback`,
      scopes: "https://www.googleapis.com/auth/forms.body",
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
