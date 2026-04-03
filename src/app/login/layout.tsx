import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
  description: "Sign in or create an account for Mathi Enterprises.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
