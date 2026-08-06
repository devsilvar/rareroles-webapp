import { useState, useEffect, ReactNode } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import {
  Squares2X2Icon,
  DocumentTextIcon,
  ChartBarIcon,
  BriefcaseIcon,
  UserCircleIcon,
  EnvelopeIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import {
  Squares2X2Icon as Squares2X2IconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  BriefcaseIcon as BriefcaseIconSolid,
  UserCircleIcon as UserCircleIconSolid,
  EnvelopeIcon as EnvelopeIconSolid,
  EyeIcon as EyeIconSolid,
} from "@heroicons/react/24/solid";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      path: "/admin/overview",
      icon: Squares2X2Icon,
      iconSolid: Squares2X2IconSolid,
      label: "Overview",
      group: "main",
    },
    {
      path: "/admin/submissions",
      icon: DocumentTextIcon,
      iconSolid: DocumentTextIconSolid,
      label: "Submissions",
      group: "main",
    },
    {
      path: "/admin/visitors",
      icon: EyeIcon,
      iconSolid: EyeIconSolid,
      label: "Visitors",
      group: "main",
    },
    {
      path: "/admin/analytics",
      icon: ChartBarIcon,
      iconSolid: ChartBarIconSolid,
      label: "Analytics",
      group: "main",
    },
    {
      path: "/admin/hiring",
      icon: BriefcaseIcon,
      iconSolid: BriefcaseIconSolid,
      label: "Hiring",
      group: "categories",
    },
    {
      path: "/admin/talent",
      icon: UserCircleIcon,
      iconSolid: UserCircleIconSolid,
      label: "Talent",
      group: "categories",
    },
    {
      path: "/admin/contact",
      icon: EnvelopeIcon,
      iconSolid: EnvelopeIconSolid,
      label: "Contact",
      group: "categories",
    },
  ];

  const mainNav = navItems.filter((item) => item.group === "main");
  const categoriesNav = navItems.filter((item) => item.group === "categories");

  return (
    <div className="admin-page min-h-screen bg-slate-50 flex" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-60" : "w-16"
        } bg-white border-r border-slate-200/80 transition-all duration-300 fixed h-full z-50 lg:relative flex flex-col`}
      >
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-slate-200/80 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
          {sidebarOpen ? (
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">RareRoles</h1>
              <p className="text-[10px] text-white/80 font-medium">Admin</p>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-all text-white/90 hover:text-white"
          >
            {sidebarOpen ? (
              <XMarkIcon className="w-4 h-4" />
            ) : (
              <Bars3Icon className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2.5 py-4 overflow-y-auto">
          {/* Main Section */}
          <div className="mb-4">
            {sidebarOpen && (
              <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Main
              </p>
            )}
            <div className="space-y-0.5">
              {mainNav.map((item) => (
                <NavItem
                  key={item.path}
                  to={item.path}
                  icon={item.icon}
                  iconSolid={item.iconSolid}
                  label={item.label}
                  active={isActive(item.path)}
                  collapsed={!sidebarOpen}
                />
              ))}
            </div>
          </div>

          {/* Categories Section */}
          <div className="pt-4 border-t border-slate-200/60">
            {sidebarOpen && (
              <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Data
              </p>
            )}
            <div className="space-y-0.5">
              {categoriesNav.map((item) => (
                <NavItem
                  key={item.path}
                  to={item.path}
                  icon={item.icon}
                  iconSolid={item.iconSolid}
                  label={item.label}
                  active={isActive(item.path)}
                  collapsed={!sidebarOpen}
                />
              ))}
            </div>
          </div>
        </nav>

        {/* Logout */}
        <div className="p-2.5 border-t border-slate-200/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span className="text-xs font-semibold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/80 sticky top-0 z-40">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h1>
                {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
              </div>

              <div className="flex items-center gap-2">
                {/* Search */}
                <div className="relative hidden md:block">
                  <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-48 pl-8 pr-3 py-1.5 rounded-lg bg-slate-100 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:bg-white transition-all border border-transparent focus:border-indigo-200"
                  />
                </div>

                {/* Notifications */}
                <div className="relative">
                  <button className="p-2 rounded-lg bg-slate-100 hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 group">
                    <BellIcon className="w-4 h-4 text-slate-600 group-hover:text-indigo-600" />
                  </button>
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-pink-500 to-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    3
                  </span>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-2 pl-2 ml-2 border-l border-slate-200">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-slate-900">Admin</p>
                    <p className="text-[10px] text-slate-500">Administrator</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                    AU
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4">
          {children}
        </div>
      </main>
    </div>
  );
}

// NavItem Component
interface NavItemProps {
  to: string;
  icon: any;
  iconSolid: any;
  label: string;
  active: boolean;
  collapsed: boolean;
}

function NavItem({ to, icon: Icon, iconSolid: IconSolid, label, active, collapsed }: NavItemProps) {
  const ActiveIcon = active ? (IconSolid || Icon) : Icon;
  
  return (
    <Link
      to={to}
      className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 ${
        active
          ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 shadow-sm"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-r-full" />
      )}
      <div className={`shrink-0 ${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-200`}>
        <ActiveIcon className="w-4 h-4" />
      </div>
      {!collapsed && (
        <span className="text-xs font-semibold flex-1 text-left">{label}</span>
      )}
    </Link>
  );
}
