"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Heart } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nickname } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        email,
        nickname,
      });
      router.push("/couple");
      router.refresh();
    }
  }

  return (
    <div className="min-h-dvh flex flex-col justify-center px-6 bg-white">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <Heart className="w-12 h-12 text-[#ff6b81] fill-[#ff6b81]" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">시작하기</h1>
        <p className="text-gray-400 text-sm mt-1">계정을 만들어보세요</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 text-sm outline-none focus:border-[#ff6b81] transition-colors"
        />
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 text-sm outline-none focus:border-[#ff6b81] transition-colors"
        />
        <input
          type="password"
          placeholder="비밀번호 (6자 이상)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 text-sm outline-none focus:border-[#ff6b81] transition-colors"
        />

        {error && <p className="text-red-400 text-xs text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-2xl bg-[#ff6b81] text-white font-semibold text-sm disabled:opacity-60 active:scale-95 transition-transform"
        >
          {loading ? "가입 중..." : "회원가입"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-6">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-[#ff6b81] font-semibold">
          로그인
        </Link>
      </p>
    </div>
  );
}
