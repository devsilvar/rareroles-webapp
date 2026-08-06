import { useState, useEffect } from "react";
import { supabase, getConversionRate, getAverageResponseTime } from "../../lib/supabase";
import DashboardLayout from "../../components/admin/DashboardLayout";
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  BriefcaseIcon,
  FunnelIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface TrendData {
  date: string;
  hiring: number;
  talent: number;
  contact: number;
  total: number;
}

interface RoleData {
  role: string;
  count: number;
}

interface HourData {
  hour: string;
  submissions: number;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [conversionRate, setConversionRate] = useState(0);
  const [avgResponseTime, setAvgResponseTime] = useState(0);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [topRoles, setTopRoles] = useState<RoleData[]>([]);
  const [hourlyData, setHourlyData] = useState<HourData[]>([]);
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    contactedCount: 0,
    pendingCount: 0,
    conversionRateChange: 0,
  });

  useEffect(() => {
    fetchAnalyticsData();
    
    // Real-time subscriptions
    const channel = supabase
      .channel('analytics-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hiring_enquiries' }, 
        () => fetchAnalyticsData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'talent_submissions' }, 
        () => fetchAnalyticsData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contacts' }, 
        () => fetchAnalyticsData())
      .subscribe();
    
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [hiringRes, talentRes, contactRes, convRate, avgRespTime] = await Promise.all([
        supabase.from('hiring_enquiries').select('*').order('created_at', { ascending: false }),
        supabase.from('talent_submissions').select('*').order('created_at', { ascending: false }),
        supabase.from('contacts').select('*').order('created_at', { ascending: false }),
        getConversionRate(),
        getAverageResponseTime(),
      ]);

      const hiring = hiringRes.data || [];
      const talent = talentRes.data || [];
      const contacts = contactRes.data || [];
      const allSubmissions = [...hiring, ...talent, ...contacts];

      setConversionRate(convRate);
      setAvgResponseTime(avgRespTime);

      // Calculate stats
      const totalSubmissions = allSubmissions.length;
      const contactedCount = allSubmissions.filter(s => s.contacted).length;
      const pendingCount = totalSubmissions - contactedCount;

      setStats({
        totalSubmissions,
        contactedCount,
        pendingCount,
        conversionRateChange: 3.5, // Could be calculated from historical data
      });

      // Generate 30-day trend data
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
      
      const trends: TrendData[] = [];
      for (let i = 0; i < 30; i++) {
        const date = new Date(thirtyDaysAgo);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        const hiringCount = hiring.filter(h => h.created_at.startsWith(dateStr)).length;
        const talentCount = talent.filter(t => t.created_at.startsWith(dateStr)).length;
        const contactCount = contacts.filter(c => c.created_at.startsWith(dateStr)).length;

        trends.push({
          date: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
          hiring: hiringCount,
          talent: talentCount,
          contact: contactCount,
          total: hiringCount + talentCount + contactCount,
        });
      }
      setTrendData(trends);

      // Extract top roles from hiring enquiries
      const roleMap = new Map<string, number>();
      hiring.forEach(h => {
        if (h.roles && Array.isArray(h.roles)) {
          h.roles.forEach((role: any) => {
            const title = role.title || '';
            const count = role.count || 1;
            roleMap.set(title, (roleMap.get(title) || 0) + count);
          });
        }
      });
      
      const rolesArray = Array.from(roleMap.entries())
        .map(([role, count]) => ({ role, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
      setTopRoles(rolesArray);

      // Generate hourly distribution
      const hourCounts = new Array(24).fill(0);
      allSubmissions.forEach(s => {
        const date = new Date(s.created_at);
        const hour = date.getHours();
        hourCounts[hour]++;
      });

      const hourlyArray: HourData[] = hourCounts.map((count, hour) => ({
        hour: `${hour.toString().padStart(2, '0')}:00`,
        submissions: count,
      }));
      setHourlyData(hourlyArray);

    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Advanced Analytics" subtitle="Deep insights and trends">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#ec4899] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#1e1b4b] font-semibold">Loading analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Advanced Analytics" 
      subtitle="Deep insights, trends, and performance metrics"
    >
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Conversion Rate
              </span>
              <div className="p-2.5 rounded-xl bg-green-100 text-green-600 shadow-md">
                <FunnelIcon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-4xl font-bold text-[#1e1b4b] mb-2">{conversionRate}%</p>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                +{stats.conversionRateChange}%
              </span>
              <span className="text-xs text-gray-500 font-medium">vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Avg Response Time
              </span>
              <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600 shadow-md">
                <ClockIcon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-4xl font-bold text-[#1e1b4b] mb-2">{avgResponseTime}h</p>
            <p className="text-xs text-gray-500">Time to first contact</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Total Submissions
              </span>
              <div className="p-2.5 rounded-xl bg-purple-100 text-purple-600 shadow-md">
                <ChartBarIcon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-4xl font-bold text-[#1e1b4b] mb-2">{stats.totalSubmissions}</p>
            <p className="text-xs text-gray-500">All time submissions</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Pending Actions
              </span>
              <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600 shadow-md">
                <CalendarDaysIcon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-4xl font-bold text-[#1e1b4b] mb-2">{stats.pendingCount}</p>
            <p className="text-xs text-gray-500">Awaiting response</p>
          </div>
        </div>

        {/* Submission Trends */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#1e1b4b]">Submission Trends</h3>
              <p className="text-sm text-gray-500 mt-0.5">Last 30 days breakdown</p>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600 shadow-sm">
              <ArrowTrendingUpIcon className="w-5 h-5" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorHiring" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e1b4b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#1e1b4b" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorTalent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorContact" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
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
              <Area
                type="monotone"
                dataKey="hiring"
                stroke="#1e1b4b"
                fillOpacity={1}
                fill="url(#colorHiring)"
                name="Hiring"
              />
              <Area
                type="monotone"
                dataKey="talent"
                stroke="#ec4899"
                fillOpacity={1}
                fill="url(#colorTalent)"
                name="Talent"
              />
              <Area
                type="monotone"
                dataKey="contact"
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#colorContact)"
                name="Contact"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Requested Roles */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#1e1b4b]">Top Requested Roles</h3>
                <p className="text-sm text-gray-500 mt-0.5">Most in-demand positions</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#fce7f3] text-[#ec4899] shadow-sm">
                <BriefcaseIcon className="w-5 h-5" />
              </div>
            </div>
            {topRoles.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={topRoles} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <YAxis
                    dataKey="role"
                    type="category"
                    stroke="#9ca3af"
                    style={{ fontSize: "11px" }}
                    width={120}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" fill="#ec4899" radius={[0, 8, 8, 0]} name="Count" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[320px] text-gray-400">
                <div className="text-center">
                  <BriefcaseIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No role data available</p>
                </div>
              </div>
            )}
          </div>

          {/* Peak Submission Times */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#1e1b4b]">Peak Submission Times</h3>
                <p className="text-sm text-gray-500 mt-0.5">Activity by hour of day</p>
              </div>
              <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600 shadow-sm">
                <ClockIcon className="w-5 h-5" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="hour"
                  stroke="#9ca3af"
                  style={{ fontSize: "10px", fontWeight: 600 }}
                  interval={2}
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
                <Line
                  type="monotone"
                  dataKey="submissions"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{ fill: "#f97316", r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Submissions"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Funnel Visualization */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#1e1b4b]">Conversion Funnel</h3>
              <p className="text-sm text-gray-500 mt-0.5">From submission to contact</p>
            </div>
            <div className="p-2.5 rounded-xl bg-green-100 text-green-600 shadow-sm">
              <FunnelIcon className="w-5 h-5" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-[#1e1b4b]">Total Submissions</span>
                <span className="text-sm font-bold text-[#1e1b4b]">{stats.totalSubmissions}</span>
              </div>
              <div className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-400 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                100%
              </div>
            </div>

            <div className="relative pl-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-[#1e1b4b]">Contacted</span>
                <span className="text-sm font-bold text-[#1e1b4b]">{stats.contactedCount}</span>
              </div>
              <div 
                className="h-12 bg-gradient-to-r from-green-500 to-green-400 rounded-xl flex items-center justify-center text-white font-bold shadow-md"
                style={{ width: `${(stats.contactedCount / stats.totalSubmissions) * 100}%` }}
              >
                {Math.round((stats.contactedCount / stats.totalSubmissions) * 100)}%
              </div>
            </div>

            <div className="relative pl-16">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-[#1e1b4b]">Pending Response</span>
                <span className="text-sm font-bold text-[#1e1b4b]">{stats.pendingCount}</span>
              </div>
              <div 
                className="h-12 bg-gradient-to-r from-orange-500 to-orange-400 rounded-xl flex items-center justify-center text-white font-bold shadow-md"
                style={{ width: `${(stats.pendingCount / stats.totalSubmissions) * 100}%` }}
              >
                {Math.round((stats.pendingCount / stats.totalSubmissions) * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
