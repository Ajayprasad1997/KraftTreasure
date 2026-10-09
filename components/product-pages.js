"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, MoreHorizontal, Package, Pencil, Eye, Trash2, Boxes, CheckCircle2, FileDown } from "lucide-react";
import { useAdmin } from "./admin-context";
import { PageHeading, StatCard, StatusBadge, SearchFilter, TablePagination, EmptyState, ExportButton } from "./ui";

function money(value) { return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value) || 0); }
function exportCsv(rows) {
  const keys = ["id", "name", "category", "price", "stock", "status"];
  const csv = [keys.join(","), ...rows.map(r => keys.map(k => `"${String(r[k] ?? "").replaceAll('"', '""')}"`).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const a = document.createElement("a"); a.href = url; a.download = "krafttreasure-products.csv"; a.click(); URL.revokeObjectURL(url);
}

export function ProductsPage() {
  const { products, deleteProduct } = useAdmin();
  const [search, setSearch] = useState(""); const [filter, setFilter] = useState("All"); const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(5); const [selected, setSelected] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const filtered = useMemo(() => products.filter(p => (p.name + p.id + p.category).toLowerCase().includes(search.toLowerCase()) && (filter === "All" || p.status === filter)), [products, search, filter]);
  const totalPages = Math.ceil(filtered.length / pageSize);
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  return <div>
    <PageHeading eyebrow="CATALOG MANAGEMENT" title="Products" description="Manage your catalog, pricing, and stock from one place." action="Add Product" actionHref="/admin/products/new" secondary={<ExportButton onClick={() => exportCsv(filtered)}/>}/>
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total products" value={products.length} change="+12.8%" icon={Package}/>
      <StatCard label="Published" value={products.filter(p => p.status === "Published").length} change="+8.2%" icon={CheckCircle2} tint="green"/>
      <StatCard label="Low stock" value={products.filter(p => p.stock > 0 && p.stock < 10).length} change="Needs attention" icon={Boxes} tint="amber"/>
      <StatCard label="Out of stock" value={products.filter(p => p.stock === 0).length} change="View inventory" icon={ArrowUpRight} tint="blue"/>
    </div>
    <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-soft">
      <SearchFilter search={search} setSearch={v => {setSearch(v); setPage(1);}} placeholder="Search products, SKU or category..." filter={filter} setFilter={v => {setFilter(v); setPage(1);}} options={["Published", "Draft"]}/>
      {selected.length > 0 && <div className="flex items-center justify-between bg-brand-light px-4 py-2 text-xs text-brand-dark"><span>{selected.length} products selected</span><button onClick={() => {if(confirm("Delete selected products?")) {selected.forEach(deleteProduct); setSelected([]);}}} className="font-semibold">Delete selected</button></div>}
      <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left">
        <thead><tr className="bg-stone-50/80 text-[10px] font-bold uppercase tracking-[.1em] text-stone-400"><th className="w-10 px-4 py-3"><input type="checkbox" checked={visible.length > 0 && visible.every(p => selected.includes(p.id))} onChange={e => setSelected(e.target.checked ? [...new Set([...selected, ...visible.map(p => p.id)])] : selected.filter(id => !visible.some(p => p.id === id)))} /></th><th className="px-3 py-3">Product</th><th className="px-3 py-3">SKU</th><th className="px-3 py-3">Category</th><th className="px-3 py-3">Price</th><th className="px-3 py-3">Stock</th><th className="px-3 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
        <tbody className="divide-y divide-stone-100">{visible.map(p => <tr key={p.id} className="transition hover:bg-stone-50/70">
          <td className="px-4 py-4"><input type="checkbox" checked={selected.includes(p.id)} onChange={e => setSelected(e.target.checked ? [...selected, p.id] : selected.filter(id => id !== p.id))}/></td>
          <td className="px-3 py-3.5"><div className="flex items-center gap-3"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#F7EEE8] text-2xl">{p.emoji || "🎁"}</div><div><Link href={`/admin/products/${p.id}`} className="text-sm font-semibold hover:text-brand">{p.name}</Link><div className="mt-1 text-[11px] text-stone-400">Updated {p.updated}</div></div></div></td>
          <td className="px-3 py-4 text-xs text-stone-500">{p.id}</td><td className="px-3 py-4 text-xs text-stone-600">{p.category}</td><td className="px-3 py-4 text-sm font-semibold">{money(p.price)}</td>
          <td className="px-3 py-4"><span className={`text-sm font-semibold ${p.stock < 10 ? "text-amber-700" : "text-stone-700"}`}>{p.stock}</span><div className="mt-1 text-[10px] text-stone-400">{p.stock === 0 ? "Out of stock" : p.stock < 10 ? "Low stock" : "In stock"}</div></td>
          <td className="px-3 py-4"><StatusBadge status={p.status}/></td>
          <td className="px-4 py-4"><div className="flex justify-end gap-1"><Link title="View" href={`/admin/products/${p.id}`} className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-800"><Eye size={15}/></Link><Link title="Edit" href={`/admin/products/${p.id}/edit`} className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-brand"><Pencil size={15}/></Link><button title="Delete" onClick={() => setDeleteId(p.id)} className="rounded-lg p-2 text-stone-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={15}/></button></div></td>
        </tr>)}</tbody>
      </table></div>
      {visible.length === 0 && <EmptyState title="No products found" description="Try a different search, or add your first product."/>}
      <TablePagination page={page} setPage={setPage} totalPages={totalPages} total={filtered.length} pageSize={pageSize} setPageSize={setPageSize}/>
    </div>
    {deleteId && <div className="fixed inset-0 z-[70] grid place-items-center bg-black/35 p-4"><div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"><div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-rose-600"><Trash2 size={18}/></div><h3 className="text-lg font-bold">Delete product?</h3><p className="mt-2 text-sm leading-6 text-stone-500">This will remove the product from this prototype. This action cannot be undone.</p><div className="mt-6 flex justify-end gap-2"><button onClick={() => setDeleteId(null)} className="rounded-xl border border-stone-200 px-4 py-2 text-sm">Cancel</button><button onClick={() => {deleteProduct(deleteId); setDeleteId(null); setSelected(s => s.filter(id => id !== deleteId));}} className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white">Delete product</button></div></div></div>}
  </div>;
}

export function ProductForm({ productId }) {
  const { products, addProduct, updateProduct } = useAdmin();
  const router = useRouter();
  const existing = products.find(p => p.id === productId);
  const [form, setForm] = useState(() => existing ? { ...existing } : { name: "", category: "Home Decor", price: "", stock: "0", status: "Draft", sku: "", description: "", emoji: "🎁" });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const set = (key, value) => setForm(old => ({ ...old, [key]: value }));
  function submit(publish) {
    if (!form.name.trim()) return setError("Please enter a product name.");
    if (form.price === "" || Number(form.price) <= 0) return setError("Enter a valid price greater than zero.");
    if (Number(form.stock) < 0 || !Number.isInteger(Number(form.stock))) return setError("Stock must be a non-negative whole number.");
    setError("");
    const payload = { ...form, name: form.name.trim(), price: Number(form.price), stock: Number(form.stock), status: publish ? "Published" : "Draft" };
    if (productId) updateProduct(productId, payload); else addProduct(payload);
    setSaved(true);
    setTimeout(() => router.push("/admin/products"), 450);
  }
  return <div>
    <PageHeading eyebrow="CATALOG MANAGEMENT" title={productId ? "Edit Product" : "Add New Product"} description={productId ? "Update product details and inventory." : "Create a product listing for your storefront."}/>
    {saved && <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">Product saved. Returning to the product listing…</div>}
    {error && <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
    <form onSubmit={e => {e.preventDefault(); submit(true);}} className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="space-y-5">
        <section className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-soft sm:p-6"><h3 className="font-bold">Basic information</h3><p className="mt-1 text-xs text-stone-400">Give your product a clear name and description.</p>
          <label className="mt-5 block text-xs font-semibold text-stone-700">Product name <span className="text-rose-500">*</span><input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Handwoven Jute Basket" className="form-input mt-2" /></label>
          <div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="block text-xs font-semibold text-stone-700">SKU<input value={form.sku || ""} onChange={e => set("sku", e.target.value)} placeholder="KT-1007" className="form-input mt-2"/></label><label className="block text-xs font-semibold text-stone-700">Category<select value={form.category} onChange={e => set("category", e.target.value)} className="form-input mt-2">{["Home Decor","Decor & Lighting","Stationery","Accessories","Kitchen & Dining","Gifts","Art & Craft"].map(c => <option key={c}>{c}</option>)}</select></label></div>
          <label className="mt-4 block text-xs font-semibold text-stone-700">Description<textarea value={form.description || ""} onChange={e => set("description", e.target.value)} rows={5} placeholder="Describe the materials, dimensions, features, and story behind this product..." className="form-input mt-2 resize-y"/></label>
        </section>
        <section className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-soft sm:p-6"><h3 className="font-bold">Product media</h3><p className="mt-1 text-xs text-stone-400">Choose a visual placeholder for this prototype.</p><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{["🎁","🧺","🪔","📔","👜","☕","🪢","🌿"].map(emoji => <button type="button" key={emoji} onClick={() => set("emoji", emoji)} className={`grid h-20 place-items-center rounded-xl border text-3xl ${form.emoji === emoji ? "border-brand bg-brand-light ring-2 ring-brand/10" : "border-stone-200 bg-stone-50 hover:border-stone-300"}`}>{emoji}</button>)}</div><p className="mt-3 text-[11px] text-stone-400">Image upload integration can be connected to your backend later.</p></section>
      </div>
      <div className="space-y-5">
        <section className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-soft"><h3 className="font-bold">Pricing</h3><label className="mt-4 block text-xs font-semibold text-stone-700">Price (INR) <span className="text-rose-500">*</span><div className="relative mt-2"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">₹</span><input type="number" min="0.01" step="0.01" value={form.price} onChange={e => set("price", e.target.value)} placeholder="799" className="form-input pl-8"/></div></label><label className="mt-4 block text-xs font-semibold text-stone-700">Compare-at price (INR)<input type="number" min="0" step="0.01" value={form.comparePrice || ""} onChange={e => set("comparePrice", e.target.value)} placeholder="999" className="form-input mt-2"/></label></section>
        <section className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-soft"><h3 className="font-bold">Inventory</h3><label className="mt-4 block text-xs font-semibold text-stone-700">Stock quantity<input type="number" min="0" step="1" value={form.stock} onChange={e => set("stock", e.target.value)} className="form-input mt-2"/></label><label className="mt-4 flex items-center gap-2 text-sm text-stone-600"><input type="checkbox" checked={form.trackInventory !== false} onChange={e => set("trackInventory", e.target.checked)}/> Track inventory</label><div className="mt-4 rounded-xl bg-stone-50 p-3 text-xs text-stone-500">Current stock status: <strong className="text-stone-800">{Number(form.stock) === 0 ? "Out of stock" : Number(form.stock) < 10 ? "Low stock" : "In stock"}</strong></div></section>
        <section className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-soft"><h3 className="font-bold">Publishing</h3><label className="mt-4 block text-xs font-semibold text-stone-700">Status<select value={form.status} onChange={e => set("status", e.target.value)} className="form-input mt-2"><option>Draft</option><option>Published</option></select></label><label className="mt-4 flex items-center gap-2 text-sm text-stone-600"><input type="checkbox" checked={!!form.featured} onChange={e => set("featured", e.target.checked)}/> Featured product</label></section>
      </div>
      <div className="flex flex-wrap justify-end gap-2 xl:col-span-2"><button type="button" onClick={() => router.push("/admin/products")} className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50">Cancel</button><button type="button" onClick={() => submit(false)} className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-stone-50">Save as draft</button><button type="submit" className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">{productId ? "Save changes" : "Publish product"}</button></div>
    </form>
  </div>;
}

export function ProductDetail({ productId }) {
  const { products, deleteProduct } = useAdmin();
  const router = useRouter();
  const product = products.find(p => p.id === productId);
  if (!product) return <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center"><h2 className="text-xl font-bold">Product not found</h2><p className="mt-2 text-sm text-stone-500">This product may have been deleted.</p><Link href="/admin/products" className="mt-5 inline-block rounded-xl bg-brand px-4 py-2 text-sm text-white">Back to products</Link></div>;
  return <div><PageHeading eyebrow="PRODUCT DETAILS" title={product.name} description={`SKU ${product.sku || product.id} · ${product.category}`} action="Edit Product" actionHref={`/admin/products/${product.id}/edit`}/><div className="grid gap-5 lg:grid-cols-[1fr_330px]"><section className="rounded-2xl border border-stone-200 bg-white p-7 shadow-soft"><div className="grid h-48 place-items-center rounded-2xl bg-[#F7EEE8] text-8xl">{product.emoji || "🎁"}</div><div className="mt-6 flex flex-wrap items-center gap-3"><StatusBadge status={product.status}/><span className="text-xs text-stone-400">Last updated {product.updated}</span></div><h3 className="mt-5 text-lg font-bold">Product description</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-stone-600">{product.description || "No description has been added yet."}</p></section><div className="space-y-4"><section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-soft"><div className="text-xs text-stone-400">Selling price</div><div className="mt-1 text-3xl font-bold">₹{Number(product.price).toLocaleString("en-IN")}</div><div className="mt-5 border-t border-stone-100 pt-4 text-xs text-stone-500">Category <strong className="float-right text-stone-800">{product.category}</strong></div><div className="mt-3 text-xs text-stone-500">Available stock <strong className="float-right text-stone-800">{product.stock}</strong></div></section><button onClick={() => {if(confirm("Delete this product?")) {deleteProduct(product.id); router.push("/admin/products");}}} className="w-full rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50">Delete product</button></div></div></div>;
}
