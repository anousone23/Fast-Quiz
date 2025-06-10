"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStripe } from "@stripe/react-stripe-js";
import { ClipLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const stripe = useStripe();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!stripe) return;

    const clientSecret = searchParams.get("payment_intent_client_secret");

    if (!clientSecret) {
      setStatus("error");
      setMessage("No payment information found");
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setStatus("success");
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setStatus("loading");
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setStatus("error");
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setStatus("error");
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe, searchParams]);

  if (status === "loading") {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <ClipLoader color="#fafafa" />
        <p className="mt-4">Processing your payment...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="text-center flex flex-col gap-y-4">
        {status === "success" ? (
          <>
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h1 className="text-2xl font-bold text-green-600">
              Payment Successful!
            </h1>
            <p className="text-gray-600">{message}</p>
            <Button>
              <Link href={"/"}>Return to home page</Link>
            </Button>
          </>
        ) : (
          <>
            <div className="text-red-500 text-6xl mb-4">✗</div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">
              Payment Failed
            </h1>
            <p className="text-gray-600">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
