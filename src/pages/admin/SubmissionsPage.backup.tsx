import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import DashboardLayout from "../../components/admin/DashboardLayout";
import { StatusBadge } from "../../components/admin/StatusBadge";
import { TypeBadge } from "../../components/admin/TypeBadge";
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  CalendarIcon,
  EnvelopeIcon,
  UserIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  CheckIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

interface Submission {
  id: string;
  type: "hiring" | "talent" | "contact";
  name: string;
  email: string;
  primaryInfo: string; // role/company/company
  secondaryInfo?: string; // location/location/message preview
  contacted: boolean;
  created_at: string;
  fullData: any;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "hiring" | "talent" | "contact">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "contacted" | "pending">("all");
  const [stats, setStats] = useState({ hiring: 0, talent: 0, contact: 0, total: 0 });

  useEffect(() => {
    fetchAllSubmissions();
    
    // Real-time subscriptions for all tables
    const channel = supabase
      .channel('all-submissions-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hiring_enquiries' }, 
        () => fetchAllSubmissions())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'talent_submissions' }, 
        () => fetchAllSubmissions())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contacts' }, 
        () => fetchAllSubmissions())
      .subscribe();
    
    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [submissions, searchTerm, typeFilter, statusFilter]);

  const fetchAllSubmissions = async () => {
    setLoading(true);
    try {
      const [hiringRes, talentRes, contactRes] = await Promise.all([
        supabase.from('hiring_enquiries').select('*').order('created_at', { ascending: false }),
        supabase.from('talent_submissions').select('*').order('created_at', { ascending: false }),
        supabase.from('contacts').select('*').order('created_at', { ascending: false }),
      ]);

      const hiring = (hiringRes.data || []).map(h => ({
        id: h.id,
        type: "hiring" as const,
        name: h.contact_name,
        email: h.email,
        primaryInfo: h.company,
        secondaryInfo: h.location,
        contacted: h.contacted,
        created_at: h.created_at,
        fullData: h,
      }));

      const talent = (talentRes.data || []).map(t => ({
        id: t.id,
        type: "talent" as const,
        name: t.name,
        email: t.email,
        primaryInfo: t.desired_role,
        secondaryInfo: t.location,
        contacted: t.contacted,
        created_at: t.created_at,
        fullData: t,
      }));

      const contact = (contactRes.data || []).map(c => ({
        id: c.id,
        type: "contact" as const,
        name: c.name,
        email: c.email,
        primaryInfo: c.company || "General Inquiry",
        secondaryInfo: c.message.substring(0, 100) + (c.message.length > 100 ? "..." : ""),
        contacted: c.contacted,
        created_at: c.created_at,
        fullData: c,
      }));

      const allSubmissions = [...hiring, ...talent, ...contact].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setSubmissions(allSubmissions);
      setStats({
        hiring: hiring.length,
        talent: talent.length,
        contact: contact.length,
        total: allSubmissions.length,
      });
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSubmissions = () => {
    let filtered = [...submissions];

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(s => s.type === typeFilter);
    }

    // Status filter
    if (statusFilter === "contacted") {
      filtered = filtered.filter(s => s.contacted);
    } else if (statusFilter === "pending") {
      filtered = filtered.filter(s => !s.contacted);
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        s.primaryInfo.toLowerCase().includes(term) ||
        (s.secondaryInfo && s.secondaryInfo.toLowerCase().includes(term))
      );
    }

    setFilteredSubmissions(filtered);
  };

  const markAsContacted = async (submission: Submission) => {
    try {
      const tableName = 
        submission.type === "hiring" ? "hiring_enquiries" :
        submission.type === "talent" ? "talent_submissions" : "contacts";

      const { error } = await supabase
        .from(tableName)
        .update({
          contacted: true,
          contacted_at: new Date().toISOString(),
          contacted_by: 'admin@rareroles.com',
        })
        .eq('id', submission.id);

      if (error) throw error;
      fetchAllSubmissions();
    } catch (error) {
      console.error('Error marking as contacted:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "hiring": return BriefcaseIcon;
      case "talent": return UserIcon;
      case "contact": return EnvelopeIcon;
      default: return DocumentTextIcon;
    }
  };

  const navigateToDetail = (submission: Submission) => {
    const path = `/admin/${submission.type}`;
    window.location.href = path;
  };

  if (loading) {
    return (
      <DashboardLayout title="All Submissions" subtitle="View all submissions in one place">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#ec4899] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#1e1b4b] font-semibold">Loading submissions...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="All Submissions" 
      subtitle={`${filteredSubmissions.length} ${filteredSubmissions.length === 1 ? 'submission' : 'submissions'} found`}
    >
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Total</p>
                <p className="text-2xl font-bold text-[#1e1b4b]">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#1e1b4b] flex items-center justify-center">
                <BriefcaseIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Hiring</p>
                <p className="text-2xl font-bold text-[#1e1b4b]">{stats.hiring}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#ec4899] flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Talent</p>
                <p className="text-2xl font-bold text-[#1e1b4b]">{stats.talent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center">
                <EnvelopeIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Contact</p>
                <p className="text-2xl font-bold text-[#1e1b4b]">{stats.contact}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, company, role, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-sm text-[#1e1b4b] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ec4899] focus:border-transparent transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Type Filter */}
              <div className="flex gap-2">
                <button
                  onClick={() => setTypeFilter("all")}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    typeFilter === "all"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setTypeFilter("hiring")}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    typeFilter === "hiring"
                      ? "bg-[#1e1b4b] text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Hiring ({stats.hiring})
                </button>
                <button
                  onClick={() => setTypeFilter("talent")}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    typeFilter === "talent"
                      ? "bg-[#ec4899] text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Talent ({stats.talent})
                </button>
                <button
                  onClick={() => setTypeFilter("contact")}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    typeFilter === "contact"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Contact ({stats.contact})
                </button>
              </div>

              <div className="w-px h-8 bg-gray-300" />

              {/* Status Filter */}
              <div className="flex gap-2">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    statusFilter === "all"
                      ? "bg-[#1e1b4b] text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All Status
                </button>
                <button
                  onClick={() => setStatusFilter("pending")}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    statusFilter === "pending"
                      ? "bg-orange-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setStatusFilter("contacted")}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    statusFilter === "contacted"
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Contacted
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredSubmissions.map((submission) => {
            const TypeIcon = getTypeIcon(submission.type);
            return (
              <div
                key={`${submission.type}-${submission.id}`}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-[#ec4899]/30 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                      submission.type === "hiring" ? "bg-[#1e1b4b]" :
                      submission.type === "talent" ? "bg-[#ec4899]" : "bg-indigo-600"
                    }`}>
                      <TypeIcon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-lg font-bold text-[#1e1b4b]">{submission.name}</h3>
                        <TypeBadge type={submission.type} />
                        <StatusBadge contacted={submission.contacted} />
                      </div>

                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <EnvelopeIcon className="w-4 h-4" />
                          <a href={`mailto:${submission.email}`} className="hover:text-[#ec4899] transition-colors">
                            {submission.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {submission.type === "hiring" && <BuildingOfficeIcon className="w-4 h-4 text-gray-600" />}
                          {submission.type === "talent" && <BriefcaseIcon className="w-4 h-4 text-gray-600" />}
                          {submission.type === "contact" && <BuildingOfficeIcon className="w-4 h-4 text-gray-600" />}
                          <span className="font-bold text-[#1e1b4b]">{submission.primaryInfo}</span>
                        </div>
                        {submission.secondaryInfo && (
                          <p className="text-sm text-gray-600 line-clamp-1">{submission.secondaryInfo}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{formatDate(submission.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => navigateToDetail(submission)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 font-bold text-sm transition-colors whitespace-nowrap"
                    >
                      <EyeIcon className="w-4 h-4" />
                      View Details
                    </button>
                    {!submission.contacted && (
                      <button
                        onClick={() => markAsContacted(submission)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 font-bold text-sm transition-colors whitespace-nowrap"
                      >
                        <CheckIcon className="w-4 h-4" />
                        Mark Contacted
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
            <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-600 mb-2">No submissions found</h3>
            <p className="text-gray-500">
              {searchTerm || typeFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "No submissions yet"}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
