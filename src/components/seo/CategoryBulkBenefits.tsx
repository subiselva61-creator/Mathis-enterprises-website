type Props = { materialLabel: string };

export default function CategoryBulkBenefits({ materialLabel }: Props) {
  return (
    <section className="mt-8 md:mt-10" aria-labelledby="bulk-benefits-heading">
      <h2
        id="bulk-benefits-heading"
        className="text-[20px] font-semibold tracking-tight text-[#1d1d1f] md:text-[22px]"
      >
        Why buy bulk {materialLabel} from Mathi Enterprises
      </h2>
      <ul className="mt-3 max-w-prose list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-neutral-700 md:text-base">
        <li>
          <strong className="font-medium text-neutral-900">Wholesale distribution</strong> — project supply chain support
          with clear MOQs and indicative rates from our IndiaMART-backed catalog.
        </li>
        <li>
          <strong className="font-medium text-neutral-900">Construction procurement</strong> — short-list SKUs here, then
          confirm freight, GST, and the latest quote before dispatch.
        </li>
        <li>
          <strong className="font-medium text-neutral-900">Industrial-grade materials</strong> — where a product page lists
          IS certification or grade, verify the same on your purchase order and delivery challan.
        </li>
      </ul>
    </section>
  );
}
