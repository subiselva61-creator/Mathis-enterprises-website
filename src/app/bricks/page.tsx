import type { Metadata } from "next";
import Link from "next/link";
import BricksLineup from "@/components/bricks/BricksLineup";
import { brickProductsFrom } from "@/data/products";
import { getMergedProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Bricks",
  description:
    "Explore all brick products from Mathi Enterprises — clay, fly ash, wire cut, concrete, and interlock bricks in Chennai.",
};

export default async function BricksPage() {
  const merged = await getMergedProducts();
  const bricks = brickProductsFrom(merged);

  return (
    <div className="page-container">
      <h1 className="pageTitle">Bricks</h1>
      <p className="pageLead mb-8 md:mb-10">
        Clay, fly ash, wire cut, concrete, and interlock bricks — swipe or scroll to compare models.
      </p>
      <BricksLineup products={bricks} />
      <p className="mt-10 text-sm text-neutral-600 md:mt-14">
        Prefer the full catalog?{" "}
        <Link href="/shop" className="font-medium text-[#0027eb] underline-offset-2 hover:underline">
          Browse the shop
        </Link>
        .
      </p>
    </div>
  );
}
