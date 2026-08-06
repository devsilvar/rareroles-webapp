import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  supabase,
  getConversionRate,
  getAverageResponseTime,
  getAllHiringEnquiries,
  getAllTalentSubmissions,
  getAllContacts,
} from "../lib/supabase";
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
  ArrowTrendingUpIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ChevronRightIcon,
  EyeIcon,
  CheckCircleIcon,
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
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Types
interface DashboardStats {
  totalSubmissions: number;
  todaySubmissions: number;
  activeRoles: number;
  conversionRate: number;
  hiringEnquiries: number;
  talentSubmissions: number;
  contactForms: number;
  visitors: number;
  averageResponseTime: number;
}

interface Activity {
  id: string;
  name: string;
  email: string;
  type: "hiring" | "talent" | "contact";
  created_at: string;
  score?: number;
}

interface ChartData {
  day: string;
  submissions: number;
  contacts: number;
}

type ViewType = "overview" | "submissions" | "visitors" | "analytics" | "hiring" | "talent" | "contact";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>("overview");
  const [stats, setStats] = useState<DashboardStats>({
    totalSubmissions: 0,
    todaySubmissions: 0,
    activeRoles: 0,
    conversionRate: 0,
    hiringEnquiries: 0,
    talentSubmissions: 0,
    contactForms: 0,
    visitors: 0,
    averageResponseTime: 0,
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/admin/login");
    } else {
      fetchDashboardData();
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel with analytics
      const [hiringRes, talentRes, contactRes, conversionRate, avgResponseTime] = await Promise.all([
        supabase.from("hiring_enquiries").select("*"),
        supabase.from("talent_submissions").select("*"),
        supabase.from("contacts").select("*"),
        getConversionRate(),
        getAverageResponseTime(),
      ]);

      const hiring = hiringRes.data || [];
      const talent = talentRes.data || [];
      const contacts = contactRes.data || [];

      const today = new Date().toISOString().split("T")[0];
      const todayCount = [...hiring, ...talent, ...contacts].filter(
        (item) => item.created_at.startsWith(today)
      ).length;

      // Calculate visitors (unique emails from last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentSubmissions = [...hiring, ...talent, ...contacts].filter(
        (item) => new Date(item.created_at) >= thirtyDaysAgo
      );
      const uniqueEmails = new Set(recentSubmissions.map(item => 
        'email' in item ? item.email : ''
      )).size;

      setStats({
        totalSubmissions: hiring.length + talent.length + contacts.length,
        todaySubmissions: todayCount,
        activeRoles: hiring.filter((h) => !h.contacted).length,
        conversionRate: conversionRate,
        hiringEnquiries: hiring.length,
        talentSubmissions: talent.length,
        contactForms: contacts.length,
        visitors: uniqueEmails,
        averageResponseTime: avgResponseTime,
      });

      const allActivity: Activity[] = [
        ...hiring.map((h) => ({
          id: h.id,
          name: h.contact_name,
          email: h.email,
          type: "hiring" as const,
          created_at: h.created_at,
          score: 95,
        })),
        ...talent.map((t) => ({
          id: t.id,
          name: t.name,
          email: t.email,
          type: "talent" as const,
          created_at: t.created_at,
          score: 88,
        })),
        ...contacts.map((c) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          type: "contact" as const,
          created_at: c.created_at,
        })),
      ];

      allActivity.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setRecentActivity(allActivity.slice(0, 10));

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split("T")[0];
      });

      const chartDataTemp: ChartData[] = last7Days.map((date) => {
        const daySubmissions = [...hiring, ...talent].filter((item) =>
          item.created_at.startsWith(date)
        ).length;
        const dayContacts = contacts.filter((item) =>
          item.created_at.startsWith(date)
        ).length;

        return {
          day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date(date).getDay()],
          submissions: daySubmissions,
          contacts: dayContacts,
        };
      });

      setChartData(chartDataTemp);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("dashboard-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "hiring_enquiries" },
        () => fetchDashboardData()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "talent_submissions" },
        () => fetchDashboardData()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contacts" },
        () => fetchDashboardData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };

  const getViewTitle = () => {
    switch (currentView) {
      case "overview": return "Dashboard Overview";
      case "submissions": return "All Submissions";
      case "visitors": return "Visitor Analytics";
      case "analytics": return "Advanced Analytics";
      case "hiring": return "Hiring Enquiries";
      case "talent": return "Talent Submissions";
      case "contact": return "Contact Messages";
      default: return "Dashboard";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8fc]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ec4899] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#1e1b4b] font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f8fc] via-[#fafafa] to-[#f8f8fc] flex" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 fixed h-full z-50 lg:relative shadow-xl`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 bg-gradient-to-r from-[#1e1b4b] to-[#2d2a6e]">
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold text-white">RareRoles</h1>
                <p className="text-xs text-white/70">Admin Portal</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
            >
              {sidebarOpen ? (
                <XMarkIcon className="w-5 h-5" />
              ) : (
                <Bars3Icon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {/* Group 1: Overview */}
            <div className="mb-6">
              {sidebarOpen && (
                <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Main
                </p>
              )}
              <NavItem
                icon={Squares2X2Icon}
                iconSolid={Squares2X2IconSolid}
                label="Overview"
                active={currentView === "overview"}
                onClick={() => setCurrentView("overview")}
                count={stats.totalSubmissions}
                collapsed={!sidebarOpen}
              />
              <NavItem
                icon={DocumentTextIcon}
                iconSolid={DocumentTextIconSolid}
                label="Submissions"
                active={currentView === "submissions"}
                onClick={() => setCurrentView("submissions")}
                count={stats.totalSubmissions}
                collapsed={!sidebarOpen}
              />
              <NavItem
                icon={EyeIcon}
                iconSolid={EyeIconSolid}
                label="Visitors"
                active={currentView === "visitors"}
                onClick={() => setCurrentView("visitors")}
                count={stats.visitors}
                collapsed={!sidebarOpen}
              />
              <NavItem
                icon={ChartBarIcon}
                iconSolid={ChartBarIconSolid}
                label="Analytics"
                active={currentView === "analytics"}
                onClick={() => setCurrentView("analytics")}
                collapsed={!sidebarOpen}
              />
            </div>

            {/* Group 2: Categories */}
            <div className="pt-6 border-t border-gray-100">
              {sidebarOpen && (
                <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Categories
                </p>
              )}
              <NavItem
                icon={BriefcaseIcon}
                iconSolid={BriefcaseIconSolid}
                label="Hiring"
                active={currentView === "hiring"}
                onClick={() => setCurrentView("hiring")}
                count={stats.hiringEnquiries}
                collapsed={!sidebarOpen}
              />
              <NavItem
                icon={UserCircleIcon}
                iconSolid={UserCircleIconSolid}
                label="Talent"
                active={currentView === "talent"}
                onClick={() => setCurrentView("talent")}
                count={stats.talentSubmissions}
                collapsed={!sidebarOpen}
              />
              <NavItem
                icon={EnvelopeIcon}
                iconSolid={EnvelopeIconSolid}
                label="Contact"
                active={currentView === "contact"}
                onClick={() => setCurrentView("contact")}
                count={stats.contactForms}
                collapsed={!sidebarOpen}
              />
            </div>
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-gray-100 bg-gray-50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[#1e1b4b] tracking-tight">{getViewTitle()}</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Welcome back! Here's what's happening today.
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden md:block">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-64 pl-10 pr-4 py-2.5 rounded-full bg-gray-100 text-sm text-[#1e1b4b] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ec4899] focus:bg-white transition-all"
                  />
                </div>

                {/* Notifications */}
                <div className="relative">
                  <button className="p-2.5 rounded-full bg-gray-100 hover:bg-[#fce7f3] transition-colors">
                    <BellIcon className="w-5 h-5 text-gray-600" />
                  </button>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ec4899] text-white text-xs font-bold rounded-full flex items-center justify-center">
                    3
                  </span>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-[#1e1b4b]">Admin User</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1e1b4b] to-[#2d2a6e] text-white flex items-center justify-center font-bold shadow-lg cursor-pointer">
                    AU
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Stats Row 1 - 4 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              label="TOTAL SUBMISSIONS"
              value={stats.totalSubmissions}
              change="+12"
              caption="today"
              icon={DocumentTextIcon}
              iconColor="bg-blue-100 text-blue-600"
            />
            <StatCard
              label="ACTIVE ROLES"
              value={stats.activeRoles}
              change="+5"
              caption="active"
              icon={BriefcaseIcon}
              iconColor="bg-purple-100 text-purple-600"
            />
            <StatCard
              label="AWAITING RESPONSE"
              value={stats.todaySubmissions}
              change="+8"
              caption="awaiting"
              icon={ClockIcon}
              iconColor="bg-orange-100 text-orange-600"
            />
            <StatCard
              label="CONVERSION RATE"
              value={`${stats.conversionRate}%`}
              change="+3%"
              caption="converted"
              icon={ArrowTrendingUpIcon}
              iconColor="bg-green-100 text-green-600"
            />
          </div>

          {/* Stats Row 2 - 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard2
              label="Hiring Enquiries"
              value={stats.hiringEnquiries}
              today={Math.floor(stats.todaySubmissions / 3)}
              count={5}
              icon={BriefcaseIcon}
              iconColor="bg-[#1e1b4b] text-white"
            />
            <StatCard2
              label="Talent Submissions"
              value={stats.talentSubmissions}
              today={Math.floor(stats.todaySubmissions / 3)}
              count={8}
              icon={UserCircleIcon}
              iconColor="bg-[#ec4899] text-white"
            />
            <StatCard2
              label="Contact Forms"
              value={stats.contactForms}
              today={Math.floor(stats.todaySubmissions / 3)}
              count={3}
              icon={EnvelopeIcon}
              iconColor="bg-indigo-600 text-white"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Line Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg transition-shadow duration-300 border border-gray-100">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1e1b4b]">Activity Overview</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Last 7 days</p>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600 shadow-sm">
                  <ChartBarIcon className="w-5 h-5" />
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="day"
                    stroke="#9ca3af"
                    style={{ fontSize: "12px", fontWeight: 600 }}
                  />
                  <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      fontSize: "12px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "12px", fontWeight: 600 }}
                    iconType="circle"
                  />
                  <Line
                    type="monotone"
                    dataKey="submissions"
                    stroke="#1e1b4b"
                    strokeWidth={3}
                    dot={{ fill: "#1e1b4b", r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Submissions"
                  />
                  <Line
                    type="monotone"
                    dataKey="contacts"
                    stroke="#ec4899"
                    strokeWidth={3}
                    dot={{ fill: "#ec4899", r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Contacts"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg transition-shadow duration-300 border border-gray-100">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1e1b4b]">Submission Types</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Distribution</p>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-100 text-purple-600 shadow-sm">
                  <ChartBarIcon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Hiring", value: stats.hiringEnquiries, color: "#1e1b4b" },
                          { name: "Talent", value: stats.talentSubmissions, color: "#ec4899" },
                          { name: "Contact", value: stats.contactForms, color: "#8b5cf6" },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {[
                          { name: "Hiring", value: stats.hiringEnquiries, color: "#1e1b4b" },
                          { name: "Talent", value: stats.talentSubmissions, color: "#ec4899" },
                          { name: "Contact", value: stats.contactForms, color: "#8b5cf6" },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="text-center -mt-44">
                    <p className="text-4xl font-bold text-[#1e1b4b]">
                      {stats.totalSubmissions}
                    </p>
                    <p className="text-xs text-gray-500 font-semibold">Total</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <PieLegendItem
                    color="#1e1b4b"
                    label="Hiring"
                    value={stats.hiringEnquiries}
                    percentage={Math.round(
                      (stats.hiringEnquiries / stats.totalSubmissions) * 100
                    )}
                  />
                  <PieLegendItem
                    color="#ec4899"
                    label="Talent"
                    value={stats.talentSubmissions}
                    percentage={Math.round(
                      (stats.talentSubmissions / stats.totalSubmissions) * 100
                    )}
                  />
                  <PieLegendItem
                    color="#8b5cf6"
                    label="Contact"
                    value={stats.contactForms}
                    percentage={Math.round(
                      (stats.contactForms / stats.totalSubmissions) * 100
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-[#fce7f3] shadow-sm">
                <ClockIcon className="w-6 h-6 text-[#ec4899]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1e1b4b]">Recent Activity</h3>
                <p className="text-sm text-gray-500">{recentActivity.length} latest entries</p>
              </div>
            </div>

            <div className="space-y-2">
              {recentActivity.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  relativeTime={getRelativeTime(activity.created_at)}
                />
              ))}

              {recentActivity.length === 0 && (
                <div className="text-center py-12">
                  <ExclamationCircleIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// NavItem Component
interface NavItemProps {
  icon: any;
  iconSolid?: any;
  label: string;
  count?: number;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

function NavItem({ icon: Icon, iconSolid: IconSolid, label, count, active, collapsed, onClick }: NavItemProps) {
  const ActiveIcon = IconSolid || Icon;
  
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${
        active
          ? "bg-[#fce7f3] text-[#ec4899] shadow-sm"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#ec4899] rounded-r-full" />
      )}
      {active ? (
        <ActiveIcon className="w-5 h-5 shrink-0" />
      ) : (
        <Icon className="w-5 h-5 shrink-0" />
      )}
      {!collapsed && (
        <>
          <span className="text-sm font-semibold flex-1 text-left">{label}</span>
          {count !== undefined && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              active 
                ? "bg-[#ec4899] text-white" 
                : "bg-gray-100 text-gray-600"
            }`}>
              {count}
            </span>
          )}
        </>
      )}
    </button>
  );
}

// StatCard Component
interface StatCardProps {
  label: string;
  value: number | string;
  change: string;
  caption: string;
  icon: any;
  iconColor: string;
}

function StatCard({ label, value, change, caption, icon: Icon, iconColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg transition-shadow duration-300 border border-gray-100 cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          {label}
        </span>
        <div className={`p-2.5 rounded-xl ${iconColor} shadow-md`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-4xl font-bold text-[#1e1b4b]">{value}</p>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-[#fce7f3] text-[#ec4899] text-xs font-bold shadow-sm">
            {change}
          </span>
          <span className="text-xs text-gray-500 font-medium">{caption}</span>
        </div>
      </div>
    </div>
  );
}

// StatCard2 Component
interface StatCard2Props {
  label: string;
  value: number;
  today: number;
  count: number;
  icon: any;
  iconColor: string;
}

function StatCard2({ label, value, today, count, icon: Icon, iconColor }: StatCard2Props) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg transition-shadow duration-300 border border-gray-100 cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-bold text-[#1e1b4b]">{label}</h3>
        <div className={`p-2.5 rounded-xl ${iconColor} shadow-md`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-4xl font-bold text-[#1e1b4b]">{value}</p>
        <p className="text-sm text-gray-500 font-medium">Today: <span className="font-bold text-[#1e1b4b]">{today}</span></p>
        <div className="flex justify-end">
          <span className="px-3 py-1 rounded-full bg-[#fce7f3] text-[#ec4899] text-xs font-bold shadow-sm">
            {count}
          </span>
        </div>
      </div>
    </div>
  );
}

// PieLegendItem Component
interface PieLegendItemProps {
  color: string;
  label: string;
  value: number;
  percentage: number;
}

function PieLegendItem({ color, label, value, percentage }: PieLegendItemProps) {
  return (
    <div className="flex items-center gap-3 cursor-pointer">
      <div 
        className="w-4 h-4 rounded-full shadow-md" 
        style={{ backgroundColor: color }} 
      />
      <div>
        <p className="text-sm font-bold text-[#1e1b4b]">{label}</p>
        <p className="text-xs text-gray-500">
          <span className="font-bold">{value}</span> ({percentage}%)
        </p>
      </div>
    </div>
  );
}

// ActivityItem Component
interface ActivityItemProps {
  activity: Activity;
  relativeTime: string;
}

function ActivityItem({ activity, relativeTime }: ActivityItemProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "hiring":
        return BriefcaseIcon;
      case "talent":
        return UserCircleIcon;
      case "contact":
        return EnvelopeIcon;
      default:
        return DocumentTextIcon;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "hiring":
        return "bg-[#1e1b4b]";
      case "talent":
        return "bg-[#ec4899]";
      case "contact":
        return "bg-indigo-600";
      default:
        return "bg-gray-600";
    }
  };

  const TypeIcon = getTypeIcon(activity.type);

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200 cursor-pointer border border-transparent hover:border-gray-200">
      {/* Icon */}
      <div className={`w-12 h-12 rounded-full ${getTypeColor(activity.type)} flex items-center justify-center shrink-0 shadow-md`}>
        <TypeIcon className="w-6 h-6 text-white" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#1e1b4b] truncate">{activity.name}</p>
        <p className="text-xs text-gray-500 truncate">{activity.email}</p>
      </div>

      {/* Status & Time */}
      <div className="flex items-center gap-3 shrink-0">
        {activity.score && (
          <span className="px-3 py-1.5 rounded-full bg-[#fce7f3] text-[#ec4899] text-xs font-bold shadow-sm">
            {activity.score}
          </span>
        )}
        <span className="text-xs text-gray-400 w-10 text-right font-semibold">{relativeTime}</span>
        <ChevronRightIcon className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
}
