"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Package, Activity, ShoppingCart, ContactRound, TicketPercent, ChartNoAxesCombined, Headset, Bell, Star, Settings, LogOut, ChevronDown, Boxes, FolderTree, X } from "lucide-react";

const sections = [
  { label: "OVERVIEW", items: [{ label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard }] },
  { label: "CATALOG", items: [
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Inventory", href: "/admin/inventory", icon: Boxes },
    { label: "Product Activity", href: "/admin/activity", icon: Activity }
  ]},
  { label: "SALES", items: [
    { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { label: "Customers", href: "/admin/customers", icon: ContactRound },
    { label: "Coupons", href: "/admin/coupons", icon: TicketPercent },
    { label: "Reviews", href: "/admin/reviews", icon: Star }
  ]},
  { label: "MANAGE", items: [
    { label: "User Management", href: "/admin/users", icon: Users },
    { label: "Support", href: "/admin/support", icon: Headset },
    { label: "Analytics", href: "/admin/analytics", icon: ChartNoAxesCombined },
    { label: "Notifications", href: "/admin/notifications", icon: Bell },
    { label: "Settings", href: "/admin/settings", icon: Settings }
  ]}
];

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname();
  return (
    <>
      {open && <button className="fixed inset-0 z-40 bg-black/30 lg:hidden" aria-label="Close menu" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-stone-200 bg-white transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-[82px] items-center justify-between border-b border-stone-100 px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-xl text-white">✳</div>
            <div><div className="text-lg font-extrabold tracking-tight">KraftTreasure</div><div className="text-[10px] font-semibold tracking-[.19em] text-stone-400">STORE ADMIN</div></div>
          </Link>
          <button className="lg:hidden" onClick={onClose}><X size={19}/></button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {sections.map((section) => <div key={section.label} className="mb-6">
            <div className="mb-2 px-3 text-[10px] font-bold tracking-[.16em] text-stone-400">{section.label}</div>
            <div className="space-y-1">
              {section.items.map(({ label, href, icon: Icon }) => {
                const active = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href + "/"));
                return <Link key={href} href={href} onClick={onClose} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${active ? "bg-brand-light text-brand-dark" : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"}`}>
                  <Icon size={17} strokeWidth={1.8}/><span>{label}</span>{label === "Support" && <span className="ml-auto rounded-md bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-600">4</span>}
                </Link>;
              })}
            </div>
          </div>)}
        </nav>
        <div className="border-t border-stone-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-stone-50 p-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[#EBD1C4] text-xs font-bold text-brand-dark">AK</div>
            <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">Admin Kraft</div><div className="text-xs text-stone-500">Store administrator</div></div>
            <ChevronDown size={15} className="text-stone-400"/>
          </div>
          <Link href="/login" className="mt-3 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-stone-500 hover:bg-stone-50"><LogOut size={16}/> Sign out</Link>
        </div>
      </aside>
    </>
  );
}
