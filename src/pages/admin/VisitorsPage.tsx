import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import DashboardLayout from "../../components/admin/DashboardLayout";
import {
  EyeIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  MapPinIcon,
  CalendarIcon,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface VisitorData {
  email: string;
  name: string;
  location?: string;
  type: "hiring" | "talent" | "contact";
  dates: string[];
}

interface TimelineData {
  date: string;
  visitors: number;
  new: number;
  returning: number;
}

export default function VisitorsPage() {
  const [loading, setLoading] = useState(true);
  const [visitors, setVisitors] = useState<VisitorData[]>([]);
  const [timelineData, setTimelineData] = useState<TimelineData[]>([]);
  const [stats, setStats] = useState({
    totalVisitors: 0,
    newVisitors: 0,
    returningVisitors: 0,
    averageVisits: 0,
  });
  const [locationData, setLocationData] = useState<{ name: string; value: number }[]>([]);
  const [typeData, setTypeData] = useState<{ name: string; value: number; color: string }[]>([]);

  useEffect(() => {
    fetchVisitorData();
    
    // Real-time subscriptions
    const channel = supabase
      .channel('visitors-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hiring_enquiries' }, 
        () => fetchVisitorData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'talent_submissions' }, 
        () => fetchVisitorData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contacts' }, 
        () => fetchVisitorData())
      .subscribe();
    
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchVisitorData = async () => {
    setLoading(true);
    try {
      const [hiringRes, talentRes, contactRes] = await Promise.all([
        supabase.from('hiring_enquiries').select('*').order('created_at', { ascending: false }),
        supabase.from('talent_submissions').select('*').order('created_at', { ascending: false }),
        supabase.from('contacts').select('*').order('created_at', { ascending: false }),
      ]);

      const hiring = hiringRes.data || [];
      const talent = talentRes.data || [];
      const contacts = contactRes.data || [];

      // Process unique visitors
      const visitorMap = new Map<string, VisitorData>();

      hiring.forEach(h => {
        if (!visitorMap.has(h.email)) {
          visitorMap.set(h.email, {
            email: h.email,
            name: h.contact_name,
            location: h.location,
            type: "hiring",
            dates: [h.created_at],
          });
        } else {
          visitorMap.get(h.email)!.dates.push(h.created_at);
        }
      });

      talent.forEach(t => {
        if (!visitorMap.has(t.email)) {
          visitorMap.set(t.email, {
            email: t.email,
            name: t.name,
            location: t.location,
            type: "talent",
            dates: [t.created_at],
          });
        } else {
          visitorMap.get(t.email)!.dates.push(t.created_at);
        }
      });

      contacts.forEach(c => {
        if (!visitorMap.has(c.email)) {
          visitorMap.set(c.email, {
            email: c.email,
            name: c.name,
            location: undefined,
            type: "contact",
            dates: [c.created_at],
          });
        } else {
          visitorMap.get(c.email)!.dates.push(c.created_at);
        }
      });

      const visitorsArray = Array.from(visitorMap.values());
      setVisitors(visitorsArray);

      // Calculate stats
      const totalVisitors = visitorsArray.length;
      const returningVisitors = visitorsArray.filter(v => v.dates.length > 1).length;
      const newVisitors = totalVisitors - returningVisitors;
      const totalVisits = visitorsArray.reduce((sum, v) => sum + v.dates.length, 0);
      const averageVisits = totalVisitors > 0 ? (totalVisits / totalVisitors) : 0;

      setStats({
        totalVisitors,
        newVisitors,
        returningVisitors,
        averageVisits: Number(averageVisits.toFixed(1)),
      });

      // Generate timeline data (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
      
      const timeline: TimelineData[] = [];
      for (let i = 0; i < 30; i++) {
        const date = new Date(thirtyDaysAgo);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        const visitorsOnDate = visitorsArray.filter(v => 
          v.dates.some(d => d.startsWith(dateStr))
        );

        const newOnDate = visitorsOnDate.filter(v => {
          const firstVisit = v.dates.sort()[0];
          return firstVisit.startsWith(dateStr);
        }).length;

        timeline.push({
          date: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
          visitors: visitorsOnDate.length,
          new: newOnDate,
          returning: visitorsOnDate.length - newOnDate,
        });
      }
      setTimelineData(timeline);

      // Location data
      const locationCounts = new Map<string, number>();
      visitorsArray.forEach(v => {
        if (v.location) {
          locationCounts.set(v.location, (locationCounts.get(v.location) || 0) + 1);
        }
      });
      const locationArray = Array.from(locationCounts.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
      setLocationData(locationArray);

      // Type distribution
      const typeCounts = {
        hiring: visitorsArray.filter(v => v.type === "hiring").length,
        talent: visitorsArray.filter(v => v.type === "talent").length,
        contact: visitorsArray.filter(v => v.type === "contact").length,
      };
      setTypeData([
        { name: "Hiring", value: typeCounts.hiring, color: "#1e1b4b" },
        { name: "Talent", value: typeCounts.talent, color: "#ec4899" },
        { name: "Contact", value: typeCounts.contact, color: "#6366f1" },
      ]);

    } catch (error) {
      console.error('Error fetching visitor data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Visitor Analytics" subtitle="Track unique visitors and engagement">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#ec4899] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#1e1b4b] font-semibold">Loading visitor analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Visitor Analytics" 
      subtitle="Track unique visitors and engagement patterns"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Total Visitors
              </span>
              <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600 shadow-md">
                <EyeIcon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-4xl font-bold text-[#1e1b4b] mb-2">{stats.totalVisitors}</p>
            <p className="text-xs text-gray-500">Unique emails (all time)</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                New Visitors
              </span>
              <div className="p-2.5 rounded-xl bg-green-100 text-green-600 shadow-md">
                <ArrowTrendingUpIcon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-4xl font-bold text-[#1e1b4b] mb-2">{stats.newVisitors}</p>
            <p className="text-xs text-gray-500">First-time visitors</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Returning
              </span>
              <div className="p-2.5 rounded-xl bg-purple-100 text-purple-600 shadow-md">
                <UserGroupIcon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-4xl font-bold text-[#1e1b4b] mb-2">{stats.returningVisitors}</p>
            <p className="text-xs text-gray-500">Multiple submissions</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Avg Visits
              </span>
              <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600 shadow-md">
                <CalendarIcon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-4xl font-bold text-[#1e1b4b] mb-2">{stats.averageVisits}</p>
            <p className="text-xs text-gray-500">Per visitor</p>
          </div>
        </div>

        {/* Timeline Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#1e1b4b]">Visitor Timeline</h3>
              <p className="text-sm text-gray-500 mt-0.5">Last 30 days</p>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600 shadow-sm">
              <EyeIcon className="w-5 h-5" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={timelineData}>
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
              <Line
                type="monotone"
                dataKey="visitors"
                stroke="#1e1b4b"
                strokeWidth={3}
                dot={{ fill: "#1e1b4b", r: 4 }}
                activeDot={{ r: 6 }}
                name="Total Visitors"
              />
              <Line
                type="monotone"
                dataKey="new"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", r: 3 }}
                name="New"
              />
              <Line
                type="monotone"
                dataKey="returning"
                stroke="#ec4899"
                strokeWidth={2}
                dot={{ fill: "#ec4899", r: 3 }}
                name="Returning"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visitor Type Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#1e1b4b]">Visitor Types</h3>
                <p className="text-sm text-gray-500 mt-0.5">By submission type</p>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-100 text-purple-600 shadow-sm">
                <UserGroupIcon className="w-5 h-5" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Locations */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#1e1b4b]">Top Locations</h3>
                <p className="text-sm text-gray-500 mt-0.5">Geographic distribution</p>
              </div>
              <div className="p-2.5 rounded-xl bg-green-100 text-green-600 shadow-sm">
                <MapPinIcon className="w-5 h-5" />
              </div>
            </div>
            {locationData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={locationData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#9ca3af"
                    style={{ fontSize: "12px" }}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="value" fill="#ec4899" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[280px] text-gray-400">
                <div className="text-center">
                  <MapPinIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No location data available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Visitor List */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#1e1b4b]">Recent Visitors</h3>
              <p className="text-sm text-gray-500 mt-0.5">Top {Math.min(20, visitors.length)} visitors</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Name</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Email</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Location</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Type</th>
                  <th className="text-center py-3 px-4 text-xs font-bold text-gray-500 uppercase">Visits</th>
                </tr>
              </thead>
              <tbody>
                {visitors.slice(0, 20).map((visitor, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          visitor.type === "hiring" ? "bg-[#1e1b4b]" :
                          visitor.type === "talent" ? "bg-[#ec4899]" : "bg-indigo-600"
                        }`}>
                          {visitor.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-[#1e1b4b]">{visitor.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{visitor.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{visitor.location || "—"}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        visitor.type === "hiring" ? "bg-[#1e1b4b] text-white" :
                        visitor.type === "talent" ? "bg-[#ec4899] text-white" : "bg-indigo-600 text-white"
                      }`}>
                        {visitor.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                        visitor.dates.length > 1 ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"
                      }`}>
                        {visitor.dates.length}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
