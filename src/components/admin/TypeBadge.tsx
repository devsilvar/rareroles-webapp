interface TypeBadgeProps {
  type: "hiring" | "talent" | "contact";
  className?: string;
}

export function TypeBadge({ type, className = "" }: TypeBadgeProps) {
  const styles = {
    hiring: "bg-[#1e1b4b] text-white",
    talent: "bg-[#ec4899] text-white",
    contact: "bg-indigo-600 text-white",
  };

  const labels = {
    hiring: "Hiring",
    talent: "Talent",
    contact: "Contact",
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${styles[type]} ${className}`}>
      {labels[type]}
    </span>
  );
}
