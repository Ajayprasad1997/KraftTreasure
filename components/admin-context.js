"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AdminContext = createContext(null);
const initialProducts = [
  { id: "KT-1001", name: "Handwoven Jute Basket", category: "Home Decor", price: 799, stock: 28, status: "Published", updated: "Oct 08, 2026", emoji: "🧺" },
  { id: "KT-1002", name: "Terracotta Tea Light Set", category: "Decor & Lighting", price: 549, stock: 7, status: "Published", updated: "Oct 07, 2026", emoji: "🪔" },
  { id: "KT-1003", name: "Botanical Art Notebook", category: "Stationery", price: 299, stock: 0, status: "Draft", updated: "Oct 06, 2026", emoji: "📔" },
  { id: "KT-1004", name: "Block Print Tote Bag", category: "Accessories", price: 649, stock: 42, status: "Published", updated: "Oct 05, 2026", emoji: "👜" },
  { id: "KT-1005", name: "Hand-painted Ceramic Mug", category: "Kitchen & Dining", price: 449, stock: 12, status: "Published", updated: "Oct 04, 2026", emoji: "☕" },
  { id: "KT-1006", name: "Macrame Wall Hanging", category: "Home Decor", price: 1299, stock: 4, status: "Draft", updated: "Oct 03, 2026", emoji: "🪢" }
];

const initialOrders = [
  { id: "#KT-2084", customer: "Aarav Sharma", date: "Oct 09, 2026", total: 1848, payment: "Paid", status: "Processing" },
  { id: "#KT-2083", customer: "Diya Patel", date: "Oct 09, 2026", total: 799, payment: "Paid", status: "Shipped" },
  { id: "#KT-2082", customer: "Kabir Mehta", date: "Oct 08, 2026", total: 2397, payment: "Pending", status: "Pending" },
  { id: "#KT-2081", customer: "Anaya Singh", date: "Oct 08, 2026", total: 549, payment: "Paid", status: "Delivered" },
  { id: "#KT-2080", customer: "Ishaan Roy", date: "Oct 07, 2026", total: 1299, payment: "Refunded", status: "Cancelled" }
];

const initialCustomers = [
  { id: "CUS-1001", name: "Aarav Sharma", email: "aarav@example.com", orders: 8, spend: 12450, status: "Active" },
  { id: "CUS-1002", name: "Diya Patel", email: "diya@example.com", orders: 5, spend: 7890, status: "Active" },
  { id: "CUS-1003", name: "Kabir Mehta", email: "kabir@example.com", orders: 2, spend: 2397, status: "Active" },
  { id: "CUS-1004", name: "Anaya Singh", email: "anaya@example.com", orders: 11, spend: 18990, status: "Active" },
  { id: "CUS-1005", name: "Ishaan Roy", email: "ishaan@example.com", orders: 1, spend: 1299, status: "Inactive" }
];

export function AdminProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const [orders] = useState(initialOrders);
  const [customers] = useState(initialCustomers);
  const [notifications, setNotifications] = useState(3);

  const addProduct = (product) => setProducts((old) => [{ ...product, id: `KT-${1001 + old.length}`, updated: "Oct 09, 2026" }, ...old]);
  const updateProduct = (id, changes) => setProducts((old) => old.map((p) => p.id === id ? { ...p, ...changes, updated: "Oct 09, 2026" } : p));
  const deleteProduct = (id) => setProducts((old) => old.filter((p) => p.id !== id));

  return <AdminContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, orders, customers, notifications, setNotifications }}>{children}</AdminContext.Provider>;
}
export function useAdmin() { return useContext(AdminContext); }
