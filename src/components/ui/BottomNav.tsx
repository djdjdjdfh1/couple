"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Image, MessageCircle, User } from "lucide-react";

const navItems = [
  { href: "/home", icon: Home, label: "홈" },
  { href: "/memories", icon: Image, label: "추억" },
  { href: "/chat", icon: MessageCircle, label: "채팅" },
  { href: "/profile", icon: User, label: "나" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 safe-area-pb">
      <div className="flex">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                active ? "text-[#ff6b81]" : "text-gray-300"
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
