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
  MegaphoneIcon,
} from "@heroicons/react/24/outline";
import {
  Squares2X2Icon as Squares2X2IconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  BriefcaseIcon as BriefcaseIconSolid,
  UserCircleIcon as UserCircleIconSolid,
  EnvelopeIcon as EnvelopeIconSolid,
  EyeIcon as EyeIconSolid,
  MegaphoneIcon as MegaphoneIconSolid,
} from "@heroicons/react/24/solid";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    getCurrentUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to submissions page with search query
      navigate(`/admin/submissions?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Get user initials from email
  const getUserInitials = () => {
    if (!userEmail) return "AD";
    const parts = userEmail.split("@")[0].split(/[._-]/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return userEmail.substring(0, 2).toUpperCase();
  };

  const getUserDisplayName = () => {
    if (!userEmail) return "Admin";
    const name = userEmail.split("@")[0];
    return name
      .split(/[._-]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
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
    {
      path: "/admin/marketing",
      icon: MegaphoneIcon,
      iconSolid: MegaphoneIconSolid,
      label: "Marketing",
      group: "settings",
    },
  ];

  const mainNav = navItems.filter((item) => item.group === "main");
  const categoriesNav = navItems.filter((item) => item.group === "categories");
  const settingsNav = navItems.filter((item) => item.group === "settings");

  return (
    <div
      className="admin-page min-h-screen bg-slate-50 flex"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
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
            {sidebarOpen ? <XMarkIcon className="w-4 h-4" /> : <Bars3Icon className="w-4 h-4" />}
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

          {/* Settings Section */}
          <div className="pt-4 mt-4 border-t border-slate-200/60">
            {sidebarOpen && (
              <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Settings
              </p>
            )}
            <div className="space-y-0.5">
              {settingsNav.map((item) => (
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
                {/* Search - Functional */}
                <form onSubmit={handleSearch} className="relative hidden md:block">
                  <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search submissions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 pl-8 pr-3 py-1.5 rounded-lg bg-slate-100 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:bg-white transition-all border border-transparent focus:border-indigo-200"
                  />
                </form>

                {/* User Profile with Dropdown - Functional */}
                <div className="relative pl-2 ml-2 border-l border-slate-200">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 hover:bg-slate-50 rounded-lg px-2 py-1 transition-colors"
                  >
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold text-slate-900">{getUserDisplayName()}</p>
                      <p className="text-[10px] text-slate-500">
                        {userEmail || "admin@rarerolestechnologies.com"}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      {getUserInitials()}
                    </div>
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <>
                      {/* Backdrop to close menu */}
                      <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />

                      {/* Menu */}
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                        <div className="px-3 py-2 border-b border-slate-100">
                          <p className="text-xs font-bold text-slate-900">{getUserDisplayName()}</p>
                          <p className="text-[10px] text-slate-500 truncate">{userEmail}</p>
                        </div>

                        <Link
                          to="/admin/overview"
                          className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Squares2X2Icon className="w-4 h-4" />
                          Dashboard
                        </Link>

                        <Link
                          to="/admin/change-password"
                          className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                            />
                          </svg>
                          Change Password
                        </Link>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100 mt-1"
                        >
                          <ArrowRightOnRectangleIcon className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4">{children}</div>
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
  const ActiveIcon = active ? IconSolid || Icon : Icon;

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
      <div
        className={`shrink-0 ${active ? "scale-110" : "group-hover:scale-110"} transition-transform duration-200`}
      >
        <ActiveIcon className="w-4 h-4" />
      </div>
      {!collapsed && <span className="text-xs font-semibold flex-1 text-left">{label}</span>}
    </Link>
  );
}
