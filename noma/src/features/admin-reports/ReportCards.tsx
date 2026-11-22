import { useState } from 'react'
import {
  CheckCircle,
  DownloadSimple,
  FileText,
  Funnel,
  SpinnerGap,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useProductStore } from '../../store/productStore'

function escapeCsvCell(value: string | number | undefined) {
  const str = String(value ?? '')
  return `"${str.replace(/"/g, '""')}"`
}

function downloadCsv(filename: string, headers: string[], rows: Array<Array<string | number | undefined>>) {
  const lines = [headers.map(escapeCsvCell).join(','), ...rows.map((r) => r.map(escapeCsvCell).join(','))]
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
  const [startDate, setStartDate] = useState('2026-08-01')
  const [endDate, setEndDate] = useState('2026-08-31')
  const [downloadingReport, setDownloadingReport] = useState<string | null>(null)
  const [successReport, setSuccessReport] = useState<string | null>(null)

  const handleDownload = (reportId: string) => {
    setDownloadingReport(reportId)

    setTimeout(() => {
      try {
        if (reportId === 'monthly-financials') {
          downloadCsv(
            `noma-financials-${startDate}-to-${endDate}.csv`,
            ['Order ID', 'Customer', 'Status', 'Total (NGN)', 'Supplier Owed (NGN)', 'Markup Profit (NGN)', 'Payment Ref'],
            orders.map((o) => [o.id, o.customer, o.status, o.total, o.baseAmountOwed, o.markupEarned, o.paymentRef])
          )
        } else if (reportId === 'category-performance') {
          downloadCsv(
            `noma-categories-${startDate}-to-${endDate}.csv`,
            ['Category ID', 'Label', 'Default Markup (%)', 'SKU Count', 'Merchandising Line'],
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
            ['Product ID', 'Name', 'Category', 'Supplier', 'Stock Qty', 'Base Cost (NGN)', 'Retail Price (NGN)'],
            products.map((p) => [p.id, p.name, p.category, p.supplierName || p.brand, p.stockQty, p.basePrice, p.finalPrice])
          )
        } else {
          const customerRows =
            customers.length > 0
              ? customers.map((c) => [c.id, c.name, c.phone, c.email || '', c.orders, c.lifetimeValue, c.isGuest ? 'Guest' : 'Account'])
              : orders.map((o) => [o.userId || o.id, o.customer, o.phone, o.email || '', 1, o.total, o.userId ? 'Account' : 'Guest'])
          downloadCsv(
            `noma-customers-${startDate}-to-${endDate}.csv`,
            ['ID', 'Name', 'Phone', 'Email', 'Orders', 'Spend (NGN)', 'Type'],
            customerRows
          )
        }

        setSuccessReport(reportId)
        toast.success('Report exported as CSV.')
        setTimeout(() => setSuccessReport(null), 2500)
      } finally {
        setDownloadingReport(null)
      }
    }, 300)
  }

  const reports = [
    {
      id: 'monthly-financials',
      title: 'Monthly Financial Audit & Markup Breakdown',
      desc: 'Complete ledger of gross sales, supplier wholesale cost, markup profit earned, and fixed salary allocation.',
      badge: 'CSV / XLSX',
      count: `${orders.length} Order Records`,
    },
    {
      id: 'category-performance',
      title: 'Category Sales & Margin Performance',
      desc: 'Product catalog breakdown by category with average markup percentages and default pricing rules.',
      badge: 'CSV / PDF',
      count: `${categories.length} Retail Categories`,
    },
    {
      id: 'inventory-valuation',
      title: 'Warehouse Stock & Inventory Valuation',
      desc: 'Current stock levels, low-stock warning items, base cost valuation, and retail listing totals.',
      badge: 'CSV / XLSX',
      count: `${products.length} Active SKUs`,
    },
    {
      id: 'customer-crm',
      title: 'Customer Lifetime Value & Contact Directory',
      desc: 'Buyer phone numbers, delivery destination areas, total orders completed, and total spend.',
      badge: 'CSV',
      count: 'Full CRM Export',
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Date Range Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[8px] border border-[#E5E7EB] bg-white p-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#0B1220]">
          <Funnel size={16} weight="regular" className="text-[#1049EB]" />
          <span>Report Timeframe</span>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-[6px] border border-[#D1D5DB] bg-white px-3 py-1.5 font-mono text-xs text-[#0B1220] focus:border-[#1049EB] focus:outline-none focus:ring-2 focus:ring-[#1049EB]/15"
          />
          <span className="text-xs text-[#5E6675]">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-[6px] border border-[#D1D5DB] bg-white px-3 py-1.5 font-mono text-xs text-[#0B1220] focus:border-[#1049EB] focus:outline-none focus:ring-2 focus:ring-[#1049EB]/15"
          />
        </div>
      </div>

      {/* Reports Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {reports.map((report) => (
          <article
            key={report.id}
            className="flex flex-col justify-between rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-[4px] border border-[#E5E7EB] bg-[#F6F7F9] px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#374151]">
                  {report.badge}
                </span>
                <span className="font-mono text-xs font-semibold text-[#1049EB]">
                  {report.count}
                </span>
              </div>
              <h3 className="flex items-center gap-2 text-base font-bold tracking-tight text-[#0B1220]">
                <FileText size={18} weight="regular" className="shrink-0 text-[#5E6675]" />
                <span>{report.title}</span>
              </h3>
              <p className="text-xs leading-relaxed text-[#5E6675]">{report.desc}</p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[#E5E7EB] pt-4">
              {successReport === report.id ? (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[#15803D]">
                  <CheckCircle size={15} weight="regular" />
                  <span>Download Complete</span>
                </span>
              ) : (
                <span className="text-[11px] text-[#5E6675]">Ready for export</span>
              )}
              <button
                type="button"
                onClick={() => handleDownload(report.id)}
                disabled={downloadingReport === report.id}
                className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#0B1220] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1E293B] disabled:opacity-50"
              >
                {downloadingReport === report.id ? (
                  <SpinnerGap size={14} weight="regular" className="animate-spin" />
                ) : (
                  <DownloadSimple size={14} weight="regular" />
                )}
                <span>{downloadingReport === report.id ? 'Generating...' : 'Export Report'}</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
