/**
 * Known email provider domains.
 * Includes the primary domain for each of the four supported providers:
 *  - Google  → gmail.com
 *  - Yahoo   → yahoo.com
 *  - Microsoft Outlook / Hotmail / Live → outlook.com, hotmail.com, live.com
 *  - Apple iCloud → icloud.com, me.com, mac.com
 */
const KNOWN_PROVIDER_DOMAINS = new Set([
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'icloud.com',
  'me.com',
  'mac.com',
]);

/**
 * Returns true when `email` is syntactically valid AND its domain belongs to
 * one of the known consumer email providers (Gmail, Yahoo, Outlook, iCloud).
 *
 * @param {string} email - The email address to validate.
 * @returns {boolean}
 */
export function isKnownProviderEmail(email) {
  if (typeof email !== 'string') return false;

  const atIndex = email.lastIndexOf('@');
  if (atIndex < 1) return false;

  const local  = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1).toLowerCase();

  // Local-part must be non-empty and free of whitespace
  if (!local || /\s/.test(local)) return false;

  // Domain must be non-empty and free of whitespace; the Set lookup below
  // guarantees it contains a dot, so no separate regex is needed.
  if (!domain || /\s/.test(domain)) return false;

  return KNOWN_PROVIDER_DOMAINS.has(domain);
}

/**
 * Returns true when `email` matches a general email format (any domain).
 * Used for fields where any valid email address is acceptable.
 *
 * @param {string} email - The email address to validate.
 * @returns {boolean}
 */
export function validateEmailFormat(email) {
  if (typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
