import type { Metadata } from "next";
import AccountClient from "./AccountClient";

export const metadata: Metadata = {
  title: "Account",
  description: "Your Mathi Enterprises account, details, and shopping bag.",
};

export default function AccountPage() {
  return <AccountClient />;
}
