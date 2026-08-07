import { useEffect, useMemo, useState } from "react";
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import {
  LOCATION_HELP,
  LOCATION_LABELS,
  PLATFORM_LABELS,
  SCRIPT_TEMPLATES,
  TIMING_LABELS,
  findTemplate,
  type LoadTiming,
  type MarketingScript,
  type MarketingScriptDraft,
  type PageMode,
  type Platform,
  type ScriptLocation,
} from "../../types/marketing";
import { PUBLIC_PAGES, SCRIPT_SLOTS } from "../../constants/script-slots";
import { analyseSnippet } from "../../lib/marketing-scripts";

interface ScriptEditorProps {
  script: MarketingScript | null;
  onSave: (draft: MarketingScriptDraft) => Promise<void>;
  onClose: () => void;
}

const emptyDraft: MarketingScriptDraft = {
  name: "",
  platform: "custom",
  notes: null,
  snippet: "",
  template_key: null,
  template_id: null,
  noscript_html: null,
  location: "head",
  slot_id: null,
  page_mode: "all",
  page_paths: [],
  load_timing: "immediate",
  load_delay_ms: 0,
  priority: 50,
  enabled: false,
  spa_pageview: true,
};

export default function ScriptEditor({ script, onSave, onClose }: ScriptEditorProps) {
  const [draft, setDraft] = useState<MarketingScriptDraft>(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (script) {
      const { id, created_at, updated_at, created_by, updated_by, ...rest } = script;
      void id;
      void created_at;
      void updated_at;
      void created_by;
      void updated_by;
      setDraft(rest);
    } else {
      setDraft(emptyDraft);
    }
  }, [script]);

  const set = <K extends keyof MarketingScriptDraft>(
    key: K,
    value: MarketingScriptDraft[K],
  ) => setDraft((d) => ({ ...d, [key]: value }));

  const analysis = useMemo(
    () => analyseSnippet(draft.snippet ?? ""),
    [draft.snippet],
  );

  const template = findTemplate(draft.template_key);

  /** Fill the paste box from a vendor template so the owner only types an ID. */
  const applyTemplate = (key: string, id: string) => {
    const t = findTemplate(key);
    if (!t) return;
    setDraft((d) => ({
      ...d,
      template_key: key,
      template_id: id,
      platform: t.platform,
      snippet: id ? t.build(id) : "",
      noscript_html: id && t.buildNoscript ? t.buildNoscript(id) : d.noscript_html,
      location: t.recommendedLocation,
      name: d.name || t.label,
    }));
  };

  const togglePage = (paths: string[]) => {
    setDraft((d) => {
      const has = paths.every((p) => d.page_paths.includes(p));
      const next = has
        ? d.page_paths.filter((p) => !paths.includes(p))
        : [...new Set([...d.page_paths, ...paths])];
      return { ...d, page_paths: next };
    });
  };

  const validationError = (): string | null => {
    if (!draft.name.trim()) return "Give this script a name so you can recognise it later.";
    const hasSnippet = !!draft.snippet?.trim();
    const hasTemplate = !!draft.template_key && !!draft.template_id;
    if (!hasSnippet && !hasTemplate) {
      return "Paste a script, or pick a platform and enter its ID.";
    }
    if (draft.location === "slot" && !draft.slot_id) {
      return "Choose which spot on the page this should go into.";
    }
    if (draft.page_mode !== "all" && draft.page_paths.length === 0) {
      return "Select at least one page, or switch back to \"All pages\".";
    }
    return null;
  };

  const handleSave = async () => {
    const problem = validationError();
    if (problem) {
      setError(problem);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      // Admin pages are never tracked; strip them rather than silently ignoring.
      const cleanPaths = draft.page_paths.filter((p) => !p.startsWith("/admin"));
      await onSave({
        ...draft,
        page_paths: cleanPaths,
        notes: draft.notes?.trim() ? draft.notes : null,
        load_delay_ms: draft.load_timing === "delay" ? draft.load_delay_ms : 0,
        slot_id: draft.location === "slot" ? draft.slot_id : null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-50 h-full overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-5 py-3.5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {script ? "Edit script" : "Add a script"}
            </h2>
            <p className="text-xs text-slate-500">
              Paste a tag from Google, Meta, LinkedIn or TikTok and choose where it loads.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* 1. Identity */}
          <Section step="1" title="What is this?">
            <Field label="Name">
              <input
                value={draft.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Meta Pixel — lead tracking"
                className={inputClass}
              />
            </Field>
            <Field label="Platform">
              <select
                value={draft.platform}
                onChange={(e) => set("platform", e.target.value as Platform)}
                className={inputClass}
              >
                {Object.entries(PLATFORM_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Notes (optional)">
              <input
                value={draft.notes ?? ""}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Anything you want to remember about this tag"
                className={inputClass}
              />
            </Field>
          </Section>

          {/* 2. Payload */}
          <Section step="2" title="Paste your code">
            <div className="mb-3">
              <p className="text-xs font-semibold text-slate-600 mb-1.5">
                Only have an ID? Pick your platform and we'll build the snippet.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SCRIPT_TEMPLATES.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => applyTemplate(t.key, draft.template_id ?? "")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                      draft.template_key === t.key
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
                {draft.template_key && (
                  <button
                    type="button"
                    onClick={() =>
                      setDraft((d) => ({ ...d, template_key: null, template_id: null }))
                    }
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-500 hover:text-red-600"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {template && (
              <Field label={template.idLabel}>
                <input
                  value={draft.template_id ?? ""}
                  onChange={(e) => applyTemplate(template.key, e.target.value.trim())}
                  placeholder={template.idPlaceholder}
                  className={inputClass}
                />
                <p className="text-[11px] text-slate-500 mt-1">{template.help}</p>
                {draft.template_id && !template.idPattern.test(draft.template_id) && (
                  <p className="text-[11px] text-amber-600 mt-1">
                    That doesn't look like a usual {template.idLabel} — double-check it.
                  </p>
                )}
              </Field>
            )}

            <Field label="Script">
              <textarea
                value={draft.snippet ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, snippet: e.target.value, template_key: null }))
                }
                rows={10}
                spellCheck={false}
                placeholder={"<!-- Paste the full snippet the platform gave you -->\n<script>...</script>"}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono text-[11px] leading-relaxed text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300"
              />
            </Field>

            {/* Live parse summary — turns a blind paste into a confirmed one */}
            {!!(draft.snippet ?? "").trim() && (
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-[11px] font-bold text-slate-700 mb-2">What we found</p>
                {analysis.nodes.length === 0 && (
                  <p className="text-[11px] text-slate-500">No recognisable tags.</p>
                )}
                <ul className="space-y-1">
                  {analysis.nodes.map((node, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                      {node.kind === "external" && <CodeBracketIcon className="w-3.5 h-3.5 mt-px text-indigo-500 shrink-0" />}
                      {node.kind === "inline" && <DocumentTextIcon className="w-3.5 h-3.5 mt-px text-indigo-500 shrink-0" />}
                      {node.kind === "noscript" && <PhotoIcon className="w-3.5 h-3.5 mt-px text-slate-400 shrink-0" />}
                      <span>
                        <b className="text-slate-800">
                          {node.kind === "external"
                            ? "Loads from"
                            : node.kind === "inline"
                              ? "Inline code"
                              : "No-JavaScript fallback"}
                        </b>{" "}
                        {node.detail}
                      </span>
                    </li>
                  ))}
                </ul>
                {analysis.warnings.map((w, i) => (
                  <p key={i} className="flex items-start gap-1.5 text-[11px] text-amber-700 mt-2">
                    <ExclamationTriangleIcon className="w-3.5 h-3.5 mt-px shrink-0" />
                    {w}
                  </p>
                ))}
                {analysis.hasScript && analysis.warnings.length === 0 && (
                  <p className="flex items-center gap-1.5 text-[11px] text-emerald-600 mt-2">
                    <CheckCircleIcon className="w-3.5 h-3.5" />
                    Looks like a valid tracking snippet.
                  </p>
                )}
              </div>
            )}
          </Section>

          {/* 3. Location */}
          <Section step="3" title="Where should it go?">
            <div className="space-y-2">
              {(Object.keys(LOCATION_LABELS) as ScriptLocation[]).map((loc) => (
                <label
                  key={loc}
                  className={`flex gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                    draft.location === loc
                      ? "border-indigo-300 bg-indigo-50/60"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    checked={draft.location === loc}
                    onChange={() => set("location", loc)}
                    className="mt-0.5 accent-indigo-600"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800">{LOCATION_LABELS[loc]}</p>
                    <p className="text-[11px] text-slate-500">{LOCATION_HELP[loc]}</p>
                  </div>
                </label>
              ))}
            </div>

            {draft.location === "slot" && (
              <Field label="Which spot?">
                <select
                  value={draft.slot_id ?? ""}
                  onChange={(e) => set("slot_id", e.target.value || null)}
                  className={inputClass}
                >
                  <option value="">Choose a spot…</option>
                  {SCRIPT_SLOTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Need a spot that isn't listed? Ask your developer to add one.
                </p>
              </Field>
            )}
          </Section>

          {/* 4. Pages */}
          <Section step="4" title="Which pages?">
            <div className="flex gap-1.5 mb-3">
              {(["all", "include", "exclude"] as PageMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => set("page_mode", mode)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                    draft.page_mode === mode
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  {mode === "all" ? "All pages" : mode === "include" ? "Only these" : "All except"}
                </button>
              ))}
            </div>

            {draft.page_mode !== "all" && (
              <div className="space-y-1.5">
                {PUBLIC_PAGES.map((page) => {
                  const checked = page.paths.every((p) => draft.page_paths.includes(p));
                  return (
                    <label
                      key={page.key}
                      className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-indigo-300"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePage(page.paths)}
                        className="accent-indigo-600"
                      />
                      <span className="text-xs font-semibold text-slate-800">{page.label}</span>
                      <span className="text-[10px] text-slate-400 ml-auto font-mono">
                        {page.paths.join("  ")}
                      </span>
                    </label>
                  );
                })}
                <p className="text-[11px] text-slate-500 pt-1">
                  Pages with two addresses are handled together, so a visitor arriving at either one is tracked.
                </p>
              </div>
            )}
            <p className="text-[11px] text-slate-500 mt-2">
              Admin pages are never tracked.
            </p>
          </Section>

          {/* 5. Timing & order */}
          <Section step="5" title="When should it load?">
            <Field label="Timing">
              <select
                value={draft.load_timing}
                onChange={(e) => set("load_timing", e.target.value as LoadTiming)}
                className={inputClass}
              >
                {(Object.keys(TIMING_LABELS) as LoadTiming[]).map((t) => (
                  <option key={t} value={t}>
                    {TIMING_LABELS[t]}
                  </option>
                ))}
              </select>
            </Field>

            {draft.load_timing === "consent" && (
              <p className="flex items-start gap-1.5 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">
                <ExclamationTriangleIcon className="w-3.5 h-3.5 mt-px shrink-0" />
                There is no cookie consent banner on this site yet, so a script set to this
                option will never load. Leave it on another setting until one is added.
              </p>
            )}

            {draft.load_timing === "delay" && (
              <Field label="Delay (milliseconds)">
                <input
                  type="number"
                  min={0}
                  max={30000}
                  value={draft.load_delay_ms}
                  onChange={(e) => set("load_delay_ms", Number(e.target.value))}
                  className={inputClass}
                />
              </Field>
            )}

            <Field label="Order">
              <input
                type="number"
                min={0}
                max={100}
                value={draft.priority}
                onChange={(e) => set("priority", Number(e.target.value))}
                className={inputClass}
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Lower numbers load first. Put Google Tag Manager low (e.g. 10) so it starts
                before anything that depends on it.
              </p>
            </Field>

            <label className="flex items-start gap-2 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={draft.spa_pageview}
                onChange={(e) => set("spa_pageview", e.target.checked)}
                className="mt-0.5 accent-indigo-600"
              />
              <span>
                <span className="block text-xs font-bold text-slate-800">
                  Count a page view when visitors move between pages
                </span>
                <span className="block text-[11px] text-slate-500">
                  Keep this on. Without it the platform only ever counts the first page a
                  visitor lands on.
                </span>
              </span>
            </label>
          </Section>

          {/* 6. Publish */}
          <Section step="6" title="Go live">
            <label className="flex items-start gap-2 p-3 rounded-lg bg-white border-2 border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={draft.enabled}
                onChange={(e) => set("enabled", e.target.checked)}
                className="mt-0.5 accent-emerald-600 w-4 h-4"
              />
              <span>
                <span className="block text-xs font-bold text-slate-800">
                  Active on the live website
                </span>
                <span className="block text-[11px] text-slate-500">
                  Changes take effect the next time a visitor loads a page.
                </span>
              </span>
            </label>
          </Section>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
              <ExclamationTriangleIcon className="w-4 h-4 text-red-500 mt-px shrink-0" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-5 py-3 flex gap-2 justify-end">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? "Saving…" : script ? "Save changes" : "Add script"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300 transition-all";

function Section({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
          {step}
        </span>
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">{title}</h3>
      </div>
      <div className="space-y-3 pl-7">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-slate-600 mb-1">{label}</label>
      {children}
    </div>
  );
}
