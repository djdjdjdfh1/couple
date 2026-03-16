"use client";

import { useEffect, useState } from "react";

export default function DdayCounter({ startedAt }: { startedAt: string }) {
  const [days, setDays] = useState(0);

  useEffect(() => {
    const start = new Date(startedAt);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    setDays(diff + 1);
  }, [startedAt]);

  return (
    <p className="text-5xl font-bold my-1">
      {days > 0 ? `${days}일` : "D-day"}
    </p>
  );
}
