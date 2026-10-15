"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BuyProductClient from "@/app/products/[id]/buy/BuyProductClient";
import ProductMoreDetailsClient from "@/app/products/[id]/details/ProductMoreDetailsClient";
import ProductDetailClient from "@/app/products/[id]/ProductDetailClient";
import PageLayout from "@/components/PageLayout";
import { ProductItem } from "@/data/products";
import {
  findProductByIdIncludingCustom,
  VENDOR_PRODUCTS_EVENT_KEY,
  VENDOR_PRODUCTS_STORAGE_KEY,
} from "@/utils/vendorProducts";

type ProductRouteView = "detail" | "details" | "buy" | "compare";

interface ProductRouteClientProps {
  initialProduct: ProductItem | null;
  productId: string;
  view: ProductRouteView;
}

export default function ProductRouteClient({ initialProduct, productId, view }: ProductRouteClientProps) {
  const [product, setProduct] = useState<ProductItem | null>(initialProduct);
  const [hasResolvedBrowserData, setHasResolvedBrowserData] = useState(Boolean(initialProduct));

  useEffect(() => {
    const resolveProduct = () => {
      setProduct(findProductByIdIncludingCustom(productId));
      setHasResolvedBrowserData(true);
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key === VENDOR_PRODUCTS_STORAGE_KEY) resolveProduct();
    };
    const frameId = window.requestAnimationFrame(resolveProduct);
    window.addEventListener(VENDOR_PRODUCTS_EVENT_KEY, resolveProduct);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener(VENDOR_PRODUCTS_EVENT_KEY, resolveProduct);
      window.removeEventListener("storage", handleStorage);
    };
  }, [productId]);

  if (!product) {
    return (
      <PageLayout activeNav="products">
        <section className="product-route-state" aria-live="polite">
          {!hasResolvedBrowserData ? (
            <p>Loading product details...</p>
          ) : (
            <>
              <h1>Product not found</h1>
              <p>This listing may have been removed or is no longer available.</p>
              <Link className="btn-primary" href="/products">Browse products</Link>
            </>
          )}
        </section>
      </PageLayout>
    );
  }

  if (view === "buy") return <BuyProductClient product={product} />;
  if (view === "compare") return <ProductMoreDetailsClient initialTab="compare" product={product} />;
  if (view === "details") return <ProductMoreDetailsClient product={product} />;
  return <ProductDetailClient product={product} />;
}
