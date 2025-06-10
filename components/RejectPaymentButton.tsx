"use client";

import { useActionState, useEffect } from "react";
import { rejectPaymentAction } from "@/actions/payment";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IPayment } from "@/types";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function RejectPaymentButton({
  payment,
}: {
  payment: IPayment;
}) {
  const [state, action, pending] = useActionState(rejectPaymentAction, {
    success: false,
    error: "",
  });

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.success) toast.success("Payment rejected.");
  }, [state]);

  if (payment.status === "approved" || payment.status === "rejected")
    return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" className="text-xs bg-red-600 hover:bg-red-700">
          Reject
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm reject payment</DialogTitle>
        </DialogHeader>

        <form
          action={action}
          className="flex flex-col items-center gap-y-4 w-full"
        >
          <Input
            placeholder="Reject reason..."
            className="text-sm md:text-base text-white"
            name="rejectReason"
          />
          <input type="hidden" name="paymentId" value={payment.id} />
          <input type="hidden" name="paymentImage" value={payment.image} />
          <input type="hidden" name="amount" value={payment.amount} />

          <div className="flex flex-row items-center justify-center gap-x-8 w-full">
            <Button
              type="submit"
              className="text-sm bg-red-600 hover:bg-red-700"
            >
              {pending ? <ClipLoader color="#fafafa" size={14} /> : "Confirm"}
            </Button>

            <DialogClose asChild>
              <Button
                type="button"
                className="text-sm bg-zinc-600 hover:bg-zinc-700"
              >
                Cancel
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
