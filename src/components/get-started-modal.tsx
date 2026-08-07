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
  DocumentArrowUpIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useFormTracking } from "@/hooks/useAnalytics";
import { syncHiringEnquiry, syncTalentSubmission } from "@/lib/data-sync";
import { fireConversion } from "@/lib/marketing-scripts";
import { uploadCV, validateFile, formatFileSize } from "@/lib/file-upload";

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

const MAX_ROLES = 5;

type RoleRow = { id: number; title: string; count: number };

type View = "choice" | "hiring" | "talent" | "sent";

export function GetStartedProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<View>("choice");
  const [roles, setRoles] = useState<RoleRow[]>([{ id: 1, title: "", count: 1 }]);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [selectedTalentRole, setSelectedTalentRole] = useState<string>("");
  const navigate = useNavigate();
  
  // Add form tracking
  const trackFormSubmit = useFormTracking();

  const open = useCallback((next: "choice" | "hiring" | "talent" = "choice", prefillRole = "") => {
    setView(next);
    setRoles([{ id: 1, title: prefillRole, count: 1 }]);
    setCvFile(null);
    setCvError("");
    setSelectedTalentRole("");
    setIsOpen(true);
  }, []);
  const close = useCallback(() => {
    setIsOpen(false);
    setCvFile(null);
    setCvError("");
  }, []);

  const handleCvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setCvFile(null);
      setCvError("");
      return;
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      setCvError(validation.error || "Invalid file");
      setCvFile(null);
      return;
    }

    setCvFile(file);
    setCvError("");
  };

  const removeCvFile = () => {
    setCvFile(null);
    setCvError("");
  };

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

  const handleHiringSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (uploading) return; // Prevent double submission
    
    setUploading(true);
    
    const data = new FormData(e.currentTarget);
    const company = String(data.get("company") ?? "");
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const phone = String(data.get("phone") ?? "");
    const location = String(data.get("location") ?? "");
    const seniority = String(data.get("seniority") ?? "");
    const timeline = String(data.get("timeline") ?? "");
    const details = String(data.get("details") ?? "");

    const rolesList = roles
      .filter((r) => r.title.trim())
      .map((r) => ({
        title: r.title === "Custom Role" 
          ? String(data.get(`custom-role-${r.id}`) ?? "Custom Role")
          : r.title.trim(),
        count: r.count,
      }));

    // Track form submission
    trackFormSubmit('hiring_form', { company, email, roles: rolesList.length });

    // Dual-write to Supabase + Google Apps Script
    try {
      const syncResult = await syncHiringEnquiry({
        company,
        contact_name: name,
        email,
        phone,
        location,
        roles: rolesList,
        seniority,
        timeline,
        details,
      });
      
      if (import.meta.env.DEV) {
        console.log('[Hiring] Sync result:', syncResult);
      }

      // Only show success if Supabase succeeded (primary data store)
      if (syncResult.supabase.success) {
        // Show warning if Google Apps Script failed
        if (!syncResult.googleAppsScript.success) {
          console.warn('[Hiring] Partial sync - Google Apps Script failed but Supabase succeeded');
        }
        fireConversion('hiring_enquiry', { roles: rolesList.length });
        setUploading(false);
        setView("sent");
      } else {
        // Supabase failed - show error
        console.error('[Hiring] Supabase sync failed:', syncResult.supabase.error);
        alert(`Submission failed: ${syncResult.supabase.error || 'Unable to save your request. Please try again.'}`);
        setUploading(false);
      }
    } catch (error) {
      console.error('[Hiring] Sync error:', error);
      alert('Submission failed: An unexpected error occurred. Please try again.');
      setUploading(false);
    }
  };

  const handleTalentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (uploading) return; // Prevent double submission
    
    setUploading(true);
    setCvError(""); // Clear any previous errors
    
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const phone = String(data.get("phone") ?? "");
    const role = String(data.get("role") ?? "");
    const customRole = String(data.get("custom_role") ?? "");
    const experience = String(data.get("experience") ?? "");
    const location = String(data.get("location") ?? "");
    const links = String(data.get("links") ?? "");
    const about = String(data.get("about") ?? "");

    // Track form submission
    trackFormSubmit('talent_form', { name, email, role, has_cv: !!cvFile });

    let cvUrl = "";
    let cvPublicId = "";
    let cvFileName = "";

    // Upload CV if provided
    if (cvFile) {
      try {
        console.log('[Talent] Uploading CV file...');
        const uploadResult = await uploadCV(cvFile, email);
        
        if (uploadResult.success) {
          cvUrl = uploadResult.secureUrl || "";
          cvPublicId = uploadResult.publicId || "";
          cvFileName = cvFile.name;
          console.log('[Talent] CV uploaded successfully:', cvUrl);
        } else {
          console.error('[Talent] CV upload failed:', uploadResult.error);
          setCvError(uploadResult.error || "Failed to upload CV");
          alert(`CV upload failed: ${uploadResult.error || "Please try again or submit without CV"}`);
          setUploading(false);
          return; // Stop submission if CV upload fails when CV was provided
        }
      } catch (uploadError) {
        console.error('[Talent] CV upload error:', uploadError);
        const errorMsg = uploadError instanceof Error ? uploadError.message : "Unexpected error during CV upload";
        setCvError(errorMsg);
        alert(`CV upload failed: ${errorMsg}`);
        setUploading(false);
        return; // Stop submission if CV upload fails when CV was provided
      }
    }

    // Dual-write to Supabase + Google Apps Script
    try {
      const syncResult = await syncTalentSubmission({
        name,
        email,
        phone,
        desired_role: role,
        custom_role: customRole,
        experience,
        location,
        links,
        about,
        cv_url: cvUrl,
        cv_file_path: cvPublicId,
        cv_file_name: cvFileName,
      });
      
      if (import.meta.env.DEV) {
        console.log('[Talent] Sync result:', syncResult);
      }

      // Only show success if Supabase succeeded (primary data store)
      if (syncResult.supabase.success) {
        // Show warning if Google Apps Script failed
        if (!syncResult.googleAppsScript.success) {
          console.warn('[Talent] Partial sync - Google Apps Script failed but Supabase succeeded');
        }
        fireConversion('talent_application', { has_cv: !!cvFile });
        setUploading(false);
        setView("sent");
      } else {
        // Supabase failed - show error
        console.error('[Talent] Supabase sync failed:', syncResult.supabase.error);
        alert(`Submission failed: ${syncResult.supabase.error || 'Unable to save your profile. Please try again.'}`);
        setUploading(false);
      }
    } catch (error) {
      console.error('[Talent] Sync error:', error);
      const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
      alert(`Submission failed: ${errorMsg}. Please try again.`);
      setUploading(false);
    }
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
                            className="w-full rounded-full border-2 border-accent/30 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 hover:border-accent/50 focus:border-accent focus:outline-none"
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
                              className="w-full rounded-full border-2 border-accent/30 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 hover:border-accent/50 focus:border-accent focus:outline-none"
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
                              className="w-full rounded-full border-2 border-accent/30 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 hover:border-accent/50 focus:border-accent focus:outline-none"
                            />
                          </label>
                        </div>

                        <label className="block">
                          <span className="mb-1.5 block text-sm font-semibold text-slate-900">
                            Phone Number <span className="text-slate-500 font-normal">(optional)</span>
                          </span>
                          <input
                            type="tel"
                            name="phone"
                            placeholder="+44 7700 900000"
                            className="w-full rounded-full border-2 border-accent/30 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 hover:border-accent/50 focus:border-accent focus:outline-none"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-1.5 block text-sm font-semibold text-slate-900">
                            Location <span className="text-accent">*</span>
                          </span>
                          <input
                            type="text"
                            name="location"
                            required
                            placeholder="London, Remote, New York, etc."
                            className="w-full rounded-full border-2 border-accent/30 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 hover:border-accent/50 focus:border-accent focus:outline-none"
                          />
                        </label>
                      </div>

                      {/* Role Details - Enhanced with dropdown and quantity */}
                      <div className="space-y-4 border-t border-slate-200 pt-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-slate-900">Roles Needed</h3>
                          <span className="text-xs text-slate-500">{roles.length} / {MAX_ROLES}</span>
                        </div>

                        {roles.map((role, idx) => (
                          <div key={role.id} className="space-y-3 rounded-2xl border-2 border-accent/20 bg-slate-50/50 p-4">
                            {/* Role Selector */}
                            <label className="block">
                              <span className="mb-1.5 block text-xs font-semibold text-slate-700">
                                Role Title <span className="text-accent">*</span>
                              </span>
                              <select
                                value={role.title}
                                onChange={(e) => updateRoleTitle(role.id, e.target.value)}
                                required
                                className="w-full rounded-full border-2 border-accent/30 bg-white px-4 py-2 text-sm text-slate-900 font-medium transition-all duration-200 hover:border-accent/50 focus:border-accent focus:outline-none appearance-none cursor-pointer"
                                style={{
                                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23E91E63'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                  backgroundRepeat: 'no-repeat',
                                  backgroundPosition: 'right 1rem center',
                                  backgroundSize: '1rem',
                                  paddingRight: '2.5rem'
                                }}
                              >
                                <option value="">Select a role</option>
                                <option value="Oracle PL/SQL Developers">Oracle PL/SQL Developers</option>
                                <option value="CCIE Network Engineers">CCIE Network Engineers</option>
                                <option value="AIX System Administrators">AIX System Administrators</option>
                                <option value="SharePoint Engineers">SharePoint Engineers</option>
                                <option value="AI / Machine Learning Engineers">AI / Machine Learning Engineers</option>
                                <option value="AI Automation Engineers">AI Automation Engineers</option>
                                <option value="Solution Architects">Solution Architects</option>
                                <option value="AI Operators">AI Operators</option>
                                <option value="AI-Enabled Software Engineers">AI-Enabled Software Engineers</option>
                                <option value="Software Tester">Software Tester</option>
                                <option value="Backend Engineer">Backend Engineer</option>
                                <option value="Frontend Engineer">Frontend Engineer</option>
                                <option value="Fullstack Engineer">Fullstack Engineer</option>
                                <option value="DevOps Engineer">DevOps Engineer</option>
                                <option value="Mobile Developer">Mobile Developer</option>
                                <option value="System Administrator">System Administrator</option>
                                <option value="Product Manager">Product Manager</option>
                                <option value="Site Reliability Engineer">Site Reliability Engineer</option>
                                <option value="Custom Role">Custom Role</option>
                              </select>
                            </label>

                            {/* Custom Role Input - Shows when "Custom Role" is selected */}
                            {role.title === "Custom Role" && (
                              <label className="block">
                                <span className="mb-1.5 block text-xs font-semibold text-slate-700">
                                  Specify Custom Role <span className="text-accent">*</span>
                                </span>
                                <input
                                  type="text"
                                  name={`custom-role-${role.id}`}
                                  required
                                  placeholder="Enter the specific role you need"
                                  className="w-full rounded-full border-2 border-accent/30 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 hover:border-accent/50 focus:border-accent focus:outline-none"
                                />
                              </label>
                            )}

                            {/* Quantity Selector */}
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-slate-700">Number of hires</span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateRoleCount(role.id, -1)}
                                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-accent/30 bg-white text-accent transition-all duration-200 hover:bg-accent/5 hover:border-accent/50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                                  disabled={role.count <= 1}
                                >
                                  <MinusIcon className="h-4 w-4" strokeWidth={2.5} />
                                </button>
                                <span className="min-w-[3.5rem] text-center text-lg font-bold text-slate-900">{role.count}</span>
                                <button
                                  type="button"
                                  onClick={() => updateRoleCount(role.id, 1)}
                                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-accent/30 bg-white text-accent transition-all duration-200 hover:bg-accent/5 hover:border-accent/50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
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
                                className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition-all duration-200 hover:bg-red-100 hover:border-red-300 active:scale-95"
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
                            className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-dashed border-accent/40 bg-white px-4 py-3 text-sm font-bold text-accent transition-all duration-200 hover:border-accent hover:bg-accent/5 active:scale-95"
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
                              className="w-full rounded-full border-2 border-accent/30 bg-white px-4 py-2 text-sm text-slate-900 font-medium transition-all duration-200 hover:border-accent/50 focus:border-accent focus:outline-none appearance-none cursor-pointer"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23E91E63'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.75rem center',
                                backgroundSize: '0.875rem',
                                paddingRight: '2rem'
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
                              className="w-full rounded-full border-2 border-accent/30 bg-white px-4 py-2 text-sm text-slate-900 font-medium transition-all duration-200 hover:border-accent/50 focus:border-accent focus:outline-none appearance-none cursor-pointer"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23E91E63'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.75rem center',
                                backgroundSize: '0.875rem',
                                paddingRight: '2rem'
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
                            placeholder="Skills, budget, must-haves…"
                            className="w-full resize-none rounded-3xl border-2 border-accent/30 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 hover:border-accent/50 focus:border-accent focus:outline-none"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex shrink-0 gap-3 border-t border-slate-200 px-6 py-4">
                      <button
                        type="button"
                        onClick={() => setView("choice")}
                        disabled={uploading}
                        className="rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:border-slate-400 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={uploading}
                        className="flex-1 rounded-full bg-gradient-to-r from-[#E91E63] to-[#C2185B] px-6 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-95 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {uploading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Request'
                        )}
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
                              className="w-full rounded-full border-2 border-accent/30 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 hover:border-accent/50 focus:border-accent focus:outline-none"
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
                              className="w-full rounded-full border-2 border-accent/30 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 hover:border-accent/50 focus:border-accent focus:outline-none"
                            />
                          </label>
                        </div>

                        <label className="block">
                          <span className="mb-1.5 block text-sm font-semibold text-slate-900">
                            Phone Number <span className="text-slate-500 font-normal">(optional)</span>
                          </span>
                          <input
                            type="tel"
                            name="phone"
                            placeholder="+44 7700 900000"
                            className="w-full rounded-full border-2 border-accent/30 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 hover:border-accent/50 focus:border-accent focus:outline-none"
                          />
                        </label>
                      </div>

                      {/* Professional Info */}
                      <div className="space-y-4 border-t border-slate-200 pt-4">
                        <label className="block">
                          <span className="mb-1.5 block text-sm font-semibold text-slate-900">
                            Desired Role <span className="text-accent">*</span>
                          </span>
                          <select
                            name="role"
                            required
                            value={selectedTalentRole}
                            onChange={(e) => setSelectedTalentRole(e.target.value)}
                            className="w-full rounded-full border-2 border-accent/30 bg-white px-4 py-2 text-sm text-slate-900 font-medium transition-all duration-200 hover:border-accent/50 focus:border-accent focus:outline-none appearance-none cursor-pointer"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23E91E63'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'right 1rem center',
                              backgroundSize: '1rem',
                              paddingRight: '2.5rem'
                            }}
                          >
                            <option value="">Select a role</option>
                            <option value="Oracle PL/SQL Developers">Oracle PL/SQL Developers</option>
                            <option value="CCIE Network Engineers">CCIE Network Engineers</option>
                            <option value="AIX System Administrators">AIX System Administrators</option>
                            <option value="SharePoint Engineers">SharePoint Engineers</option>
                            <option value="AI / Machine Learning Engineers">AI / Machine Learning Engineers</option>
                            <option value="AI Automation Engineers">AI Automation Engineers</option>
                            <option value="Solution Architects">Solution Architects</option>
                            <option value="AI Operators">AI Operators</option>
                            <option value="AI-Enabled Software Engineers">AI-Enabled Software Engineers</option>
                            <option value="Software Tester">Software Tester</option>
                            <option value="Backend Engineer">Backend Engineer</option>
                            <option value="Frontend Engineer">Frontend Engineer</option>
                            <option value="Fullstack Engineer">Fullstack Engineer</option>
                            <option value="DevOps Engineer">DevOps Engineer</option>
                            <option value="Mobile Developer">Mobile Developer</option>
                            <option value="System Administrator">System Administrator</option>
                            <option value="Product Manager">Product Manager</option>
                            <option value="Site Reliability Engineer">Site Reliability Engineer</option>
                            <option value="Other">Other (Specify Below)</option>
                          </select>
                        </label>

                        {/* Custom Role Input - Shows when "Other" is selected */}
                        {selectedTalentRole === "Other" && (
                          <label className="block">
                            <span className="mb-1.5 block text-sm font-semibold text-slate-900">
                              Specify Your Desired Role <span className="text-accent">*</span>
                            </span>
                            <input
                              type="text"
                              name="custom_role"
                              required
                              placeholder="Enter the specific role you're looking for"
                              className="w-full rounded-full border-2 border-accent/30 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 hover:border-accent/50 focus:border-accent focus:outline-none"
                            />
                          </label>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          <label className="block">
                            <span className="mb-1.5 block text-sm font-semibold text-slate-900">Experience Level</span>
                            <select
                              name="experience"
                              className="w-full rounded-full border-2 border-accent/30 bg-white px-4 py-2 text-sm text-slate-900 font-medium transition-all duration-200 hover:border-accent/50 focus:border-accent focus:outline-none appearance-none cursor-pointer"
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
                            <span className="mb-1.5 block text-sm font-semibold text-slate-900">Location</span>
                            <input
                              type="text"
                              name="location"
                              placeholder="Remote, London, etc."
                              className="w-full rounded-full border-2 border-accent/30 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 hover:border-accent/50 focus:border-accent focus:outline-none"
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
                            className="w-full rounded-full border-2 border-accent/30 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 hover:border-accent/50 focus:border-accent focus:outline-none"
                          />
                        </label>

                        {/* CV/Resume Upload */}
                        <div className="block">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-slate-900">
                              Upload CV/Resume <span className="text-slate-500 font-normal">(PDF, optional)</span>
                            </span>
                            {cvFile && (
                              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                                <CheckCircleIcon className="w-4 h-4" />
                                {formatFileSize(cvFile.size)}
                              </span>
                            )}
                          </div>

                          {!cvFile ? (
                            <label className="block cursor-pointer">
                              <div className="w-full rounded-2xl border-2 border-dashed border-accent/30 bg-gradient-to-br from-slate-50 to-white px-6 py-8 text-center transition-all duration-200 hover:border-accent hover:bg-accent/5">
                                <DocumentArrowUpIcon className="w-10 h-10 mx-auto text-accent mb-3" />
                                <p className="text-sm font-semibold text-slate-900 mb-1">
                                  Click to upload or drag and drop
                                </p>
                                <p className="text-xs text-slate-500">
                                  PDF only, max 10MB
                                </p>
                              </div>
                              <input
                                type="file"
                                accept=".pdf,application/pdf"
                                onChange={handleCvFileChange}
                                className="hidden"
                              />
                            </label>
                          ) : (
                            <div className="w-full rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-6 py-4 flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="p-2 rounded-lg bg-emerald-100">
                                  <DocumentArrowUpIcon className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-slate-900 truncate">
                                    {cvFile.name}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {formatFileSize(cvFile.size)}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={removeCvFile}
                                className="ml-3 p-2 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors"
                              >
                                <XMarkIcon className="w-5 h-5" />
                              </button>
                            </div>
                          )}

                          {cvError && (
                            <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                              <XMarkIcon className="w-4 h-4" />
                              {cvError}
                            </p>
                          )}
                        </div>

                        <label className="block">
                          <span className="mb-1.5 block text-sm font-semibold text-slate-900">
                            About You <span className="text-slate-500 font-normal">(optional)</span>
                          </span>
                          <textarea
                            name="about"
                            rows={3}
                            placeholder="Key skills, what you're looking for next…"
                            className="w-full resize-none rounded-3xl border-2 border-accent/30 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 hover:border-accent/50 focus:border-accent focus:outline-none"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex shrink-0 gap-3 border-t border-slate-200 px-6 py-4">
                      <button
                        type="button"
                        onClick={() => setView("choice")}
                        disabled={uploading}
                        className="rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:border-slate-400 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={uploading}
                        className="flex-1 rounded-full bg-gradient-to-r from-[#E91E63] to-[#C2185B] px-6 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-95 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {uploading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {cvFile ? 'Uploading CV...' : 'Submitting...'}
                          </>
                        ) : (
                          'Submit Profile'
                        )}
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
