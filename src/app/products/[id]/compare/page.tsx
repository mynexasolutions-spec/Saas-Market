import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_PRODUCTS, getProductById } from "@/data/products";
import ProductMoreDetailsClient from "../details/ProductMoreDetailsClient";

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
      title: "Product Comparison | SaaS MRKT",
    };
  }
  return {
    title: `Compare ${product.name} with Top Market Alternatives | SaaS MRKT`,
    description: `Side-by-side technical, financial, and architectural benchmark comparing ${product.name} with leading market alternatives.`,
  };
}

export default async function ProductComparePage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductMoreDetailsClient product={product} initialTab="compare" />;
}
