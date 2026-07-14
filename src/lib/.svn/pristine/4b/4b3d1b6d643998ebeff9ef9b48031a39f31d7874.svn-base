const validSlugs = ["new", "edit", "clone", "transfer-to", "transfer-from"] as const;

export type ValidSlug = (typeof validSlugs)[number];

/**
 * Function to check if a dynamic route's slug is valid.
 *
 * A valid dynamic route's slug is one that starts with "new", "edit", "clone", "transfer-to", or "transfer-from", e.g. "/system-account/all-account/new".
 *
 * @param slug - The route to check.
 * @returns `true` if the route is valid, `false` otherwise.
 */
export function isValidSlug(slug: string): slug is ValidSlug {
  return validSlugs.includes(slug as ValidSlug);
}
