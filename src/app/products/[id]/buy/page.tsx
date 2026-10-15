import { Metadata } from "next";
import { ALL_PRODUCTS, getProductById } from "@/data/products";
import ProductRouteClient from "@/components/ProductRouteClient";

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
      title: "Checkout | SaaS MRKT",
    };
  }
  return {
    title: `Buy ${product.name} - Secure Checkout | SaaS MRKT`,
    description: `Complete your secure purchase of ${product.name}. Instant delivery, verified escrow, 30-day money-back guarantee.`,
  };
}

export default async function BuyPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(id);
  return <ProductRouteClient initialProduct={product || null} productId={id} view="buy" />;
}
