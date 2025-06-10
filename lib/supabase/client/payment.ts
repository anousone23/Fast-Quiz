import { v4 as uuidv4 } from "uuid";

import { createClient } from "@/utils/supabase/client";

export async function uploadPaymentImage(file: File) {
  if (!file) return;

  const supabase = createClient();
  const userId = (await supabase.auth.getSession()).data.session?.user.id;

  const fileExt = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  const { error } = await supabase.storage
    .from("payment-image")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return filePath;
}

export async function createPayment({
  amount,
  image,
}: {
  amount: number;
  image: string;
}) {
  const supabase = createClient();
  const userId = (await supabase.auth.getSession()).data.session?.user.id;

  const { error } = await supabase
    .from("payments")
    .insert({ user_id: userId, amount, image });

  if (error) throw new Error(error.message);
}
