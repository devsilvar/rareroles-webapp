import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  PlusIcon,
  MegaphoneIcon,
  PencilSquareIcon,
  TrashIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import DashboardLayout from "../../components/admin/DashboardLayout";
import ScriptEditor from "../../components/admin/ScriptEditor";
import {
  Badge,
  Card,
  EmptyState,
  LoadingSpinner,
} from "../../components/admin/AdminUIComponents";
import {
  createScript,
  deleteScript,
  fetchAllScripts,
  setScriptEnabled,
  updateScript,
} from "../../lib/marketing-scripts";
import {
  LOCATION_LABELS,
  PLATFORM_LABELS,
  TIMING_LABELS,
  type MarketingScript,
  type MarketingScriptDraft,
} from "../../types/marketing";
import { describePaths, SCRIPT_SLOTS } from "../../constants/script-slots";

export default function MarketingScriptsPage() {
  const [scripts, setScripts] = useState<MarketingScript[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<MarketingScript | null>(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setScripts(await fetchAllScripts());
    } catch (err) {
      console.error("[Marketing] Load failed:", err);
      toast.error("Could not load scripts", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleSave = async (draft: MarketingScriptDraft) => {
    if (editing) {
      await updateScript(editing.id, draft);
      toast.success("Script updated", {
        description: "Changes apply the next time a visitor loads a page.",
      });
    } else {
      await createScript(draft);
      toast.success("Script added", {
        description: draft.enabled
          ? "It is now live on the website."
          : "Saved as a draft — switch it on when you're ready.",
      });
    }
    setEditing(null);
    setCreating(false);
    await load();
  };

  const handleToggle = async (script: MarketingScript) => {
    const next = !script.enabled;
    // Optimistic: the switch should feel instant.
    setScripts((prev) =>
      prev.map((s) => (s.id === script.id ? { ...s, enabled: next } : s)),
    );
    try {
      await setScriptEnabled(script.id, script.name, next);
      toast.success(next ? `"${script.name}" is live` : `"${script.name}" switched off`, {
        description: next
          ? "It will load for visitors from their next page load."
          : "Visitors already on the site keep it until they reload.",
      });
    } catch (err) {
      setScripts((prev) =>
        prev.map((s) => (s.id === script.id ? { ...s, enabled: !next } : s)),
      );
      toast.error("Could not change that", {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  };

  const handleDelete = async (script: MarketingScript) => {
    if (!window.confirm(`Delete "${script.name}"? This cannot be undone.`)) return;
    try {
      await deleteScript(script.id, script.name);
      toast.success("Script deleted");
      await load();
    } catch (err) {
      toast.error("Could not delete", {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  };

  const liveCount = scripts.filter((s) => s.enabled).length;

  return (
    <DashboardLayout
      title="Marketing Scripts"
      subtitle="Add tracking tags from Google, Meta, LinkedIn or TikTok and choose where they load"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Badge variant={liveCount > 0 ? "success" : "default"} size="md">
            {liveCount} live
          </Badge>
          <span className="text-xs text-slate-500">
            {scripts.length} total
          </span>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setCreating(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95"
        >
          <PlusIcon className="w-4 h-4" />
          Add script
        </button>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-100 mb-4">
        <InformationCircleIcon className="w-4 h-4 text-blue-500 mt-px shrink-0" />
        <p className="text-[11px] text-blue-800 leading-relaxed">
          Reporting stays where it already lives — Google Ads, Meta Events Manager,
          LinkedIn Campaign Manager and TikTok Ads Manager. This page only decides which
          tags run on your website and where. Changes take effect on a visitor's next page
          load.
        </p>
      </div>

      {loading ? (
        <div className="py-16">
          <LoadingSpinner text="Loading scripts..." />
        </div>
      ) : scripts.length === 0 ? (
        <Card>
          <EmptyState
            icon={MegaphoneIcon}
            title="No scripts yet"
            description="Add your first tracking tag — you only need the snippet or ID from the platform."
          />
        </Card>
      ) : (
        <div className="space-y-2">
          {scripts.map((script) => (
            <Card key={script.id} className="flex items-center gap-3">
              <button
                onClick={() => handleToggle(script)}
                role="switch"
                aria-checked={script.enabled}
                aria-label={`${script.enabled ? "Disable" : "Enable"} ${script.name}`}
                className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${
                  script.enabled ? "bg-emerald-500" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                    script.enabled ? "left-4.5" : "left-0.5"
                  }`}
                />
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-slate-900 truncate">{script.name}</p>
                  <Badge variant={script.enabled ? "success" : "default"}>
                    {script.enabled ? "Live" : "Draft"}
                  </Badge>
                  <Badge variant="info">{PLATFORM_LABELS[script.platform]}</Badge>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {script.location === "slot"
                    ? SCRIPT_SLOTS.find((s) => s.id === script.slot_id)?.label ??
                      "a specific spot"
                    : LOCATION_LABELS[script.location]}
                  {" · "}
                  {script.page_mode === "all"
                    ? "all pages"
                    : script.page_mode === "include"
                      ? `only ${describePaths(script.page_paths)}`
                      : `all except ${describePaths(script.page_paths)}`}
                  {" · "}
                  {TIMING_LABELS[script.load_timing].toLowerCase()}
                  {" · order "}
                  {script.priority}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => {
                    setCreating(false);
                    setEditing(script);
                  }}
                  aria-label={`Edit ${script.name}`}
                  className="p-2 rounded-lg text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(script)}
                  aria-label={`Delete ${script.name}`}
                  className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {(creating || editing) && (
        <ScriptEditor
          script={editing}
          onSave={handleSave}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
        />
      )}
    </DashboardLayout>
  );
}
