"use client";

import { useEffect } from "react";
import { Icons } from "./icons";
import { adminToastTone } from "@/lib/admin-client";

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  const tone = adminToastTone(message);
  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [message, onClose]);

  return (
    <div className={`cms-toast cms-toast-${tone}`} role="status">
      {tone === "success" ? <Icons.check size={14} /> : <Icons.close size={14} />}
      {message}
    </div>
  );
}
