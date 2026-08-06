import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import DashboardLayout from "../../components/admin/DashboardLayout";
import { StatusBadge } from "../../components/admin/StatusBadge";
import { downloadCVWithFallback } from "../../lib/cloudinary-utils";
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  EnvelopeIcon,
  MapPinIcon,
  BriefcaseIcon,
  CalendarIcon,
  LinkIcon,
  DocumentArrowDownIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface TalentSubmission {
  id: string;
  name: string;
  email: string;
  desired_role: string;
  experience?: string;
  location?: string;
  links?: string;
  about?: string;
  cv_url?: string;
  cv_file_path?: string;
  cv_file_name?: string;
  contacted: boolean;
  contacted_at?: string;
  contacted_by?: string;
  created_at: string;
}

export default function TalentPage() {
  const [submissions, setSubmissions] = useState<TalentSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<TalentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "contacted" | "pending">("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedTalent, setSelectedTalent] = useState<TalentSubmission | null>(null);

  useEffect(() => {
    fetchSubmissions();
    
    // Real-time subscription
    const channel = supabase
      .channel('talent-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'talent_submissions' }, 
        () => fetchSubmissions())
      .subscribe();
    
    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [submissions, searchTerm, statusFilter, roleFilter]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('talent_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching talent submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSubmissions = () => {
    let filtered = [...submissions];

    // Status filter
    if (statusFilter === "contacted") {
      filtered = filtered.filter(s => s.contacted);
    } else if (statusFilter === "pending") {
      filtered = filtered.filter(s => !s.contacted);
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter(s => 
        s.desired_role.toLowerCase().includes(roleFilter.toLowerCase())
      );
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        s.desired_role.toLowerCase().includes(term) ||
        (s.location && s.location.toLowerCase().includes(term))
      );
    }

    setFilteredSubmissions(filtered);
  };

  const markAsContacted = async (id: string) => {
    try {
      const { error } = await supabase
        .from('talent_submissions')
        .update({
          contacted: true,
          contacted_at: new Date().toISOString(),
          contacted_by: 'admin@rareroles.com',
        })
        .eq('id', id);

      if (error) throw error;
      fetchSubmissions();
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

  const downloadCV = async (cv_url?: string, cv_file_name?: string) => {
    if (!cv_url) {
      alert('No CV available for download');
      return;
    }
    
    try {
      const result = await downloadCVWithFallback(cv_url, cv_file_name || 'CV.pdf');
      
      if (!result.success) {
        alert(
          'Failed to download CV. This might be a Cloudinary configuration issue.\n\n' +
          'Error: ' + (result.error || 'Unknown error') + '\n\n' +
          'Please check FIX_CLOUDINARY_CV_401_ERROR.md for solutions.'
        );
      } else {
        console.log(`[CV Download] Success using ${result.method}`);
      }
    } catch (error: any) {
      console.error('Error downloading CV:', error);
      alert(
        'An unexpected error occurred while downloading the CV.\n\n' +
        'The file might be opening in a new tab instead.'
      );
      // Last resort fallback
      window.open(cv_url, '_blank');
    }
  };

  // Get unique roles for filtering
  const uniqueRoles = Array.from(new Set(submissions.map(s => s.desired_role)))
    .filter(Boolean)
    .sort();

  if (loading) {
    return (
      <DashboardLayout title="Talent Submissions" subtitle="Manage talent profiles and CVs">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#ec4899] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#1e1b4b] font-semibold">Loading talent submissions...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Talent Submissions" 
      subtitle={`${filteredSubmissions.length} ${filteredSubmissions.length === 1 ? 'submission' : 'submissions'} found`}
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, role, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-sm text-[#1e1b4b] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ec4899] focus:border-transparent transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-2">
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
                  All ({submissions.length})
                </button>
                <button
                  onClick={() => setStatusFilter("pending")}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    statusFilter === "pending"
                      ? "bg-orange-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Pending ({submissions.filter(s => !s.contacted).length})
                </button>
                <button
                  onClick={() => setStatusFilter("contacted")}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    statusFilter === "contacted"
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Contacted ({submissions.filter(s => s.contacted).length})
                </button>
              </div>

              {/* Role Filter */}
              {uniqueRoles.length > 0 && (
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 rounded-xl border-2 border-gray-200 bg-white text-sm font-bold text-[#1e1b4b] focus:outline-none focus:ring-2 focus:ring-[#ec4899] focus:border-transparent transition-all"
                >
                  <option value="all">All Roles</option>
                  {uniqueRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Submissions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-[#ec4899]/30 transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedTalent(submission)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ec4899] to-[#f472b6] flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {submission.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#1e1b4b]">{submission.name}</h3>
                      <p className="text-sm text-gray-500">{submission.email}</p>
                    </div>
                  </div>
                  <StatusBadge contacted={submission.contacted} className="mb-3" />
                </div>

                {!submission.contacted && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsContacted(submission.id);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 font-bold text-sm transition-colors"
                  >
                    <CheckIcon className="w-4 h-4" />
                    Mark Contacted
                  </button>
                )}
              </div>

              {/* Role and Experience */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <BriefcaseIcon className="w-4 h-4 text-[#ec4899]" />
                  <span className="font-bold text-[#1e1b4b]">{submission.desired_role}</span>
                </div>
                {submission.experience && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-semibold">Experience:</span>
                    <span>{submission.experience}</span>
                  </div>
                )}
                {submission.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{submission.location}</span>
                  </div>
                )}
              </div>

              {/* About */}
              {submission.about && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                  {submission.about}
                </p>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                {submission.cv_url && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadCV(submission.cv_url, submission.cv_file_name);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1e1b4b] text-white hover:bg-[#2d2a6e] font-bold text-sm transition-colors"
                  >
                    <DocumentArrowDownIcon className="w-4 h-4" />
                    Download CV
                  </button>
                )}
                {submission.links && (
                  <a
                    href={submission.links}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 font-bold text-sm transition-colors"
                  >
                    <LinkIcon className="w-4 h-4" />
                    LinkedIn/Portfolio
                  </a>
                )}
                <a
                  href={`mailto:${submission.email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200 font-bold text-sm transition-colors"
                >
                  <EnvelopeIcon className="w-4 h-4" />
                  Email
                </a>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
                <CalendarIcon className="w-4 h-4" />
                <span>{formatDate(submission.created_at)}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
            <UserCircleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-600 mb-2">No talent submissions found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all" || roleFilter !== "all"
                ? "Try adjusting your filters"
                : "No talent submissions yet"}
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedTalent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedTalent(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-[#1e1b4b] to-[#2d2a6e] text-white p-6 rounded-t-2xl flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {selectedTalent.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedTalent.name}</h2>
                  <p className="text-white/80">{selectedTalent.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTalent(null)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <StatusBadge contacted={selectedTalent.contacted} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Desired Role</label>
                  <p className="text-lg font-bold text-[#1e1b4b] mt-1">{selectedTalent.desired_role}</p>
                </div>
                {selectedTalent.experience && (
                  <div>
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Experience Level</label>
                    <p className="text-lg font-bold text-[#1e1b4b] mt-1">{selectedTalent.experience}</p>
                  </div>
                )}
                {selectedTalent.location && (
                  <div>
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Location</label>
                    <p className="text-lg font-bold text-[#1e1b4b] mt-1">{selectedTalent.location}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Submitted</label>
                  <p className="text-lg font-bold text-[#1e1b4b] mt-1">{formatDate(selectedTalent.created_at)}</p>
                </div>
              </div>

              {selectedTalent.about && (
                <div>
                  <label className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 block">About</label>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">{selectedTalent.about}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                {selectedTalent.cv_url && (
                  <button
                    onClick={() => downloadCV(selectedTalent.cv_url, selectedTalent.cv_file_name)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#1e1b4b] text-white hover:bg-[#2d2a6e] font-bold transition-colors shadow-md"
                  >
                    <DocumentArrowDownIcon className="w-5 h-5" />
                    Download CV
                  </button>
                )}
                {selectedTalent.links && (
                  <a
                    href={selectedTalent.links}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 font-bold transition-colors"
                  >
                    <LinkIcon className="w-5 h-5" />
                    View Profile
                  </a>
                )}
                <a
                  href={`mailto:${selectedTalent.email}`}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200 font-bold transition-colors"
                >
                  <EnvelopeIcon className="w-5 h-5" />
                  Send Email
                </a>
                {!selectedTalent.contacted && (
                  <button
                    onClick={() => {
                      markAsContacted(selectedTalent.id);
                      setSelectedTalent(null);
                    }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 font-bold transition-colors ml-auto"
                  >
                    <CheckIcon className="w-5 h-5" />
                    Mark as Contacted
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
