import Image from "next/image";
import React from "react";

import Header from "@/components/Header";
import { formatDateToDDMMYYYY } from "@/lib/helper";
import { getCurrentUserPayments } from "@/lib/supabase/server/payment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default async function MyPaymentsPage() {
  const payments = await getCurrentUserPayments();

  return (
    <div className="w-full h-screen px-8 py-8 flex flex-col">
      <Header />

      <div className="mt-8 flex flex-col gap-y-8">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className=" bg-zinc-700 border border-zinc-600 rounded-sm py-4 px-4 md:px-8 flex flex-row items-start justify-between w-full  mx-auto"
          >
            {payment.image && (
              <Dialog>
                <DialogTrigger>
                  {" "}
                  <div className="w-20 h-20 relative md:w-32 md:h-32 cursor-pointer">
                    <Image
                      src={payment.imageUrl as string}
                      alt="payment image"
                      fill
                      objectFit="contain"
                      className=""
                    />
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Payment Image</DialogTitle>

                    <Image
                      src={payment.imageUrl as string}
                      alt="payment image"
                      width={200}
                      height={200}
                      objectFit="contain"
                      className="mx-auto mt-8"
                      unoptimized
                    />
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            )}

            <div className="flex flex-col items-start gap-y-8">
              <p className="text-white text-sm font-medium">
                date: {formatDateToDDMMYYYY(payment.created_at)}
              </p>
              <p className="text-white text-sm font-medium">
                amount: {payment.amount}
              </p>
            </div>

            <div className="flex flex-col items-start gap-y-8">
              <p className={`text-sm font-medium `}>
                status:{" "}
                <span
                  className={`${
                    payment.status === "pending" && "text-orange-500"
                  } ${payment.status === "rejected" && "text-red-500"} ${
                    payment.status === "approved" && "text-green-500"
                  }`}
                >
                  {payment.status}
                </span>
              </p>

              {payment.reject_reason && (
                <p className="text-sm text-red-600 font-medium">
                  {payment.reject_reason}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
