interface StatusBadgeProps {
  contacted: boolean;
  className?: string;
}

export function StatusBadge({ contacted, className = "" }: StatusBadgeProps) {
  if (contacted) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Contacted
      </span>
    );
  }
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
      Pending
    </span>
  );
}
