/**
 * Shared Admin UI Components
 * Professional, compact, modern design
 */

import { ReactNode } from "react";

// Card Component - Compact and professional
interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = "", hover = false, onClick }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg p-4 shadow-sm border border-slate-200/60 ${
        hover ? "hover:shadow-md hover:border-slate-300/60 transition-all duration-200" : ""
      } ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// Section Header - Compact with icon
interface SectionHeaderProps {
  icon: any;
  title: string;
  subtitle?: string;
  iconBgColor?: string;
  children?: ReactNode;
}

export function SectionHeader({ icon: Icon, title, subtitle, iconBgColor = "bg-indigo-50", children }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        <div className={`p-2 rounded-lg ${iconBgColor}`}>
          <Icon className="w-4 h-4 text-inherit" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

// Badge Component - Compact status badge
interface BadgeProps {
  children: ReactNode;
  variant?: "success" | "danger" | "warning" | "info" | "default";
  size?: "sm" | "md";
}

export function Badge({ children, variant = "default", size = "sm" }: BadgeProps) {
  const colors = {
    success: "bg-emerald-50 text-emerald-600",
    danger: "bg-red-50 text-red-600",
    warning: "bg-orange-50 text-orange-600",
    info: "bg-blue-50 text-blue-600",
    default: "bg-slate-100 text-slate-700",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span className={`inline-flex items-center rounded-full font-bold ${colors[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
}

// Button Component - Compact and modern
interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
  icon?: any;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function Button({ 
  children, 
  variant = "primary", 
  size = "sm", 
  icon: Icon, 
  onClick, 
  disabled = false,
  className = ""
}: ButtonProps) {
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300",
    danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}

// Input Component - Compact and clean
interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  icon?: any;
  className?: string;
}

export function Input({ type = "text", placeholder, value, onChange, icon: Icon, className = "" }: InputProps) {
  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full ${Icon ? "pl-9" : "pl-3"} pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300 focus:bg-white transition-all ${className}`}
      />
    </div>
  );
}

// Select Component - Compact dropdown
interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}

export function Select({ value, onChange, options, className = "" }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300 transition-all cursor-pointer ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

// Avatar Component - Compact user avatar
interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  gradient?: string;
}

export function Avatar({ name, size = "md", gradient = "from-indigo-600 to-purple-600" }: AvatarProps) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`rounded-lg bg-gradient-to-br ${gradient} text-white flex items-center justify-center font-bold shadow-sm ${sizes[size]}`}>
      {initials}
    </div>
  );
}

// Empty State Component - For no data
interface EmptyStateProps {
  icon: any;
  title: string;
  description?: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Icon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <p className="text-sm font-semibold text-slate-700 mb-1">{title}</p>
      {description && <p className="text-xs text-slate-500">{description}</p>}
    </div>
  );
}

// Loading Spinner - Compact loader
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function LoadingSpinner({ size = "md", text }: LoadingSpinnerProps) {
  const sizes = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4",
  };

  return (
    <div className="text-center">
      <div className={`${sizes[size]} border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3`} />
      {text && <p className="text-sm text-slate-700 font-semibold">{text}</p>}
    </div>
  );
}

// Info Row Component - For detail views
interface InfoRowProps {
  icon: any;
  label: string;
  value: string | ReactNode;
  iconColor?: string;
}

export function InfoRow({ icon: Icon, label, value, iconColor = "text-slate-600" }: InfoRowProps) {
  return (
    <div className="flex items-start gap-2.5 py-2">
      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconColor}`} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-500 mb-0.5">{label}</p>
        <p className="text-sm text-slate-900 break-words">{value}</p>
      </div>
    </div>
  );
}

// Stats Grid - For overview cards
interface StatGridProps {
  children: ReactNode;
  cols?: 2 | 3 | 4;
}

export function StatGrid({ children, cols = 4 }: StatGridProps) {
  const colsClass = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid grid-cols-1 ${colsClass[cols]} gap-3`}>
      {children}
    </div>
  );
}
