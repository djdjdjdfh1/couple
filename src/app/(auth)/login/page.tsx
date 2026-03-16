"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Heart } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("이메일 또는 비밀번호가 올바르지 않아요");
      setLoading(false);
    } else {
      router.push("/home");
      router.refresh();
    }
  }

  return (
    <div className="min-h-dvh flex flex-col justify-center px-6 bg-white">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <Heart className="w-12 h-12 text-[#ff6b81] fill-[#ff6b81]" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">우리의 이야기</h1>
        <p className="text-gray-400 text-sm mt-1">커플을 위한 공간</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 text-sm outline-none focus:border-[#ff6b81] transition-colors"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 text-sm outline-none focus:border-[#ff6b81] transition-colors"
          />
        </div>

        {error && <p className="text-red-400 text-xs text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-2xl bg-[#ff6b81] text-white font-semibold text-sm disabled:opacity-60 active:scale-95 transition-transform"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-6">
        계정이 없으신가요?{" "}
        <Link href="/signup" className="text-[#ff6b81] font-semibold">
          회원가입
        </Link>
      </p>
    </div>
  );
}
