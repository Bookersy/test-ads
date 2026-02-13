export const ADMIN_EMAIL = "bookerdavies8@gmail.com";

export function isAdmin(email: string | null | undefined): boolean {
  return email?.toLowerCase() === ADMIN_EMAIL;
}
