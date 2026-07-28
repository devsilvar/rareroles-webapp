import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import {
  BriefcaseIcon,
  RocketLaunchIcon,
  XMarkIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

type GetStartedContextValue = {
  open: (view?: "choice" | "hiring" | "talent", prefillRole?: string) => void;
  close: () => void;
};

const GetStartedContext = createContext<GetStartedContextValue | null>(null);

export function useGetStarted() {
  const ctx = useContext(GetStartedContext);
  if (!ctx) {
    throw new Error("useGetStarted must be used within a GetStartedProvider");
  }
  return ctx;
}

type Choice = {
  to: string;
  title: string;
  description: string;
  icon: typeof BriefcaseIcon;
  action?: "hiring" | "talent";
};

const choices: Choice[] = [
  {
    to: "/companies",
    title: "I'm hiring talent",
    description: "Tell us the role — we'll find the right people",
    icon: BriefcaseIcon,
    action: "hiring",
  },
  {
    to: "/talent",
    title: "I'm looking for opportunities",
    description: "Share your profile and get matched to roles",
    icon: RocketLaunchIcon,
    action: "talent",
  },
];

const HIRING_EMAIL = "hello@rareroles.com";
const MAX_ROLES = 5;

type RoleRow = { id: number; title: string; count: number };

type View = "choice" | "hiring" | "talent" | "sent";

export function GetStartedProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<View>("choice");
  const [roles, setRoles] = useState<RoleRow[]>([{ id: 1, title: "", count: 1 }]);
  const navigate = useNavigate();

  const open = useCallback((next: "choice" | "hiring" | "talent" = "choice", prefillRole = "") => {
    setView(next);
    setRoles([{ id: 1, title: prefillRole, count: 1 }]);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  const addRole = () =>
    setRoles((prev) =>
      prev.length >= MAX_ROLES
        ? prev
        : [...prev, { id: (prev[prev.length - 1]?.id ?? 0) + 1, title: "", count: 1 }],
    );

  const removeRole = (id: number) =>
    setRoles((prev) => (prev.length <= 1 ? prev : prev.filter((r) => r.id !== id)));

  const updateRoleTitle = (id: number, title: string) =>
    setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, title } : r)));

  const updateRoleCount = (id: number, delta: number) =>
    setRoles((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, count: Math.max(1, Math.min(99, r.count + delta)) } : r,
      ),
    );

  const handleSelect = (choice: Choice) => {
    if (choice.action === "hiring") {
      setView("hiring");
      return;
    }
    if (choice.action === "talent") {
      setView("talent");
      return;
    }
    setIsOpen(false);
    navigate(choice.to);
  };

  const handleHiringSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const company = String(data.get("company") ?? "");
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const seniority = String(data.get("seniority") ?? "");
    const timeline = String(data.get("timeline") ?? "");
    const details = String(data.get("details") ?? "");

    const roleLines = roles
      .filter((r) => r.title.trim())
      .map((r) => `  • ${r.title.trim()} × ${r.count}`);

    const subject = `Hiring enquiry — ${company || name}`;
    const body = [
      `Company: ${company}`,
      `Contact: ${name}`,
      `Email: ${email}`,
      "",
      "Roles:",
      ...roleLines,
      "",
      seniority ? `Seniority: ${seniority}` : null,
      timeline ? `Timeline: ${timeline}` : null,
      details ? "" : null,
      details ? "Details:" : null,
      details || null,
    ]
      .filter((line) => line !== null)
      .join("\n");

    window.location.href = `mailto:${HIRING_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setView("sent");
  };

  const handleTalentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const role = String(data.get("role") ?? "");
    const experience = String(data.get("experience") ?? "");
    const location = String(data.get("location") ?? "");
    const links = String(data.get("links") ?? "");
    const about = String(data.get("about") ?? "");

    const subject = `Talent profile — ${name}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Desired role: ${role}`,
      experience ? `Experience: ${experience}` : null,
      location ? `Location / remote: ${location}` : null,
      links ? `Links: ${links}` : null,
      about ? "" : null,
      about ? "About:" : null,
      about || null,
    ]
      .filter((line) => line !== null)
      .join("\n");

    window.location.href = `mailto:${HIRING_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setView("sent");
  };

  return (
    <GetStartedContext.Provider value={value}>
      {children}

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            style={{ zIndex: 9998 }}
          />

          <Dialog.Content
              className="fixed left-[50%] top-[50%] z-[9999] w-[calc(100vw-2rem)] max-w-[28rem] -translate-x-1/2 -translate-y-1/2 flex flex-col bg-white p-0 font-sans shadow-2xl shadow-black/40"
              style={{
                maxHeight: "calc(100vh - 2rem)",
              }}
            >
              <Dialog.Title
                style={{
                  position: "absolute",
                  width: "1px",
                  height: "1px",
                  padding: 0,
                  margin: "-1px",
                  overflow: "hidden",
                  clip: "rect(0, 0, 0, 0)",
                  whiteSpace: "nowrap",
                  border: 0,
                }}
              >
                Get Started
              </Dialog.Title>
              <Dialog.Description
                style={{
                  position: "absolute",
                  width: "1px",
                  height: "1px",
                  padding: 0,
                  margin: "-1px",
                  overflow: "hidden",
                  clip: "rect(0, 0, 0, 0)",
                  whiteSpace: "nowrap",
                  border: 0,
                }}
              >
                Choose how you want to get started
              </Dialog.Description>

              {view === "choice" && (
                <div className="relative overflow-hidden">
                  {/* HERO HEADER - Brand Colors */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-ink via-primary to-accent px-6 pt-5 pb-6">
                    {/* Animated background patterns */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute -left-4 top-0 h-32 w-32 rounded-full bg-white blur-3xl animate-pulse" />
                      <div className="absolute right-0 top-8 h-24 w-24 rounded-full bg-white blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
                      <div className="absolute bottom-0 left-1/2 h-40 w-40 rounded-full bg-white blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                    </div>

                    {/* Close button */}
                    <div className="absolute right-6 top-6 z-10">
                      <Dialog.Close
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                        aria-label="Close"
                      >
                        <XMarkIcon className="h-5 w-5" strokeWidth={2.5} />
                      </Dialog.Close>
                    </div>

                    {/* Hero content */}
                    <div className="relative z-10 text-center">
                      {/* Better structured headline */}
                      <div className="space-y-1">
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
                          Welcome to RareRoles
                        </p>
                        <h2 className="text-[26px] font-extrabold leading-tight tracking-tight text-white drop-shadow-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          How can we help you?
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* CHOICE CARDS */}
                  <div className="p-5 pt-4">
                    <div className="space-y-2">
                      {choices.map((choice, idx) => (
                        <button
                          key={choice.to}
                          type="button"
                          onClick={() => handleSelect(choice)}
                          className="group relative flex w-full items-center gap-3 overflow-hidden border border-border bg-white p-3 text-left transition-all duration-200 hover:border-accent hover:bg-accent/5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                        >
                          {/* Icon - Brand colors */}
                          <choice.icon 
                            className="h-6 w-6 shrink-0 text-ink/60 transition-colors duration-200 group-hover:text-accent" 
                            strokeWidth={2} 
                          />

                          {/* Content */}
                          <div className="min-w-0 flex-1">
                            <h3 className="text-[15px] font-bold leading-tight text-foreground transition-colors duration-200 group-hover:text-accent" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              {choice.title}
                            </h3>
                            <p className="mt-1 text-[12px] leading-snug text-ink-muted">
                              {choice.description}
                            </p>
                          </div>

                          {/* Arrow - Brand color */}
                          <ArrowRightIcon className="h-4 w-4 shrink-0 text-ink/40 transition-colors duration-200 group-hover:text-accent" strokeWidth={2} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {view === "hiring" && (
                <div className="flex min-h-0 max-h-[calc(100vh-4rem)] flex-col">
                  {/* Header - Brand Colors */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-ink via-primary to-accent px-6 py-5">
                    {/* Back button */}
                    <button
                      type="button"
                      onClick={() => setView("choice")}
                      className="absolute left-6 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                    >
                      <ArrowLeftIcon className="h-4 w-4" />
                    </button>

                    {/* Header text - Same style as choice modal */}
                    <div className="text-center">
                      <div className="space-y-1">
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
                          For Companies
                        </p>
                        <h2 className="text-[22px] font-extrabold leading-tight tracking-tight text-white drop-shadow-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          Tell us who you need
                        </h2>
                      </div>
                    </div>

                    {/* Close button */}
                    <Dialog.Close
                      className="absolute right-6 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                      aria-label="Close"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </Dialog.Close>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleHiringSubmit} className="flex min-h-0 flex-col">
                    <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
                      {/* Company & Contact */}
                      <div className="space-y-4">
                        <label className="block">
                          <span className="mb-1.5 block text-sm font-semibold text-slate-900">
                            Company Name <span className="text-accent">*</span>
                          </span>
                          <input
                            type="text"
                            name="company"
                            required
                            placeholder="Acme Inc."
                            className="w-full rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 hover:border-slate-400 focus:border-[#E91E63] focus:outline-none"
                          />
                        </label>

                        <div className="grid grid-cols-2 gap-3">
                          <label className="block">
                            <span className="mb-1.5 block text-sm font-semibold text-slate-900">
                              Your Name <span className="text-accent">*</span>
                            </span>
                            <input
                              type="text"
                              name="name"
                              required
                              placeholder="John Doe"
                              className="w-full rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 hover:border-slate-400 focus:border-[#E91E63] focus:outline-none"
                            />
                          </label>

                          <label className="block">
                            <span className="mb-1.5 block text-sm font-semibold text-slate-900">
                              Work Email <span className="text-accent">*</span>
                            </span>
                            <input
                              type="email"
                              name="email"
                              required
                              placeholder="john@acme.com"
                              className="w-full rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 hover:border-slate-400 focus:border-[#E91E63] focus:outline-none"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Role Details - Enhanced with dropdown and quantity */}
                      <div className="space-y-4 border-t border-slate-200 pt-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-slate-900">Roles Needed</h3>
                          <span className="text-xs text-slate-500">{roles.length} / {MAX_ROLES}</span>
                        </div>

                        {roles.map((role, idx) => (
                          <div key={role.id} className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                            {/* Role Selector */}
                            <label className="block">
                              <span className="mb-1.5 block text-xs font-semibold text-slate-700">
                                Role Title <span className="text-[#E91E63]">*</span>
                              </span>
                              <select
                                value={role.title}
                                onChange={(e) => updateRoleTitle(role.id, e.target.value)}
                                required
                                className="w-full rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm text-slate-900 font-medium transition-all duration-200 hover:border-slate-400 focus:border-[#E91E63] focus:outline-none appearance-none cursor-pointer"
                                style={{
                                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23E91E63'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                  backgroundRepeat: 'no-repeat',
                                  backgroundPosition: 'right 1.25rem center',
                                  backgroundSize: '1.25rem',
                                  paddingRight: '3rem'
                                }}
                              >
                                <option value="">Select a role</option>
                                <option value="Oracle PL/SQL Developer">Oracle PL/SQL Developer</option>
                                <option value="CCIE Network Engineer">CCIE Network Engineer</option>
                                <option value="AIX System Administrator">AIX System Administrator</option>
                                <option value="SharePoint Engineer">SharePoint Engineer</option>
                                <option value="AI / Machine Learning Engineer">AI / Machine Learning Engineer</option>
                                <option value="AI Automation Engineer">AI Automation Engineer</option>
                                <option value="Solution Architect">Solution Architect</option>
                                <option value="Custom Role">Custom Role (specify in details)</option>
                              </select>
                            </label>

                            {/* Quantity Selector */}
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-slate-700">Number of hires</span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateRoleCount(role.id, -1)}
                                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:border-[#E91E63] hover:text-[#E91E63] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                                  disabled={role.count <= 1}
                                >
                                  <MinusIcon className="h-4 w-4" strokeWidth={2.5} />
                                </button>
                                <span className="min-w-[3.5rem] text-center text-lg font-bold text-slate-900">{role.count}</span>
                                <button
                                  type="button"
                                  onClick={() => updateRoleCount(role.id, 1)}
                                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:border-[#E91E63] hover:text-[#E91E63] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                                  disabled={role.count >= 99}
                                >
                                  <PlusIcon className="h-4 w-4" strokeWidth={2.5} />
                                </button>
                              </div>
                            </div>

                            {/* Remove button (if more than 1 role) */}
                            {roles.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeRole(role.id)}
                                className="flex w-full items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition-all duration-200 hover:bg-red-100 hover:border-red-300 active:scale-95"
                              >
                                <TrashIcon className="h-4 w-4" />
                                Remove Role
                              </button>
                            )}
                          </div>
                        ))}

                        {/* Add Role Button */}
                        {roles.length < MAX_ROLES && (
                          <button
                            type="button"
                            onClick={addRole}
                            className="flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition-all duration-200 hover:border-[#E91E63] hover:bg-[#E91E63]/5 hover:text-[#E91E63] active:scale-95"
                          >
                            <PlusIcon className="h-5 w-5" strokeWidth={2.5} />
                            Add Another Role
                          </button>
                        )}

                        {/* Additional Details */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <label className="block">
                            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Seniority Level</span>
                            <select
                              name="seniority"
                              className="w-full rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm text-slate-900 font-medium transition-all duration-200 hover:border-slate-400 focus:border-[#E91E63] focus:outline-none appearance-none cursor-pointer"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23E91E63'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 1rem center',
                                backgroundSize: '1rem',
                                paddingRight: '2.5rem'
                              }}
                            >
                              <option value="">Select</option>
                              <option>Junior</option>
                              <option>Mid-level</option>
                              <option>Senior</option>
                              <option>Lead / Principal</option>
                              <option>Executive</option>
                            </select>
                          </label>

                          <label className="block">
                            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Timeline</span>
                            <select
                              name="timeline"
                              className="w-full rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm text-slate-900 font-medium transition-all duration-200 hover:border-slate-400 focus:border-[#E91E63] focus:outline-none appearance-none cursor-pointer"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23E91E63'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 1rem center',
                                backgroundSize: '1rem',
                                paddingRight: '2.5rem'
                              }}
                            >
                              <option value="">Select</option>
                              <option>ASAP</option>
                              <option>Within 1 month</option>
                              <option>1–3 months</option>
                              <option>Just exploring</option>
                            </select>
                          </label>
                        </div>

                        <label className="block">
                          <span className="mb-1.5 block text-xs font-semibold text-slate-700">
                            Additional Details <span className="text-slate-500 font-normal">(optional)</span>
                          </span>
                          <textarea
                            name="details"
                            rows={3}
                            placeholder="Skills, budget, location, must-haves…"
                            className="w-full resize-none rounded-3xl border border-slate-300 bg-white px-5 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 hover:border-slate-400 focus:border-[#E91E63] focus:outline-none"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex shrink-0 gap-3 border-t border-slate-200 px-6 py-4">
                      <button
                        type="button"
                        onClick={() => setView("choice")}
                        className="rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:border-slate-400 active:scale-95"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 rounded-full bg-gradient-to-r from-[#E91E63] to-[#C2185B] px-6 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-95 focus:outline-none"
                      >
                        Submit Request
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {view === "talent" && (
                <div className="flex min-h-0 max-h-[calc(100vh-4rem)] flex-col">
                  {/* Header - Brand Colors */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-ink via-primary to-accent px-6 py-5">
                    {/* Back button */}
                    <button
                      type="button"
                      onClick={() => setView("choice")}
                      className="absolute left-6 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                    >
                      <ArrowLeftIcon className="h-4 w-4" />
                    </button>

                    {/* Header text - Same style */}
                    <div className="text-center">
                      <div className="space-y-1">
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
                          For Talent
                        </p>
                        <h2 className="text-[22px] font-extrabold leading-tight tracking-tight text-white drop-shadow-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          Tell us about yourself
                        </h2>
                      </div>
                    </div>

                    {/* Close button */}
                    <Dialog.Close
                      className="absolute right-6 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                      aria-label="Close"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </Dialog.Close>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleTalentSubmit} className="flex min-h-0 flex-col">
                    <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
                      {/* Personal Info */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <label className="block">
                            <span className="mb-1.5 block text-sm font-semibold text-slate-900">
                              Full Name <span className="text-accent">*</span>
                            </span>
                            <input
                              type="text"
                              name="name"
                              required
                              placeholder="Jane Doe"
                              className="w-full rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 hover:border-slate-400 focus:border-[#E91E63] focus:outline-none"
                            />
                          </label>

                          <label className="block">
                            <span className="mb-1.5 block text-sm font-semibold text-slate-900">
                              Email <span className="text-accent">*</span>
                            </span>
                            <input
                              type="email"
                              name="email"
                              required
                              placeholder="jane@email.com"
                              className="w-full rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 hover:border-slate-400 focus:border-[#E91E63] focus:outline-none"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Professional Info */}
                      <div className="space-y-4 border-t border-slate-200 pt-4">
                        <label className="block">
                          <span className="mb-1.5 block text-sm font-semibold text-slate-900">
                            Desired Role <span className="text-accent">*</span>
                          </span>
                          <input
                            type="text"
                            name="role"
                            required
                            placeholder="Senior Frontend Engineer"
                            className="w-full rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 hover:border-slate-400 focus:border-[#E91E63] focus:outline-none"
                          />
                        </label>

                        <div className="grid grid-cols-2 gap-3">
                          <label className="block">
                            <span className="mb-1.5 block text-sm font-semibold text-slate-900">Experience Level</span>
                            <select
                              name="experience"
                              className="w-full rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm text-slate-900 font-medium transition-all duration-200 hover:border-slate-400 focus:border-[#E91E63] focus:outline-none appearance-none cursor-pointer"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23E91E63'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 1.25rem center',
                                backgroundSize: '1rem',
                                paddingRight: '2.5rem'
                              }}
                            >
                              <option value="">Select</option>
                              <option>Junior</option>
                              <option>Mid-level</option>
                              <option>Senior</option>
                              <option>Lead / Principal</option>
                              <option>Executive</option>
                            </select>
                          </label>

                          <label className="block">
                            <span className="mb-1.5 block text-sm font-semibold text-slate-900">Location</span>
                            <input
                              type="text"
                              name="location"
                              placeholder="Remote, London, etc."
                              className="w-full rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 hover:border-slate-400 focus:border-[#E91E63] focus:outline-none"
                            />
                          </label>
                        </div>

                        <label className="block">
                          <span className="mb-1.5 block text-sm font-semibold text-slate-900">
                            LinkedIn or Portfolio
                          </span>
                          <input
                            type="url"
                            name="links"
                            placeholder="linkedin.com/in/..."
                            className="w-full rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 hover:border-slate-400 focus:border-[#E91E63] focus:outline-none"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-1.5 block text-sm font-semibold text-slate-900">
                            About You <span className="text-slate-500 font-normal">(optional)</span>
                          </span>
                          <textarea
                            name="about"
                            rows={3}
                            placeholder="Key skills, what you're looking for next…"
                            className="w-full resize-none rounded-3xl border border-slate-300 bg-white px-5 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 hover:border-slate-400 focus:border-[#E91E63] focus:outline-none"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex shrink-0 gap-3 border-t border-slate-200 px-6 py-4">
                      <button
                        type="button"
                        onClick={() => setView("choice")}
                        className="rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:border-slate-400 active:scale-95"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 rounded-full bg-gradient-to-r from-[#E91E63] to-[#C2185B] px-6 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-95 focus:outline-none"
                      >
                        Submit Profile
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {view === "sent" && (
                <div className="p-8">
                  <div className="mb-6 flex items-start justify-between">
                    <h2 className="text-xl font-bold text-slate-900">All Done!</h2>
                    <Dialog.Close
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-colors duration-200 hover:bg-white hover:text-slate-900 focus-visible:outline-none"
                      aria-label="Close"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </Dialog.Close>
                  </div>

                  <div className="flex flex-col items-center py-6 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                      <CheckIcon className="h-8 w-8 text-green-500" strokeWidth={2.5} />
                    </div>
                    <p className="mt-5 text-sm leading-relaxed text-slate-600">
                      Thanks! A member of our team will reach out to you soon.
                    </p>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="mt-6 rounded-lg bg-[#FF5722] px-6 py-2.5 text-sm font-bold text-slate-900 transition-all duration-200 hover:bg-[#FF6F3D]"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </GetStartedContext.Provider>
  );
}
