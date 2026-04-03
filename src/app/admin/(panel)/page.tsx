import Link from "next/link";
import { getMergedProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";
import { createServiceRoleClient } from "@/lib/supabase/service";
import type { ProductOverrideRow } from "@/lib/supabase/types";

async function loadOverrideIds(): Promise<Set<string>> {
  const client = createServiceRoleClient();
  if (!client) return new Set();
  const { data } = await client.from("product_overrides").select("product_id");
  const rows = (data ?? []) as Pick<ProductOverrideRow, "product_id">[];
  return new Set(rows.map((r) => r.product_id));
}

export default async function AdminHomePage() {
  const [products, overrideIds] = await Promise.all([getMergedProducts(), loadOverrideIds()]);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Products</h1>
      <p className="mt-2 max-w-2xl text-sm text-neutral-600">
        Edits are stored in Supabase and merged on top of the built-in catalog and IndiaMART sync. Empty override fields fall
        back to the default catalog.
      </p>
      <ul
        className="mt-8 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white"
        data-admin-product-rows
      >
        {products.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
            <div>
              <span className="font-medium text-neutral-900">{p.name}</span>
              <span className="ml-2 text-neutral-500">({p.slug})</span>
              {overrideIds.has(p.id) ? (
                <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                  overrides
                </span>
              ) : null}
            </div>
            <Link
              href={`/admin/products/${encodeURIComponent(p.id)}`}
              className="shrink-0 rounded-lg border border-neutral-300 px-3 py-1.5 text-neutral-800 transition hover:bg-neutral-50"
            >
              Edit
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
