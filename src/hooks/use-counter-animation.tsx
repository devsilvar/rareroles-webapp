import { useEffect, useRef, useState } from "react";

interface UseCounterAnimationOptions {
  end: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  separator?: string;
}

/**
 * Custom hook for animating numbers with Intersection Observer
 * Triggers animation when element comes into view
 */
export function useCounterAnimation({
  end,
  duration = 2000,
  decimals = 0,
  suffix = "",
  prefix = "",
  separator = "",
}: UseCounterAnimationOptions) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  // Intersection Observer to detect when element is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            setIsVisible(true);
            hasAnimated.current = true;
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of element is visible
        rootMargin: "0px",
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  // Animate the counter
  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const endTime = startTime + duration;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function for smooth animation (easeOutExpo)
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentCount = easeOutExpo * end;
      setCount(currentCount);

      if (now < endTime) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  // Format the number with decimals, separators, prefix and suffix
  const formattedCount = (() => {
    const rounded = decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toString();
    const parts = rounded.split(".");
    
    // Add thousand separators if specified
    if (separator) {
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    }
    
    const formatted = parts.join(".");
    return `${prefix}${formatted}${suffix}`;
  })();

  return { ref: elementRef, count: formattedCount, isAnimating: isVisible };
}
