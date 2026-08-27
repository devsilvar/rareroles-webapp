import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import "./styles/admin.css";

// Use hydrateRoot to preserve prerendered HTML for SEO
const rootElement = document.getElementById("root")!;

// Check if we have prerendered content
if (rootElement.hasChildNodes()) {
  // Hydrate if content exists (from SSR/prerendering)
  hydrateRoot(
    rootElement,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // Fallback to createRoot for development
  const ReactDOM = await import("react-dom/client");
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
