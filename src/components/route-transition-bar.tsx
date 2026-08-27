import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * RouteTransitionBar
 *
 * Provides a minimal, ultra-sleek accent progress bar at the top of the viewport
 * whenever a route change occurs.
 */
export function RouteTransitionBar() {
  const location = useLocation();
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setAnimating(true);
    const timer = setTimeout(() => {
      setAnimating(false);
    }, 280);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!animating) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[99999] h-[2.5px] bg-transparent pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <div className="h-full w-full bg-gradient-to-r from-accent via-pink-400 to-purple-500 animate-pulse" />
    </div>
  );
}
