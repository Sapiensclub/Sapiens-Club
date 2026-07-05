import { Resend } from "resend";
import { site } from "@/lib/site";

/*
 * Email via Resend (spec §11). Simple HTML matching the brand — paper
 * background, ink text, spark button. Email failures are logged but never
 * fail the API request: a signup is stored even if the email bounces.
 *
 * The sapiens.club domain is verified in Resend (July 2026), so we send
 * from hello@sapiens.club and can deliver to anyone. Replies go to the
 * real contact inbox via reply_to.
 */
const FROM = "Sapiens <hello@sapiens.club>";

/* escape user-supplied text before putting it in email HTML — stops a
   submitted message/name/city from injecting links or markup into the
   owner's notification email */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

const shell = (inner: string) => `
<div style="background:#F7F4EC;padding:32px 16px;font-family:Georgia,serif;color:#141414">
  <div style="max-width:520px;margin:0 auto;background:#FBF3E4;border-radius:12px;padding:32px">
    ${inner}
    <p style="margin-top:28px;font-size:13px;color:#141414;opacity:.7">
      <a href="${site.instagramUrl}" style="color:#141414">Instagram</a> ·
      <a href="${site.youtubeUrl}" style="color:#141414">YouTube</a> ·
      <a href="${site.twitterUrl}" style="color:#141414">X</a>
    </p>
  </div>
</div>`;

export async function sendWaitlistConfirmation(to: string) {
  const resend = getResend();
  if (!resend) return;
  try {
    await resend.emails.send({
      from: FROM,
      to,
      replyTo: site.contactEmail, // subscriber replies reach a real inbox
      subject: "Welcome, Sapiens 🌱",
      html: shell(`
        <h1 style="font-size:22px;margin:0 0 16px">You're in.</h1>
        <p style="line-height:1.7">You just joined the people building a society where helping
        each other is the default — not the exception.</p>
        <p style="line-height:1.7">We'll write about once a month, and the moment Sapiens opens
        in your city, you'll be the first to know.</p>
        <p style="line-height:1.7">Until then: someone near you could probably use a hand today.
        You don't need an app for that.</p>
        <p style="margin-top:24px">— Team Sapiens</p>
        <p style="margin-top:20px">
          <a href="${site.url}" style="background:#F59E2D;color:#141414;text-decoration:none;
          padding:10px 22px;border-radius:10px;font-weight:bold">sapiens.club</a>
        </p>`),
    });
  } catch (err) {
    console.error("[resend] waitlist confirmation failed:", err);
  }
}

export async function notifyOwner(subject: string, fields: Record<string, string | undefined>) {
  const resend = getResend();
  if (!resend) return;
  const rows = Object.entries(fields)
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;font-weight:bold">${esc(k)}</td><td>${esc(v!)}</td></tr>`
    )
    .join("");
  try {
    await resend.emails.send({
      from: FROM,
      to: site.contactEmail,
      subject,
      html: shell(`<h1 style="font-size:18px;margin:0 0 12px">${subject}</h1><table>${rows}</table>`),
    });
  } catch (err) {
    console.error("[resend] owner notification failed:", err);
  }
}
