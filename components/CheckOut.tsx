"use client";

import { BASE_URL } from "@/lib/constant";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { Button } from "./ui/button";
import { useSearchParams } from "next/navigation";

export default function CheckOut({ amount }: { amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  // Check for returning payment status
  useEffect(() => {
    if (!stripe) return;

    const clientSecretFromUrl = searchParams.get(
      "payment_intent_client_secret"
    );

    if (clientSecretFromUrl) {
      stripe
        .retrievePaymentIntent(clientSecretFromUrl)
        .then(({ paymentIntent }) => {
          setPaymentStatus(paymentIntent?.status || null);
        });
    }
  }, [stripe, searchParams]);

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: amount * 100 }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error("Error creating payment intent:", error);
        setErrorMessage("Failed to initialize payment");
      });
  }, [amount]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) return;

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message!);
      setIsLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${BASE_URL}/payment-success`,
      },
    });

    if (error) {
      // Only show error if it's not a redirect (PromptPay will redirect)
      if (error.type !== "validation_error") {
        setErrorMessage(error.message!);
      }
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  }

  // Show payment status if returning from redirect
  if (paymentStatus) {
    return (
      <div className="text-center p-6">
        {paymentStatus === "succeeded" ? (
          <>
            <div className="text-green-500 text-4xl mb-4">✓</div>
            <h2 className="text-xl font-bold text-green-600 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600">
              Your payment has been processed successfully.
            </p>
          </>
        ) : paymentStatus === "processing" ? (
          <>
            <ClipLoader color="#fafafa" />
            <h2 className="text-xl font-bold mt-4">Processing Payment</h2>
            <p className="text-gray-600">Your payment is being processed.</p>
          </>
        ) : (
          <>
            <div className="text-red-500 text-4xl mb-4">✗</div>
            <h2 className="text-xl font-bold text-red-600 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600">Please try again.</p>
          </>
        )}
      </div>
    );
  }

  if (!stripe || !elements || !clientSecret) {
    return (
      <div>
        <ClipLoader color="#fafafa" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      {clientSecret && <PaymentElement />}

      {errorMessage && (
        <p className="text-sm md:text-base text-red-400">{errorMessage}</p>
      )}

      <Button
        className="bg-zinc-700 border border-zinc-600 hover:bg-zinc-600"
        disabled={!stripe || isLoading}
      >
        {isLoading ? <ClipLoader color="#fafafa" size={20} /> : "Pay"}
      </Button>
    </form>
  );
}
