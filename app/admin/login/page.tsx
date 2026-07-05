"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/buttons";

/*
 * /admin/login — single password field → POST /api/admin/login.
 * On success the httpOnly cookie is set and we go to /admin.
 */
export default function AdminLogin() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const password = new FormData(e.currentTarget).get("password");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.replace("/admin");
      router.refresh();
    } else {
      setStatus("error");
    }
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-sm flex-col items-center justify-center gap-6 px-6 text-center">
      <h1>Admin</h1>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Password"
          className="sketch-border border-2 border-ink bg-paper px-4 py-2.5 text-center"
        />
        <Button type="submit" disabled={status === "sending"} className="self-center">
          {status === "sending" ? "Checking…" : "Enter"}
        </Button>
        {status === "error" && (
          <p role="alert" className="text-sm font-semibold text-clay">
            Wrong password.
          </p>
        )}
      </form>
    </section>
  );
}
