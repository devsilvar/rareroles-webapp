import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  fetchPublicScripts,
  hasInjected,
  injectScript,
  isAdminPath,
  notifyPageView,
  shouldInjectOnPath,
} from "../lib/marketing-scripts";
import type { PublicMarketingScript } from "../types/marketing";

const CACHE_KEY = "mkt_scripts_cache";
const CACHE_TTL_MS = 5 * 60 * 1000;

interface CachedPayload {
  at: number;
  scripts: PublicMarketingScript[];
}

function readCache(): PublicMarketingScript[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedPayload;
    if (Date.now() - parsed.at > CACHE_TTL_MS) return null;
    return parsed.scripts;
  } catch {
    return null;
  }
}

function writeCache(scripts: PublicMarketingScript[]): void {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ at: Date.now(), scripts } satisfies CachedPayload),
    );
  } catch {
    /* sessionStorage unavailable (private mode / quota) — not worth reporting */
  }
}

function scheduleInjection(script: PublicMarketingScript, run: () => void): () => void {
  switch (script.load_timing) {
    case "idle": {
      const w = window as Window & {
        requestIdleCallback?: (cb: () => void) => number;
        cancelIdleCallback?: (handle: number) => void;
      };
      if (typeof w.requestIdleCallback === "function") {
        const handle = w.requestIdleCallback(run);
        return () => w.cancelIdleCallback?.(handle);
      }
      const timer = window.setTimeout(run, 200);
      return () => window.clearTimeout(timer);
    }
    case "delay": {
      const timer = window.setTimeout(run, script.load_delay_ms);
      return () => window.clearTimeout(timer);
    }
    case "consent":
      // No consent mechanism is implemented yet, so this deliberately never
      // fires. Dead is the correct failure mode here — the alternative is
      // loading marketing cookies without the consent the owner asked for.
      // The admin UI states this plainly.
      return () => {};
    case "immediate":
    default:
      run();
      return () => {};
  }
}

/**
 * Loads owner-configured marketing tags on the public site.
 *
 * Mount inside the public route branch only. Injecting on /admin would leak
 * admin URLs to vendors, pollute the owner's marketing data with staff
 * traffic, and expose candidate PII to any tag with session-recording
 * behaviour. The injector self-guards as well, via isAdminPath.
 */
export default function MarketingScriptsProvider() {
  const location = useLocation();
  const [scripts, setScripts] = useState<PublicMarketingScript[]>(() => readCache() ?? []);
  const loadedRef = useRef(scripts.length > 0);
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (loadedRef.current) return;
    let cancelled = false;

    fetchPublicScripts().then((rows) => {
      if (cancelled) return;
      loadedRef.current = true;
      writeCache(rows);
      setScripts(rows);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Inject whatever matches the current route.
  useEffect(() => {
    if (isAdminPath(location.pathname)) return;
    if (!scripts.length) return;

    const cleanups: Array<() => void> = [];

    for (const script of scripts) {
      if (hasInjected(script.id)) continue;
      if (!shouldInjectOnPath(script, location.pathname)) continue;

      // Slot targets render with the page, so injection is retried on each
      // route change until the anchor actually exists.
      cleanups.push(scheduleInjection(script, () => injectScript(script)));
    }

    return () => cleanups.forEach((fn) => fn());
  }, [scripts, location.pathname]);

  // Vendor tags count a page view once, when they load. In an SPA the URL
  // changes without any script reloading, so without this every visit looks
  // like a single landing-page hit and interior pages appear to get no
  // traffic at all.
  useEffect(() => {
    if (isAdminPath(location.pathname)) return;

    const previous = lastPathRef.current;
    lastPathRef.current = location.pathname;

    // Skip the first render: the tags themselves fire the initial page view.
    if (previous === null || previous === location.pathname) return;
    if (!scripts.some((s) => s.spa_pageview)) return;

    notifyPageView(location.pathname);
  }, [location.pathname, scripts]);

  return null;
}
