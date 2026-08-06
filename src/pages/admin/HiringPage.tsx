import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import DashboardLayout from "../../components/admin/DashboardLayout";
import Pagination from "../../components/admin/Pagination";
import {
  MagnifyingGlassIcon,
  BriefcaseIcon,
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  EnvelopeIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  FunnelIcon,
  BuildingOfficeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface HiringEnquiry {
  id: string;
  company: string;
  contact_name: string;
  email: string;
  location?: string;
  roles: Array<{ title: string; count: number }>;
  seniority?: string;
  timeline?: string;
  details?: string;
  contacted: boolean;
  contacted_at?: string;
  contacted_by?: string;
  created_at: string;
}

const ITEMS_PER_PAGE = 15;

export default function HiringPageNew() {
  const [enquiries, setEnquiries] = useState<HiringEnquiry[]>([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState<HiringEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "contacted" | "pending">("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<HiringEnquiry | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchEnquiries();
    
    const channel = supabase
      .channel('hiring-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hiring_enquiries' }, 
        () => fetchEnquiries())
      .subscribe();
    
    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    filterEnquiries();
    setCurrentPage(1); // Reset to first page when filters change
  }, [enquiries, searchTerm, statusFilter]);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('hiring_enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEnquiries(data || []);
    } catch (error) {
      console.error('Error fetching hiring enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEnquiries = () => {
    let filtered = [...enquiries];

    if (statusFilter === "contacted") {
      filtered = filtered.filter(e => e.contacted);
    } else if (statusFilter === "pending") {
      filtered = filtered.filter(e => !e.contacted);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(e =>
        e.company.toLowerCase().includes(term) ||
        e.contact_name.toLowerCase().includes(term) ||
        e.email.toLowerCase().includes(term) ||
        e.location?.toLowerCase().includes(term) ||
        e.roles.some(r => r.title.toLowerCase().includes(term))
      );
    }

    setFilteredEnquiries(filtered);
  };

  const toggleContacted = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('hiring_enquiries')
        .update({ 
          contacted: !currentStatus,
          contacted_at: !currentStatus ? new Date().toISOString() : null,
        })
        .eq('id', id);

      if (error) throw error;
      fetchEnquiries();
    } catch (error) {
      console.error('Error updating contacted status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTotalRoles = (roles: Array<{ title: string; count: number }>) => {
    return roles.reduce((sum, role) => sum + role.count, 0);
  };

  // Pagination
  const totalPages = Math.ceil(filteredEnquiries.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEnquiries = filteredEnquiries.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) {
    return (
      <DashboardLayout title="Hiring Enquiries" subtitle="Manage company requests">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-700 font-semibold">Loading enquiries...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Hiring Enquiries" subtitle={`${filteredEnquiries.length} enquiries`}>
      <div className="space-y-4">
        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/60">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by company, name, email, role, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300 focus:bg-white transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-slate-400" />
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === "all"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All ({enquiries.length})
              </button>
              <button
                onClick={() => setStatusFilter("pending")}
                className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === "pending"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Pending ({enquiries.filter(e => !e.contacted).length})
              </button>
              <button
                onClick={() => setStatusFilter("contacted")}
                className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === "contacted"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Contacted ({enquiries.filter(e => e.contacted).length})
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Roles
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Timeline
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedEnquiries.map((enquiry) => (
                  <tr
                    key={enquiry.id}
                    className="table-row hover:bg-slate-50 transition-all cursor-pointer"
                    onClick={() => setSelectedEnquiry(enquiry)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center text-white font-bold text-sm">
                          {enquiry.company.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{enquiry.company}</p>
                          <p className="text-xs text-slate-500">{formatDate(enquiry.created_at)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-slate-900">{enquiry.contact_name}</p>
                      <p className="text-xs text-slate-500">{enquiry.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
                          {getTotalRoles(enquiry.roles)} {getTotalRoles(enquiry.roles) === 1 ? 'Role' : 'Roles'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <MapPinIcon className="w-4 h-4 text-slate-400" />
                        {enquiry.location || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-700">{enquiry.timeline || 'N/A'}</span>
                    </td>
                    <td className="px-4 py-3">
                      {enquiry.contacted ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
                          <CheckIcon className="w-3 h-3" />
                          Contacted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEnquiry(enquiry);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-semibold transition-all"
                      >
                        <EyeIcon className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {paginatedEnquiries.length === 0 && (
              <div className="text-center py-12">
                <BuildingOfficeIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-700 mb-1">No hiring enquiries found</p>
                <p className="text-xs text-slate-500">Try adjusting your filters</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {paginatedEnquiries.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredEnquiries.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedEnquiry && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
          onClick={() => setSelectedEnquiry(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-pink-600 to-rose-600 text-white p-6 rounded-t-2xl flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-2xl">
                  {selectedEnquiry.company.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedEnquiry.company}</h2>
                  <p className="text-white/80 text-sm mt-1">{selectedEnquiry.contact_name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <EnvelopeIcon className="w-5 h-5 text-pink-600" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <UserIcon className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Contact Person</p>
                      <p className="text-sm font-semibold text-slate-900">{selectedEnquiry.contact_name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <EnvelopeIcon className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Email</p>
                      <p className="text-sm text-slate-900 break-all">{selectedEnquiry.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <MapPinIcon className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Location</p>
                      <p className="text-sm text-slate-900">{selectedEnquiry.location || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <ClockIcon className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Timeline</p>
                      <p className="text-sm text-slate-900">{selectedEnquiry.timeline || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Roles */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <BriefcaseIcon className="w-5 h-5 text-pink-600" />
                  Roles Needed ({getTotalRoles(selectedEnquiry.roles)} total)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedEnquiry.roles.map((role, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <BriefcaseIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-semibold text-slate-900">{role.title}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                        ×{role.count}
                      </span>
                    </div>
                  ))}
                </div>
                {selectedEnquiry.seniority && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs font-semibold text-blue-900 mb-1">Seniority Level</p>
                    <p className="text-sm text-blue-800">{selectedEnquiry.seniority}</p>
                  </div>
                )}
              </div>

              {/* Details */}
              {selectedEnquiry.details && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <BuildingOfficeIcon className="w-5 h-5 text-pink-600" />
                    Additional Details
                  </h3>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedEnquiry.details}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-200">
                <button
                  onClick={() => {
                    toggleContacted(selectedEnquiry.id, selectedEnquiry.contacted);
                    setSelectedEnquiry(null);
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md ${
                    selectedEnquiry.contacted
                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  <CheckIcon className="w-5 h-5" />
                  {selectedEnquiry.contacted ? "Mark as Pending" : "Mark as Contacted"}
                </button>
                <button
                  onClick={() => window.open(`mailto:${selectedEnquiry.email}`, '_blank')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-pink-600 text-white hover:bg-pink-700 text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                >
                  <EnvelopeIcon className="w-5 h-5" />
                  Send Email
                </button>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-200 text-xs text-slate-500">
                <CalendarIcon className="w-4 h-4" />
                Submitted on {formatDate(selectedEnquiry.created_at)}
                {selectedEnquiry.contacted_at && (
                  <>
                    <span className="text-slate-300">•</span>
                    Contacted on {formatDate(selectedEnquiry.contacted_at)}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
