"use client";

import { useRouter, useSearchParams } from "next/navigation";
import generatePayload from "promptpay-qr";
import { QRCodeSVG } from "qrcode.react";
import { ChangeEvent, Suspense, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { ClipLoader } from "react-spinners";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isImageFile } from "@/lib/helper";
import {
  createPayment,
  uploadPaymentImage,
} from "@/lib/supabase/client/payment";
import { getSettings } from "@/lib/supabase/client/setting";

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function CheckoutPage() {
  const params = useSearchParams();
  const amount = parseInt(params.get("amount") as string);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchSetting() {
      const data = await getSettings();

      setPhone(data.phone);
    }

    fetchSetting();
  }, []);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;

    if (!files) return;

    if (!isImageFile(files[0])) return toast.error("Invalid image file");

    setImageFile(files[0]);
  }

  async function handleConfirmPayment() {
    if (!imageFile) return toast.error("Please upload payment image");

    try {
      setIsLoading(true);

      const imagePath = await uploadPaymentImage(imageFile);

      await createPayment({ amount, image: imagePath! });

      toast.success("Payment successfully created");
      setImageFile(null);

      router.push("/my-payments");
    } catch (error) {
      console.log("Error from handleConfirmPayment", error);
      toast.error((error as Error).message || "Failed to create payment.");
    } finally {
      setIsLoading(false);
    }
  }

  const qr = generatePayload(phone, { amount });

  return (
    <Suspense fallback={<ClipLoader size={32} color="#fafafa" />}>
      <div className="w-full h-screen px-8 py-8 flex flex-col">
        <Header />

        <main className="flex-1 flex flex-col items-center justify-center gap-y-4">
          <p>Total amount: {amount} BAHT</p>

          <div className="bg-zinc-100 px-4 py-4 rounded-md flex flex-col items-center gap-y-4">
            <p className="text-black font-medium">PromptPay</p>

            <div className="flex flex-col items-center gap-y-4">
              <QRCodeSVG value={qr} size={140} />

              {/* image input */}
              {imageFile ? (
                <div className="border border-zinc-300 w-full px-4 py-2 rounded-sm bg-zinc-100 flex flex-row items-center gap-x-4">
                  <p className="text-xs md:text-sm text-black flex-1">
                    {imageFile.name}
                  </p>

                  <RxCross2
                    className="text-black cursor-pointer"
                    size={18}
                    onClick={() => setImageFile(null)}
                  />
                </div>
              ) : (
                <>
                  <p className="text-xs md:text-sm text-orange-500">
                    Attach the payment image after paid
                  </p>

                  <div
                    className="border border-zinc-300 w-full px-4 py-2 rounded-sm bg-zinc-100 cursor-pointer"
                    onClick={() => {
                      if (fileRef.current) fileRef.current.click();
                    }}
                  >
                    <p className="text-xs md:text-sm text-black">
                      Upload payment image
                    </p>
                  </div>

                  <Input
                    ref={fileRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </>
              )}

              <Button
                className="w-full bg-zinc-700 border-zinc-600 hover:bg-zinc-600 "
                onClick={handleConfirmPayment}
              >
                {isLoading ? (
                  <ClipLoader size={20} color="#fafafa" />
                ) : (
                  "Confirm"
                )}
              </Button>
            </div>
          </div>

          {/* <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: amount * 100,
            currency: "thb",
          }}
        >
          <CheckOut amount={amount} />
        </Elements> */}
        </main>
      </div>
    </Suspense>
  );
}
