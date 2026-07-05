import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

/*
 * GET /api/admin/export?table=waitlist|contacts — downloads a CSV.
 * Gated by the admin cookie.
 */
function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const cols = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = cols.join(",");
  const body = rows.map((r) => cols.map((c) => escape(r[c])).join(",")).join("\n");
  return `${header}\n${body}`;
}

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const table = req.nextUrl.searchParams.get("table");
  if (table !== "waitlist" && table !== "contacts") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ ok: false }, { status: 500 });

  const { data, error } = await db
    .from(table)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ ok: false }, { status: 500 });

  const csv = toCsv(data ?? []);
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="sapiens-${table}-${date}.csv"`,
    },
  });
}
