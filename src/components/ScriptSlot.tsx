/**
 * A named anchor a marketing script can be injected into.
 *
 * Renders nothing visible — it exists purely to give the owner a stable,
 * human-readable target ("Contact — below the form") instead of a CSS
 * selector that breaks silently on the next redesign.
 *
 * To add a slot: place this component where you want it and register the same
 * id in src/constants/script-slots.ts so it appears in the admin dropdown.
 */
export function ScriptSlot({ id }: { id: string }) {
  return <div data-script-slot={id} aria-hidden="true" />;
}

export default ScriptSlot;
