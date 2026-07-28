import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ value, duration = 2000, className = "" }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateCounter();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounter = () => {
    // Extract numeric value from string (handles decimals like "3.2")
    const numericMatch = value.match(/\d+\.?\d*/);
    if (!numericMatch) return;

    const targetValue = parseFloat(numericMatch[0]);
    const isDecimal = value.includes(".");
    
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation (ease-out-cubic)
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentCount = easeOutCubic * targetValue;
      
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(targetValue);
      }
    };
    
    animate();
  };

  // Format the display value
  const getDisplayValue = () => {
    // Handle "60d" format
    if (value.includes("d") && !value.includes("days")) {
      return `${Math.round(count)}d`;
    }
    // Handle "3.2×" format
    else if (value.includes("×")) {
      return `${count.toFixed(1)}×`;
    }
    // Handle "87%" format
    else if (value.includes("%")) {
      return `${Math.round(count)}%`;
    }
    // Handle range like "5-7 days"
    else if (value.includes("-")) {
      const parts = value.split("-");
      return `${parts[0]}-${Math.round(count)} ${value.split(" ").slice(1).join(" ")}`;
    }
    // Handle "1000+" format
    else if (value.includes("+")) {
      return `${Math.round(count).toLocaleString()}+`;
    }
    
    return Math.round(count).toString();
  };

  return (
    <div ref={elementRef} className={className}>
      {getDisplayValue()}
    </div>
  );
}
