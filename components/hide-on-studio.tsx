"use client";

import { usePathname } from "next/navigation";

/*
 * The admin panel at /studio brings its own full-screen UI — the site
 * header/footer would just get in the way there.
 */
export function HideOnStudio({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/studio")) return null;
  return <>{children}</>;
}
