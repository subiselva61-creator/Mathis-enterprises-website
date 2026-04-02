import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
      <h1 className="pageTitle" style={{ marginBottom: "0.75rem" }}>
        Page not found
      </h1>
      <p className="pageLead" style={{ margin: "0 auto 1.5rem" }}>
        The page you requested does not exist or the product slug is invalid.
      </p>
      <Link href="/shop" style={{ fontWeight: 600, color: "#c4b5fd", textDecoration: "underline" }}>
        Back to shop
      </Link>
    </div>
  );
}
