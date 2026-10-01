function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Email version of the guide-page offer card. Layout is tables so mail clients keep it. */
export function buildGuideOfferEmail(opts: {
  siteUrl: string;
  bedsRemaining: number | null;
}): { html: string; text: string } {
  const checkUrl = `${opts.siteUrl.replace(/\/$/, "")}/quickeval/check`;
  const beds =
    opts.bedsRemaining == null
      ? ""
      : `<td align="right" valign="top" style="padding:0 0 0 12px;white-space:nowrap;">
          <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1;font-weight:600;color:#E23D3D;">${opts.bedsRemaining}</p>
          <p style="margin:4px 0 0;font-size:11px;line-height:1;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#E23D3D;">
            <span style="color:#E23D3D;">&#9679;</span> ${opts.bedsRemaining === 1 ? "bed left" : "beds left"}
          </p>
        </td>`;

  const html = `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:8px 0 4px;background:#211E19;border:1px solid #3A3529;border-radius:10px;">
  <tr>
    <td style="padding:28px 24px 24px;font-family:Arial,Helvetica,sans-serif;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td valign="top" style="font-size:11px;line-height:1.3;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:#E23D3D;">
            Limited Space Offer
          </td>
          ${beds}
        </tr>
      </table>
      <h2 style="margin:16px 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.22;font-weight:600;color:#F1ECDF;">
        We'll pay for your transportation to our home.
      </h2>
      <p style="margin:0 0 10px;font-size:16px;line-height:1.45;font-weight:700;color:#F1ECDF;">Pay 1 month.</p>
      <p style="margin:0 0 12px;font-size:16px;line-height:1.45;font-weight:700;color:#F1ECDF;">We guarantee you safety, stability, and a home.</p>
      <p style="margin:0 0 12px;font-size:15px;line-height:1.55;color:#C9C2AE;">If you decide this is not the place for you, we'll give you a 100% refund within 7 days of move-in.</p>
      <p style="margin:0 0 12px;font-size:15px;line-height:1.55;color:#C9C2AE;">Once you become a resident, on your second successful referral, your full month's rent will be only $125 for the whole month.</p>
      <p style="margin:0 0 18px;font-size:15px;line-height:1.55;color:#C9C2AE;">Each additional successful referral gives you another month of $125 in rent.</p>
      <p style="margin:0 0 12px;font-size:12px;line-height:1.4;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#B8963E;">See if you are eligible below</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td align="center" bgcolor="#1B2E52" style="border-radius:5px;">
            <a href="${escapeHtml(checkUrl)}" style="display:block;padding:14px 20px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:#F3EEE3;text-decoration:none;">See if you're a good fit</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`.trim();

  const bedLine =
    opts.bedsRemaining == null
      ? []
      : [`${opts.bedsRemaining} ${opts.bedsRemaining === 1 ? "bed" : "beds"} left`];

  const text = [
    "Limited Space Offer",
    ...bedLine,
    "",
    "We'll pay for your transportation to our home.",
    "Pay 1 month.",
    "We guarantee you safety, stability, and a home.",
    "If you decide this is not the place for you, we'll give you a 100% refund within 7 days of move-in.",
    "Once you become a resident, on your second successful referral, your full month's rent will be only $125 for the whole month.",
    "Each additional successful referral gives you another month of $125 in rent.",
    "",
    `See if you are eligible: ${checkUrl}`,
  ].join("\n");

  return { html, text };
}
