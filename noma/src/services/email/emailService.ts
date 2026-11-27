import type { Order, OrderStatus } from '../../types/commerce'
import {
  adminNewOrderEmail,
  adminSupportAlertEmail,
  customerWelcomeEmail,
  newsletterWelcomeEmail,
  orderCancelledEmail,
  orderConfirmedEmail,
  orderDeliveredEmail,
  orderDispatchedEmail,
  storeUpdateEmail,
  type RenderedEmail,
} from './templates'

const EMAIL_WORKER_URL = 'https://noma-r2-api.inventra.workers.dev/api/email/send'

interface SendEmailPayload {
  to: string | string[]
  subject: string
  html: string
  text: string
  replyTo?: string
  from?: string
}

async function postEmail(payload: SendEmailPayload): Promise<boolean> {
  try {
    const res = await fetch(EMAIL_WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      console.warn(`Noma email send notice (HTTP ${res.status}):`, errText)
      return false
    }
    return true
  } catch (err) {
    console.warn('Noma email send notice:', err)
    return false
  }
}

function resolveStorefrontUrl(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }
  return 'https://noma-africa.vercel.app'
}

export const emailService = {
  sendRaw: postEmail,

  sendOrderConfirmedEmails: async (
    order: Order,
    options?: { adminEmail?: string; whatsappUrl?: string; etaText?: string },
  ) => {
    const storefrontUrl = resolveStorefrontUrl()
    const items = (order.items || []).map((i) => ({
      name: i.name,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      size: i.size,
    }))
    const subtotal = Math.max(0, order.total - (order.deliveryFee || 0))

    const tasks: Promise<boolean>[] = []

    if (order.email && order.email.includes('@')) {
      const customerMail = orderConfirmedEmail({
        orderId: order.id,
        customerName: order.customer,
        items,
        subtotal,
        deliveryFee: order.deliveryFee || 0,
        total: order.total,
        deliveryArea: order.deliveryArea || order.state || 'Nigeria',
        address: order.address,
        etaText: options?.etaText,
        paymentRef: order.paymentRef,
        storefrontUrl,
        whatsappUrl: options?.whatsappUrl,
      })
      tasks.push(
        postEmail({
          to: order.email.trim(),
          ...customerMail,
          replyTo: options?.adminEmail,
        }),
      )
    }

    if (options?.adminEmail && options.adminEmail.includes('@')) {
      const adminMail = adminNewOrderEmail({
        orderId: order.id,
        customerName: order.customer,
        customerPhone: order.phone,
        customerEmail: order.email,
        deliveryArea: order.deliveryArea || order.state || 'Nigeria',
        items,
        total: order.total,
        deliveryFee: order.deliveryFee || 0,
        markupEarned: order.markupEarned,
        paymentMethod: order.paymentMethod,
        paymentRef: order.paymentRef,
        storefrontUrl,
      })
      tasks.push(
        postEmail({
          to: options.adminEmail.trim(),
          ...adminMail,
          replyTo: order.email,
        }),
      )
    }

    await Promise.allSettled(tasks)
  },

  sendOrderStatusEmail: async (
    order: Order,
    nextStatus: OrderStatus,
    options?: { adminEmail?: string; whatsappUrl?: string; riderNote?: string },
  ): Promise<boolean> => {
    if (!order.email || !order.email.includes('@')) return false

    const storefrontUrl = resolveStorefrontUrl()
    let rendered: RenderedEmail | null = null

    if (nextStatus === 'dispatched') {
      rendered = orderDispatchedEmail({
        orderId: order.id,
        customerName: order.customer,
        deliveryArea: order.deliveryArea || order.state || 'Nigeria',
        riderNote: options?.riderNote,
        storefrontUrl,
        whatsappUrl: options?.whatsappUrl,
      })
    } else if (nextStatus === 'delivered') {
      rendered = orderDeliveredEmail({
        orderId: order.id,
        customerName: order.customer,
        items: (order.items || []).map((i) => ({ name: i.name, slug: i.slug })),
        storefrontUrl,
        whatsappUrl: options?.whatsappUrl,
      })
    } else if (nextStatus === 'cancelled') {
      rendered = orderCancelledEmail({
        orderId: order.id,
        customerName: order.customer,
        total: order.total,
        wasPaid: Boolean(order.paymentRef && !order.paymentRef.startsWith('POD-')),
        storefrontUrl,
        whatsappUrl: options?.whatsappUrl,
      })
    } else if (nextStatus === 'packed') {
      rendered = storeUpdateEmail({
        recipientName: order.customer,
        title: `Your order ${order.id} is packed and ready`,
        introParagraph: `We have finished quality-checking and packing your Noma order ${order.id}.`,
        highlights: [
          {
            leadIn: 'Next step',
            detail:
              'Your package is queued for rider pickup. We will send you another email as soon as it is out for delivery.',
          },
        ],
        ctaLabel: `Track order ${order.id}`,
        ctaUrl: `${storefrontUrl}/orders/${encodeURIComponent(order.id)}`,
        storefrontUrl,
      })
    }

    if (!rendered) return false

    return postEmail({
      to: order.email.trim(),
      ...rendered,
      replyTo: options?.adminEmail,
    })
  },

  sendCustomerWelcomeEmail: async (email: string, name: string, whatsappUrl?: string) => {
    if (!email || !email.includes('@')) return false
    const rendered = customerWelcomeEmail({
      customerName: name,
      storefrontUrl: resolveStorefrontUrl(),
      whatsappUrl,
    })
    return postEmail({ to: email.trim(), ...rendered })
  },

  sendNewsletterWelcomeEmail: async (email: string) => {
    if (!email || !email.includes('@')) return false
    const rendered = newsletterWelcomeEmail({
      storefrontUrl: resolveStorefrontUrl(),
    })
    return postEmail({ to: email.trim(), ...rendered })
  },

  sendSupportAlertEmail: async (
    payload: {
      senderName: string
      senderEmail?: string
      senderPhone?: string
      subject: string
      message: string
    },
    adminEmail?: string,
  ) => {
    if (!adminEmail || !adminEmail.includes('@')) return false
    const rendered = adminSupportAlertEmail({
      ...payload,
      storefrontUrl: resolveStorefrontUrl(),
    })
    return postEmail({
      to: adminEmail.trim(),
      ...rendered,
      replyTo: payload.senderEmail,
    })
  },
}
