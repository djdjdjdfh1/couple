"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ImagePlus, Send } from "lucide-react";

export default function MemoryForm({
  coupleId,
  userId,
}: {
  coupleId: string;
  userId: string;
}) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() && !image) return;
    setLoading(true);

    const supabase = createClient();
    let imageUrl: string | null = null;

    if (image) {
      const ext = image.name.split(".").pop();
      const path = `${coupleId}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("memories")
        .upload(path, image);
      if (!uploadError) {
        const { data } = supabase.storage.from("memories").getPublicUrl(path);
        imageUrl = data.publicUrl;
      }
    }

    await supabase.from("memories").insert({
      couple_id: coupleId,
      author_id: userId,
      content: content.trim(),
      image_url: imageUrl,
    });

    setContent("");
    setImage(null);
    setPreview(null);
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mb-5">
      {preview && (
        <div className="relative mb-2">
          <img
            src={preview}
            alt="preview"
            className="w-full h-40 object-cover rounded-2xl"
          />
          <button
            type="button"
            onClick={() => { setImage(null); setPreview(null); }}
            className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full"
          >
            삭제
          </button>
        </div>
      )}
      <div className="flex items-end gap-2 bg-gray-50 rounded-2xl px-4 py-3">
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={handleImage}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-gray-300 hover:text-[#ff6b81] transition-colors shrink-0"
        >
          <ImagePlus className="w-5 h-5" />
        </button>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="오늘의 추억을 남겨봐요..."
          rows={2}
          className="flex-1 bg-transparent text-sm outline-none resize-none text-gray-700 placeholder:text-gray-300"
        />
        <button
          type="submit"
          disabled={loading || (!content.trim() && !image)}
          className="text-[#ff6b81] disabled:text-gray-200 transition-colors shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
