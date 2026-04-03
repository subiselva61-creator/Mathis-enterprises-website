import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-container text-center" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
      <h1 className="pageTitle" style={{ marginBottom: "0.75rem" }}>
        Page not found
      </h1>
      <p className="pageLead" style={{ margin: "0 auto 1.5rem" }}>
        The page you requested does not exist or the product slug is invalid.
      </p>
      <Link href="/shop" className="font-semibold text-neutral-900 underline decoration-neutral-400 underline-offset-4">
        Back to shop
      </Link>
    </div>
  );
}
