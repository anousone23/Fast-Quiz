import { IPayment } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function getCurrentUserPayments() {
  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  if (!userId) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const enrichedPayments = await Promise.all(
    (data || []).map(async (payment) => {
      const { data: signedUrlData, error: signedUrlError } =
        await supabase.storage
          .from("payment-image")
          .createSignedUrl(payment.image, 60);

      if (signedUrlError) {
        console.warn(
          `Failed to create signed URL for ${payment.image}:`,
          signedUrlError.message
        );
      }

      return {
        ...payment,
        imageUrl: signedUrlData?.signedUrl || null,
      };
    })
  );

  return enrichedPayments as (IPayment & { imageUrl: string | null })[];
}

export async function getAllPayments() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const enrichedPayments = await Promise.all(
    (data || []).map(async (payment) => {
      const { data: signedUrlData, error: signedUrlError } =
        await supabase.storage
          .from("payment-image")
          .createSignedUrl(payment.image, 60);

      if (signedUrlError) {
        console.warn(
          `Failed to create signed URL for ${payment.image}:`,
          signedUrlError.message
        );
      }

      return {
        ...payment,
        imageUrl: signedUrlData?.signedUrl || null,
      };
    })
  );

  return enrichedPayments as (IPayment & { imageUrl: string | null })[];
}
