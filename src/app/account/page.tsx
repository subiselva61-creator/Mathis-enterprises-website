import type { Metadata } from "next";
import AccountClient from "./AccountClient";
import { noindexMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = noindexMetadata({
  title: "Account",
  description: "Your Mathi Enterprises account, details, and shopping bag.",
});

export default function AccountPage() {
  return <AccountClient />;
}
