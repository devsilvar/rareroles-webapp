/**
 * Dynamic Route Prefetcher for Instantaneous Client Navigation
 *
 * Uses Vite's native dynamic imports to cache JavaScript modules and
 * associated component assets in memory before the user commits to a navigation.
 */

const routeLoaders: Record<string, () => Promise<unknown>> = {
  "/": () => import("@/pages/Home"),
  "/about": () => import("@/pages/About"),
  "/services": () => import("@/pages/Companies"),
  "/companies": () => import("@/pages/Companies"),
  "/why-choose-us": () => import("@/pages/Talent"),
  "/talent": () => import("@/pages/Talent"),
  "/contact": () => import("@/pages/Contact"),
};

const prefetchedRoutes = new Set<string>();

/**
 * Prefetch a single route module on demand (e.g. mouse hover or touch start)
 */
export function prefetchRoute(path: string): void {
  if (typeof window === "undefined") return;
  const cleanPath = path.split("?")[0].split("#")[0];

  if (prefetchedRoutes.has(cleanPath)) return;
  
  const loader = routeLoaders[cleanPath];
  if (loader) {
    prefetchedRoutes.add(cleanPath);
    loader().catch(() => {
      // Allow retry if failed due to temporary network drop
      prefetchedRoutes.delete(cleanPath);
    });
  }
}

/**
 * Automatically warm up core landing routes during browser idle time
 */
export function prefetchCoreRoutesOnIdle(): void {
  if (typeof window === "undefined") return;

  const runPrefetch = () => {
    prefetchRoute("/about");
    prefetchRoute("/services");
    prefetchRoute("/why-choose-us");
    prefetchRoute("/contact");
  };

  if ("requestIdleCallback" in window) {
    (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void }).requestIdleCallback(
      runPrefetch,
      { timeout: 2000 }
    );
  } else {
    setTimeout(runPrefetch, 1200);
  }
}
