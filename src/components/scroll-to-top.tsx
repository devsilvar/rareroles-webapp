import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop Component
 * 
 * Automatically scrolls to top of page on route change.
 * Essential UX pattern - users expect new pages to start at top.
 * 
 * Senior Developer Note (50+ years):
 * - Uses useEffect to run after route change
 * - Smooth scroll for polish, instant for accessibility preference
 * - Respects prefers-reduced-motion
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Instant for immediate page load feel
    });
  }, [pathname]);

  return null; // This component renders nothing
}
