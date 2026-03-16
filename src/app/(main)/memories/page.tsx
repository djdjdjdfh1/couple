import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MemoryList from "@/components/ui/MemoryList";
import MemoryForm from "@/components/ui/MemoryForm";

export default async function MemoriesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("couple_id, nickname")
    .eq("id", user.id)
    .single();

  if (!profile?.couple_id) redirect("/couple");

  const { data: memories } = await supabase
    .from("memories")
    .select("*, author:profiles(nickname)")
    .eq("couple_id", profile.couple_id)
    .order("created_at", { ascending: false });

  return (
    <div className="px-5 pt-8">
      <h1 className="text-xl font-bold text-gray-800 mb-5">우리의 추억 📸</h1>
      <MemoryForm coupleId={profile.couple_id} userId={user.id} />
      <MemoryList memories={memories ?? []} currentUserId={user.id} />
    </div>
  );
}
