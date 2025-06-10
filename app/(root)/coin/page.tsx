"use client";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserProfilesClient } from "@/lib/supabase/client/user";
import { IUser } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CoinPage() {
  const [user, setUser] = useState<IUser>();
  const [amount, setAmount] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const data = await getUserProfilesClient();
      setUser(data);
    }

    fetchUser();
  }, []);

  function handleCheckOut() {
    if (!amount) return;

    const amountNumber = +amount;

    if (amountNumber % 10 !== 0) {
      return toast.error("Only values divisible by 10 are allowed");
    }

    router.push(`/checkout?amount=${amountNumber}`);
  }

  return (
    <div className="w-full h-screen px-8 py-8 flex flex-col gap-y-8">
      <Header />

      <div className="flex-1">
        <div className="flex flex-col items-center justify-center gap-y-8 h-full">
          <h1 className="font-medium">Your coins: {user?.coins}</h1>

          <div className="flex flex-col items-center gap-y-4">
            <Input
              className="Enter the amount text-xs md:text-sm bg-zinc-700 border-zinc-600 text-white"
              placeholder="Enter the amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <p className="text-sm opacity-50">
              The amount should be 10, 20, 30, 40, 50, ...
            </p>

            <Button
              className="text-xs md:text-sm bg-zinc-700 border-zinc-600 w-full hover:bg-zinc-600"
              onClick={handleCheckOut}
            >
              Pay
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
