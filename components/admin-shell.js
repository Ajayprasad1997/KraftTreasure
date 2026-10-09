"use client";

import { useState } from "react";
import { Menu, Search, Bell, ChevronDown, Command } from "lucide-react";
import Sidebar from "./sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdmin } from "./admin-context";

const titleMap = {
  dashboard: "Dashboard", products: "Products", categories: "Categories", inventory: "Inventory",
  activity: "Product Activity", orders: "Orders", customers: "Customers", coupons: "Coupons & Discounts",
  reviews: "Reviews & Ratings", users: "User Management", support: "Support & Tickets",
  analytics: "Analytics & Reports", notifications: "Notifications", settings: "Settings"
};

export default function AdminShell({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { notifications } = useAdmin();
  const segments = pathname.split("/").filter(Boolean);
  const key = segments[1] || "dashboard";
  const title = titleMap[key] || "Admin";
  return <div className="min-h-screen bg-canvas">
    <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)}/>
    <div className="min-h-screen lg:pl-[260px]">
      <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-stone-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <button onClick={() => setMenuOpen(true)} className="rounded-lg p-2 hover:bg-stone-100 lg:hidden" aria-label="Open menu"><Menu size={20}/></button>
          <div className="min-w-0"><div className="text-xs text-stone-400">KraftTreasure / <span className="text-stone-600">{title}</span></div><h1 className="mt-0.5 truncate text-lg font-bold tracking-tight">{title}</h1></div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden h-10 w-56 items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 md:flex"><Search size={16} className="text-stone-400"/><input className="w-full bg-transparent text-xs outline-none placeholder:text-stone-400" placeholder="Search anything..."/><kbd className="flex items-center gap-0.5 rounded border border-stone-200 bg-white px-1 py-0.5 text-[10px] text-stone-400"><Command size={10}/> K</kbd></div>
          <Link href="/admin/notifications" className="relative rounded-xl border border-stone-200 p-2.5 text-stone-600 hover:bg-stone-50"><Bell size={17}/>{notifications > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand ring-2 ring-white"/>}</Link>
          <button className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-stone-50"><div className="grid h-8 w-8 place-items-center rounded-full bg-[#EBD1C4] text-xs font-bold text-brand-dark">AK</div><span className="hidden text-left sm:block"><span className="block text-xs font-semibold">Admin Kraft</span><span className="block text-[10px] text-stone-400">Administrator</span></span><ChevronDown size={14} className="hidden text-stone-400 sm:block"/></button>
        </div>
      </header>
      <main className="mx-auto max-w-[1600px] p-4 sm:p-7 lg:p-8">{children}</main>
      <footer className="px-7 pb-6 text-center text-[11px] text-stone-400">© 2026 KraftTreasure · Ecommerce Administration</footer>
    </div>
  </div>;
}
