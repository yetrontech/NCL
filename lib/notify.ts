import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";

export type SubmissionKind =
  | "application"
  | "referral"
  | "tour_request"
  | "benefits_screening";

export type NotificationPayload = {
  kind: SubmissionKind;
  summary: string;
  details: Record<string, string | null | undefined>;
  /** Submitter email — receives a confirmation after successful insert */
  userEmail?: string | null;
  userName?: string | null;
  /** Row id, when available — lets an owner push open that submission directly */
  rowId?: string | null;
};

const KIND_LABEL: Record<SubmissionKind, string> = {
  application: "Self Application",
  referral: "Referral",
  tour_request: "Tour Request",
  benefits_screening: "Benefits Screening",
};

const INBOX_KIND: Record<SubmissionKind, string> = {
  application: "applications",
  referral: "referrals",
  tour_request: "tours",
  benefits_screening: "screenings",
};

const EXPO_PUSH_TOKEN = /^Exp(o|onent)PushToken\[[A-Za-z0-9_-]{1,120}\]$/;

const SUPPORT_PHONE = "(404) 731-2371";
const DEFAULT_SITE_URL = "https://www.newcreationliving.org";
const EMAIL_LOGO_CID = "ncl-logo";

let cachedEmailLogoBase64: string | null = null;

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");
}

function getEmailLogoBase64(): string | null {
  if (cachedEmailLogoBase64) return cachedEmailLogoBase64;

  try {
    const logoPath = join(process.cwd(), "public", "img", "ncl-email-logo.png");
    cachedEmailLogoBase64 = readFileSync(logoPath).toString("base64");
    return cachedEmailLogoBase64;
  } catch (error) {
    console.error("Email logo not found at public/img/ncl-email-logo.png:", error);
    return null;
  }
}

function getInlineLogoAttachment():
  | { filename: string; content: string; content_id: string }
  | null {
  const content = getEmailLogoBase64();
  if (!content) return null;

  return {
    filename: "ncl-email-logo.png",
    content,
    content_id: EMAIL_LOGO_CID,
  };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function paragraphsToHtml(paragraphs: string[]): string {
  return paragraphs
    .map(
      (paragraph) =>
        `<p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#2D3748;">${escapeHtml(paragraph)}</p>`
    )
    .join("");
}

function buildEmailSignatureHtml(): string {
  const siteUrl = getSiteUrl();
  const logoSrc = getEmailLogoBase64()
    ? `cid:${EMAIL_LOGO_CID}`
    : `${siteUrl}/img/ncl-email-logo.png`;

  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:32px;border-top:1px solid #E8E2D6;">
  <tr>
    <td style="padding-top:24px;text-align:center;">
      <a href="${siteUrl}" style="text-decoration:none;">
        <img src="${logoSrc}" alt="New Creation Living" width="120" height="93" style="display:block;margin:0 auto 14px;border:0;" />
      </a>
      <p style="margin:0 0 6px;font-family:Georgia,'Times New Roman',serif;font-size:15px;font-weight:700;letter-spacing:1.2px;color:#1B2B5E;">
        NEW CREATION LIVING
      </p>
      <p style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#B8963E;">
        From Benefits to Belonging
      </p>
      <p style="margin:0;font-size:14px;line-height:1.5;color:#5B6478;">
        <a href="tel:+14047312371" style="color:#1B2B5E;text-decoration:none;">${SUPPORT_PHONE}</a>
        &nbsp;·&nbsp;
        <a href="mailto:support@newcreationliving.org" style="color:#1B2B5E;text-decoration:none;">support@newcreationliving.org</a>
      </p>
    </td>
  </tr>
</table>`.trim();
}

function wrapUserEmailHtml(bodyParagraphs: string[]): string {
  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#F7F4EE;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#F7F4EE;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;background:#FFFFFF;border:1px solid #E8E2D6;border-radius:12px;">
            <tr>
              <td style="padding:32px 28px 28px;font-family:Arial,Helvetica,sans-serif;">
                ${paragraphsToHtml(bodyParagraphs)}
                ${buildEmailSignatureHtml()}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function formatDetails(details: NotificationPayload["details"]): string {
  return Object.entries(details)
    .filter(([, value]) => value != null && String(value).trim() !== "")
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

const DEFAULT_NOTIFY_EMAIL = "support@newcreationliving.org";
const DEFAULT_STAFF_FROM =
  "New Creation Living Alerts <notifications@newcreationliving.org>";
/** Always alerted, even if NOTIFY_EMAIL is unset or points at a broken mailbox. */
const ALWAYS_NOTIFY_EMAIL = "nclresidences@gmail.com";

function extractEmailAddress(value: string): string {
  const match = value.match(/<([^>]+)>/);
  return (match?.[1] || value).trim().toLowerCase();
}

/** Practical format check so Resend does not reject reply_to / confirmation to. */
function isValidEmailAddress(value: string | null | undefined): boolean {
  const email = (value || "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Staff alerts must send even if the submitter typed a bad address. */
function getStaffReplyTo(userEmail?: string | null): string | null {
  const email = (userEmail || "").trim();
  if (!email) return null;
  if (!isValidEmailAddress(email)) {
    console.warn(`Staff reply-to omitted: invalid submitter email "${email}"`);
    return null;
  }
  return email;
}

function getFromAddress(): string {
  return (
    process.env.RESEND_FROM_EMAIL || "New Creation Living <onboarding@resend.dev>"
  );
}

/** Prefer a From address that is not identical to the staff inbox. */
function getStaffFromAddress(staffTo: string): string {
  const configured =
    process.env.RESEND_STAFF_FROM_EMAIL ||
    process.env.RESEND_FROM_EMAIL ||
    DEFAULT_STAFF_FROM;
  const staffAddress = extractEmailAddress(staffTo);
  const fromAddress = extractEmailAddress(configured);

  if (fromAddress && fromAddress === staffAddress) {
    return DEFAULT_STAFF_FROM;
  }

  return configured;
}

function getStaffNotifyEmails(): string[] {
  const raw = (process.env.NOTIFY_EMAIL || DEFAULT_NOTIFY_EMAIL).trim();
  const emails = raw
    .split(/[,;\s]+/)
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  const configured = emails.length > 0 ? emails : [DEFAULT_NOTIFY_EMAIL];
  return [...new Set([...configured, ALWAYS_NOTIFY_EMAIL])];
}

function buildStaffEmailHtml(payload: NotificationPayload, label: string): string {
  const rows = Object.entries(payload.details)
    .filter(([, value]) => value != null && String(value).trim() !== "")
    .map(
      ([key, value]) =>
        `<tr>
          <td style="padding:12px;border-bottom:1px solid #E8E2D6;">
            <p style="margin:0 0 4px;color:#5B6478;font-size:13px;line-height:1.4;">${escapeHtml(key)}</p>
            <p style="margin:0;color:#1B2B5E;font-size:15px;font-weight:600;line-height:1.45;white-space:pre-wrap;">${escapeHtml(String(value))}</p>
          </td>
        </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#F7F4EE;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:560px;background:#FFFFFF;border:1px solid #E8E2D6;border-radius:12px;">
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 8px;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#B8963E;font-weight:700;">New ${escapeHtml(label)}</p>
                <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#1B2B5E;">${escapeHtml(payload.summary)}</h1>
                <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#2D3748;">
                  A visitor submitted the ${escapeHtml(label.toLowerCase())} form on New Creation Living.
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E8E2D6;border-radius:10px;overflow:hidden;">
                  ${rows}
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

async function sendResendEmail(opts: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  from?: string;
  replyTo?: string | null;
  attachments?: Array<{
    filename: string;
    content: string;
    content_id?: string;
  }>;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("Email skipped: set RESEND_API_KEY in .env.local / production env");
    return;
  }

  const from = opts.from || getFromAddress();
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [opts.to],
      ...(opts.replyTo?.trim() ? { reply_to: opts.replyTo.trim() } : {}),
      subject: opts.subject,
      text: opts.text,
      ...(opts.html ? { html: opts.html } : {}),
      ...(opts.attachments?.length ? { attachments: opts.attachments } : {}),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Resend failed (${response.status}) from=${from} to=${opts.to}: ${errorText}`
    );
  }
}

async function sendStaffEmailToRecipient(opts: {
  to: string;
  from: string;
  replyTo: string | null;
  subject: string;
  text: string;
  html: string;
}): Promise<void> {
  try {
    await sendResendEmail(opts);
  } catch (error) {
    if (!opts.replyTo) throw error;
    console.warn(
      `Staff email failed with reply-to=${opts.replyTo}; retrying without reply-to`
    );
    await sendResendEmail({ ...opts, replyTo: null });
  }
}

async function sendStaffEmail(payload: NotificationPayload): Promise<void> {
  const recipients = getStaffNotifyEmails();
  const from = getStaffFromAddress(recipients[0]);
  const label = KIND_LABEL[payload.kind];
  const body = [
    `New ${label} submission on New Creation Living.`,
    "",
    payload.summary,
    "",
    formatDetails(payload.details),
  ].join("\n");
  const html = buildStaffEmailHtml(payload, label);
  const subject = `New NCL ${label}: ${payload.summary}`;

  console.info(
    `Sending staff ${payload.kind} email to [${recipients.join(", ")}] from ${from}`
  );

  const replyTo = getStaffReplyTo(payload.userEmail);

  // Send individually so one bad recipient doesn't block the rest.
  const results = await Promise.allSettled(
    recipients.map((to) =>
      sendStaffEmailToRecipient({
        to,
        from,
        replyTo,
        subject,
        text: body,
        html,
      })
    )
  );

  const failures = results.filter((result) => result.status === "rejected");
  if (failures.length === results.length) {
    throw new Error(
      `All staff email recipients failed for ${payload.kind}: ${recipients.join(", ")}`
    );
  }
  for (const failure of failures) {
    if (failure.status === "rejected") {
      console.error("Staff email recipient failed:", failure.reason);
    }
  }
}

function buildUserConfirmation(payload: NotificationPayload): {
  subject: string;
  text: string;
  html: string;
} | null {
  const name = (payload.userName || "").trim() || "there";
  const preferredDate =
    typeof payload.details["Preferred date"] === "string"
      ? payload.details["Preferred date"]
      : null;
  const referee =
    typeof payload.details.Referee === "string" ? payload.details.Referee : null;

  switch (payload.kind) {
    case "application":
      return {
        subject: "We received your New Creation Living application",
        text: [
          `Hi ${name},`,
          "",
          "Thank you for applying to New Creation Living. We've received your application and our team will review it shortly.",
          "",
          "We'll follow up with you by phone or email — usually within a few hours during business hours.",
          "",
          `If you have questions in the meantime, call us at ${SUPPORT_PHONE}.`,
          "",
          "— New Creation Living",
        ].join("\n"),
        html: wrapUserEmailHtml([
          `Hi ${name},`,
          "Thank you for applying to New Creation Living. We've received your application and our team will review it shortly.",
          "We'll follow up with you by phone or email — usually within a few hours during business hours.",
          `If you have questions in the meantime, call us at ${SUPPORT_PHONE}.`,
        ]),
      };
    case "referral":
      return {
        subject: "We received your New Creation Living referral",
        text: [
          `Hi ${name},`,
          "",
          referee
            ? `Thank you for referring ${referee} to New Creation Living. We've received your referral and our team will review it shortly.`
            : "Thank you for your referral to New Creation Living. We've received it and our team will review it shortly.",
          "",
          "We'll follow up with you by phone or email — usually within a few hours during business hours.",
          "",
          `If you have questions in the meantime, call us at ${SUPPORT_PHONE}.`,
          "",
          "— New Creation Living",
        ].join("\n"),
        html: wrapUserEmailHtml([
          `Hi ${name},`,
          referee
            ? `Thank you for referring ${referee} to New Creation Living. We've received your referral and our team will review it shortly.`
            : "Thank you for your referral to New Creation Living. We've received it and our team will review it shortly.",
          "We'll follow up with you by phone or email — usually within a few hours during business hours.",
          `If you have questions in the meantime, call us at ${SUPPORT_PHONE}.`,
        ]),
      };
    case "tour_request":
      return {
        subject: "We received your New Creation Living tour request",
        text: [
          `Hi ${name},`,
          "",
          preferredDate
            ? `Thank you for requesting a tour. We've received your preferred date of ${preferredDate} and will confirm a time with you soon.`
            : "Thank you for requesting a tour. We've received your request and will confirm a time with you soon.",
          "",
          `If you need to reach us sooner, call ${SUPPORT_PHONE}.`,
          "",
          "— New Creation Living",
        ].join("\n"),
        html: wrapUserEmailHtml([
          `Hi ${name},`,
          preferredDate
            ? `Thank you for requesting a tour. We've received your preferred date of ${preferredDate} and will confirm a time with you soon.`
            : "Thank you for requesting a tour. We've received your request and will confirm a time with you soon.",
          `If you need to reach us sooner, call ${SUPPORT_PHONE}.`,
        ]),
      };
    case "benefits_screening":
      return {
        subject: "We received your New Creation Living benefits request",
        text: [
          `Hi ${name},`,
          "",
          "Thank you for reaching out about benefits assistance. We've received your screening request and our team will follow up shortly.",
          "",
          `If you have questions in the meantime, call us at ${SUPPORT_PHONE}.`,
          "",
          "— New Creation Living",
        ].join("\n"),
        html: wrapUserEmailHtml([
          `Hi ${name},`,
          "Thank you for reaching out about benefits assistance. We've received your screening request and our team will follow up shortly.",
          `If you have questions in the meantime, call us at ${SUPPORT_PHONE}.`,
        ]),
      };
    default:
      return null;
  }
}

async function sendUserConfirmation(payload: NotificationPayload): Promise<void> {
  const to = (payload.userEmail || "").trim();
  if (!to) {
    console.warn(
      `User confirmation skipped for ${payload.kind}: no submitter email provided`
    );
    return;
  }
  if (!isValidEmailAddress(to)) {
    console.warn(
      `User confirmation skipped for ${payload.kind}: invalid submitter email "${to}"`
    );
    return;
  }

  const message = buildUserConfirmation(payload);
  if (!message) return;

  const logoAttachment = getInlineLogoAttachment();

  await sendResendEmail({
    to,
    subject: message.subject,
    text: message.text,
    html: message.html,
    attachments: logoAttachment ? [logoAttachment] : undefined,
  });
}

async function sendSms(payload: NotificationPayload): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  const to = process.env.NOTIFY_PHONE;

  if (!accountSid || !authToken || !from || !to) {
    console.warn(
      "SMS notify skipped: set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, and NOTIFY_PHONE in .env.local"
    );
    return;
  }

  const label = KIND_LABEL[payload.kind];
  const message = `NCL: New ${label} — ${payload.summary}. Check the dashboard.`;

  const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
  const body = new URLSearchParams({
    To: to,
    From: from,
    Body: message,
  });

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Twilio failed (${response.status}): ${errorText}`);
  }
}

function getOwnerPushSecret(): string | null {
  const secret = (process.env.NOTIFY_OWNER_PUSH_SECRET || "").trim();
  return secret.length >= 16 ? secret : null;
}

function ownerPushClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createClient(url, anonKey);
}

async function listOwnerPushTokens(secret: string): Promise<string[]> {
  const supabase = ownerPushClient();
  if (!supabase) return [];

  const { data, error } = await supabase.rpc("house_list_owner_push_tokens", {
    p_secret: secret,
  });
  if (error) {
    throw new Error(`Owner push tokens failed: ${error.message}`);
  }

  const row = data as { ok?: boolean; tokens?: unknown; error?: string } | null;
  if (!row?.ok) {
    throw new Error(row?.error || "Owner push tokens were not returned.");
  }

  return Array.isArray(row.tokens)
    ? row.tokens.filter(
        (token): token is string => typeof token === "string" && EXPO_PUSH_TOKEN.test(token)
      )
    : [];
}

async function dropOwnerPushToken(secret: string, expoToken: string): Promise<void> {
  const supabase = ownerPushClient();
  if (!supabase) return;
  const { error } = await supabase.rpc("house_drop_push_token", {
    p_secret: secret,
    p_expo_token: expoToken,
  });
  if (error) {
    console.warn(`Could not drop stale push token: ${error.message}`);
  }
}

type ExpoPushTicket = {
  status?: string;
  message?: string;
  details?: { error?: string };
};

async function sendOwnerPush(payload: NotificationPayload): Promise<void> {
  const secret = getOwnerPushSecret();
  if (!secret) {
    console.warn(
      "Owner push skipped: set NOTIFY_OWNER_PUSH_SECRET (16+ chars) to match house_settings.owner_push_secret"
    );
    return;
  }

  const tokens = await listOwnerPushTokens(secret);
  if (tokens.length === 0) {
    console.info("Owner push skipped: no registered owner devices");
    return;
  }

  const label = KIND_LABEL[payload.kind];
  const messages = tokens.map((to) => ({
    to,
    sound: "default",
    channelId: "inbox",
    title: `New NCL ${label}`,
    body: payload.summary,
    data: {
      kind: INBOX_KIND[payload.kind],
      ...(payload.rowId ? { id: payload.rowId } : {}),
    },
  }));

  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messages),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Expo push failed (${response.status}): ${errorText}`);
  }

  const body = (await response.json()) as { data?: ExpoPushTicket[] };
  const tickets = Array.isArray(body.data) ? body.data : [];
  for (let i = 0; i < tickets.length; i += 1) {
    const ticket = tickets[i];
    const token = tokens[i];
    if (ticket?.status === "error" && ticket.details?.error === "DeviceNotRegistered" && token) {
      await dropOwnerPushToken(secret, token);
    }
  }
}

/**
 * Notify staff (email + SMS + owner push) and send the submitter a confirmation email.
 * Staff email always goes out, even if the submitter address is invalid.
 * Failures are logged only — they never fail the visitor's submission.
 */
export type DecisionEmailInput = {
  status: "accepted" | "denied";
  table: "applications" | "referrals";
  firstName: string;
  email: string | null | undefined;
};

export async function notifyApplicantDecision(input: DecisionEmailInput): Promise<void> {
  const to = (input.email || "").trim();
  if (!to) {
    throw new Error("This application has no email address.");
  }
  if (!isValidEmailAddress(to)) {
    throw new Error("This application does not have a usable email address.");
  }

  const name = input.firstName.trim() || "there";
  const accepted = input.status === "accepted";
  const subject = accepted
    ? "You've been accepted to New Creation Living"
    : "An update on your New Creation Living application";
  const paragraphs = accepted
    ? [
        `Hi ${name},`,
        "We're happy to let you know that your application to New Creation Living has been accepted.",
        "Our team will be in touch shortly about next steps, including move-in.",
        `If you have questions, call us at ${SUPPORT_PHONE}.`,
      ]
    : [
        `Hi ${name},`,
        "Thank you for applying to New Creation Living. After careful review, we are not able to offer you a place at this time.",
        `If you have questions, call us at ${SUPPORT_PHONE}.`,
      ];

  const text = [...paragraphs, "", "— New Creation Living"].join("\n\n");
  const html = wrapUserEmailHtml(paragraphs);
  const logoAttachment = getInlineLogoAttachment();

  if (process.env.RESEND_API_KEY) {
    try {
      await sendResendEmail({
        to,
        subject,
        text,
        html,
        attachments: logoAttachment ? [logoAttachment] : undefined,
      });
      return;
    } catch (err) {
      console.error("Resend decision email failed, trying Gmail backup:", err);
    }
  }

  const { sendGmailBackup } = await import("@/lib/gmail-backup");
  await sendGmailBackup({ to, subject, text, html });
}

export async function notifyNewSubmission(payload: NotificationPayload): Promise<void> {
  const results = await Promise.allSettled([
    sendStaffEmail(payload),
    sendSms(payload),
    sendUserConfirmation(payload),
    sendOwnerPush(payload),
  ]);

  for (const result of results) {
    if (result.status === "rejected") {
      console.error("Submission notification failed:", result.reason);
    }
  }
}
