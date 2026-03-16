"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-gray-100 text-gray-400 text-sm active:scale-95 transition-transform"
    >
      <LogOut className="w-4 h-4" />
      로그아웃
    </button>
  );
}
