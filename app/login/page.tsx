import { FcGoogle } from "react-icons/fc";

import { loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) return redirect("/");

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="border-zinc-700 bg-zinc-800 flex flex-col gap-y-4">
        <div className="flex flex-col items-center justify-center gap-y-2">
          <p className="font-bold text-lg md:text-2xl">Fast Quiz</p>
          <p>PDF to mutilple choices or true false questions</p>
        </div>

        <form className="flex items-center justify-center" action={loginAction}>
          <Button
            type="submit"
            className="bg-zinc-100 text-black flex items-center justify-center hover:bg-zinc-200 transition-all duration-200"
          >
            <FcGoogle />
            <p>Sign in with Google</p>
          </Button>
        </form>
      </div>
    </div>
  );
}
