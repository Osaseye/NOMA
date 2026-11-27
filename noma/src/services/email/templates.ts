/**
 * Noma Marketplace — Reusable HTML Email Layout & Phase 1A Transactional Templates
 *
 * Visual Spec:
 * - Single clean white 600px card on a soft #F5F5F7 canvas
 * - Full-width custom Noma header banner flush at the top
 * - Warm, human letter-style typography — zero UI icons, zero icon badges, zero heavy colored boxes
 * - Clean dark ink (#1F2937) paragraphs, bold lead-ins (#0F172A) for next steps
 * - Inline Noma Blue (#1049EB) links
 * - Lightweight #E5E7EB hairline receipt rows (tabular-nums Naira) only when needed
 * - Warm sign-off and a quiet 2-line muted footer (#6B7280)
 *
 * Pure zero-dependency TypeScript — runs identically in Cloudflare Workers (`noma-r2-api`) and browser/Node.
 */

export const NOMA_EMAIL_HEADER_BANNER_URL =
  'https://pub-104edba51a2647c881c1c4db7f453fa7.r2.dev/email/noma-email-header-banner.jpg'

export const DEFAULT_STOREFRONT_URL = 'https://shopnoma.com.ng'
export const DEFAULT_WHATSAPP_URL = 'https://wa.me/2348104189461'

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

const FONT_STACK =
  "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

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
  return `<a href="${escapeHtml(href)}" style="color:#1049EB;font-weight:600;text-decoration:underline;text-underline-offset:2px;">${escapeHtml(label)}</a>`
}

function paragraph(htmlContent: string, marginBottom = 16): string {
  return `<p style="margin:0 0 ${marginBottom}px 0;font-family:${FONT_STACK};font-size:15px;line-height:1.65;color:#1F2937;">${htmlContent}</p>`
}

function leadInLine(leadIn: string, bodyHtml: string, marginBottom = 12): string {
  return `<p style="margin:0 0 ${marginBottom}px 0;font-family:${FONT_STACK};font-size:15px;line-height:1.65;color:#1F2937;"><strong style="color:#0F172A;font-weight:700;">${escapeHtml(leadIn)}</strong> ${bodyHtml}</p>`
}

function renderReceiptRows(
  items: EmailOrderItem[],
  summaryRows: Array<{ label: string; value: string; bold?: boolean }>,
): string {
  const itemRowsHtml = items
    .map((item) => {
      const sizeText = item.size ? ` · Size ${escapeHtml(item.size)}` : ''
      const lineTotal = formatNairaEmail(item.unitPrice * item.quantity)
      return `
        <tr>
          <td style="padding:11px 0;border-bottom:1px solid #E5E7EB;font-family:${FONT_STACK};font-size:14px;line-height:1.5;color:#1F2937;">
            ${escapeHtml(item.name)}<span style="color:#6B7280;"> &times; ${item.quantity}${sizeText}</span>
          </td>
          <td align="right" style="padding:11px 0 11px 16px;border-bottom:1px solid #E5E7EB;font-family:${FONT_STACK};font-size:14px;line-height:1.5;font-weight:600;color:#0F172A;white-space:nowrap;font-variant-numeric:tabular-nums;">
            ${escapeHtml(lineTotal)}
          </td>
        </tr>`
    })
    .join('')

  const totalsHtml = summaryRows
    .map((row, idx) => {
      const isLast = idx === summaryRows.length - 1
      const borderStyle = isLast ? 'border-bottom:none;' : 'border-bottom:1px solid #E5E7EB;'
      const labelColor = row.bold ? '#0F172A' : '#6B7280'
      const weight = row.bold ? '700' : '500'
      const valueSize = row.bold ? '15px' : '14px'
      return `
        <tr>
          <td style="padding:10px 0;${borderStyle}font-family:${FONT_STACK};font-size:14px;font-weight:${weight};color:${labelColor};">
            ${escapeHtml(row.label)}
          </td>
          <td align="right" style="padding:10px 0 10px 16px;${borderStyle}font-family:${FONT_STACK};font-size:${valueSize};font-weight:${row.bold ? '700' : '600'};color:#0F172A;white-space:nowrap;font-variant-numeric:tabular-nums;">
            ${escapeHtml(row.value)}
          </td>
        </tr>`
    })
    .join('')

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0;border-top:1px solid #E5E7EB;border-collapse:collapse;">
      ${itemRowsHtml}
      ${totalsHtml}
    </table>`
}

export interface NomaEmailLayoutOptions {
  preheader: string
  heading: string
  bodyHtml: string
  signOff?: string
  footerLine1?: string
  footerLine2?: string
}

/**
 * Shared Noma Marketplace letter-style HTML email shell.
 * Single clean white 600px card on a soft #F5F5F7 canvas with the custom Noma header banner.
 */
export function renderNomaEmailLayout({
  preheader,
  heading,
  bodyHtml,
  signOff = 'Warm regards,<br /><strong style="color:#0F172A;font-weight:700;">The Noma Team</strong>',
  footerLine1 = 'Noma Marketplace · Retail & Wholesale across Nigeria',
  footerLine2 = 'Need help? Reply to this email or message us anytime on WhatsApp.',
}: NomaEmailLayoutOptions): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background-color:#F5F5F7;font-family:${FONT_STACK};-webkit-font-smoothing:antialiased;color:#1F2937;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">
    ${escapeHtml(preheader)}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F5F5F7;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#FFFFFF;border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;border-collapse:separate;">
          <!-- Full-Width Noma Header Banner -->
          <tr>
            <td style="padding:0;line-height:0;font-size:0;">
              <img
                src="${NOMA_EMAIL_HEADER_BANNER_URL}"
                alt="Noma Marketplace"
                width="600"
                style="display:block;width:100%;max-width:600px;height:auto;border:0;"
              />
            </td>
          </tr>

          <!-- Letter Body -->
          <tr>
            <td style="padding:36px 40px 32px 40px;">
              <h1 style="margin:0 0 20px 0;font-family:${FONT_STACK};font-size:22px;line-height:1.3;font-weight:700;letter-spacing:-0.02em;color:#0F172A;">
                ${escapeHtml(heading)}
              </h1>

              ${bodyHtml}

              <p style="margin:26px 0 0 0;font-family:${FONT_STACK};font-size:15px;line-height:1.65;color:#1F2937;">
                ${signOff}
              </p>
            </td>
          </tr>

          <!-- Quiet 2-Line Muted Footer -->
          <tr>
            <td style="padding:20px 40px 26px 40px;border-top:1px solid #E5E7EB;">
              <p style="margin:0 0 4px 0;font-family:${FONT_STACK};font-size:12px;line-height:1.5;color:#6B7280;">
                ${escapeHtml(footerLine1)}
              </p>
              <p style="margin:0;font-family:${FONT_STACK};font-size:12px;line-height:1.5;color:#6B7280;">
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

  const receiptHtml = renderReceiptRows(data.items, [
    { label: 'Subtotal', value: formatNairaEmail(data.subtotal) },
    {
      label: 'Delivery',
      value: data.deliveryFee === 0 ? 'Free' : formatNairaEmail(data.deliveryFee),
    },
    { label: 'Total Paid', value: formatNairaEmail(data.total), bold: true },
  ])

  const bodyHtml = [
    paragraph(`Hi ${escapeHtml(firstName)},`),
    paragraph(
      `Thank you for your order. We have received your payment and your order <strong style="color:#0F172A;">${escapeHtml(data.orderId)}</strong> is now confirmed.`,
    ),
    receiptHtml,
    leadInLine('Delivery destination:', escapeHtml(destination || 'Nigeria')),
    leadInLine(
      'What happens next:',
      `Our fulfillment team is preparing and quality-checking your items. Estimated delivery is ${escapeHtml(eta)}, and we will email you as soon as your package is dispatched.`,
    ),
    leadInLine(
      'Track your order:',
      `You can follow every stage of your delivery anytime on your ${inlineLink('live order tracking page', trackUrl)}.`,
      0,
    ),
    data.paymentRef
      ? paragraph(
          `<span style="font-size:13px;color:#6B7280;">Payment reference: ${escapeHtml(data.paymentRef)}</span>`,
          0,
        )
      : '',
  ].join('')

  const html = renderNomaEmailLayout({
    preheader: `Order ${data.orderId} confirmed — ${formatNairaEmail(data.total)} received.`,
    heading: `Your Noma order ${data.orderId} is confirmed`,
    bodyHtml,
    footerLine2: `Questions about your order? Reply here or reach us on WhatsApp (${waUrl.replace('https://', '')}).`,
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
    `What happens next: Our team is preparing your items (ETA ${eta}). We will email you once dispatched.`,
    `Track your order: ${trackUrl}`,
    '',
    'Warm regards,',
    'The Noma Team',
  ].join('\n')

  return {
    subject: `Order ${data.orderId} confirmed — Noma Marketplace`,
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
  const eta = data.etaText || 'soon'

  const bodyHtml = [
    paragraph(`Hi ${escapeHtml(firstName)},`),
    paragraph(
      `Good news — your Noma order <strong style="color:#0F172A;">${escapeHtml(data.orderId)}</strong> has left our fulfillment desk and is now on its way to <strong style="color:#0F172A;">${escapeHtml(data.deliveryArea)}</strong>.`,
    ),
    data.riderNote ? leadInLine('Dispatch note:', escapeHtml(data.riderNote)) : '',
    leadInLine(
      'What happens next:',
      `Our delivery partner will call your phone number before arriving (${escapeHtml(eta)}). Please keep your line reachable so handover is smooth.`,
    ),
    leadInLine(
      'Follow live progress:',
      `View your updated delivery timeline on ${inlineLink(`order ${data.orderId}`, trackUrl)}.`,
      0,
    ),
  ].join('')

  const html = renderNomaEmailLayout({
    preheader: `Order ${data.orderId} is on its way to ${data.deliveryArea}.`,
    heading: `Your order ${data.orderId} is on the way`,
    bodyHtml,
  })

  const text = [
    `Hi ${firstName},`,
    '',
    `Your Noma order ${data.orderId} has been dispatched and is heading to ${data.deliveryArea}.`,
    data.riderNote ? `Dispatch note: ${data.riderNote}` : '',
    `What happens next: Our delivery partner will reach out by phone before arriving (${eta}).`,
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
      `Your Noma order <strong style="color:#0F172A;">${escapeHtml(data.orderId)}</strong> (${itemSummary}) has been delivered. We hope everything arrived in great condition.`,
    ),
    leadInLine(
      'Share a quick review:',
      `If you have a minute, ${inlineLink('leave a short rating on Noma', reviewUrl)} — your honest feedback helps other shoppers across Nigeria.`,
    ),
    leadInLine(
      'Need anything else?',
      `If anything isn't right with your package, simply reply to this email or ${inlineLink('message us on WhatsApp', waUrl)} and our team will sort it out quickly.`,
      0,
    ),
  ].join('')

  const html = renderNomaEmailLayout({
    preheader: `Order ${data.orderId} has been delivered — thank you for shopping with Noma.`,
    heading: `Order ${data.orderId} has been delivered`,
    bodyHtml,
  })

  const text = [
    `Hi ${firstName},`,
    '',
    `Your Noma order ${data.orderId} has been delivered. We hope everything arrived in great condition.`,
    '',
    `Share a quick review: ${reviewUrl}`,
    `Need help? Reply to this email or chat with us on WhatsApp: ${waUrl}`,
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
    ? `Your payment of <strong style="color:#0F172A;font-variant-numeric:tabular-nums;">${escapeHtml(formatNairaEmail(data.total))}</strong> is being refunded to your original payment method. Bank refunds typically reflect within 1–3 business days.`
    : `No charge was completed for this order, so no further action is needed on your side.`

  const bodyHtml = [
    paragraph(`Hi ${escapeHtml(firstName)},`),
    paragraph(
      `This is a quick note to let you know that your Noma order <strong style="color:#0F172A;">${escapeHtml(data.orderId)}</strong> has been cancelled.${data.reason ? ` Reason: ${escapeHtml(data.reason)}.` : ''}`,
    ),
    leadInLine('Payment & refund:', refundText),
    leadInLine(
      'Need assistance?',
      `If this was unexpected or you would like help placing a replacement order, ${inlineLink('message our team on WhatsApp', waUrl)} or ${inlineLink('browse the catalog', catalogUrl)}.`,
      0,
    ),
  ].join('')

  const html = renderNomaEmailLayout({
    preheader: `Update regarding your Noma order ${data.orderId}.`,
    heading: `Order ${data.orderId} was cancelled`,
    bodyHtml,
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
    subject: `Order ${data.orderId} cancelled — Noma Marketplace`,
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

  const receiptHtml = renderReceiptRows(data.items, summaryRows)

  const bodyHtml = [
    paragraph(
      `A new paid order <strong style="color:#0F172A;">${escapeHtml(data.orderId)}</strong> for <strong style="color:#0F172A;font-variant-numeric:tabular-nums;">${escapeHtml(formatNairaEmail(data.total))}</strong> just came in.`,
    ),
    leadInLine(
      'Customer:',
      `${escapeHtml(data.customerName)} · ${escapeHtml(data.customerPhone)}${data.customerEmail ? ` · ${escapeHtml(data.customerEmail)}` : ''}`,
    ),
    leadInLine('Destination:', escapeHtml(data.deliveryArea || 'Nigeria')),
    data.paymentRef
      ? leadInLine(
          'Payment:',
          `${escapeHtml(data.paymentMethod || 'Bank Transfer')} (${escapeHtml(data.paymentRef)})`,
        )
      : '',
    receiptHtml,
    leadInLine(
      'Next step:',
      `Review items, assign a rider, and update fulfillment status on ${inlineLink(`Admin Order ${data.orderId}`, adminOrderUrl)}.`,
      0,
    ),
  ].join('')

  const html = renderNomaEmailLayout({
    preheader: `New paid order ${data.orderId} — ${formatNairaEmail(data.total)} from ${data.customerName}.`,
    heading: `New paid order: ${data.orderId}`,
    bodyHtml,
    signOff: '— Noma Operations',
    footerLine2: 'Internal admin notification from Noma Marketplace.',
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

  const contactLine = [data.senderEmail, data.senderPhone].filter(Boolean).join(' · ')

  const bodyHtml = [
    paragraph(
      `<strong style="color:#0F172A;">${escapeHtml(data.senderName)}</strong> just submitted a new message through the Noma support page.`,
    ),
    leadInLine('Subject:', escapeHtml(data.subject || 'General Inquiry')),
    contactLine ? leadInLine('Contact:', escapeHtml(contactLine)) : '',
    `<div style="margin:18px 0;padding:14px 0;border-top:1px solid #E5E7EB;border-bottom:1px solid #E5E7EB;font-family:${FONT_STACK};font-size:15px;line-height:1.65;color:#1F2937;white-space:pre-line;">${escapeHtml(data.message)}</div>`,
    leadInLine(
      'Respond:',
      `Open the ${inlineLink('Admin Feedback Inbox', inboxUrl)} or reply directly to the customer.`,
      0,
    ),
  ].join('')

  const html = renderNomaEmailLayout({
    preheader: `New support message from ${data.senderName}: ${data.subject}`,
    heading: `New customer message`,
    bodyHtml,
    signOff: '— Noma Operations',
    footerLine2: 'Internal admin notification from Noma Marketplace.',
  })

  const text = [
    `New support message from ${data.senderName}`,
    `Subject: ${data.subject || 'General Inquiry'}`,
    contactLine ? `Contact: ${contactLine}` : '',
    '',
    data.message,
    '',
    `Open Feedback Inbox: ${inboxUrl}`,
  ]
    .filter(Boolean)
    .join('\n')

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
      `Welcome to Noma. Your account is ready, and we're glad to have you with us.`,
    ),
    leadInLine(
      'Faster checkout:',
      `Save your delivery address once in ${inlineLink('your account', `${baseUrl}/account`)} and breeze through future orders.`,
    ),
    leadInLine(
      'Live order tracking:',
      `Every order you place is tracked step-by-step from confirmation to doorstep delivery on your ${inlineLink('orders page', `${baseUrl}/orders`)}.`,
    ),
    leadInLine(
      'Start exploring:',
      `Browse fashion, footwear, home appliances, cookware, and everyday essentials in ${inlineLink('the Noma catalog', `${baseUrl}/catalog`)}.`,
      0,
    ),
  ].join('')

  const html = renderNomaEmailLayout({
    preheader: `Welcome to Noma Marketplace, ${firstName}. Your account is ready.`,
    heading: `Welcome to Noma, ${firstName}`,
    bodyHtml,
    footerLine2: `Need help with anything? Reply to this email or chat with us on WhatsApp (${waUrl.replace('https://', '')}).`,
  })

  const text = [
    `Hi ${firstName},`,
    '',
    'Welcome to Noma. Your account is ready.',
    `Account & saved address: ${baseUrl}/account`,
    `Track orders: ${baseUrl}/orders`,
    `Browse catalog: ${baseUrl}/catalog`,
    '',
    'Warm regards,',
    'The Noma Team',
  ].join('\n')

  return {
    subject: `Welcome to Noma Marketplace, ${firstName}`,
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
  const greeting = data.subscriberName ? `Hi ${escapeHtml(firstNameOf(data.subscriberName))},` : 'Hello,'

  const bodyHtml = [
    paragraph(greeting),
    paragraph(
      `Thanks for joining Noma Insider. We keep our emails short, thoughtful, and worth opening — only writing when there is something genuinely useful to share.`,
    ),
    leadInLine(
      'What you can expect:',
      `Early notice on fresh arrivals, restocks on bestsellers, seasonal offers, and occasional wholesale drops.`,
    ),
    leadInLine(
      'While you are here:',
      `Take a look at ${inlineLink('what is trending on Noma right now', `${baseUrl}/catalog`)}.`,
      0,
    ),
  ].join('')

  const html = renderNomaEmailLayout({
    preheader: `You're on the Noma Insider list for new drops and seasonal offers.`,
    heading: `You're on the Noma Insider list`,
    bodyHtml,
    footerLine2: data.unsubscribeUrl
      ? `You can unsubscribe anytime at ${data.unsubscribeUrl}.`
      : 'You received this because you subscribed to Noma updates.',
  })

  const text = [
    data.subscriberName ? `Hi ${firstNameOf(data.subscriberName)},` : 'Hello,',
    '',
    "Thanks for joining Noma Insider. We'll send you early notice on new arrivals, restocks, and seasonal offers.",
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
 * 9. `store_update` — Clean letter template for platform updates, delivery news, or order packing notes.
 */
export function storeUpdateEmail(data: StoreUpdateEmailData): RenderedEmail {
  const baseUrl = (data.storefrontUrl || DEFAULT_STOREFRONT_URL).replace(/\/$/, '')
  const greeting = data.recipientName ? `Hi ${escapeHtml(firstNameOf(data.recipientName))},` : 'Hello,'

  const bodyHtml = [
    paragraph(greeting),
    paragraph(escapeHtml(data.introParagraph)),
    ...data.highlights.map((h, idx) =>
      leadInLine(
        h.leadIn.endsWith(':') ? h.leadIn : `${h.leadIn}:`,
        escapeHtml(h.detail),
        idx === data.highlights.length - 1 && !data.ctaLabel ? 0 : 12,
      ),
    ),
    data.ctaLabel
      ? paragraph(
          inlineLink(data.ctaLabel, data.ctaUrl || `${baseUrl}/catalog`),
          0,
        )
      : '',
  ].join('')

  const html = renderNomaEmailLayout({
    preheader: data.introParagraph.slice(0, 110),
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
    subject: `${data.title} — Noma Marketplace`,
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
 * 10. `new_arrivals` — Clean hairline list showcasing newly added items or restocks on Noma.
 */
export function newArrivalsEmail(data: NewArrivalsEmailData): RenderedEmail {
  const baseUrl = (data.storefrontUrl || DEFAULT_STOREFRONT_URL).replace(/\/$/, '')
  const greeting = data.recipientName ? `Hi ${escapeHtml(firstNameOf(data.recipientName))},` : 'Hello,'
  const heading = data.headline || 'Fresh arrivals just landed on Noma'
  const intro =
    data.introNote ||
    'We just added a new batch of quality-checked pieces across our store. Here are a few highlights now in stock:'

  const rowsHtml = data.items
    .map((item) => {
      const url = `${baseUrl}/product/${encodeURIComponent(item.slug)}`
      const catText = item.category ? ` · ${escapeHtml(item.category)}` : ''
      return `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;font-family:${FONT_STACK};font-size:14px;line-height:1.5;color:#1F2937;">
            ${inlineLink(item.name, url)}<span style="color:#6B7280;">${catText}</span>
          </td>
          <td align="right" style="padding:12px 0 12px 16px;border-bottom:1px solid #E5E7EB;font-family:${FONT_STACK};font-size:14px;font-weight:600;color:#0F172A;white-space:nowrap;font-variant-numeric:tabular-nums;">
            ${escapeHtml(formatNairaEmail(item.price))}
          </td>
        </tr>`
    })
    .join('')

  const listTable = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 22px 0;border-top:1px solid #E5E7EB;border-collapse:collapse;">
      ${rowsHtml}
    </table>`

  const bodyHtml = [
    paragraph(greeting),
    paragraph(escapeHtml(intro)),
    listTable,
    leadInLine(
      'See everything new:',
      `Explore the full collection on ${inlineLink('Noma Marketplace', `${baseUrl}/catalog`)}.`,
      0,
    ),
  ].join('')

  const html = renderNomaEmailLayout({
    preheader: `${heading} — see what just landed on Noma.`,
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
  campaignName: string // e.g., "Christmas & Holiday Sale", "Detty December Deals", "Black Friday", "Eid Offer"
  headline: string
  message: string
  offerSummary: string // e.g., "Up to 25% off selected fashion, cookware, and appliances"
  promoCode?: string
  validUntil?: string
  ctaLabel?: string
  ctaUrl?: string
  storefrontUrl?: string
}

/**
 * 11. `seasonal_promo` — Tasteful letter-style template for Christmas, holiday sales, flash deals, and promos.
 */
export function seasonalPromoEmail(data: SeasonalPromoEmailData): RenderedEmail {
  const baseUrl = (data.storefrontUrl || DEFAULT_STOREFRONT_URL).replace(/\/$/, '')
  const greeting = data.recipientName ? `Hi ${escapeHtml(firstNameOf(data.recipientName))},` : 'Hello,'
  const targetUrl = data.ctaUrl || `${baseUrl}/catalog`

  const bodyHtml = [
    paragraph(greeting),
    paragraph(escapeHtml(data.message)),
    leadInLine('The offer:', escapeHtml(data.offerSummary)),
    data.promoCode
      ? leadInLine(
          'Promo code:',
          `<strong style="color:#0F172A;font-family:monospace;letter-spacing:0.04em;">${escapeHtml(data.promoCode)}</strong> at checkout.`,
        )
      : '',
    data.validUntil ? leadInLine('Available until:', escapeHtml(data.validUntil)) : '',
    leadInLine(
      'Shop early:',
      `Popular sizes and bestsellers move quickly — ${inlineLink(data.ctaLabel || 'shop the sale on Noma', targetUrl)}.`,
      0,
    ),
  ].join('')

  const html = renderNomaEmailLayout({
    preheader: `${data.campaignName}: ${data.offerSummary}`,
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
      `Welcome aboard — <strong style="color:#0F172A;">${escapeHtml(data.storeName)}</strong> has been approved to sell on Noma Marketplace.`,
    ),
    leadInLine(
      'Upload your products:',
      `Sign in to ${inlineLink('your Noma Vendor Portal', portalUrl)} to upload product photos. Our AI listing assistant will help draft clean titles, descriptions, and specs for review.`,
    ),
    leadInLine(
      'How orders & payouts work:',
      `Whenever a customer pays for one of your items, we notify you immediately for dispatch and settle your earnings directly to your verified bank account.`,
    ),
    leadInLine(
      'Need onboarding help?',
      `Reply to this email or ${inlineLink('message our vendor desk on WhatsApp', waUrl)} anytime.`,
      0,
    ),
  ].join('')

  const html = renderNomaEmailLayout({
    preheader: `${data.storeName} is approved on Noma Marketplace — start uploading your products.`,
    heading: `${data.storeName} is approved on Noma`,
    bodyHtml,
  })

  const text = [
    `Hi ${firstName},`,
    '',
    `Welcome aboard — ${data.storeName} has been approved to sell on Noma Marketplace.`,
    `Vendor Portal: ${portalUrl}`,
    `Need help? Chat with our vendor desk on WhatsApp: ${waUrl}`,
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
