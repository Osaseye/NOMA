const WORKER_API_BASE = 'https://noma-r2-api.inventra.workers.dev'
const KORA_INLINE_SCRIPT_URL =
  'https://korablobstorage.blob.core.windows.net/modal-bucket/korapay-collections.min.js'
const KORA_PUBLIC_KEY = 'pk_live_wxTQihsH5S2WYWtavYaz1fC3rdNQ3jVMzazsHZa8'
const KORA_WEBHOOK_URL = `${WORKER_API_BASE}/api/kora/webhook`

interface KorapayWindow extends Window {
  Korapay?: {
    initialize: (options: Record<string, unknown>) => void
    close?: () => void
  }
}

export interface KoraBankTransferAccount {
  mode?: 'checkout' | 'direct' | 'inline'
  reference: string
  amount: number
  amountExpected: number
  currency: string
  checkoutUrl?: string
  bankName: string
  accountNumber: string
  accountName: string
  expiryDateInUtc: string | null
  rawStatus: string
}

export interface KoraVerifyResult {
  paid: boolean
  status: string
  source?: string
  reference: string
  amount?: number
  message?: string
}

export interface InlineCheckoutParams {
  amount: number
  customerName: string
  customerEmail?: string
  customerPhone?: string
  reference: string
  narration?: string
  onSuccess?: (data: unknown) => void
  onFailed?: (data: unknown) => void
  onError?: (err: unknown) => void
  onClose?: () => void
}

function sanitizeCustomerName(raw: string): string {
  const cleaned = raw.replace(/[!#$%&()*:;<=>?\]^[{}|~]/g, ' ').replace(/\s+/g, ' ').trim()
  return cleaned || 'Noma Customer'
}

function sanitizeCustomerEmail(raw?: string, phone?: string): string {
  const trimmed = (raw || '').trim()
  if (trimmed && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return trimmed
  }
  const digits = (phone || '').replace(/\D/g, '').slice(-10)
  return `customer${digits || Date.now()}@noma.ng`
}

let inlineScriptPromise: Promise<void> | null = null

function ensureInlineScriptLoaded(): Promise<void> {
  const win = window as KorapayWindow
  if (win.Korapay && typeof win.Korapay.initialize === 'function') {
    return Promise.resolve()
  }

  if (inlineScriptPromise) {
    return inlineScriptPromise
  }

  inlineScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${KORA_INLINE_SCRIPT_URL}"]`
    )

    const timeout = window.setTimeout(() => {
      inlineScriptPromise = null
      reject(new Error('Payment window timed out while loading.'))
    }, 8000)

    const finish = () => {
      window.clearTimeout(timeout)
      const w = window as KorapayWindow
      if (w.Korapay && typeof w.Korapay.initialize === 'function') {
        resolve()
      } else {
        inlineScriptPromise = null
        reject(new Error('Payment window could not be initialized.'))
      }
    }

    const fail = () => {
      window.clearTimeout(timeout)
      inlineScriptPromise = null
      reject(new Error('Could not load payment window.'))
    }

    if (existing) {
      if ((window as KorapayWindow).Korapay) {
        finish()
        return
      }
      existing.addEventListener('load', finish, { once: true })
      existing.addEventListener('error', fail, { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = KORA_INLINE_SCRIPT_URL
    script.async = true
    script.onload = finish
    script.onerror = fail
    document.head.appendChild(script)
  })

  return inlineScriptPromise
}

export const koraService = {
  openInlineCheckout: async (params: InlineCheckoutParams): Promise<void> => {
    await ensureInlineScriptLoaded()
    const win = window as KorapayWindow
    if (!win.Korapay || typeof win.Korapay.initialize !== 'function') {
      throw new Error('Payment window is not available right now.')
    }

    const safeAmount = Number(Number(params.amount).toFixed(2))
    const safeName = sanitizeCustomerName(params.customerName)
    const safeEmail = sanitizeCustomerEmail(params.customerEmail, params.customerPhone)

    win.Korapay.initialize({
      key: KORA_PUBLIC_KEY,
      reference: params.reference,
      amount: safeAmount,
      currency: 'NGN',
      customer: {
        name: safeName,
        email: safeEmail,
      },
      narration: params.narration || `Noma Order for ${safeName}`,
      default_channel: 'bank_transfer',
      channels: ['bank_transfer', 'card'],
      notification_url: KORA_WEBHOOK_URL,
      onSuccess: (data: unknown) => {
        params.onSuccess?.(data)
      },
      onFailed: (data: unknown) => {
        params.onFailed?.(data)
      },
      onError: (err: unknown) => {
        params.onError?.(err)
      },
      onClose: () => {
        params.onClose?.()
      },
    })
  },

  closeInlineCheckout: (): void => {
    try {
      const modal = document.querySelector('.kpy--dist--modal')
      if (!modal) return
      const win = window as KorapayWindow
      if (win.Korapay && typeof win.Korapay.close === 'function') {
        win.Korapay.close()
      } else {
        modal.remove()
      }
    } catch {
      // Ignore DOM cleanup errors
    }
  },

  initiateBankTransfer: async (params: {
    amount: number
    customerName: string
    customerEmail?: string
    reference?: string
    narration?: string
    redirectUrl?: string
  }): Promise<KoraBankTransferAccount> => {
    const res = await fetch(`${WORKER_API_BASE}/api/kora/bank-transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
    const data = (await res.json().catch(() => null)) as
      | (KoraBankTransferAccount & { error?: string })
      | null

    if (!res.ok || !data || (!data.checkoutUrl && !data.accountNumber)) {
      throw new Error(data?.error || 'Could not start payment. Please try again.')
    }

    return data
  },

  verifyCharge: async (reference: string): Promise<KoraVerifyResult> => {
    const res = await fetch(
      `${WORKER_API_BASE}/api/kora/verify/${encodeURIComponent(reference)}`
    )
    const data = (await res.json().catch(() => null)) as KoraVerifyResult | null
    if (!res.ok || !data) {
      return { paid: false, status: 'pending', reference }
    }
    return data
  },
}
