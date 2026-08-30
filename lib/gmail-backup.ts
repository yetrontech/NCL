import nodemailer from "nodemailer";

const GMAIL_USER = (process.env.GMAIL_USER || "nclresidences@gmail.com").trim();

export async function sendGmailBackup(opts: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<void> {
  const pass = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, "");
  if (!pass) {
    throw new Error(
      "Gmail backup is not set up. Add GMAIL_APP_PASSWORD for nclresidences@gmail.com."
    );
  }

  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: GMAIL_USER, pass },
  });

  await transport.sendMail({
    from: `New Creation Living <${GMAIL_USER}>`,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  });
}
