import { useState, useEffect } from "react";
import {
  DocumentTextIcon,
  BriefcaseIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  UserCircleIcon,
  EnvelopeIcon,
  ChartBarIcon,
  ExclamationCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
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
import { supabase, getConversionRate, getAverageResponseTime } from "../../lib/supabase";
import DashboardLayout from "../../components/admin/DashboardLayout";

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

export default function OverviewPage() {
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
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
      setRecentActivity(allActivity.slice(0, 5)); // Show only 5 most recent

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

  if (loading) {
    return (
      <DashboardLayout title="Dashboard Overview" subtitle="Welcome back! Here's what's happening today.">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-700 font-semibold">Loading overview...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard Overview" subtitle="Welcome back! Here's what's happening today.">
      <div className="space-y-4">
      {/* Stats Row 1 - 4 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="TOTAL SUBMISSIONS"
          value={stats.totalSubmissions}
          change="+12"
          caption="today"
          icon={DocumentTextIcon}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="ACTIVE ROLES"
          value={stats.activeRoles}
          change="+5"
          caption="active"
          icon={BriefcaseIcon}
          iconColor="bg-purple-50 text-purple-600"
        />
        <StatCard
          label="AWAITING RESPONSE"
          value={stats.todaySubmissions}
          change="+8"
          caption="awaiting"
          icon={ClockIcon}
          iconColor="bg-orange-50 text-orange-600"
        />
        <StatCard
          label="CONVERSION RATE"
          value={`${stats.conversionRate}%`}
          change="+3%"
          caption="converted"
          icon={ArrowTrendingUpIcon}
          iconColor="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Stats Row 2 - 3 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard2
          label="Hiring Enquiries"
          value={stats.hiringEnquiries}
          today={Math.floor(stats.todaySubmissions / 3)}
          count={5}
          icon={BriefcaseIcon}
          iconColor="bg-indigo-600 text-white"
        />
        <StatCard2
          label="Talent Submissions"
          value={stats.talentSubmissions}
          today={Math.floor(stats.todaySubmissions / 3)}
          count={8}
          icon={UserCircleIcon}
          iconColor="bg-pink-600 text-white"
        />
        <StatCard2
          label="Contact Forms"
          value={stats.contactForms}
          today={Math.floor(stats.todaySubmissions / 3)}
          count={3}
          icon={EnvelopeIcon}
          iconColor="bg-purple-600 text-white"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Line Chart */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/60">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Activity Overview</h3>
              <p className="text-xs text-slate-500 mt-0.5">Last 7 days</p>
            </div>
            <ChartBarIcon className="stat-icon w-7 h-7 text-blue-600" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="day"
                stroke="#94a3b8"
                style={{ fontSize: "11px", fontWeight: 600 }}
              />
              <YAxis stroke="#94a3b8" style={{ fontSize: "11px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "11px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
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
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/60">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Submission Types</h3>
              <p className="text-xs text-slate-500 mt-0.5">Distribution</p>
            </div>
            <ChartBarIcon className="stat-icon w-7 h-7 text-purple-600" />
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="flex-1 w-full relative">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Hiring", value: stats.hiringEnquiries, color: "#4f46e5" },
                      { name: "Talent", value: stats.talentSubmissions, color: "#ec4899" },
                      { name: "Contact", value: stats.contactForms, color: "#8b5cf6" },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {[
                      { name: "Hiring", value: stats.hiringEnquiries, color: "#4f46e5" },
                      { name: "Talent", value: stats.talentSubmissions, color: "#ec4899" },
                      { name: "Contact", value: stats.contactForms, color: "#8b5cf6" },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "11px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-3xl font-bold text-slate-900">
                  {stats.totalSubmissions}
                </p>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Total</p>
              </div>
            </div>
            <div className="space-y-3 w-full lg:w-auto">
              <PieLegendItem
                color="#4f46e5"
                label="Hiring"
                value={stats.hiringEnquiries}
                percentage={Math.round(
                  (stats.hiringEnquiries / (stats.totalSubmissions || 1)) * 100
                )}
              />
              <PieLegendItem
                color="#ec4899"
                label="Talent"
                value={stats.talentSubmissions}
                percentage={Math.round(
                  (stats.talentSubmissions / (stats.totalSubmissions || 1)) * 100
                )}
              />
              <PieLegendItem
                color="#8b5cf6"
                label="Contact"
                value={stats.contactForms}
                percentage={Math.round(
                  (stats.contactForms / (stats.totalSubmissions || 1)) * 100
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/60">
        <div className="flex items-center gap-2.5 mb-4">
          <ClockIcon className="stat-icon w-7 h-7 text-indigo-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
            <p className="text-xs text-slate-500">{recentActivity.length} latest entries</p>
          </div>
        </div>

        <div className="space-y-1">
          {recentActivity.map((activity) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              relativeTime={getRelativeTime(activity.created_at)}
            />
          ))}

          {recentActivity.length === 0 && (
            <div className="text-center py-8">
              <ExclamationCircleIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No recent activity</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </DashboardLayout>
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
  const colorMap: Record<string, string> = {
    'bg-blue-50 text-blue-600': 'text-blue-600',
    'bg-purple-50 text-purple-600': 'text-purple-600',
    'bg-orange-50 text-orange-600': 'text-orange-600',
    'bg-emerald-50 text-emerald-600': 'text-emerald-600',
  };
  
  const iconOnlyColor = colorMap[iconColor] || 'text-slate-600';
  
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-200 hover:border-slate-300/60 group cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          {label}
        </span>
        <Icon className={`stat-icon w-7 h-7 ${iconOnlyColor} group-hover:scale-110 transition-transform duration-200`} />
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">
            {change}
          </span>
          <span className="text-[10px] text-slate-500 font-medium">{caption}</span>
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
  const colorMap: Record<string, string> = {
    'bg-indigo-600 text-white': 'text-indigo-600',
    'bg-pink-600 text-white': 'text-pink-600',
    'bg-purple-600 text-white': 'text-purple-600',
  };
  
  const iconOnlyColor = colorMap[iconColor] || 'text-slate-600';
  
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-200 hover:border-slate-300/60 group cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xs font-bold text-slate-900">{label}</h3>
        <Icon className={`stat-icon w-7 h-7 ${iconOnlyColor} group-hover:scale-110 transition-transform duration-200`} />
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500 font-medium">Today: <span className="font-bold text-slate-900">{today}</span></p>
        <div className="flex justify-end">
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold">
            +{count}
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
    <div className="flex items-center gap-2.5 py-1.5 hover:bg-slate-50 px-2 -mx-2 rounded-lg cursor-pointer transition-colors">
      <div 
        className="w-3 h-3 rounded-full shadow-sm" 
        style={{ backgroundColor: color }} 
      />
      <div className="flex-1">
        <p className="text-xs font-bold text-slate-900">{label}</p>
        <p className="text-[10px] text-slate-500">
          <span className="font-bold">{value}</span> <span className="text-slate-400">({percentage}%)</span>
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
        return "bg-indigo-600";
      case "talent":
        return "bg-pink-600";
      case "contact":
        return "bg-purple-600";
      default:
        return "bg-slate-600";
    }
  };

  const TypeIcon = getTypeIcon(activity.type);

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-all duration-200 cursor-pointer group border border-transparent hover:border-slate-200">
      <div className={`w-9 h-9 rounded-lg ${getTypeColor(activity.type)} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-200`}>
        <TypeIcon className="activity-icon w-5 h-5 text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-900 truncate">{activity.name}</p>
        <p className="text-[10px] text-slate-500 truncate">{activity.email}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {activity.score && (
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">
            {activity.score}
          </span>
        )}
        <span className="text-[10px] text-slate-400 w-8 text-right font-semibold">{relativeTime}</span>
        <ChevronRightIcon className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all duration-200" />
      </div>
    </div>
  );
}
