/**
 * Canonical Application Domain & URL Resolution Helper
 * Sunshine Public School — Production Domain Safety Architecture
 * 
 * Ensures all public redirects (logout, auth, middleware) resolve to the 
 * canonical production domain (https://www.sspsedu.com) rather than 
 * internal deployment platform origins (e.g. *.up.railway.app).
 */

export const DEFAULT_CANONICAL_DOMAIN = "https://www.sspsedu.com";

/**
 * The canonical base URL of the application.
 * Normalizes trailing slashes and checks production/environment variables.
 */
export const APP_URL = (
  process.env.APP_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXTAUTH_URL ||
  process.env.AUTH_URL ||
  DEFAULT_CANONICAL_DOMAIN
).replace(/\/+$/, "");

/**
 * Returns an absolute URL bound to the canonical production domain.
 * 
 * Example:
 *   absoluteUrl("/login") -> "https://www.sspsedu.com/login"
 */
export function absoluteUrl(path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${APP_URL}${cleanPath}`;
}
