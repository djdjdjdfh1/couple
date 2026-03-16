import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Heart } from "lucide-react";
import DdayCounter from "@/components/ui/DdayCounter";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, couples(*)")
    .eq("id", user.id)
    .single();

  if (!profile?.couple_id) {
    redirect("/couple");
  }

  const couple = profile.couples as any;

  // 상대방 프로필 조회
  const partnerId =
    couple.user1_id === user.id ? couple.user2_id : couple.user1_id;
  const { data: partner } = partnerId
    ? await supabase.from("profiles").select("nickname").eq("id", partnerId).single()
    : { data: null };

  return (
    <div className="px-5 pt-10">
      {/* 상단 인사 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-gray-400 text-sm">안녕하세요,</p>
          <h1 className="text-xl font-bold text-gray-800">
            {profile.nickname}
            {partner ? ` ♥ ${partner.nickname}` : ""}
          </h1>
        </div>
        <Heart className="w-7 h-7 text-[#ff6b81] fill-[#ff6b81]" />
      </div>

      {/* D-day 카드 */}
      <div className="bg-[#ff6b81] rounded-3xl p-6 text-white mb-5 text-center shadow-lg shadow-pink-200">
        <p className="text-sm opacity-80 mb-1">함께한 지</p>
        <DdayCounter startedAt={couple.started_at} />
        <p className="text-sm opacity-80 mt-1">
          {new Date(couple.started_at).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          부터
        </p>
      </div>

      {/* 빠른 메뉴 */}
      <div className="grid grid-cols-2 gap-3">
        <QuickCard href="/memories" emoji="📸" title="추억 남기기" desc="사진과 글을 공유해요" />
        <QuickCard href="/chat" emoji="💬" title="채팅하기" desc="지금 바로 대화해요" />
      </div>
    </div>
  );
}

function QuickCard({
  href,
  emoji,
  title,
  desc,
}: {
  href: string;
  emoji: string;
  title: string;
  desc: string;
}) {
  return (
    <a
      href={href}
      className="bg-gray-50 rounded-2xl p-4 block hover:bg-[#fff0f3] transition-colors active:scale-95"
    >
      <p className="text-2xl mb-2">{emoji}</p>
      <p className="font-semibold text-gray-800 text-sm">{title}</p>
      <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
    </a>
  );
}
