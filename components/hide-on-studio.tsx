"use client";

import { usePathname } from "next/navigation";

/*
 * Hide the site header/footer on routes that own the full screen:
 * /studio (Sanity's own UI) and /admin (the private signups viewer).
 */
export function HideOnStudio({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/studio") || pathname?.startsWith("/admin"))
    return null;
  return <>{children}</>;
}
