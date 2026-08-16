import { useState } from 'react'
import { HiDocumentChartBar, HiArrowDownTray, HiCheckCircle, HiFunnel, HiSparkles } from 'react-icons/hi2'
import { useProductStore } from '../../store/productStore'

export function ReportCards() {
  const { orders, products, categories } = useProductStore()
  const [downloadingReport, setDownloadingReport] = useState<string | null>(null)
  const [successReport, setSuccessReport] = useState<string | null>(null)

  const handleDownload = (reportName: string) => {
    setDownloadingReport(reportName)
    setTimeout(() => {
      setDownloadingReport(null)
      setSuccessReport(reportName)
      setTimeout(() => setSuccessReport(null), 2500)
    }, 800)
  }

  const reports = [
    {
      id: 'monthly-financials',
      title: 'Monthly Financial Audit & Markup Breakdown',
      desc: 'Complete ledger of gross sales, supplier wholesale cost, markup profit earned, and fixed salary allocation.',
      badge: 'CSV / Excel',
      count: `${orders.length} Order Records`,
    },
    {
      id: 'category-performance',
      title: 'Category Sales & Margin Performance',
      desc: 'Product sales breakdown by category with average markup percentages and default pricing rules.',
      badge: 'CSV / PDF',
      count: `${categories.length} Retail Categories`,
    },
    {
      id: 'inventory-valuation',
      title: 'Warehouse Stock & Inventory Valuation',
      desc: 'Current stock levels, low-stock warning items, base cost valuation, and retail listing total.',
      badge: 'CSV / Excel',
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
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <HiFunnel size={16} className="text-emerald-600" /> Filter Report Timeframe:
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            defaultValue="2026-08-01"
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800 outline-none"
          />
          <span className="text-xs text-slate-400">to</span>
          <input
            type="date"
            defaultValue="2026-08-31"
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800 outline-none"
          />
        </div>
      </div>

      {/* Reports Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase text-slate-700">
                  {report.badge}
                </span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <HiSparkles size={14} /> {report.count}
                </span>
              </div>
              <h3 className="font-['Outfit'] font-black text-base text-slate-900 flex items-center gap-2">
                <HiDocumentChartBar size={18} className="text-emerald-600" /> {report.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">{report.desc}</p>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
              {successReport === report.id ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <HiCheckCircle size={16} /> Download Complete!
                </span>
              ) : (
                <span className="text-[11px] text-slate-400 font-medium">Ready for instant download</span>
              )}
              <button
                onClick={() => handleDownload(report.id)}
                disabled={downloadingReport === report.id}
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                <HiArrowDownTray size={14} />
                {downloadingReport === report.id ? 'Generating...' : 'Export Report'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
