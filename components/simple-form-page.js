"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeading } from "./ui";

const definitions = {
  users: { title: "Add User", description: "Invite a team member and assign store access.", fields: [
    {name:"name",label:"Full name",required:true,placeholder:"Enter full name"},
    {name:"email",label:"Email address",type:"email",required:true,placeholder:"name@company.com"},
    {name:"phone",label:"Phone number",placeholder:"+91 98765 43210"},
    {name:"role",label:"Role",type:"select",options:["Administrator","Catalog Manager","Order Manager","Support Agent"]},
    {name:"status",label:"Account status",type:"select",options:["Active","Inactive"]}
  ]},
  categories: { title: "Add Category", description: "Create a category to organize your product catalog.", fields: [
    {name:"name",label:"Category name",required:true,placeholder:"e.g. Home Decor"},
    {name:"slug",label:"URL slug",placeholder:"home-decor"},
    {name:"description",label:"Description",type:"textarea",placeholder:"Describe this category"},
    {name:"parent",label:"Parent category",type:"select",options:["None","Home Decor","Accessories","Gifts"]},
    {name:"status",label:"Status",type:"select",options:["Active","Inactive"]}
  ]},
  coupons: { title: "Create Coupon", description: "Set up a promotion for your customers.", fields: [
    {name:"code",label:"Coupon code",required:true,placeholder:"WELCOME10"},
    {name:"type",label:"Discount type",type:"select",options:["Percentage","Fixed amount (INR)"]},
    {name:"value",label:"Discount value",type:"number",required:true,placeholder:"10"},
    {name:"minimum",label:"Minimum order value (INR)",type:"number",placeholder:"500"},
    {name:"limit",label:"Usage limit",type:"number",placeholder:"100"},
    {name:"expires",label:"Expiry date",type:"date",required:true},
    {name:"status",label:"Status",type:"select",options:["Active","Inactive"]}
  ]}
};

export default function SimpleFormPage({ moduleKey }) {
  const def = definitions[moduleKey];
  const router = useRouter();
  const [values,setValues] = useState({});
  const [error,setError] = useState("");
  const [saved,setSaved] = useState(false);
  const update = (key,value) => {
    setValues(old => {
      const next = {...old,[key]:value};
      if (key === "name" && moduleKey === "categories" && !old.slug) next.slug = value.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
      return next;
    });
  };
  function submit(e) {
    e.preventDefault();
    const missing = def.fields.find(f => f.required && !String(values[f.name] || "").trim());
    if (missing) { setError(`${missing.label} is required.`); return; }
    setError(""); setSaved(true);
    setTimeout(() => router.push(`/admin/${moduleKey}`), 700);
  }
  return <div>
    <PageHeading eyebrow="STORE MANAGEMENT" title={def.title} description={def.description}/>
    <form onSubmit={submit} className="max-w-4xl overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-soft">
      <div className="grid gap-x-6 gap-y-5 p-5 sm:grid-cols-2 sm:p-7">
        {def.fields.map(field => <label key={field.name} className={`block text-xs font-semibold text-stone-700 ${field.type==="textarea"?"sm:col-span-2":""}`}>{field.label}{field.required && <span className="ml-1 text-rose-500">*</span>}
          {field.type === "select" ? <select value={values[field.name] || field.options[0]} onChange={e=>update(field.name,e.target.value)} className="form-input mt-2">{field.options.map(o=><option key={o}>{o}</option>)}</select>
          : field.type === "textarea" ? <textarea value={values[field.name]||""} onChange={e=>update(field.name,e.target.value)} rows={4} placeholder={field.placeholder} className="form-input mt-2 resize-y"/>
          : <input type={field.type||"text"} required={field.required} value={values[field.name]||""} onChange={e=>update(field.name,e.target.value)} placeholder={field.placeholder} className="form-input mt-2"/>}
        </label>)}
      </div>
      {error && <div className="mx-5 mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700 sm:mx-7">{error}</div>}
      {saved && <div className="mx-5 mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 sm:mx-7">Form submitted in prototype. Returning to listing…</div>}
      <div className="flex justify-end gap-2 border-t border-stone-100 bg-stone-50/60 px-5 py-4 sm:px-7"><button type="button" onClick={()=>router.push(`/admin/${moduleKey}`)} className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-600">Cancel</button><button type="submit" className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">Save {moduleKey==="users"?"user":moduleKey==="categories"?"category":"coupon"}</button></div>
    </form>
    <p className="mt-4 max-w-4xl text-xs leading-5 text-stone-400">Prototype note: this form validates and demonstrates the workflow, but saving is not persisted to a database yet.</p>
  </div>;
}
