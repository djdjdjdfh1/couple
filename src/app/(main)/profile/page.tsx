import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/ui/LogoutButton";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, couples(*)")
    .eq("id", user.id)
    .single();

  const couple = profile?.couples as any;

  return (
    <div className="px-5 pt-12">
      <h1 className="text-xl font-bold text-gray-800 mb-8">내 프로필</h1>

      <div className="bg-[#fff0f3] rounded-3xl p-6 mb-5 text-center">
        <div className="w-16 h-16 rounded-full bg-[#ff6b81] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
          {profile?.nickname?.[0] ?? "?"}
        </div>
        <p className="font-bold text-gray-800 text-lg">{profile?.nickname}</p>
        <p className="text-gray-400 text-sm">{user.email}</p>
      </div>

      {couple && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
          <p className="text-xs text-gray-400 mb-1">사귀기 시작한 날</p>
          <p className="font-semibold text-gray-800">
            {new Date(couple.started_at).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-xs text-gray-400 mt-3 mb-1">초대 코드</p>
          <p className="font-mono font-bold text-[#ff6b81] tracking-widest">
            {couple.invite_code}
          </p>
        </div>
      )}

      <LogoutButton />
    </div>
  );
}
