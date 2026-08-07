/**
 * Marketing script manager — data access, snippet parsing, DOM injection and
 * conversion signalling.
 *
 * We deliver the vendor's tag and tell it when a conversion happened. We do
 * not measure anything ourselves.
 */

import { supabase } from "./supabase";
import {
  findTemplate,
  type MarketingScript,
  type MarketingScriptDraft,
  type PublicMarketingScript,
} from "../types/marketing";

const PUBLIC_VIEW = "marketing_scripts_public";
const TABLE = "marketing_scripts";
const AUDIT_TABLE = "marketing_script_audit";

// ============================================================================
// Reads
// ============================================================================

/**
 * Enabled scripts for the public site.
 *
 * Failure is silent and total: if Supabase is unreachable the site renders
 * normally with no tags. A pixel outage must never become a site outage.
 */
export async function fetchPublicScripts(): Promise<PublicMarketingScript[]> {
  try {
    const { data, error } = await supabase
      .from(PUBLIC_VIEW)
      .select("*")
      .order("priority", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data as PublicMarketingScript[]) ?? [];
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn("[Marketing] Could not load scripts:", err);
    }
    return [];
  }
}

export async function fetchAllScripts(): Promise<MarketingScript[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("priority", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data as MarketingScript[]) ?? [];
}

// ============================================================================
// Writes
// ============================================================================

async function currentUserEmail(): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.email ?? null;
}

/** Audit is best-effort: it must never block or fail a save. */
async function recordAudit(
  scriptId: string | null,
  scriptName: string,
  action: "create" | "update" | "enable" | "disable" | "delete",
  diff?: Record<string, unknown>,
): Promise<void> {
  try {
    await supabase.from(AUDIT_TABLE).insert([
      {
        script_id: scriptId,
        script_name: scriptName,
        action,
        changed_by: await currentUserEmail(),
        diff: diff ?? null,
      },
    ]);
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn("[Marketing] Audit write failed:", err);
    }
  }
}

export async function createScript(
  draft: MarketingScriptDraft,
): Promise<MarketingScript> {
  const email = await currentUserEmail();
  const { data, error } = await supabase
    .from(TABLE)
    .insert([{ ...draft, created_by: email, updated_by: email }])
    .select()
    .single();

  if (error) throw error;
  const created = data as MarketingScript;
  void recordAudit(created.id, created.name, "create");
  return created;
}

export async function updateScript(
  id: string,
  patch: Partial<MarketingScriptDraft>,
): Promise<MarketingScript> {
  const email = await currentUserEmail();
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...patch, updated_by: email })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  const updated = data as MarketingScript;
  void recordAudit(updated.id, updated.name, "update", patch as Record<string, unknown>);
  return updated;
}

export async function setScriptEnabled(
  id: string,
  name: string,
  enabled: boolean,
): Promise<void> {
  const email = await currentUserEmail();
  const { error } = await supabase
    .from(TABLE)
    .update({ enabled, updated_by: email })
    .eq("id", id);

  if (error) throw error;
  void recordAudit(id, name, enabled ? "enable" : "disable");
}

export async function deleteScript(id: string, name: string): Promise<void> {
  // Audit BEFORE deleting: after the row is gone we lose the context.
  await recordAudit(id, name, "delete");
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}

// ============================================================================
// Snippet parsing
// ============================================================================

export interface ParsedNode {
  kind: "external" | "inline" | "noscript" | "other";
  /** Host for external scripts, short preview otherwise. */
  detail: string;
}

export interface SnippetAnalysis {
  nodes: ParsedNode[];
  warnings: string[];
  externalHosts: string[];
  hasScript: boolean;
}

/**
 * Inspect a pasted snippet without executing it.
 *
 * DOMParser produces an inert document — nothing here runs, and that is the
 * point. It powers the "Found: 1 external script, 1 inline script" summary
 * that turns a blind paste into a confirmed one.
 */
export function analyseSnippet(snippet: string): SnippetAnalysis {
  const nodes: ParsedNode[] = [];
  const warnings: string[] = [];
  const externalHosts: string[] = [];

  const trimmed = snippet.trim();
  if (!trimmed) {
    return { nodes, warnings: ["Nothing pasted yet."], externalHosts, hasScript: false };
  }

  let doc: Document;
  try {
    doc = new DOMParser().parseFromString(trimmed, "text/html");
  } catch {
    return {
      nodes,
      warnings: ["This could not be read as HTML. Check the paste is complete."],
      externalHosts,
      hasScript: false,
    };
  }

  doc.querySelectorAll("script").forEach((el) => {
    const src = el.getAttribute("src");
    if (src) {
      let host = src;
      try {
        host = new URL(src, window.location.origin).host;
      } catch {
        /* keep raw src if unparseable */
      }
      externalHosts.push(host);
      nodes.push({ kind: "external", detail: host });
    } else {
      const body = (el.textContent ?? "").trim();
      nodes.push({
        kind: "inline",
        detail: body.slice(0, 60) + (body.length > 60 ? "…" : ""),
      });
    }
  });

  doc.querySelectorAll("noscript").forEach(() => {
    nodes.push({ kind: "noscript", detail: "fallback for visitors without JavaScript" });
  });

  const hasScript = nodes.some((n) => n.kind === "external" || n.kind === "inline");

  if (!hasScript) {
    warnings.push(
      "No <script> tag found. If you meant to paste a tracking snippet, it may be incomplete.",
    );
  }
  // document.write after page load blanks the entire document.
  if (/document\.write\s*\(/.test(trimmed)) {
    warnings.push(
      "This uses document.write, which will break the page when loaded this way. Ask the vendor for an async version.",
    );
  }
  const openTags = (trimmed.match(/<script\b/gi) ?? []).length;
  const closeTags = (trimmed.match(/<\/script>/gi) ?? []).length;
  if (openTags !== closeTags) {
    warnings.push("Unbalanced <script> tags — the paste looks truncated.");
  }

  return { nodes, warnings, externalHosts, hasScript };
}

/** Resolve the snippet actually injected: raw paste, or template + id. */
export function resolveSnippet(script: {
  snippet: string | null;
  template_key: string | null;
  template_id: string | null;
}): string {
  if (script.snippet && script.snippet.trim()) return script.snippet;
  const template = findTemplate(script.template_key);
  if (template && script.template_id) return template.build(script.template_id);
  return "";
}

// ============================================================================
// Injection
// ============================================================================

/**
 * Module-level guard. Lives outside React state deliberately so it survives
 * the remount that StrictMode forces in development — otherwise every tag
 * loads twice in dev and double-counts.
 */
const injected = new Set<string>();

export function hasInjected(id: string): boolean {
  return injected.has(id);
}

function targetElement(
  location: string,
  slotId: string | null,
): { parent: Element; prepend: boolean } | null {
  switch (location) {
    case "head":
      return { parent: document.head, prepend: false };
    case "body_start":
      return { parent: document.body, prepend: true };
    case "body_end":
      return { parent: document.body, prepend: false };
    case "slot": {
      if (!slotId) return null;
      const el = document.querySelector(`[data-script-slot="${CSS.escape(slotId)}"]`);
      return el ? { parent: el, prepend: false } : null;
    }
    default:
      return null;
  }
}

/**
 * Inject a script's markup into the document.
 *
 * Scripts are rebuilt with createElement rather than assigned via innerHTML.
 * Per the HTML spec, a <script> inserted through innerHTML is flagged
 * "already started" and never executes — the tag appears in DevTools and the
 * pixel silently never fires. This is the single most common way a tag
 * manager looks like it works while doing nothing.
 */
export function injectScript(script: PublicMarketingScript): boolean {
  if (injected.has(script.id)) return true;

  const target = targetElement(script.location, script.slot_id);
  if (!target) return false;

  const markup = resolveSnippet(script);
  if (!markup.trim()) return false;

  // Survives a full page reload where the module guard would be reset.
  if (document.querySelector(`[data-mkt-script-id="${CSS.escape(script.id)}"]`)) {
    injected.add(script.id);
    return true;
  }

  let doc: Document;
  try {
    doc = new DOMParser().parseFromString(markup, "text/html");
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn(`[Marketing] Could not parse "${script.name}":`, err);
    }
    return false;
  }

  const fragment = document.createDocumentFragment();

  // Preserve document order: GTM's bootstrap must run before anything that
  // expects window.dataLayer to exist.
  const source = [...Array.from(doc.head.childNodes), ...Array.from(doc.body.childNodes)];

  for (const node of source) {
    if (node.nodeType === Node.TEXT_NODE) continue;
    if (!(node instanceof Element)) continue;

    if (node.tagName === "SCRIPT") {
      const el = document.createElement("script");
      for (const attr of Array.from(node.attributes)) {
        el.setAttribute(attr.name, attr.value);
      }
      if (!node.getAttribute("src")) {
        el.textContent = node.textContent;
      }
      el.setAttribute("data-mkt-script-id", script.id);
      fragment.appendChild(el);
    } else {
      const clone = node.cloneNode(true) as Element;
      clone.setAttribute("data-mkt-script-id", script.id);
      fragment.appendChild(clone);
    }
  }

  if (!fragment.childNodes.length) return false;

  if (target.prepend) {
    target.parent.insertBefore(fragment, target.parent.firstChild);
  } else {
    target.parent.appendChild(fragment);
  }

  // Meta and TikTok use a <noscript> image to track JS-disabled visitors.
  // Dropping it silently loses that slice of data.
  if (script.noscript_html?.trim()) {
    const noscript = document.createElement("noscript");
    noscript.innerHTML = script.noscript_html;
    noscript.setAttribute("data-mkt-script-id", script.id);
    document.body.insertBefore(noscript, document.body.firstChild);
  }

  injected.add(script.id);
  if (import.meta.env.DEV) {
    console.log(`[Marketing] Injected "${script.name}" into ${script.location}`);
  }
  return true;
}

// ============================================================================
// Page targeting
// ============================================================================

/** Admin pages are never tracked — see shouldInjectOnPath. */
export function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function pathMatches(pathname: string, pattern: string): boolean {
  if (pattern.endsWith("/*")) {
    return pathname.startsWith(pattern.slice(0, -1));
  }
  return pathname === pattern;
}

/**
 * Admin routes are excluded unconditionally, whatever the configuration says:
 * staff traffic would pollute the owner's own marketing data, and admin pages
 * display candidate PII (names, emails, CV links) that must not be handed to
 * a third-party script.
 */
export function shouldInjectOnPath(
  script: Pick<PublicMarketingScript, "page_mode" | "page_paths">,
  pathname: string,
): boolean {
  if (isAdminPath(pathname)) return false;

  switch (script.page_mode) {
    case "all":
      return true;
    case "include":
      return script.page_paths.some((p) => pathMatches(pathname, p));
    case "exclude":
      return !script.page_paths.some((p) => pathMatches(pathname, p));
    default:
      return false;
  }
}

// ============================================================================
// Conversion signalling
// ============================================================================

interface TrackingWindow extends Window {
  dataLayer?: unknown[];
  fbq?: (...args: unknown[]) => void;
  ttq?: { track: (...a: unknown[]) => void; page: () => void };
  lintrk?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
}

/**
 * Tell every loaded vendor tag that a conversion happened.
 *
 * Deliberately dumb: no queueing, no retries, no server-side mirror. If a
 * pixel is not loaded the event is lost, which is the vendor's problem.
 * Building around that would mean building the analytics engine this system
 * explicitly does not own.
 *
 * Call AFTER a submission succeeds. Firing on click counts abandoned and
 * failed submissions as conversions, and the owner then optimises ad spend
 * against a number that never happened.
 */
export function fireConversion(
  eventName: string,
  payload: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;
  const w = window as TrackingWindow;

  try {
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: eventName, ...payload });
    w.fbq?.("track", metaEventName(eventName), payload);
    w.ttq?.track(tiktokEventName(eventName), payload);
    w.lintrk?.("track", { conversion_id: eventName });

    if (import.meta.env.DEV) {
      console.log("[Marketing] Conversion fired:", eventName, payload);
    }
  } catch (err) {
    // A broken vendor tag must never break form submission.
    if (import.meta.env.DEV) {
      console.warn("[Marketing] Conversion signal failed:", err);
    }
  }
}

function metaEventName(event: string): string {
  switch (event) {
    case "hiring_enquiry":
    case "contact_form":
      return "Lead";
    case "talent_application":
      return "SubmitApplication";
    default:
      return "Lead";
  }
}

function tiktokEventName(event: string): string {
  switch (event) {
    case "talent_application":
      return "SubmitForm";
    default:
      return "Contact";
  }
}

/** Re-announce a page view after SPA navigation. See MarketingScriptsProvider. */
export function notifyPageView(pathname: string): void {
  if (typeof window === "undefined") return;
  const w = window as TrackingWindow;

  try {
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({
      event: "page_view",
      page_path: pathname,
      page_title: document.title,
    });
    w.fbq?.("track", "PageView");
    w.ttq?.page();
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn("[Marketing] Page view signal failed:", err);
    }
  }
}
