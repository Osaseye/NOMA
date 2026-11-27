/**
 * Shop Noma — Editorial HTML Email Layout & Complete Transactional/Campaign Templates
 *
 * Visual Direction:
 * - Single clean white 600px card on a soft #F4F5F7 canvas with the custom Noma header banner
 * - Editorial font pairing engineered for 100% native rendering in Gmail, Apple Mail & Outlook:
 *   • Display Headlines: Georgia, 'Times New Roman', Times, serif (28px, refined regular weight)
 *   • Eyebrows & Table Headers: Crisp uppercase tracked sans-serif (11px, 0.14em tracking)
 *   • Body & Tabular Naira: Clean humanist sans-serif (#334155 body, #0B1220 ink values)
 * - Thin Noma Blue (#1049EB) + Noma Gold (#FEB719) signature rule under every headline
 * - Structured 3-column magazine-style receipt table + 2-column detail grid
 * - Official-color Instagram, WhatsApp, and X social icons in the footer
 */

export const NOMA_EMAIL_HEADER_BANNER_URL =
  'https://pub-104edba51a2647c881c1c4db7f453fa7.r2.dev/email/noma-email-header-banner.jpg'

export const NOMA_EMAIL_SOCIAL_ICONS = {
  instagram: 'https://pub-104edba51a2647c881c1c4db7f453fa7.r2.dev/email/icon-instagram-v2.png',
  whatsapp: 'https://pub-104edba51a2647c881c1c4db7f453fa7.r2.dev/email/icon-whatsapp-v2.png',
  x: 'https://pub-104edba51a2647c881c1c4db7f453fa7.r2.dev/email/icon-x-v2.png',
}

export const DEFAULT_STOREFRONT_URL = 'https://shopnoma.com.ng'
export const DEFAULT_WHATSAPP_URL = 'https://wa.me/2348104189461'
export const DEFAULT_INSTAGRAM_URL = 'https://instagram.com/shopnoma'
export const DEFAULT_X_URL = 'https://x.com/shopnoma'

export interface RenderedEmail {
  subject: string
  html: string
  text: string
}

export interface EmailOrderItem {
  name: string
  quantity: number
  unitPrice: number
  size?: string
}

export interface OrderConfirmedEmailData {
  orderId: string
  customerName: string
  items: EmailOrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  deliveryArea: string
  address?: string
  etaText?: string
  paymentRef?: string
  storefrontUrl?: string
  whatsappUrl?: string
}

export interface OrderDispatchedEmailData {
  orderId: string
  customerName: string
  deliveryArea: string
  etaText?: string
  riderNote?: string
  storefrontUrl?: string
  whatsappUrl?: string
}

export interface OrderDeliveredEmailData {
  orderId: string
  customerName: string
  items: Array<{ name: string; slug?: string }>
  storefrontUrl?: string
  whatsappUrl?: string
}

export interface OrderCancelledEmailData {
  orderId: string
  customerName: string
  total: number
  wasPaid: boolean
  reason?: string
  storefrontUrl?: string
  whatsappUrl?: string
}

export interface AdminNewOrderEmailData {
  orderId: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  deliveryArea: string
  items: EmailOrderItem[]
  total: number
  deliveryFee: number
  markupEarned?: number
  paymentMethod?: string
  paymentRef?: string
  storefrontUrl?: string
}

export interface AdminSupportAlertEmailData {
  senderName: string
  senderEmail?: string
  senderPhone?: string
  subject: string
  message: string
  storefrontUrl?: string
}

const SERIF_FONT = "Georgia, 'Times New Roman', Times, serif"
const SANS_FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatNairaEmail(amount: number): string {
  const safe = Number.isFinite(amount) ? Math.round(amount) : 0
  return `₦${safe.toLocaleString('en-NG')}`
}

function firstNameOf(fullName: string): string {
  const trimmed = fullName.trim()
  if (!trimmed) return 'there'
  return trimmed.split(/\s+/)[0]
}

function inlineLink(label: string, href: string): string {
  return `<a href="${escapeHtml(href)}" style="color:#1049EB;font-weight:600;text-decoration:none;border-bottom:1px solid #93B4FA;padding-bottom:1px;">${escapeHtml(label)}</a>`
}

function primaryCta(label: string, href: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 6px 0;">
      <tr>
        <td align="center" bgcolor="#1049EB" style="border-radius:999px;">
          <a href="${escapeHtml(href)}" style="display:inline-block;padding:13px 28px;font-family:${SANS_FONT};font-size:13.5px;font-weight:600;letter-spacing:0.01em;color:#FFFFFF;text-decoration:none;border-radius:999px;">
            ${escapeHtml(label)} &nbsp;&rarr;
          </a>
        </td>
      </tr>
    </table>`
}

function paragraph(htmlContent: string, marginBottom = 16): string {
  return `<p style="margin:0 0 ${marginBottom}px 0;font-family:${SANS_FONT};font-size:15px;line-height:1.75;font-weight:400;color:#334155;">${htmlContent}</p>`
}

function leadInLine(leadIn: string, bodyHtml: string, marginBottom = 13): string {
  return `<p style="margin:0 0 ${marginBottom}px 0;font-family:${SANS_FONT};font-size:14.5px;line-height:1.7;font-weight:400;color:#334155;"><strong style="color:#0B1220;font-weight:700;">${escapeHtml(leadIn)}</strong> ${bodyHtml}</p>`
}

function renderTwoColDetails(
  left: { label: string; value: string; sub?: string },
  right: { label: string; value: string; sub?: string },
): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;border-top:1px solid #E2E8F0;border-bottom:1px solid #E2E8F0;border-collapse:collapse;">
      <tr>
        <td width="50%" valign="top" style="padding:16px 14px 16px 0;border-right:1px solid #E2E8F0;">
          <div style="font-family:${SANS_FONT};font-size:10.5px;font-weight:700;letter-spacing:0.13em;text-transform:uppercase;color:#64748B;margin-bottom:6px;">
            ${escapeHtml(left.label)}
          </div>
          <div style="font-family:${SANS_FONT};font-size:14px;font-weight:600;line-height:1.45;color:#0B1220;">
            ${escapeHtml(left.value)}
          </div>
          ${left.sub ? `<div style="font-family:${SANS_FONT};font-size:12.5px;line-height:1.5;color:#64748B;margin-top:3px;">${escapeHtml(left.sub)}</div>` : ''}
        </td>
        <td width="50%" valign="top" style="padding:16px 0 16px 18px;">
          <div style="font-family:${SANS_FONT};font-size:10.5px;font-weight:700;letter-spacing:0.13em;text-transform:uppercase;color:#64748B;margin-bottom:6px;">
            ${escapeHtml(right.label)}
          </div>
          <div style="font-family:${SANS_FONT};font-size:14px;font-weight:600;line-height:1.45;color:#0B1220;font-variant-numeric:tabular-nums;">
            ${escapeHtml(right.value)}
          </div>
          ${right.sub ? `<div style="font-family:${SANS_FONT};font-size:12.5px;line-height:1.5;color:#64748B;margin-top:3px;">${escapeHtml(right.sub)}</div>` : ''}
        </td>
      </tr>
    </table>`
}

function renderReceiptTable(
  items: EmailOrderItem[],
  summaryRows: Array<{ label: string; value: string; bold?: boolean }>,
): string {
  const itemRowsHtml = items
    .map((item) => {
      const lineTotal = formatNairaEmail(item.unitPrice * item.quantity)
      return `
        <tr>
          <td valign="top" style="padding:14px 12px 14px 0;border-bottom:1px solid #E2E8F0;font-family:${SANS_FONT};">
            <div style="font-size:14.5px;font-weight:600;line-height:1.4;color:#0B1220;">
              ${escapeHtml(item.name)}
            </div>
            ${
              item.size
                ? `<div style="font-size:12.5px;color:#64748B;margin-top:2px;">Size ${escapeHtml(item.size)}</div>`
                : ''
            }
          </td>
          <td align="center" valign="top" style="padding:14px 10px;border-bottom:1px solid #E2E8F0;font-family:${SANS_FONT};font-size:13.5px;font-weight:500;color:#475569;white-space:nowrap;font-variant-numeric:tabular-nums;">
            &times;${item.quantity}
          </td>
          <td align="right" valign="top" style="padding:14px 0 14px 12px;border-bottom:1px solid #E2E8F0;font-family:${SANS_FONT};font-size:14.5px;font-weight:600;color:#0B1220;white-space:nowrap;font-variant-numeric:tabular-nums;">
            ${escapeHtml(lineTotal)}
          </td>
        </tr>`
    })
    .join('')

  const totalsHtml = summaryRows
    .map((row, idx) => {
      const isLast = idx === summaryRows.length - 1
      const topBorder = row.bold ? 'border-top:1.5px solid #0B1220;' : ''
      const padTop = row.bold ? '14px' : '9px'
      const padBottom = isLast ? '4px' : '9px'
      return `
        <tr>
          <td colspan="2" style="padding:${padTop} 12px ${padBottom} 0;${topBorder}font-family:${SANS_FONT};font-size:${row.bold ? '14px' : '13.5px'};font-weight:${row.bold ? '700' : '400'};color:${row.bold ? '#0B1220' : '#64748B'};letter-spacing:${row.bold ? '0.02em' : '0'};">
            ${escapeHtml(row.label)}
          </td>
          <td align="right" style="padding:${padTop} 0 ${padBottom} 12px;${topBorder}font-family:${SANS_FONT};font-size:${row.bold ? '18px' : '14px'};font-weight:${row.bold ? '700' : '600'};color:#0B1220;white-space:nowrap;font-variant-numeric:tabular-nums;">
            ${escapeHtml(row.value)}
          </td>
        </tr>`
    })
    .join('')

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 22px 0;border-collapse:collapse;">
      <tr>
        <th align="left" style="padding:0 12px 10px 0;border-bottom:2px solid #0B1220;font-family:${SANS_FONT};font-size:10.5px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#64748B;">
          Item
        </th>
        <th align="center" style="padding:0 10px 10px 10px;border-bottom:2px solid #0B1220;font-family:${SANS_FONT};font-size:10.5px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#64748B;">
          Qty
        </th>
        <th align="right" style="padding:0 0 10px 12px;border-bottom:2px solid #0B1220;font-family:${SANS_FONT};font-size:10.5px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#64748B;">
          Amount
        </th>
      </tr>
      ${itemRowsHtml}
      ${totalsHtml}
    </table>`
}

export interface NomaEmailLayoutOptions {
  preheader: string
  eyebrow?: string
  heading: string
  bodyHtml: string
  signOff?: string
  footerLine1?: string
  footerLine2?: string
  instagramUrl?: string
  whatsappUrl?: string
  xUrl?: string
}

/**
 * Shared Shop Noma editorial HTML email shell.
 * Pairs Georgia display serif headings with crisp sans-serif body & structured hairline tables.
 */
export function renderNomaEmailLayout({
  preheader,
  eyebrow = 'Shop Noma',
  heading,
  bodyHtml,
  signOff = 'Warm regards,<br /><span style="font-family:Georgia, \'Times New Roman\', serif;font-size:16px;color:#0B1220;font-weight:700;">The Noma Team</span>',
  footerLine1 = 'Shop Noma · Retail & Wholesale across Nigeria',
  footerLine2 = 'Questions? Reply directly to this email anytime.',
  instagramUrl = DEFAULT_INSTAGRAM_URL,
  whatsappUrl = DEFAULT_WHATSAPP_URL,
  xUrl = DEFAULT_X_URL,
}: NomaEmailLayoutOptions): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background-color:#F4F5F7;font-family:${SANS_FONT};-webkit-font-smoothing:antialiased;color:#334155;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">
    ${escapeHtml(preheader)}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F4F5F7;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#FFFFFF;border:1px solid #E5E7EB;border-radius:14px;overflow:hidden;border-collapse:separate;">
          <!-- Full-Width Noma Header Banner -->
          <tr>
            <td style="padding:0;line-height:0;font-size:0;border-bottom:1px solid #EEF0F3;">
              <img
                src="${NOMA_EMAIL_HEADER_BANNER_URL}"
                alt="Noma — Everything You Need"
                width="600"
                style="display:block;width:100%;max-width:600px;height:auto;border:0;"
              />
            </td>
          </tr>

          <!-- Editorial Letter Body -->
          <tr>
            <td style="padding:38px 42px 34px 42px;">
              <!-- Tracked Uppercase Eyebrow -->
              <div style="margin:0 0 10px 0;font-family:${SANS_FONT};font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#1049EB;">
                ${escapeHtml(eyebrow)}
              </div>

              <!-- Editorial Serif Display Headline -->
              <h1 style="margin:0 0 18px 0;font-family:${SERIF_FONT};font-size:28px;line-height:1.24;font-weight:400;letter-spacing:-0.015em;color:#0B1220;">
                ${escapeHtml(heading)}
              </h1>

              <!-- Thin Brand Signature Accent Rule (Noma Blue + Noma Gold) -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 26px 0;">
                <tr>
                  <td width="38" height="2" bgcolor="#1049EB" style="font-size:0;line-height:0;">&nbsp;</td>
                  <td width="6" height="2" style="font-size:0;line-height:0;">&nbsp;</td>
                  <td width="14" height="2" bgcolor="#FEB719" style="font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>

              ${bodyHtml}

              <p style="margin:30px 0 0 0;font-family:${SANS_FONT};font-size:14.5px;line-height:1.75;color:#475569;">
                ${signOff}
              </p>
            </td>
          </tr>

          <!-- Clean Centered Footer with Full-Color Social Icons -->
          <tr>
            <td align="center" style="padding:26px 40px 30px 40px;border-top:1px solid #EEF0F3;background-color:#FAFAFB;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 14px auto;">
                <tr>
                  <td style="padding:0 7px;">
                    <a href="${escapeHtml(instagramUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Noma on Instagram" style="display:inline-block;text-decoration:none;">
                      <img src="${NOMA_EMAIL_SOCIAL_ICONS.instagram}" alt="Instagram" width="30" height="30" style="display:block;width:30px;height:30px;border:0;border-radius:8px;" />
                    </a>
                  </td>
                  <td style="padding:0 7px;">
                    <a href="${escapeHtml(whatsappUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Noma on WhatsApp" style="display:inline-block;text-decoration:none;">
                      <img src="${NOMA_EMAIL_SOCIAL_ICONS.whatsapp}" alt="WhatsApp" width="30" height="30" style="display:block;width:30px;height:30px;border:0;border-radius:8px;" />
                    </a>
                  </td>
                  <td style="padding:0 7px;">
                    <a href="${escapeHtml(xUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Noma on X" style="display:inline-block;text-decoration:none;">
                      <img src="${NOMA_EMAIL_SOCIAL_ICONS.x}" alt="X" width="30" height="30" style="display:block;width:30px;height:30px;border:0;border-radius:8px;" />
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 4px 0;font-family:${SANS_FONT};font-size:12px;line-height:1.5;font-weight:600;color:#475569;">
                ${escapeHtml(footerLine1)}
              </p>
              <p style="margin:0;font-family:${SANS_FONT};font-size:12px;line-height:1.5;color:#94A3B8;">
                ${escapeHtml(footerLine2)}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ============================================================================
// PHASE 1A — CORE LAUNCH TRANSACTIONAL TEMPLATES (6 TEMPLATES)
// ============================================================================

/**
 * 1. `order_confirmed` — Sent to the customer as soon as payment is confirmed.
 */
export function orderConfirmedEmail(data: OrderConfirmedEmailData): RenderedEmail {
  const baseUrl = (data.storefrontUrl || DEFAULT_STOREFRONT_URL).replace(/\/$/, '')
  const waUrl = data.whatsappUrl || DEFAULT_WHATSAPP_URL
  const trackUrl = `${baseUrl}/orders/${encodeURIComponent(data.orderId)}`
  const firstName = firstNameOf(data.customerName)
  const destination = [data.address, data.deliveryArea].filter(Boolean).join(', ')
  const eta = data.etaText || '2–5 business days'

  const receiptHtml = renderReceiptTable(data.items, [
    { label: 'Subtotal', value: formatNairaEmail(data.subtotal) },
    {
      label: 'Delivery',
      value: data.deliveryFee === 0 ? 'Free' : formatNairaEmail(data.deliveryFee),
    },
    { label: 'Total Paid', value: formatNairaEmail(data.total), bold: true },
  ])

  const detailsHtml = renderTwoColDetails(
    {
      label: 'Delivery Destination',
      value: destination || 'Nigeria',
    },
    {
      label: 'Estimated Arrival',
      value: eta,
      sub: data.paymentRef ? `Ref: ${data.paymentRef}` : undefined,
    },
  )

  const bodyHtml = [
    paragraph(`Hi ${escapeHtml(firstName)},`),
    paragraph(
      `Thank you for shopping with Noma. Your payment has been confirmed and our fulfillment team is now preparing and quality-checking your order.`,
    ),
    receiptHtml,
    detailsHtml,
    leadInLine(
      'What happens next:',
      `As soon as your package is handed to our dispatch partner, we will email you with live delivery details.`,
      0,
    ),
    primaryCta('Track Your Order', trackUrl),
  ].join('')

  const html = renderNomaEmailLayout({
    preheader: `Order ${data.orderId} confirmed — ${formatNairaEmail(data.total)} received.`,
    eyebrow: `Order Confirmation · ${data.orderId}`,
    heading: `Thank you, ${firstName}. Your order is confirmed.`,
    bodyHtml,
    whatsappUrl: waUrl,
  })

  const textItems = data.items
    .map(
      (i) =>
        `- ${i.name} x${i.quantity}${i.size ? ` (Size ${i.size})` : ''}: ${formatNairaEmail(i.unitPrice * i.quantity)}`,
    )
    .join('\n')

  const text = [
    `Hi ${firstName},`,
    '',
    `Thank you for your order. Your payment has been confirmed for order ${data.orderId}.`,
    '',
    textItems,
    `Subtotal: ${formatNairaEmail(data.subtotal)}`,
    `Delivery: ${data.deliveryFee === 0 ? 'Free' : formatNairaEmail(data.deliveryFee)}`,
    `Total Paid: ${formatNairaEmail(data.total)}`,
    '',
    `Delivery destination: ${destination || 'Nigeria'}`,
    `Estimated arrival: ${eta}`,
    `Track your order: ${trackUrl}`,
    '',
    'Warm regards,',
    'The Noma Team',
  ].join('\n')

  return {
    subject: `Order ${data.orderId} confirmed — Shop Noma`,
    html,
    text,
  }
}

/**
 * 2. `order_dispatched` — Sent to the customer when Admin marks order as `dispatched`.
 */
export function orderDispatchedEmail(data: OrderDispatchedEmailData): RenderedEmail {
  const baseUrl = (data.storefrontUrl || DEFAULT_STOREFRONT_URL).replace(/\/$/, '')
  const trackUrl = `${baseUrl}/orders/${encodeURIComponent(data.orderId)}`
  const firstName = firstNameOf(data.customerName)
  const eta = data.etaText || 'Shortly'

  const detailsHtml = renderTwoColDetails(
    { label: 'Destination', value: data.deliveryArea || 'Nigeria' },
    { label: 'Arrival Window', value: eta, sub: data.riderNote || 'Rider will call before arrival' },
  )

  const bodyHtml = [
    paragraph(`Hi ${escapeHtml(firstName)},`),
    paragraph(
      `Your Noma order has left our fulfillment desk and is now on its way to you. Please keep your phone line reachable so handover is smooth.`,
    ),
    detailsHtml,
    primaryCta('Follow Live Progress', trackUrl),
  ].join('')

  const html = renderNomaEmailLayout({
    preheader: `Order ${data.orderId} is on its way to ${data.deliveryArea}.`,
    eyebrow: `Out for Delivery · ${data.orderId}`,
    heading: `Your order is on its way`,
    bodyHtml,
    whatsappUrl: data.whatsappUrl,
  })

  const text = [
    `Hi ${firstName},`,
    '',
    `Your Noma order ${data.orderId} has been dispatched and is heading to ${data.deliveryArea}.`,
    data.riderNote ? `Dispatch note: ${data.riderNote}` : '',
    `Track live progress: ${trackUrl}`,
    '',
    'Warm regards,',
    'The Noma Team',
  ]
    .filter(Boolean)
    .join('\n')

  return {
    subject: `Your Noma order ${data.orderId} is on the way`,
    html,
    text,
  }
}

/**
 * 3. `order_delivered` — Sent to the customer when Admin marks order as `delivered`.
 */
export function orderDeliveredEmail(data: OrderDeliveredEmailData): RenderedEmail {
  const baseUrl = (data.storefrontUrl || DEFAULT_STOREFRONT_URL).replace(/\/$/, '')
  const waUrl = data.whatsappUrl || DEFAULT_WHATSAPP_URL
  const firstName = firstNameOf(data.customerName)
  const firstItem = data.items[0]
  const reviewUrl = firstItem?.slug
    ? `${baseUrl}/product/${encodeURIComponent(firstItem.slug)}`
    : `${baseUrl}/orders/${encodeURIComponent(data.orderId)}`

  const itemSummary =
    data.items.length === 1
      ? escapeHtml(data.items[0].name)
      : `${data.items.length} items from order ${escapeHtml(data.orderId)}`

  const bodyHtml = [
    paragraph(`Hi ${escapeHtml(firstName)},`),
    paragraph(
      `Your Noma order (${itemSummary}) has been delivered. We hope everything arrived in great condition and fits right in.`,
    ),
    leadInLine(
      'Need anything else?',
      `If anything isn't right with your package, simply reply to this email or ${inlineLink('message us on WhatsApp', waUrl)} and our team will sort it out quickly.`,
      0,
    ),
    primaryCta('Leave a Quick Review', reviewUrl),
  ].join('')

  const html = renderNomaEmailLayout({
    preheader: `Order ${data.orderId} has been delivered — thank you for shopping with Noma.`,
    eyebrow: `Delivered · ${data.orderId}`,
    heading: `Your Noma package has arrived`,
    bodyHtml,
    whatsappUrl: waUrl,
  })

  const text = [
    `Hi ${firstName},`,
    '',
    `Your Noma order ${data.orderId} has been delivered. We hope everything arrived in great condition.`,
    `Share a quick review: ${reviewUrl}`,
    `Need help? Chat on WhatsApp: ${waUrl}`,
    '',
    'Warm regards,',
    'The Noma Team',
  ].join('\n')

  return {
    subject: `Delivered: Noma order ${data.orderId}`,
    html,
    text,
  }
}

/**
 * 4. `order_cancelled` — Sent to the customer when an order is cancelled.
 */
export function orderCancelledEmail(data: OrderCancelledEmailData): RenderedEmail {
  const baseUrl = (data.storefrontUrl || DEFAULT_STOREFRONT_URL).replace(/\/$/, '')
  const waUrl = data.whatsappUrl || DEFAULT_WHATSAPP_URL
  const firstName = firstNameOf(data.customerName)
  const catalogUrl = `${baseUrl}/catalog`

  const refundText = data.wasPaid
    ? `Your payment of <strong style="color:#0B1220;font-variant-numeric:tabular-nums;">${escapeHtml(formatNairaEmail(data.total))}</strong> is being refunded to your original payment method (typically 1–3 business days).`
    : `No charge was completed for this order, so no further action is needed on your side.`

  const bodyHtml = [
    paragraph(`Hi ${escapeHtml(firstName)},`),
    paragraph(
      `This is a quick note to confirm that your Noma order <strong style="color:#0B1220;">${escapeHtml(data.orderId)}</strong> has been cancelled.${data.reason ? ` Reason: ${escapeHtml(data.reason)}.` : ''}`,
    ),
    leadInLine('Payment & refund:', refundText),
    leadInLine(
      'Need assistance?',
      `If this was unexpected or you would like help placing a replacement order, ${inlineLink('chat with our team on WhatsApp', waUrl)} or ${inlineLink('browse the catalog', catalogUrl)}.`,
      0,
    ),
  ].join('')

  const html = renderNomaEmailLayout({
    preheader: `Update regarding your Noma order ${data.orderId}.`,
    eyebrow: `Order Update · ${data.orderId}`,
    heading: `Order ${data.orderId} was cancelled`,
    bodyHtml,
    whatsappUrl: waUrl,
  })

  const text = [
    `Hi ${firstName},`,
    '',
    `Your Noma order ${data.orderId} has been cancelled.${data.reason ? ` Reason: ${data.reason}.` : ''}`,
    data.wasPaid
      ? `Payment & refund: Your payment of ${formatNairaEmail(data.total)} is being refunded (typically 1–3 business days).`
      : 'Payment & refund: No charge was completed for this order.',
    `Need help? Chat on WhatsApp: ${waUrl}`,
    '',
    'Warm regards,',
    'The Noma Team',
  ].join('\n')

  return {
    subject: `Order ${data.orderId} cancelled — Shop Noma`,
    html,
    text,
  }
}

/**
 * 5. `admin_new_order` — Instant operations alert sent to Admin on every confirmed paid order.
 */
export function adminNewOrderEmail(data: AdminNewOrderEmailData): RenderedEmail {
  const baseUrl = (data.storefrontUrl || DEFAULT_STOREFRONT_URL).replace(/\/$/, '')
  const adminOrderUrl = `${baseUrl}/admin/orders/${encodeURIComponent(data.orderId)}`

  const summaryRows: Array<{ label: string; value: string; bold?: boolean }> = [
    {
      label: 'Delivery Fee',
      value: data.deliveryFee === 0 ? 'Free' : formatNairaEmail(data.deliveryFee),
    },
    { label: 'Order Total', value: formatNairaEmail(data.total), bold: true },
  ]
  if (typeof data.markupEarned === 'number' && data.markupEarned > 0) {
    summaryRows.push({
      label: 'Estimated Margin',
      value: formatNairaEmail(data.markupEarned),
    })
  }

  const detailsHtml = renderTwoColDetails(
    {
      label: 'Customer',
      value: data.customerName,
      sub: [data.customerPhone, data.customerEmail].filter(Boolean).join(' · '),
    },
    {
      label: 'Destination',
      value: data.deliveryArea || 'Nigeria',
      sub: data.paymentRef ? `${data.paymentMethod || 'Transfer'} · ${data.paymentRef}` : undefined,
    },
  )

  const bodyHtml = [
    paragraph(
      `A new paid order for <strong style="color:#0B1220;font-variant-numeric:tabular-nums;">${escapeHtml(formatNairaEmail(data.total))}</strong> just arrived and is ready for fulfillment.`,
    ),
    detailsHtml,
    renderReceiptTable(data.items, summaryRows),
    primaryCta(`Open Order ${data.orderId} in Admin`, adminOrderUrl),
  ].join('')

  const html = renderNomaEmailLayout({
    preheader: `New paid order ${data.orderId} — ${formatNairaEmail(data.total)} from ${data.customerName}.`,
    eyebrow: `Admin Alert · ${data.orderId}`,
    heading: `New paid order received`,
    bodyHtml,
    signOff: '— Noma Operations',
    footerLine2: 'Internal admin notification from Shop Noma.',
  })

  const text = [
    `New paid order: ${data.orderId} (${formatNairaEmail(data.total)})`,
    `Customer: ${data.customerName} (${data.customerPhone})`,
    `Destination: ${data.deliveryArea || 'Nigeria'}`,
    '',
    ...data.items.map(
      (i) => `- ${i.name} x${i.quantity}: ${formatNairaEmail(i.unitPrice * i.quantity)}`,
    ),
    '',
    `Open in Admin: ${adminOrderUrl}`,
  ].join('\n')

  return {
    subject: `New Order ${data.orderId} · ${formatNairaEmail(data.total)}`,
    html,
    text,
  }
}

/**
 * 6. `admin_support_alert` — Sent to Admin when a shopper submits the `/support` contact form.
 */
export function adminSupportAlertEmail(data: AdminSupportAlertEmailData): RenderedEmail {
  const baseUrl = (data.storefrontUrl || DEFAULT_STOREFRONT_URL).replace(/\/$/, '')
  const inboxUrl = `${baseUrl}/admin/feedback`

  const detailsHtml = renderTwoColDetails(
    {
      label: 'From',
      value: data.senderName,
      sub: [data.senderEmail, data.senderPhone].filter(Boolean).join(' · ') || undefined,
    },
    {
      label: 'Topic',
      value: data.subject || 'General Inquiry',
    },
  )

  const bodyHtml = [
    paragraph(`A shopper just sent a new message through the Noma support page.`),
    detailsHtml,
    `<div style="margin:20px 0;font-family:${SANS_FONT};font-size:15px;line-height:1.75;color:#1E293B;white-space:pre-line;">${escapeHtml(data.message)}</div>`,
    primaryCta('Open Feedback Inbox', inboxUrl),
  ].join('')

  const html = renderNomaEmailLayout({
    preheader: `New support message from ${data.senderName}: ${data.subject}`,
    eyebrow: 'Customer Support Inbox',
    heading: `New customer message`,
    bodyHtml,
    signOff: '— Noma Operations',
    footerLine2: 'Internal admin notification from Shop Noma.',
  })

  const text = [
    `New support message from ${data.senderName}`,
    `Subject: ${data.subject || 'General Inquiry'}`,
    '',
    data.message,
    '',
    `Open Feedback Inbox: ${inboxUrl}`,
  ].join('\n')

  return {
    subject: `Support Message: ${data.subject || data.senderName}`,
    html,
    text,
  }
}

// ============================================================================
// LIFECYCLE, MARKETING, SEASONAL PROMO & PHASE 2 VENDOR TEMPLATES
// ============================================================================

export interface CustomerWelcomeEmailData {
  customerName: string
  storefrontUrl?: string
  whatsappUrl?: string
}

/**
 * 7. `customer_welcome` — Sent after successful customer account registration.
 */
export function customerWelcomeEmail(data: CustomerWelcomeEmailData): RenderedEmail {
  const baseUrl = (data.storefrontUrl || DEFAULT_STOREFRONT_URL).replace(/\/$/, '')
  const waUrl = data.whatsappUrl || DEFAULT_WHATSAPP_URL
  const firstName = firstNameOf(data.customerName)

  const bodyHtml = [
    paragraph(`Hi ${escapeHtml(firstName)},`),
    paragraph(
      `Welcome to Noma. Your account is now active — designed to make everyday retail and wholesale shopping across Nigeria effortless.`,
    ),
    leadInLine(
      'Faster checkout:',
      `Save your delivery address once in ${inlineLink('your account', `${baseUrl}/account`)} and breeze through future orders.`,
    ),
    leadInLine(
      'Live order tracking:',
      `Follow every order step-by-step from confirmation to doorstep delivery on your ${inlineLink('orders page', `${baseUrl}/orders`)}.`,
      0,
    ),
    primaryCta('Explore the Catalog', `${baseUrl}/catalog`),
  ].join('')

  const html = renderNomaEmailLayout({
    preheader: `Welcome to Shop Noma, ${firstName}. Your account is ready.`,
    eyebrow: 'Welcome to Noma',
    heading: `Glad to have you with us, ${firstName}.`,
    bodyHtml,
    whatsappUrl: waUrl,
  })

  const text = [
    `Hi ${firstName},`,
    '',
    'Welcome to Noma. Your account is ready.',
    `Account: ${baseUrl}/account`,
    `Browse catalog: ${baseUrl}/catalog`,
    '',
    'Warm regards,',
    'The Noma Team',
  ].join('\n')

  return {
    subject: `Welcome to Shop Noma, ${firstName}`,
    html,
    text,
  }
}

export interface NewsletterWelcomeEmailData {
  subscriberName?: string
  storefrontUrl?: string
  unsubscribeUrl?: string
}

/**
 * 8. `newsletter_welcome` — Sent when someone joins Noma Insider / newsletter updates.
 */
export function newsletterWelcomeEmail(data: NewsletterWelcomeEmailData): RenderedEmail {
  const baseUrl = (data.storefrontUrl || DEFAULT_STOREFRONT_URL).replace(/\/$/, '')
  const greeting = data.subscriberName
    ? `Hi ${escapeHtml(firstNameOf(data.subscriberName))},`
    : 'Hello,'

  const bodyHtml = [
    paragraph(greeting),
    paragraph(
      `Thank you for joining Noma Insider. We keep our notes brief, curated, and worth opening — writing only when fresh arrivals, restocks, or seasonal offers drop.`,
    ),
    primaryCta('See What Is Trending', `${baseUrl}/catalog`),
  ].join('')

  const html = renderNomaEmailLayout({
    preheader: `You're on the Noma Insider list for new drops and seasonal offers.`,
    eyebrow: 'Noma Insider',
    heading: `You're on the list.`,
    bodyHtml,
    footerLine2: data.unsubscribeUrl
      ? `You can unsubscribe anytime at ${data.unsubscribeUrl}.`
      : 'You received this because you subscribed to Noma updates.',
  })

  const text = [
    data.subscriberName ? `Hi ${firstNameOf(data.subscriberName)},` : 'Hello,',
    '',
    "Thanks for joining Noma Insider. We'll notify you on fresh arrivals, restocks, and seasonal offers.",
    `Browse what's trending: ${baseUrl}/catalog`,
    '',
    'Warm regards,',
    'The Noma Team',
  ].join('\n')

  return {
    subject: `Welcome to Noma Insider`,
    html,
    text,
  }
}

export interface StoreUpdateEmailData {
  recipientName?: string
  title: string
  introParagraph: string
  highlights: Array<{ leadIn: string; detail: string }>
  ctaLabel?: string
  ctaUrl?: string
  storefrontUrl?: string
}

/**
 * 9. `store_update` — Editorial letter for platform updates, delivery news, or packing updates.
 */
export function storeUpdateEmail(data: StoreUpdateEmailData): RenderedEmail {
  const baseUrl = (data.storefrontUrl || DEFAULT_STOREFRONT_URL).replace(/\/$/, '')
  const greeting = data.recipientName
    ? `Hi ${escapeHtml(firstNameOf(data.recipientName))},`
    : 'Hello,'

  const bodyHtml = [
    paragraph(greeting),
    paragraph(escapeHtml(data.introParagraph)),
    ...data.highlights.map((h, idx) =>
      leadInLine(
        h.leadIn.endsWith(':') ? h.leadIn : `${h.leadIn}:`,
        escapeHtml(h.detail),
        idx === data.highlights.length - 1 ? 0 : 13,
      ),
    ),
    data.ctaLabel ? primaryCta(data.ctaLabel, data.ctaUrl || `${baseUrl}/catalog`) : '',
  ].join('')

  const html = renderNomaEmailLayout({
    preheader: data.introParagraph.slice(0, 110),
    eyebrow: 'Noma Update',
    heading: data.title,
    bodyHtml,
  })

  const text = [
    data.recipientName ? `Hi ${firstNameOf(data.recipientName)},` : 'Hello,',
    '',
    data.introParagraph,
    '',
    ...data.highlights.map((h) => `${h.leadIn}: ${h.detail}`),
    data.ctaLabel ? `\n${data.ctaLabel}: ${data.ctaUrl || `${baseUrl}/catalog`}` : '',
    '',
    'Warm regards,',
    'The Noma Team',
  ].join('\n')

  return {
    subject: `${data.title} — Shop Noma`,
    html,
    text,
  }
}

export interface NewArrivalsEmailData {
  recipientName?: string
  headline?: string
  introNote?: string
  items: Array<{
    name: string
    category?: string
    price: number
    slug: string
  }>
  storefrontUrl?: string
}

/**
 * 10. `new_arrivals` — Structured hairline table showcasing newly added items or restocks.
 */
export function newArrivalsEmail(data: NewArrivalsEmailData): RenderedEmail {
  const baseUrl = (data.storefrontUrl || DEFAULT_STOREFRONT_URL).replace(/\/$/, '')
  const greeting = data.recipientName
    ? `Hi ${escapeHtml(firstNameOf(data.recipientName))},`
    : 'Hello,'
  const heading = data.headline || 'Fresh arrivals just landed.'
  const intro =
    data.introNote ||
    'We just added a curated batch of quality-checked pieces across our store. Here are a few highlights now in stock:'

  const rowsHtml = data.items
    .map((item) => {
      const url = `${baseUrl}/product/${encodeURIComponent(item.slug)}`
      return `
        <tr>
          <td valign="top" style="padding:14px 12px 14px 0;border-bottom:1px solid #E2E8F0;font-family:${SANS_FONT};">
            <div style="font-size:14.5px;font-weight:600;line-height:1.4;">
              ${inlineLink(item.name, url)}
            </div>
            ${item.category ? `<div style="font-size:12.5px;color:#64748B;margin-top:2px;">${escapeHtml(item.category)}</div>` : ''}
          </td>
          <td align="right" valign="top" style="padding:14px 0 14px 12px;border-bottom:1px solid #E2E8F0;font-family:${SANS_FONT};font-size:14.5px;font-weight:700;color:#0B1220;white-space:nowrap;font-variant-numeric:tabular-nums;">
            ${escapeHtml(formatNairaEmail(item.price))}
          </td>
        </tr>`
    })
    .join('')

  const listTable = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 18px 0;border-collapse:collapse;">
      <tr>
        <th align="left" style="padding:0 12px 10px 0;border-bottom:2px solid #0B1220;font-family:${SANS_FONT};font-size:10.5px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#64748B;">
          New Piece
        </th>
        <th align="right" style="padding:0 0 10px 12px;border-bottom:2px solid #0B1220;font-family:${SANS_FONT};font-size:10.5px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#64748B;">
          Price
        </th>
      </tr>
      ${rowsHtml}
    </table>`

  const bodyHtml = [
    paragraph(greeting),
    paragraph(escapeHtml(intro)),
    listTable,
    primaryCta('Shop New Arrivals', `${baseUrl}/catalog`),
  ].join('')

  const html = renderNomaEmailLayout({
    preheader: `${heading} — see what just landed on Noma.`,
    eyebrow: 'New Arrivals',
    heading,
    bodyHtml,
  })

  const text = [
    data.recipientName ? `Hi ${firstNameOf(data.recipientName)},` : 'Hello,',
    '',
    intro,
    '',
    ...data.items.map(
      (item) =>
        `- ${item.name}: ${formatNairaEmail(item.price)} (${baseUrl}/product/${encodeURIComponent(item.slug)})`,
    ),
    '',
    `Explore all products: ${baseUrl}/catalog`,
    '',
    'Warm regards,',
    'The Noma Team',
  ].join('\n')

  return {
    subject: `${heading} — Noma`,
    html,
    text,
  }
}

export interface SeasonalPromoEmailData {
  recipientName?: string
  campaignName: string
  headline: string
  message: string
  offerSummary: string
  promoCode?: string
  validUntil?: string
  ctaLabel?: string
  ctaUrl?: string
  storefrontUrl?: string
}

/**
 * 11. `seasonal_promo` — Editorial template for Christmas, Detty December, Black Friday, Eid, and flash sales.
 */
export function seasonalPromoEmail(data: SeasonalPromoEmailData): RenderedEmail {
  const baseUrl = (data.storefrontUrl || DEFAULT_STOREFRONT_URL).replace(/\/$/, '')
  const greeting = data.recipientName
    ? `Hi ${escapeHtml(firstNameOf(data.recipientName))},`
    : 'Hello,'
  const targetUrl = data.ctaUrl || `${baseUrl}/catalog`

  const detailsHtml = renderTwoColDetails(
    {
      label: 'The Offer',
      value: data.offerSummary,
    },
    {
      label: data.promoCode ? 'Promo Code' : 'Availability',
      value: data.promoCode || data.validUntil || 'Limited time',
      sub: data.promoCode && data.validUntil ? `Valid until ${data.validUntil}` : undefined,
    },
  )

  const bodyHtml = [
    paragraph(greeting),
    paragraph(escapeHtml(data.message)),
    detailsHtml,
    primaryCta(data.ctaLabel || 'Shop the Sale', targetUrl),
  ].join('')

  const html = renderNomaEmailLayout({
    preheader: `${data.campaignName}: ${data.offerSummary}`,
    eyebrow: data.campaignName,
    heading: data.headline,
    bodyHtml,
  })

  const text = [
    data.recipientName ? `Hi ${firstNameOf(data.recipientName)},` : 'Hello,',
    '',
    data.message,
    '',
    `The offer: ${data.offerSummary}`,
    data.promoCode ? `Promo code: ${data.promoCode}` : '',
    data.validUntil ? `Available until: ${data.validUntil}` : '',
    `Shop now: ${targetUrl}`,
    '',
    'Warm regards,',
    'The Noma Team',
  ]
    .filter(Boolean)
    .join('\n')

  return {
    subject: `${data.campaignName} — ${data.headline}`,
    html,
    text,
  }
}

export interface VendorWelcomeEmailData {
  vendorName: string
  storeName: string
  portalUrl?: string
  storefrontUrl?: string
  whatsappUrl?: string
}

/**
 * 12. `vendor_approved` (Phase 2) — Sent when an Instagram/WhatsApp vendor is approved to open a sub-store on Noma.
 */
export function vendorWelcomeEmail(data: VendorWelcomeEmailData): RenderedEmail {
  const baseUrl = (data.storefrontUrl || DEFAULT_STOREFRONT_URL).replace(/\/$/, '')
  const portalUrl = data.portalUrl || `${baseUrl}/admin`
  const waUrl = data.whatsappUrl || DEFAULT_WHATSAPP_URL
  const firstName = firstNameOf(data.vendorName)

  const bodyHtml = [
    paragraph(`Hi ${escapeHtml(firstName)},`),
    paragraph(
      `Welcome aboard — <strong style="color:#0B1220;">${escapeHtml(data.storeName)}</strong> has been approved to sell on Shop Noma.`,
    ),
    leadInLine(
      'Upload your products:',
      `Add product photos in your Vendor Portal and our AI listing assistant will draft clean titles, descriptions, and specs for review.`,
    ),
    leadInLine(
      'Orders & payouts:',
      `Every paid order alerts you immediately for dispatch, and earnings settle directly to your verified bank account.`,
      0,
    ),
    primaryCta('Open Your Vendor Portal', portalUrl),
  ].join('')

  const html = renderNomaEmailLayout({
    preheader: `${data.storeName} is approved on Shop Noma — start uploading your products.`,
    eyebrow: 'Noma Vendor Portal',
    heading: `${data.storeName} is approved on Noma.`,
    bodyHtml,
    whatsappUrl: waUrl,
  })

  const text = [
    `Hi ${firstName},`,
    '',
    `Welcome aboard — ${data.storeName} has been approved to sell on Shop Noma.`,
    `Vendor Portal: ${portalUrl}`,
    `Need help? Chat on WhatsApp: ${waUrl}`,
    '',
    'Warm regards,',
    'The Noma Team',
  ].join('\n')

  return {
    subject: `Approved: ${data.storeName} is live on Noma`,
    html,
    text,
  }
}
