import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_PRODUCTS, getProductById } from "@/data/products";
import ProductMoreDetailsClient from "./ProductMoreDetailsClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return ALL_PRODUCTS.map((p) => ({
    id: p.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) {
    return {
      title: "Product Specifications & Details | SaaS MRKT",
    };
  }
  return {
    title: `${product.name} - Full Technical Specifications & Diligence | SaaS MRKT`,
    description: `Detailed technical architecture, security compliance, performance SLAs, and verified metrics for ${product.name}.`,
  };
}

export default async function ProductMoreDetailsPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductMoreDetailsClient product={product} />;
}
