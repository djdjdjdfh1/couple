"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Heart, Copy, Check } from "lucide-react";

export default function CouplePage() {
  const router = useRouter();
  const [tab, setTab] = useState<"create" | "join">("create");
  const [inviteCode, setInviteCode] = useState("");
  const [myCode, setMyCode] = useState("");
  const [startedAt, setStartedAt] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // 랜덤 초대 코드 생성
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setMyCode(code);
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("couples")
      .insert({
        user1_id: user.id,
        invite_code: myCode,
        started_at: startedAt || new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (error) {
      setError("오류가 발생했어요. 다시 시도해주세요.");
      setLoading(false);
      return;
    }

    await supabase
      .from("profiles")
      .update({ couple_id: data.id })
      .eq("id", user.id);

    router.push("/home");
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: couple, error: findError } = await supabase
      .from("couples")
      .select()
      .eq("invite_code", inviteCode.toUpperCase())
      .is("user2_id", null)
      .single();

    if (findError || !couple) {
      setError("유효하지 않은 코드예요. 다시 확인해주세요.");
      setLoading(false);
      return;
    }

    await supabase
      .from("couples")
      .update({ user2_id: user.id })
      .eq("id", couple.id);

    await supabase
      .from("profiles")
      .update({ couple_id: couple.id })
      .eq("id", user.id);

    router.push("/home");
  }

  async function copyCode() {
    await navigator.clipboard.writeText(myCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-dvh flex flex-col justify-center px-6 bg-white">
      <div className="text-center mb-8">
        <Heart className="w-12 h-12 text-[#ff6b81] fill-[#ff6b81] mx-auto mb-3" />
        <h1 className="text-2xl font-bold text-gray-800">커플 연결</h1>
        <p className="text-gray-400 text-sm mt-1">상대방과 연결해보세요</p>
      </div>

      {/* 탭 */}
      <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
        <button
          onClick={() => setTab("create")}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
            tab === "create" ? "bg-white text-[#ff6b81] shadow-sm" : "text-gray-400"
          }`}
        >
          초대 코드 만들기
        </button>
        <button
          onClick={() => setTab("join")}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
            tab === "join" ? "bg-white text-[#ff6b81] shadow-sm" : "text-gray-400"
          }`}
        >
          코드로 입장하기
        </button>
      </div>

      {tab === "create" ? (
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="bg-[#fff0f3] rounded-2xl p-5 text-center">
            <p className="text-xs text-gray-400 mb-2">나의 초대 코드</p>
            <p className="text-3xl font-bold text-[#ff6b81] tracking-widest">{myCode}</p>
            <button
              type="button"
              onClick={copyCode}
              className="mt-3 flex items-center gap-1 text-xs text-gray-400 mx-auto"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "복사됨!" : "코드 복사"}
            </button>
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-2">사귀기 시작한 날</p>
            <input
              type="date"
              value={startedAt}
              onChange={(e) => setStartedAt(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 text-sm outline-none focus:border-[#ff6b81] transition-colors"
            />
          </div>

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-[#ff6b81] text-white font-semibold text-sm disabled:opacity-60 active:scale-95 transition-transform"
          >
            {loading ? "연결 중..." : "대기하기"}
          </button>
          <p className="text-xs text-gray-400 text-center">
            상대방이 코드를 입력하면 연결돼요
          </p>
        </form>
      ) : (
        <form onSubmit={handleJoin} className="space-y-4">
          <input
            type="text"
            placeholder="초대 코드 6자리 입력"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            maxLength={6}
            required
            className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 text-sm outline-none focus:border-[#ff6b81] transition-colors text-center tracking-widest uppercase font-bold text-lg"
          />

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-[#ff6b81] text-white font-semibold text-sm disabled:opacity-60 active:scale-95 transition-transform"
          >
            {loading ? "연결 중..." : "연결하기"}
          </button>
        </form>
      )}
    </div>
  );
}
