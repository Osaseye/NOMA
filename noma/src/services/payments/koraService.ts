const WORKER_API_BASE = 'https://noma-r2-api.inventra.workers.dev'

export interface KoraBankTransferAccount {
  reference: string
  amount: number
  amountExpected: number
  currency: string
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

export const koraService = {
  initiateBankTransfer: async (params: {
    amount: number
    customerName: string
    customerEmail?: string
    reference?: string
    narration?: string
  }): Promise<KoraBankTransferAccount> => {
    const res = await fetch(`${WORKER_API_BASE}/api/kora/bank-transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
    const data = (await res.json().catch(() => null)) as
      | (KoraBankTransferAccount & { error?: string })
      | null

    if (!res.ok || !data || !data.accountNumber) {
      throw new Error(
        data?.error || 'Could not generate Kora bank transfer details. Please try again.'
      )
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
