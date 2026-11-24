import { useState } from 'react'
import { DownloadSimple, SpinnerGap } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useProductStore } from '../../store/productStore'

function escapeCsvCell(value: string | number | undefined) {
  const str = String(value ?? '')
  return `"${str.replace(/"/g, '""')}"`
}

function downloadCsv(
  filename: string,
  headers: string[],
  rows: Array<Array<string | number | undefined>>
) {
  const lines = [
    headers.map(escapeCsvCell).join(','),
    ...rows.map((r) => r.map(escapeCsvCell).join(',')),
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function ReportCards() {
  const { orders, products, categories, customers } = useProductStore()
  const [startDate, setStartDate] = useState('2026-01-01')
  const [endDate, setEndDate] = useState('2026-12-31')
  const [downloadingReport, setDownloadingReport] = useState<string | null>(null)

  const handleDownload = (reportId: string) => {
    setDownloadingReport(reportId)

    setTimeout(() => {
      try {
        if (reportId === 'monthly-financials') {
          downloadCsv(
            `noma-financials-${startDate}-to-${endDate}.csv`,
            [
              'Order ID',
              'Customer',
              'Status',
              'Total (NGN)',
              'Supplier Cost (NGN)',
              'Net Margin (NGN)',
              'Payment Ref',
            ],
            orders.map((o) => [
              o.id,
              o.customer,
              o.status,
              o.total,
              o.baseAmountOwed,
              o.markupEarned,
              o.paymentRef,
            ])
          )
        } else if (reportId === 'category-performance') {
          downloadCsv(
            `noma-categories-${startDate}-to-${endDate}.csv`,
            ['Category ID', 'Label', 'Default Markup (%)', 'SKU Count', 'Description'],
            categories.map((c) => [
              c.id,
              c.label,
              c.defaultMarkupPercent,
              products.filter((p) => p.category === c.id).length,
              c.merchandisingLine,
            ])
          )
        } else if (reportId === 'inventory-valuation') {
          downloadCsv(
            `noma-inventory-${startDate}-to-${endDate}.csv`,
            [
              'Product ID',
              'Name',
              'Category',
              'Supplier',
              'Stock Qty',
              'Base Cost (NGN)',
              'Retail Price (NGN)',
            ],
            products.map((p) => [
              p.id,
              p.name,
              p.category,
              p.supplierName || p.brand,
              p.stockQty,
              p.basePrice,
              p.finalPrice,
            ])
          )
        } else {
          const customerRows =
            customers.length > 0
              ? customers.map((c) => [
                  c.id,
                  c.name,
                  c.phone,
                  c.email || '',
                  c.orders,
                  c.lifetimeValue,
                  c.isGuest ? 'Guest' : 'Account',
                ])
              : orders.map((o) => [
                  o.userId || o.id,
                  o.customer,
                  o.phone,
                  o.email || '',
                  1,
                  o.total,
                  o.userId ? 'Account' : 'Guest',
                ])
          downloadCsv(
            `noma-users-${startDate}-to-${endDate}.csv`,
            ['ID', 'Name', 'Phone', 'Email', 'Orders', 'Spend (NGN)', 'Type'],
            customerRows
          )
        }

        toast.success('Report exported as CSV.')
      } finally {
        setDownloadingReport(null)
      }
    }, 200)
  }

  const reports = [
    {
      id: 'monthly-financials',
      title: 'Financial Audit & Margin Breakdown',
      desc: 'Gross sales, supplier wholesale cost, and net profit earned per order.',
      format: 'CSV',
      count: `${orders.length} orders`,
    },
    {
      id: 'category-performance',
      title: 'Category & Markup Summary',
      desc: 'Catalog breakdown by department with default markup rules and SKU counts.',
      format: 'CSV',
      count: `${categories.length} categories`,
    },
    {
      id: 'inventory-valuation',
      title: 'Stock & Inventory Valuation',
      desc: 'Current unit counts, base cost valuation, and retail listing prices.',
      format: 'CSV',
      count: `${products.length} SKUs`,
    },
    {
      id: 'customer-crm',
      title: 'Users & Lifetime Spend Directory',
      desc: 'Shopper contact numbers, delivery states, total orders, and cumulative spend.',
      format: 'CSV',
      count: 'Full export',
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Compact Date Range Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 text-xs">
        <span className="font-semibold text-slate-600">Export Period</span>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            aria-label="Report start date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-950 focus:border-slate-950 focus:outline-none"
          />
          <span className="text-slate-400">to</span>
          <input
            type="date"
            aria-label="Report end date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-950 focus:border-slate-950 focus:outline-none"
          />
        </div>
      </div>

      {/* Single-Layer Open Reports List */}
      <div className="divide-y divide-slate-200 border-b border-slate-200">
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h3 className="text-sm font-bold text-slate-950">{report.title}</h3>
                <span className="text-[11px] font-medium text-slate-400">
                  {report.count} &bull; {report.format}
                </span>
              </div>
              <p className="text-xs text-slate-500">{report.desc}</p>
            </div>

            <button
              type="button"
              onClick={() => handleDownload(report.id)}
              disabled={downloadingReport === report.id}
              className="inline-flex h-9 w-fit shrink-0 items-center gap-1.5 rounded-lg bg-slate-950 px-4 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
            >
              {downloadingReport === report.id ? (
                <SpinnerGap size={14} className="animate-spin" />
              ) : (
                <DownloadSimple size={14} />
              )}
              <span>{downloadingReport === report.id ? 'Exporting...' : 'Export CSV'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
