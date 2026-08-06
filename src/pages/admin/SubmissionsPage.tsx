import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import DashboardLayout from "../../components/admin/DashboardLayout";
import Pagination from "../../components/admin/Pagination";
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  CalendarIcon,
  EnvelopeIcon,
  UserCircleIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  CheckIcon,
  EyeIcon,
  FunnelIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

interface Submission {
  id: string;
  type: "hiring" | "talent" | "contact";
  name: string;
  email: string;
  primaryInfo: string;
  secondaryInfo?: string;
  contacted: boolean;
  created_at: string;
  fullData: any;
}

const ITEMS_PER_PAGE = 15;

export default function SubmissionsPageNew() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "hiring" | "talent" | "contact">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "contacted" | "pending">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({ hiring: 0, talent: 0, contact: 0, total: 0 });

  useEffect(() => {
    fetchAllSubmissions();
    
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
    setCurrentPage(1); // Reset to first page when filters change
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

      const contacts = (contactRes.data || []).map(c => ({
        id: c.id,
        type: "contact" as const,
        name: c.name,
        email: c.email,
        primaryInfo: c.company || 'Individual',
        secondaryInfo: c.message.substring(0, 50) + '...',
        contacted: c.contacted,
        created_at: c.created_at,
        fullData: c,
      }));

      const all = [...hiring, ...talent, ...contacts].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setSubmissions(all);
      setStats({
        hiring: hiring.length,
        talent: talent.length,
        contact: contacts.length,
        total: all.length,
      });
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSubmissions = () => {
    let filtered = [...submissions];

    if (typeFilter !== "all") {
      filtered = filtered.filter(s => s.type === typeFilter);
    }

    if (statusFilter === "contacted") {
      filtered = filtered.filter(s => s.contacted);
    } else if (statusFilter === "pending") {
      filtered = filtered.filter(s => !s.contacted);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        s.primaryInfo.toLowerCase().includes(term) ||
        s.secondaryInfo?.toLowerCase().includes(term)
      );
    }

    setFilteredSubmissions(filtered);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "hiring": return BriefcaseIcon;
      case "talent": return UserCircleIcon;
      case "contact": return ChatBubbleLeftRightIcon;
      default: return DocumentTextIcon;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "hiring": return "from-pink-600 to-rose-600";
      case "talent": return "from-indigo-600 to-purple-600";
      case "contact": return "from-purple-600 to-indigo-600";
      default: return "from-slate-600 to-slate-700";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Pagination
  const totalPages = Math.ceil(filteredSubmissions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSubmissions = filteredSubmissions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) {
    return (
      <DashboardLayout title="All Submissions" subtitle="Unified view">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-700 font-semibold">Loading submissions...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="All Submissions" subtitle={`${filteredSubmissions.length} total submissions`}>
      <div className="space-y-4">
        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/60">
          <div className="flex flex-col gap-3">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search submissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300 focus:bg-white transition-all"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-slate-400" />
              
              {/* Type Filter */}
              <div className="flex gap-1">
                <button
                  onClick={() => setTypeFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    typeFilter === "all"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  All ({stats.total})
                </button>
                <button
                  onClick={() => setTypeFilter("hiring")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    typeFilter === "hiring"
                      ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Hiring ({stats.hiring})
                </button>
                <button
                  onClick={() => setTypeFilter("talent")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    typeFilter === "talent"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Talent ({stats.talent})
                </button>
                <button
                  onClick={() => setTypeFilter("contact")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    typeFilter === "contact"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Contact ({stats.contact})
                </button>
              </div>

              <div className="h-6 w-px bg-slate-300" />

              {/* Status Filter */}
              <div className="flex gap-1">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === "all"
                      ? "bg-slate-700 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  All Status
                </button>
                <button
                  onClick={() => setStatusFilter("pending")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === "pending"
                      ? "bg-orange-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setStatusFilter("contacted")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === "contacted"
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Contacted
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Primary Info
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Secondary
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedSubmissions.map((submission) => {
                  const TypeIcon = getTypeIcon(submission.type);
                  return (
                    <tr
                      key={submission.id}
                      className="table-row hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      <td className="px-3 py-2">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getTypeColor(submission.type)} flex items-center justify-center`}>
                          <TypeIcon className="w-4 h-4 text-white" />
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <p className="text-xs font-semibold text-slate-900">{submission.name}</p>
                        <p className="text-[10px] text-slate-500">{submission.email}</p>
                      </td>
                      <td className="px-3 py-2">
                        <span className="text-xs text-slate-700">{submission.primaryInfo}</span>
                      </td>
                      <td className="px-3 py-2">
                        <span className="text-xs text-slate-600">{submission.secondaryInfo || 'N/A'}</span>
                      </td>
                      <td className="px-3 py-2">
                        <span className="text-[10px] text-slate-500">{formatDate(submission.created_at)}</span>
                      </td>
                      <td className="px-3 py-2">
                        {submission.contacted ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-semibold">
                            <CheckIcon className="w-3 h-3" />
                            Done
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 text-[10px] font-semibold">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {paginatedSubmissions.length === 0 && (
              <div className="text-center py-12">
                <DocumentTextIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-700 mb-1">No submissions found</p>
                <p className="text-xs text-slate-500">Try adjusting your filters</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {paginatedSubmissions.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredSubmissions.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
