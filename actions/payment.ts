"use server";

import { addCoin } from "@/lib/supabase/server/coin";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function approvePaymentAction(prevState, formData: FormData) {
  const supabase = await createClient();

  const paymentId = formData.get("paymentId");
  const paymentImage = formData.get("paymentImage") as string;
  const amount = formData.get("amount") as string;

  const { data: payment, error: updateError } = await supabase
    .from("payments")
    .update({ status: "approved", image: "" })
    .eq("id", paymentId)
    .select("user_id")
    .single();

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  if (paymentImage) {
    const { error: storageError } = await supabase.storage
      .from("payment-image")
      .remove([paymentImage]);

    if (storageError) {
      return { success: false, error: storageError.message };
    }
  }

  await addCoin({ userId: payment.user_id, amount: Number(amount) });

  revalidatePath("/");

  return { success: true, error: null };
}

export async function rejectPaymentAction(prevState, formData: FormData) {
  const supabase = await createClient();

  const paymentId = formData.get("paymentId");
  const paymentImage = formData.get("paymentImage") as string;
  const rejectReason = formData.get("rejectReason") as string;

  if (!rejectReason)
    return {
      success: false,
      error: "Reject reason is required",
    };

  const { error: updateError } = await supabase
    .from("payments")
    .update({ status: "rejected", image: "", reject_reason: rejectReason })
    .eq("id", paymentId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  if (paymentImage) {
    const { error: storageError } = await supabase.storage
      .from("payment-image")
      .remove([paymentImage]);

    if (storageError) {
      return { success: false, error: storageError.message };
    }
  }

  revalidatePath("/");

  return { success: true, error: null };
}
