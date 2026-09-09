import { houseMeetInfo } from "@/lib/house-meet";
import { formatUsd, moveInProration } from "@/lib/rent-proration";

const INCLUDED = [
  "Furnished Room",
  "Water, Gas & Electricity",
  "Wifi",
  "Laundry",
  "High-End Finishes & High Standard of Living",
  "Sober & Drug-Free Environment",
  "Access to Public Transportation",
  "Community Support",
  "On-site Management and More!",
] as const;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function buildMoveInConfirmation(input: {
  firstName: string;
  whenLabel: string;
  date: string;
  houseId?: string | null;
}): {
  subject: string;
  paragraphs: string[];
  extraHtml: string;
  text: string;
} {
  const name = input.firstName.trim() || "there";
  const meet = houseMeetInfo(input.houseId);
  const rent = moveInProration(input.date);
  const payOnArrival = formatUsd(rent.moveInTotal);
  const monthly = formatUsd(rent.monthlyTotal);

  const subject = "Your New Creation Living move-in is confirmed";
  const paragraphs = [
    `Hi ${name},`,
    "Your move-in with New Creation Living is confirmed. Here's what to remember:",
  ];

  const extraHtml = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:4px 0 20px;background:#F7F4EE;border:1px solid #E8E2D6;border-radius:10px;">
      <tr>
        <td style="padding:18px 18px 8px;">
          <p style="margin:0 0 10px;font-size:13px;letter-spacing:1.4px;text-transform:uppercase;font-weight:700;color:#B8963E;">Where and when to meet</p>
          <p style="margin:0 0 8px;font-size:16px;line-height:1.65;color:#2D3748;"><strong>Address:</strong> ${escapeHtml(meet.address)}</p>
          <p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#2D3748;"><strong>Day and time:</strong> ${escapeHtml(input.whenLabel)}</p>
          <p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#2D3748;">You don't need to bring furniture. Your room is already furnished.</p>
          <p style="margin:0 0 10px;font-size:13px;letter-spacing:1.4px;text-transform:uppercase;font-weight:700;color:#B8963E;">What you'll pay</p>
          <p style="margin:0 0 8px;font-size:16px;line-height:1.65;color:#2D3748;"><strong>Due at move-in:</strong> ${payOnArrival} (${formatUsd(rent.dailyRate)} × ${rent.daysRemaining} days left in ${escapeHtml(rent.monthLabel)}, including your move-in day)</p>
          <p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#2D3748;"><strong>Monthly:</strong> ${monthly} (${formatUsd(rent.dailyRate)} a day)</p>
          <p style="margin:0 0 8px;font-size:13px;letter-spacing:1.4px;text-transform:uppercase;font-weight:700;color:#B8963E;">It's all inclusive</p>
          <ul style="margin:0 0 8px;padding:0 0 0 4px;list-style:none;">
            ${INCLUDED.map(
              (item) =>
                `<li style="margin:0 0 6px;font-size:15px;line-height:1.5;color:#2D3748;">✓&nbsp;${escapeHtml(item)}</li>`
            ).join("")}
          </ul>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#2D3748;">If you have questions, call us at (404) 731-2371.</p>
  `;

  const text = [
    ...paragraphs,
    "",
    "Where and when to meet",
    `Address: ${meet.address}`,
    `Day and time: ${input.whenLabel}`,
    "",
    "You don't need to bring furniture. Your room is already furnished.",
    "",
    "What you'll pay",
    `Due at move-in: ${payOnArrival} ($25 × ${rent.daysRemaining} days left in ${rent.monthLabel}, including your move-in day)`,
    `Monthly: ${monthly} ($25 a day)`,
    "",
    "It's all inclusive",
    ...INCLUDED.map((item) => `✓ ${item}`),
    "",
    "If you have questions, call us at (404) 731-2371.",
    "",
    "— New Creation Living",
  ].join("\n");

  return { subject, paragraphs, extraHtml, text };
}
