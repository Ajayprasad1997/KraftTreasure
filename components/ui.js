"use client";

import { Search, ChevronLeft, ChevronRight, MoreHorizontal, ArrowUpRight, Plus, Download, SlidersHorizontal, X } from "lucide-react";

export function PageHeading({ eyebrow, title, description, action, actionHref, onAction, secondary }) {
  return <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
    <div><div className="mb-2 text-[11px] font-bold uppercase tracking-[.16em] text-brand">{eyebrow || "STORE MANAGEMENT"}</div><h2 className="text-2xl font-bold tracking-tight sm:text-[28px]">{title}</h2>{description && <p className="mt-1.5 max-w-2xl text-sm text-stone-500">{description}</p>}</div>
    <div className="flex flex-wrap gap-2">{secondary}{action && (actionHref ? <a href={actionHref} className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"><Plus size={16}/>{action}</a> : <button onClick={onAction} className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark"><Plus size={16}/>{action}</button>)}</div>
  </div>;
}

export function StatCard({ label, value, change, icon: Icon, tint = "clay" }) {
  const tintClass = tint === "green" ? "bg-emerald-50 text-emerald-700" : tint === "blue" ? "bg-sky-50 text-sky-700" : tint === "amber" ? "bg-amber-50 text-amber-700" : "bg-brand-light text-brand-dark";
  return <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-soft"><div className="flex items-start justify-between"><span className="text-[13px] font-medium text-stone-500">{label}</span><span className={`grid h-9 w-9 place-items-center rounded-xl ${tintClass}`}><Icon size={17}/></span></div><div className="mt-3 text-[26px] font-bold tracking-tight">{value}</div><div className="mt-2 flex items-center gap-1.5 text-[11px]"><span className="inline-flex items-center gap-0.5 font-bold text-emerald-600"><ArrowUpRight size={13}/>{change}</span><span className="text-stone-400">vs last month</span></div></div>;
}

export function StatusBadge({ status }) {
  const styles = {
    Published: "bg-emerald-50 text-emerald-700", Active: "bg-emerald-50 text-emerald-700", Paid: "bg-emerald-50 text-emerald-700", Delivered: "bg-emerald-50 text-emerald-700", Shipped: "bg-sky-50 text-sky-700",
    Processing: "bg-blue-50 text-blue-700", Pending: "bg-amber-50 text-amber-700", Draft: "bg-stone-100 text-stone-600", Inactive: "bg-stone-100 text-stone-500", Cancelled: "bg-rose-50 text-rose-700", Refunded: "bg-purple-50 text-purple-700", "Out of Stock": "bg-rose-50 text-rose-700", "Low Stock": "bg-amber-50 text-amber-700", Open: "bg-blue-50 text-blue-700", Resolved: "bg-emerald-50 text-emerald-700"
  };
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[status] || "bg-stone-100 text-stone-600"}`}><span className="h-1.5 w-1.5 rounded-full bg-current opacity-70"/>{status}</span>;
}

export function SearchFilter({ search, setSearch, placeholder = "Search..." , filter, setFilter, options = [] }) {
  return <div className="flex flex-col gap-3 border-b border-stone-100 p-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="relative min-w-0 flex-1 sm:max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"/><input value={search} onChange={e => setSearch(e.target.value)} placeholder={placeholder} className="h-10 w-full rounded-xl border border-stone-200 bg-white pl-9 pr-9 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"/>{search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"><X size={14}/></button>}</div>
    <div className="flex items-center gap-2"><SlidersHorizontal size={15} className="text-stone-400"/><select value={filter} onChange={e => setFilter(e.target.value)} className="h-10 min-w-[130px] rounded-xl border border-stone-200 bg-white px-3 text-sm outline-none focus:border-brand"><option value="All">All statuses</option>{options.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
  </div>;
}

export function TablePagination({ page, setPage, totalPages, total, pageSize, setPageSize }) {
  return <div className="flex flex-col gap-3 border-t border-stone-100 px-4 py-3.5 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2"><span>Rows per page</span><select value={pageSize} onChange={e => {setPageSize(Number(e.target.value)); setPage(1);}} className="rounded-lg border border-stone-200 bg-white px-2 py-1.5 outline-none"><option>5</option><option>10</option><option>25</option></select><span className="ml-2">· {total} results</span></div><div className="flex items-center gap-2"><span>Page {page} of {Math.max(totalPages, 1)}</span><button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="rounded-lg border border-stone-200 p-2 hover:bg-stone-50 disabled:opacity-30"><ChevronLeft size={14}/></button><button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="rounded-lg border border-stone-200 p-2 hover:bg-stone-50 disabled:opacity-30"><ChevronRight size={14}/></button></div></div>;
}

export function EmptyState({ title = "No results found", description = "Try changing your search or filters." }) {
  return <div className="px-6 py-16 text-center"><div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-stone-100 text-stone-400"><Search size={20}/></div><div className="font-semibold">{title}</div><p className="mt-1 text-sm text-stone-500">{description}</p></div>;
}

export function ExportButton({ onClick }) {
  return <button onClick={onClick} className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50"><Download size={15}/>Export</button>;
}
