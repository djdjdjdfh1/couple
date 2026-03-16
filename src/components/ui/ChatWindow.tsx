"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Message } from "@/types";
import { Send } from "lucide-react";

export default function ChatWindow({
  coupleId,
  userId,
  nickname,
  initialMessages,
}: {
  coupleId: string;
  userId: string;
  nickname: string;
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const channel = supabase
      .channel(`chat:${coupleId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `couple_id=eq.${coupleId}`,
        },
        async (payload) => {
          const { data } = await supabase
            .from("messages")
            .select("*, sender:profiles(nickname)")
            .eq("id", payload.new.id)
            .single();
          if (data) setMessages((prev) => [...prev, data as Message]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [coupleId]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);

    await supabase.from("messages").insert({
      couple_id: coupleId,
      sender_id: userId,
      content: input.trim(),
    });

    setInput("");
    setSending(false);
  }

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="flex flex-col h-dvh">
      {/* 헤더 */}
      <div className="px-5 pt-12 pb-4 border-b border-gray-50">
        <h1 className="text-lg font-bold text-gray-800">💬 채팅</h1>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-12 text-gray-300 text-sm">
            첫 메시지를 보내봐요 💌
          </div>
        )}
        {messages.map((msg) => {
          const isMine = msg.sender_id === userId;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
            >
              {!isMine && (
                <span className="text-xs text-gray-400 mb-1 ml-1">
                  {(msg.sender as any)?.nickname}
                </span>
              )}
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isMine
                    ? "bg-[#ff6b81] text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-700 rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>
              <span className="text-[10px] text-gray-300 mt-1 mx-1">
                {formatTime(msg.created_at)}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      <form
        onSubmit={sendMessage}
        className="px-4 py-3 border-t border-gray-50 flex items-center gap-2 bg-white pb-safe"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="flex-1 bg-gray-50 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#ff6b81] transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="w-9 h-9 rounded-full bg-[#ff6b81] flex items-center justify-center disabled:opacity-40 active:scale-90 transition-transform shrink-0"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </form>
    </div>
  );
}
