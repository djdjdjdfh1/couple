"use client";

import { Memory } from "@/types";
import Image from "next/image";

export default function MemoryList({
  memories,
  currentUserId,
}: {
  memories: Memory[];
  currentUserId: string;
}) {
  if (memories.length === 0) {
    return (
      <div className="text-center py-16 text-gray-300">
        <p className="text-4xl mb-3">📷</p>
        <p className="text-sm">첫 번째 추억을 남겨봐요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      {memories.map((memory) => {
        const isMine = memory.author_id === currentUserId;
        return (
          <div key={memory.id} className="bg-white rounded-2xl border border-gray-50 shadow-sm overflow-hidden">
            {memory.image_url && (
              <div className="relative w-full h-52">
                <Image
                  src={memory.image_url}
                  alt="memory"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="px-4 py-3">
              {memory.content && (
                <p className="text-sm text-gray-700 leading-relaxed">{memory.content}</p>
              )}
              <div className="flex justify-between items-center mt-2">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    isMine ? "bg-[#fff0f3] text-[#ff6b81]" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {(memory.author as any)?.nickname ?? "상대방"}
                </span>
                <span className="text-xs text-gray-300">
                  {new Date(memory.created_at).toLocaleDateString("ko-KR", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
