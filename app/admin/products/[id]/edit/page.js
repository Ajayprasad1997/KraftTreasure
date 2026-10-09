"use client";
import { useParams } from "next/navigation";
import { ProductForm } from "../../../../../components/product-pages";
export default function Page() { const params = useParams(); return <ProductForm productId={params.id}/>; }
