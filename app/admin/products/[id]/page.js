"use client";
import { useParams } from "next/navigation";
import { ProductDetail } from "../../../../components/product-pages";
export default function Page() { const params = useParams(); return <ProductDetail productId={params.id}/>; }
