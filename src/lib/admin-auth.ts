export function parseAdminEmailAllowlist(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowlistedAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return parseAdminEmailAllowlist().includes(email.trim().toLowerCase());
}
