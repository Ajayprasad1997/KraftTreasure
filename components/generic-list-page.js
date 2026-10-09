"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Eye, Pencil, ArrowRight, Plus, Download, MoreHorizontal } from "lucide-react";
import { useAdmin } from "./admin-context";
import { PageHeading, StatusBadge, SearchFilter, TablePagination, EmptyState, ExportButton, StatCard } from "./ui";

const moduleConfig = {
 orders: { title:"Orders", eyebrow:"SALES MANAGEMENT", description:"Track, review, and manage customer orders.", action:null, columns:["Order","Customer","Date","Total","Payment","Status"], statuses:["Pending","Processing","Shipped","Delivered","Cancelled","Refunded"] },
 customers: { title:"Customers", eyebrow:"CUSTOMER RELATIONSHIPS", description:"Understand your customers and their purchase activity.", action:null, columns:["Customer","Email","Orders","Lifetime spend","Status"], statuses:["Active","Inactive"] },
 users: { title:"User Management", eyebrow:"TEAM & ACCESS", description:"Manage administrator and staff access to your store.", action:"Add User", columns:["User","Email","Role","Last login","Status"], statuses:["Active","Inactive"] },
 categories: { title:"Categories", eyebrow:"CATALOG MANAGEMENT", description:"Organize your products into easy-to-browse categories.", action:"Add Category", columns:["Category","Slug","Products","Status","Updated"], statuses:["Active","Inactive"] },
 inventory: { title:"Inventory", eyebrow:"STOCK CONTROL", description:"Monitor stock levels and catch low inventory before it sells out.", action:null, columns:["Product","SKU","Available stock","Stock status","Status"], statuses:["In Stock","Low Stock","Out of Stock"] },
 activity: { title:"Product Activity", eyebrow:"AUDIT LOG", description:"Review recent catalog changes and staff activity.", action:null, columns:["Activity","Performed by","Target","Date","Status"], statuses:["Completed","Pending"] },
 coupons: { title:"Coupons & Discounts", eyebrow:"PROMOTIONS", description:"Create and manage discounts that help customers discover your store.", action:"Create Coupon", columns:["Code","Discount","Usage","Expires","Status"], statuses:["Active","Inactive","Expired"] },
 reviews: { title:"Reviews & Ratings", eyebrow:"CUSTOMER FEEDBACK", description:"Review customer feedback and moderate product ratings.", action:null, columns:["Product","Customer","Rating","Date","Status"], statuses:["Pending","Published","Rejected"] },
 support: { title:"Support & Tickets", eyebrow:"CUSTOMER CARE", description:"Keep customer questions moving toward a resolution.", action:null, columns:["Ticket","Customer","Subject","Priority","Status"], statuses:["Open","Pending","Resolved"] },
 analytics: { title:"Analytics & Reports", eyebrow:"STORE INSIGHTS", description:"Explore performance trends and export reports.", action:null, columns:[], statuses:[] },
 notifications: { title:"Notifications", eyebrow:"UPDATES", description:"Stay on top of orders, stock alerts, and store activity.", action:null, columns:["Notification","Type","Date","Status"], statuses:["Unread","Read"] },
 settings: { title:"Settings", eyebrow:"STORE CONFIGURATION", description:"Manage store profile, checkout, shipping, and notification preferences.", action:null, columns:[], statuses:[] }
};

function rowsFor(key, {products, orders, customers}) {
 if (key === "orders") return orders.map(o => ({...o, name:o.id, amount:o.total, date:o.date, payment:o.payment, status:o.status}));
 if (key === "customers") return customers.map(c => ({...c, name:c.name, amount:c.spend, status:c.status}));
 if (key === "inventory") return products.map(p => ({...p, name:p.name, status:p.stock === 0 ? "Out of Stock" : p.stock < 10 ? "Low Stock" : "In Stock"}));
 if (key === "categories") return ["Home Decor","Decor & Lighting","Stationery","Accessories","Kitchen & Dining","Gifts"].map((name,i)=>({id:`CAT-${i+1}`,name,slug:name.toLowerCase().replaceAll(" ","-"),count:products.filter(p=>p.category===name).length,status:"Active",date:"Oct 09, 2026"}));
 if (key === "users") return [{id:"USR-001",name:"Admin Kraft",email:"admin@krafttreasure.com",role:"Administrator",date:"Today",status:"Active"},{id:"USR-002",name:"Riya Das",email:"riya@krafttreasure.com",role:"Catalog Manager",date:"Yesterday",status:"Active"},{id:"USR-003",name:"Sam Roy",email:"sam@krafttreasure.com",role:"Support Agent",date:"Oct 06, 2026",status:"Inactive"}];
 if (key === "activity") return products.slice(0,5).map((p,i)=>({id:`ACT-${i+1}`,name:i%2===0?"Product updated":"Stock adjusted",customer:"Admin Kraft",target:p.name,date:p.updated,status:"Completed"}));
 if (key === "coupons") return [{id:"WELCOME10",name:"WELCOME10",discount:"10% off",count:"124 / 500",date:"Dec 31, 2026",status:"Active"},{id:"KRAFT150",name:"KRAFT150",discount:"₹150 off",count:"42 / 100",date:"Nov 30, 2026",status:"Active"},{id:"FESTIVE20",name:"FESTIVE20",discount:"20% off",count:"200 / 200",date:"Sep 30, 2026",status:"Expired"}];
 if (key === "reviews") return [{id:"REV-201",name:"Handwoven Jute Basket",customer:"Aarav Sharma",rating:"★★★★★",date:"Oct 09, 2026",status:"Published"},{id:"REV-202",name:"Ceramic Mug",customer:"Diya Patel",rating:"★★★★☆",date:"Oct 08, 2026",status:"Pending"},{id:"REV-203",name:"Notebook",customer:"Kabir Mehta",rating:"★★★☆☆",date:"Oct 07, 2026",status:"Pending"}];
 if (key === "support") return [{id:"TK-1042",name:"TK-1042",customer:"Aarav Sharma",subject:"Where is my order?",priority:"Normal",date:"10 min ago",status:"Open"},{id:"TK-1041",name:"TK-1041",customer:"Diya Patel",subject:"Exchange request",priority:"High",date:"1 hour ago",status:"Pending"},{id:"TK-1040",name:"TK-1040",customer:"Kabir Mehta",subject:"Payment question",priority:"Low",date:"Yesterday",status:"Resolved"}];
 if (key === "notifications") return [{id:"NT-1",name:"New order #KT-2084 received",type:"Order",date:"5 min ago",status:"Unread"},{id:"NT-2",name:"Terracotta Tea Light Set is running low",type:"Inventory",date:"25 min ago",status:"Unread"},{id:"NT-3",name:"A new customer registered",type:"Customer",date:"1 hour ago",status:"Read"}];
 return [];
}

export default function GenericListPage({ moduleKey }) {
 const config = moduleConfig[moduleKey] || moduleConfig.dashboard;
 const store = useAdmin();
 const rows = useMemo(() => rowsFor(moduleKey, store), [moduleKey, store.products, store.orders, store.customers]);
 const [search,setSearch] = useState(""); const [filter,setFilter] = useState("All"); const [page,setPage] = useState(1); const [pageSize,setPageSize] = useState(5);
 const filtered = rows.filter(r => JSON.stringify(r).toLowerCase().includes(search.toLowerCase()) && (filter==="All" || r.status===filter));
 const totalPages = Math.ceil(filtered.length/pageSize);
 const visible = filtered.slice((page-1)*pageSize,page*pageSize);
 const actionHref = ({users:"/admin/users/new",categories:"/admin/categories/new",coupons:"/admin/coupons/new"})[moduleKey];
 const exportCsv = () => { const csv = [Object.keys(filtered[0]||{}).join(","), ...filtered.map(r=>Object.values(r).map(v=>`"${String(v??"").replaceAll('"','""')}"`).join(","))].join("\n"); const url=URL.createObjectURL(new Blob([csv],{type:"text/csv"})); const a=document.createElement("a");a.href=url;a.download=`krafttreasure-${moduleKey}.csv`;a.click();URL.revokeObjectURL(url); };
 if (moduleKey === "analytics") return <AnalyticsContent/>;
 if (moduleKey === "settings") return <SettingsContent/>;
 return <div><PageHeading eyebrow={config.eyebrow} title={config.title} description={config.description} action={config.action} actionHref={actionHref} secondary={<ExportButton onClick={exportCsv}/>}/>
  {moduleKey==="inventory" && <div className="mb-5 grid gap-4 sm:grid-cols-3"><StatCard label="Tracked products" value={rows.length} change="Catalog total" icon={PackageIcon}/><StatCard label="Low stock" value={rows.filter(r=>r.status==="Low Stock").length} change="Reorder soon" icon={AlertIcon} tint="amber"/><StatCard label="Out of stock" value={rows.filter(r=>r.status==="Out of Stock").length} change="Restock needed" icon={BoxIcon} tint="blue"/></div>}
  <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-soft"><SearchFilter search={search} setSearch={v=>{setSearch(v);setPage(1)}} placeholder={`Search ${config.title.toLowerCase()}...`} filter={filter} setFilter={v=>{setFilter(v);setPage(1)}} options={config.statuses}/>
  <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead><tr className="bg-stone-50/80 text-[10px] font-bold uppercase tracking-[.1em] text-stone-400">{config.columns.map(c=><th key={c} className="px-4 py-3">{c}</th>)}<th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-stone-100">{visible.map((r,i)=><tr key={r.id} className="hover:bg-stone-50/70">{config.columns.map((c,j)=><td key={c} className="px-4 py-4 text-xs">
    {c==="Order" ? <span className="font-bold">{r.id}</span> :
     c==="Customer" ? <span className="font-medium text-stone-700">{r.customer || r.name}</span> :
     c==="Product" ? <div className="flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-light text-lg">{r.emoji}</span><span className="font-semibold">{r.name}</span></div> :
     c==="User" ? <div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-brand-light font-bold text-brand-dark">{r.name?.split(" ").map(s=>s[0]).join("").slice(0,2)}</span><span className="font-semibold">{r.name}</span></div> :
     c==="Category" ? r.category :
     c==="SKU" ? (r.sku || r.id) :
     c==="Price" ? `₹${Number(r.price).toLocaleString("en-IN")}` :
     c==="Total" ? `₹${Number(r.total).toLocaleString("en-IN")}` :
     c==="Lifetime spend" ? `₹${Number(r.spend).toLocaleString("en-IN")}` :
     c==="Orders" ? r.orders :
     c==="Products" ? r.count :
     c==="Slug" ? r.slug :
     c==="Discount" ? r.discount :
     c==="Usage" ? r.count :
     c==="Expires" || c==="Updated" || c==="Date" ? (r.date || r.updated) :
     c==="Payment" ? <StatusBadge status={r.payment}/> :
     c==="Status" ? <StatusBadge status={r.status}/> :
     c==="Stock status" ? <StatusBadge status={r.status}/> :
     c==="Available stock" ? <span className={r.stock<10?"font-bold text-amber-700":"font-semibold"}>{r.stock}</span> :
     c==="Rating" ? <span className="text-amber-500">{r.rating}</span> :
     c==="Email" ? <span className="text-stone-500">{r.email}</span> :
     c==="Role" ? r.role :
     c==="Last login" ? r.date :
     c==="Subject" ? r.subject :
     c==="Priority" ? <span className={r.priority==="High"?"font-bold text-rose-600":"text-stone-600"}>{r.priority}</span> :
     c==="Type" ? r.type :
     c==="Notification" ? <span className="font-semibold">{r.name}</span> :
     c==="Activity" ? <span className="font-semibold">{r.name}</span> :
     c==="Performed by" ? r.customer :
     c==="Target" ? r.target :
     c==="Name" ? r.name : (r[c.toLowerCase()] ?? r.name ?? "—")}
   </td>)}<td className="px-4 py-4"><div className="flex justify-end gap-1"><button title="View details" onClick={()=>alert(`${config.title}: ${r.name || r.id}\n\nThis is prototype data. Connect the backend to load full details.`)} className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-800"><Eye size={15}/></button>{actionHref && <Link title="Edit" href={actionHref} className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-brand"><Pencil size={15}/></Link>}</div></td></tr>)}</tbody></table></div>
  {visible.length===0 && <EmptyState title={`No ${config.title.toLowerCase()} found`}/>}
  <TablePagination page={page} setPage={setPage} totalPages={totalPages} total={filtered.length} pageSize={pageSize} setPageSize={setPageSize}/>
  </div>
 </div>;
}

import { Package as PackageIcon, CircleAlert as AlertIcon, Boxes as BoxIcon } from "lucide-react";

function AnalyticsContent() {
 const {products,orders,customers}=useAdmin();
 return <div><PageHeading eyebrow="STORE INSIGHTS" title="Analytics & Reports" description="A snapshot of sales, customers, and catalog health." secondary={<button onClick={()=>alert("Connect your reporting API to export full analytics.")} className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold">Export report</button>}/><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Gross sales" value="₹6,38,420" change="+18.6%" icon={PackageIcon}/><StatCard label="Orders" value="1,284" change="+12.4%" icon={BoxIcon} tint="blue"/><StatCard label="Customers" value={customers.length+1240} change="+8.2%" icon={AlertIcon} tint="green"/><StatCard label="Products" value={products.length} change="+4.5%" icon={PackageIcon} tint="amber"/></div><div className="mt-5 grid gap-5 lg:grid-cols-2">{[{title:"Sales performance",desc:"Revenue is trending upward in the selected period."},{title:"Customer insights",desc:"Repeat customers and returning visits are key growth opportunities."},{title:"Product performance",desc:"Review best-selling products and inventory levels."},{title:"Order fulfillment",desc:"Monitor pending, shipped, delivered, and cancelled orders."}].map((c,i)=><section key={c.title} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-soft"><div className="text-xs font-bold uppercase tracking-wider text-brand">REPORT 0{i+1}</div><h3 className="mt-2 text-lg font-bold">{c.title}</h3><p className="mt-2 text-sm text-stone-500">{c.desc}</p><div className="mt-5 h-2 overflow-hidden rounded-full bg-stone-100"><div className="h-full rounded-full bg-brand" style={{width:`${[76,58,88,64][i]}%`}}/></div></section>)}</div></div>;
}
function SettingsContent() {
 const [saved,setSaved]=useState(false); const [storeName,setStoreName]=useState("KraftTreasure"); const [email,setEmail]=useState("hello@krafttreasure.com"); const [currency,setCurrency]=useState("INR"); const [shipping,setShipping]=useState("Free shipping over ₹999");
 return <div><PageHeading eyebrow="STORE CONFIGURATION" title="Settings" description="Configure your store profile and operational preferences."/><div className="grid gap-5 xl:grid-cols-[220px_minmax(0,1fr)]"><div className="h-fit rounded-2xl border border-stone-200 bg-white p-2 shadow-soft">{["Store profile","Checkout & currency","Shipping","Notifications","Security"].map((s,i)=><button key={s} onClick={()=>setSaved(false)} className={`w-full rounded-xl px-3 py-2.5 text-left text-sm ${i===0?"bg-brand-light font-semibold text-brand-dark":"text-stone-600 hover:bg-stone-50"}`}>{s}</button>)}</div><form onSubmit={e=>{e.preventDefault();setSaved(true);}} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-soft"><h3 className="font-bold">Store profile</h3><p className="mt-1 text-xs text-stone-400">These details are used across your store and notifications.</p>{saved&&<div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">Settings saved in this prototype.</div>}<label className="mt-5 block text-xs font-semibold">Store name<input className="form-input mt-2" value={storeName} onChange={e=>setStoreName(e.target.value)}/></label><label className="mt-4 block text-xs font-semibold">Contact email<input type="email" className="form-input mt-2" value={email} onChange={e=>setEmail(e.target.value)}/></label><label className="mt-4 block text-xs font-semibold">Store currency<select className="form-input mt-2" value={currency} onChange={e=>setCurrency(e.target.value)}><option value="INR">INR — Indian Rupee</option><option value="USD">USD — US Dollar</option><option value="GBP">GBP — Pound Sterling</option></select></label><label className="mt-4 block text-xs font-semibold">Shipping policy<input className="form-input mt-2" value={shipping} onChange={e=>setShipping(e.target.value)}/></label><div className="mt-6 flex justify-end"><button className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">Save changes</button></div></form></div></div>;
}
