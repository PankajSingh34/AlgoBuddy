export function normalizeNewsletterEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function isValidNewsletterEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeNewsletterEmail(email));
}
