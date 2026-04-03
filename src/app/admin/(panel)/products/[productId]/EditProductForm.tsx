"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import type { Product } from "@/data/product-types";
import type { ProductOverrideRow } from "@/lib/supabase/types";
import { deleteProductOverride, saveProductOverride, type SaveOverrideState, uploadProductImage } from "../../../actions";

type Props = {
  product: Product;
  overrideRow: ProductOverrideRow | null;
};

function initialPorMode(row: ProductOverrideRow | null): string {
  if (row?.price_on_request === true) return "true";
  if (row?.price_on_request === false) return "false";
  return "inherit";
}

export default function EditProductForm({ product, overrideRow }: Props) {
  const [state, formAction, isPending] = useActionState<SaveOverrideState, FormData>(saveProductOverride, {});
  const [imagesText, setImagesText] = useState(() => (overrideRow?.images ?? []).join("\n"));
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [delMsg, setDelMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadPending, startUploadTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();

  const porMode = initialPorMode(overrideRow);

  function onUpload() {
    const input = fileRef.current;
    const file = input?.files?.[0];
    if (!file) {
      setUploadMsg("Choose a file first.");
      return;
    }
    setUploadMsg(null);
    const fd = new FormData();
    fd.set("product_id", product.id);
    fd.set("file", file);
    startUploadTransition(async () => {
      const res = await uploadProductImage(fd);
      if (res.error) {
        setUploadMsg(res.error);
        return;
      }
      if (res.url) {
        setImagesText((prev) => (prev.trim() === "" ? res.url! : `${prev.trim()}\n${res.url}`));
        setUploadMsg("Uploaded — URL appended below.");
        if (input) input.value = "";
      }
    });
  }

  function onDeleteOverrides() {
    if (!window.confirm("Remove all Supabase overrides for this product?")) return;
    setDelMsg(null);
    startDeleteTransition(async () => {
      const res = await deleteProductOverride(product.id);
      if (res.error) setDelMsg(res.error);
      else window.location.reload();
    });
  }

  return (
    <div className="max-w-2xl space-y-8">
      <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Live preview</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div>
            <dt className="text-neutral-500">Price</dt>
            <dd className="font-medium text-neutral-900">
              {product.priceOnRequest ? "Price on request" : `${product.currency} ${product.price}`}
              {!product.priceOnRequest && product.priceBasis ? ` / ${product.priceBasis}` : null}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">Description</dt>
            <dd className="text-neutral-800">{product.description}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Images</dt>
            <dd className="break-all text-neutral-800">{product.images.join(", ")}</dd>
          </div>
        </dl>
      </section>

      <form action={formAction} className="space-y-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <input type="hidden" name="product_id" value={product.id} />
        <h2 className="text-lg font-semibold text-neutral-900">Overrides</h2>

        <label className="block text-sm font-medium text-neutral-800">
          Price (leave empty to use catalog / IndiaMART rules)
          <input
            type="number"
            name="price"
            min={0}
            step="any"
            defaultValue={overrideRow?.price != null ? String(overrideRow.price) : ""}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 shadow-sm outline-none focus:border-[#0027eb] focus:ring-1 focus:ring-[#0027eb]"
          />
        </label>

        <fieldset className="space-y-2 text-sm">
          <legend className="font-medium text-neutral-800">Price on request</legend>
          <label className="flex items-center gap-2">
            <input type="radio" name="price_on_request_mode" value="inherit" defaultChecked={porMode === "inherit"} />
            <span>Use catalog default</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="price_on_request_mode" value="true" defaultChecked={porMode === "true"} />
            <span>Force “price on request”</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="price_on_request_mode" value="false" defaultChecked={porMode === "false"} />
            <span>Force purchasable (show price)</span>
          </label>
        </fieldset>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            name="skip_indiamart_price"
            defaultChecked={overrideRow?.skip_indiamart_price === true}
            className="mt-1"
          />
          <span>
            <span className="font-medium text-neutral-800">Skip IndiaMART price sync</span>
            <span className="mt-0.5 block text-neutral-600">
              Use the TypeScript catalog price as the base before any manual price override above.
            </span>
          </span>
        </label>

        <label className="block text-sm font-medium text-neutral-800">
          Description (empty = catalog default)
          <textarea
            name="description"
            rows={5}
            defaultValue={overrideRow?.description ?? ""}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 shadow-sm outline-none focus:border-[#0027eb] focus:ring-1 focus:ring-[#0027eb]"
          />
        </label>

        <div>
          <label className="block text-sm font-medium text-neutral-800">
            Image URLs (one per line; empty = catalog default)
          </label>
          <textarea
            name="images"
            rows={4}
            value={imagesText}
            onChange={(e) => setImagesText(e.target.value)}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 font-mono text-sm text-neutral-900 shadow-sm outline-none focus:border-[#0027eb] focus:ring-1 focus:ring-[#0027eb]"
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input ref={fileRef} type="file" accept="image/*" className="max-w-full text-sm" />
            <button
              type="button"
              onClick={onUpload}
              disabled={uploadPending}
              className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50 disabled:opacity-60"
            >
              {uploadPending ? "Uploading…" : "Upload to storage"}
            </button>
          </div>
          {uploadMsg ? <p className="mt-2 text-sm text-neutral-600">{uploadMsg}</p> : null}
        </div>

        {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
        {state.ok ? <p className="text-sm text-emerald-700">Saved. Storefront cache refreshed.</p> : null}

        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-[#0027eb] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1e46f4] disabled:opacity-60"
        >
          {isPending ? "Saving…" : "Save overrides"}
        </button>
      </form>

      <section className="rounded-xl border border-red-200 bg-red-50/50 p-6">
        <h2 className="text-sm font-semibold text-red-900">Reset</h2>
        <p className="mt-2 text-sm text-red-800/90">Deletes the override row in Supabase for this product.</p>
        {delMsg ? <p className="mt-2 text-sm text-red-700">{delMsg}</p> : null}
        <button
          type="button"
          onClick={onDeleteOverrides}
          disabled={deletePending}
          className="mt-4 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-50 disabled:opacity-60"
        >
          {deletePending ? "Removing…" : "Remove all overrides"}
        </button>
      </section>
    </div>
  );
}
