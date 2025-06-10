import CheckoutWithParams from "@/components/CheckoutWithParams";
import { Suspense } from "react";
import { ClipLoader } from "react-spinners";

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex items-center justify-center">
          <ClipLoader color={"#fafafa"} size={32} />
        </div>
      }
    >
      <CheckoutWithParams />
    </Suspense>
  );
}
