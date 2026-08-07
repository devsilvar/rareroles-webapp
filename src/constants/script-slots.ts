/**
 * Named injection points and the public page list used by the marketing
 * script manager.
 */

export interface ScriptSlotDef {
  id: string;
  label: string;
  /** Where this slot lives, for display in the admin UI. */
  page: string;
}

/**
 * Curated "hot spots" the owner can target.
 *
 * Deliberately a fixed registry rather than free-text CSS selectors: a
 * selector silently stops matching after any redesign, and the owner is left
 * wondering why a pixel stopped firing. A named slot either exists or is
 * visibly absent from the dropdown.
 *
 * To add one: drop <ScriptSlot id="..." /> at the desired point in a page and
 * add a matching entry here.
 */
export const SCRIPT_SLOTS: ScriptSlotDef[] = [
  { id: "home-hero-after", label: "Home — below the hero section", page: "Home" },
  { id: "home-cta-after", label: "Home — below the final call-to-action", page: "Home" },
  { id: "contact-form-before", label: "Contact — above the form", page: "Contact" },
  { id: "contact-form-after", label: "Contact — below the form", page: "Contact" },
  { id: "companies-cta-after", label: "Services — below the call-to-action", page: "Services" },
  { id: "talent-cta-after", label: "Why Choose Us — below the call-to-action", page: "Why Choose Us" },
  { id: "about-content-after", label: "About — below the main content", page: "About" },
];

export interface PublicPageDef {
  /** Stable key used in the admin UI. */
  key: string;
  label: string;
  /**
   * Every path that renders this page. Several pages answer to two URLs, and
   * missing the alias is a silent tracking failure: the owner targets
   * /companies, a visitor arrives via /services, and the tag never fires.
   * Selecting a page in the admin UI stores ALL of its paths.
   */
  paths: string[];
}

/** Mirrors the public route table in src/App.tsx. */
export const PUBLIC_PAGES: PublicPageDef[] = [
  { key: "home", label: "Home", paths: ["/"] },
  { key: "about", label: "About", paths: ["/about"] },
  {
    key: "talent",
    label: "Why Choose Us / Talent",
    paths: ["/talent", "/why-choose-us"],
  },
  {
    key: "companies",
    label: "Services / Companies",
    paths: ["/companies", "/services"],
  },
  { key: "contact", label: "Contact", paths: ["/contact"] },
];

/** All paths belonging to the page that owns `path`, including aliases. */
export function pathsForPage(path: string): string[] {
  const page = PUBLIC_PAGES.find((p) => p.paths.includes(path));
  return page ? page.paths : [path];
}

/** Human-readable summary of a stored page_paths array. */
export function describePaths(paths: string[]): string {
  if (paths.length === 0) return "no pages";
  const labels = new Set<string>();
  for (const path of paths) {
    const page = PUBLIC_PAGES.find((p) => p.paths.includes(path));
    labels.add(page ? page.label : path);
  }
  return Array.from(labels).join(", ");
}
