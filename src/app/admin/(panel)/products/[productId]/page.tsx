import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import { getMergedProducts } from "@/lib/catalog";
import { fetchProductOverrideRow } from "@/lib/supabase/service";
import EditProductForm from "./EditProductForm";

type Props = { params: Promise<{ productId: string }> };

export default async function AdminEditProductPage({ params }: Props) {
  const { productId } = await params;
  const decodedId = decodeURIComponent(productId);
  const products = await getMergedProducts();
  const product = products.find((p) => p.id === decodedId);
  if (!product) notFound();

  const row = await fetchProductOverrideRow(decodedId);

  return (
    <div>
      <p className="text-sm text-neutral-600">
        <Link href="/admin" className="text-[#0027eb] underline-offset-2 hover:underline">
          ← All products
        </Link>
      </p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-neutral-900">{product.name}</h1>
      <p className="mt-1 text-sm text-neutral-500">
        ID <code className="rounded bg-neutral-200 px-1 text-neutral-800">{product.id}</code> · slug{" "}
        <code className="rounded bg-neutral-200 px-1 text-neutral-800">{product.slug}</code>
      </p>
      <p className="mt-2 text-sm text-neutral-600">
        <Link href={`/shop/${product.slug}`} className="text-[#0027eb] underline-offset-2 hover:underline" target="_blank">
          Open storefront page
        </Link>
      </p>
      <div className="mt-8">
        <EditProductForm product={product} overrideRow={row} />
      </div>
    </div>
  );
}
