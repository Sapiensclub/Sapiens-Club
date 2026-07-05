import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";
import { LogoutButton } from "./logout-button";

/*
 * /admin — private waitlist + contacts viewer (owner request). Gated by the
 * admin cookie; reads server-side with the service-role key. noindex, and
 * always dynamic so it never caches signup data.
 */
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

type WaitlistRow = {
  email: string;
  phone: string | null;
  city: string | null;
  source: string;
  created_at: string;
};
type ContactRow = {
  name: string;
  email: string;
  message: string;
  created_at: string;
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export default async function AdminPage() {
  if (!(await isAdminAuthed())) redirect("/admin/login");

  const db = supabaseAdmin();
  const configured = !!db && !!process.env.ADMIN_PASSWORD;

  const [waitlistRes, contactsRes] = db
    ? await Promise.all([
        db.from("waitlist").select("*").order("created_at", { ascending: false }),
        db.from("contacts").select("*").order("created_at", { ascending: false }),
      ])
    : [{ data: [] }, { data: [] }];

  const waitlist = (waitlistRes.data ?? []) as WaitlistRow[];
  const contacts = (contactsRes.data ?? []) as ContactRow[];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="!text-4xl">Signups</h1>
        <LogoutButton />
      </div>

      {!configured && (
        <p className="mt-6 text-clay">
          Supabase or ADMIN_PASSWORD is not configured on the server.
        </p>
      )}

      {/* counts */}
      <div className="mt-8 flex flex-wrap gap-6">
        <div className="sketch-border border-2 border-ink/60 px-6 py-4">
          <span className="font-display block text-3xl font-bold">
            {waitlist.length}
          </span>
          <span className="text-sm">on the waitlist</span>
        </div>
        <div className="sketch-border border-2 border-ink/60 px-6 py-4">
          <span className="font-display block text-3xl font-bold">
            {contacts.length}
          </span>
          <span className="text-sm">contact messages</span>
        </div>
      </div>

      {/* waitlist */}
      <div className="mt-12 flex items-center justify-between">
        <h2>Waitlist</h2>
        {waitlist.length > 0 && (
          <a
            href="/api/admin/export?table=waitlist"
            className="text-sm font-bold underline decoration-spark decoration-2 underline-offset-4"
          >
            Download CSV
          </a>
        )}
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-ink/30 text-left">
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Phone</th>
              <th className="py-2 pr-4">City</th>
              <th className="py-2 pr-4">Source</th>
              <th className="py-2 pr-4">When</th>
            </tr>
          </thead>
          <tbody>
            {waitlist.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 opacity-60">
                  No signups yet.
                </td>
              </tr>
            ) : (
              waitlist.map((r) => (
                <tr key={r.email} className="border-b border-ink/10">
                  <td className="py-2 pr-4">{r.email}</td>
                  <td className="py-2 pr-4">{r.phone ?? "—"}</td>
                  <td className="py-2 pr-4">{r.city ?? "—"}</td>
                  <td className="py-2 pr-4">{r.source}</td>
                  <td className="py-2 pr-4 whitespace-nowrap">
                    {fmt(r.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* contacts */}
      <div className="mt-14 flex items-center justify-between">
        <h2>Contact messages</h2>
        {contacts.length > 0 && (
          <a
            href="/api/admin/export?table=contacts"
            className="text-sm font-bold underline decoration-spark decoration-2 underline-offset-4"
          >
            Download CSV
          </a>
        )}
      </div>
      <div className="mt-4 space-y-4">
        {contacts.length === 0 ? (
          <p className="py-4 opacity-60">No messages yet.</p>
        ) : (
          contacts.map((c, i) => (
            <div
              key={i}
              className="sketch-border border-2 border-ink/40 px-6 py-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-bold">
                  {c.name}{" "}
                  <a
                    href={`mailto:${c.email}`}
                    className="font-normal underline decoration-spark decoration-2 underline-offset-2"
                  >
                    {c.email}
                  </a>
                </span>
                <span className="text-xs opacity-60">{fmt(c.created_at)}</span>
              </div>
              <p className="mt-2 leading-relaxed whitespace-pre-wrap">
                {c.message}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
