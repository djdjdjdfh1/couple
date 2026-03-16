import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ChatWindow from "@/components/ui/ChatWindow";

export default async function ChatPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("couple_id, nickname")
    .eq("id", user.id)
    .single();

  if (!profile?.couple_id) redirect("/couple");

  const { data: messages } = await supabase
    .from("messages")
    .select("*, sender:profiles(nickname)")
    .eq("couple_id", profile.couple_id)
    .order("created_at", { ascending: true })
    .limit(100);

  return (
    <ChatWindow
      coupleId={profile.couple_id}
      userId={user.id}
      nickname={profile.nickname}
      initialMessages={messages ?? []}
    />
  );
}
