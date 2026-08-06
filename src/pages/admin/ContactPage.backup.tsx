import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import DashboardLayout from "../../components/admin/DashboardLayout";
import { StatusBadge } from "../../components/admin/StatusBadge";
import {
  MagnifyingGlassIcon,
  EnvelopeIcon,
  UserIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  CheckIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

interface Contact {
  id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  source: string;
  contacted: boolean;
  contacted_at?: string;
  contacted_by?: string;
  created_at: string;
}

export default function ContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "contacted" | "pending">("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();
    
    // Real-time subscription
    const channel = supabase
      .channel('contact-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contacts' }, 
        () => fetchContacts())
      .subscribe();
    
    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchTerm, statusFilter, sourceFilter]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    let filtered = [...contacts];

    // Status filter
    if (statusFilter === "contacted") {
      filtered = filtered.filter(c => c.contacted);
    } else if (statusFilter === "pending") {
      filtered = filtered.filter(c => !c.contacted);
    }

    // Source filter
    if (sourceFilter !== "all") {
      filtered = filtered.filter(c => c.source === sourceFilter);
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        (c.company && c.company.toLowerCase().includes(term)) ||
        c.message.toLowerCase().includes(term)
      );
    }

    setFilteredContacts(filtered);
  };

  const markAsContacted = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({
          contacted: true,
          contacted_at: new Date().toISOString(),
          contacted_by: 'admin@rareroles.com',
        })
        .eq('id', id);

      if (error) throw error;
      fetchContacts();
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

  // Get unique sources for filtering
  const uniqueSources = Array.from(new Set(contacts.map(c => c.source)))
    .filter(Boolean)
    .sort();

  if (loading) {
    return (
      <DashboardLayout title="Contact Messages" subtitle="Manage contact form submissions">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#ec4899] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#1e1b4b] font-semibold">Loading contact messages...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Contact Messages" 
      subtitle={`${filteredContacts.length} ${filteredContacts.length === 1 ? 'message' : 'messages'} found`}
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
                placeholder="Search by name, email, company, or message..."
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
                  All ({contacts.length})
                </button>
                <button
                  onClick={() => setStatusFilter("pending")}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    statusFilter === "pending"
                      ? "bg-orange-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Pending ({contacts.filter(c => !c.contacted).length})
                </button>
                <button
                  onClick={() => setStatusFilter("contacted")}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    statusFilter === "contacted"
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Contacted ({contacts.filter(c => c.contacted).length})
                </button>
              </div>

              {/* Source Filter */}
              {uniqueSources.length > 0 && (
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="px-4 py-2 rounded-xl border-2 border-gray-200 bg-white text-sm font-bold text-[#1e1b4b] focus:outline-none focus:ring-2 focus:ring-[#ec4899] focus:border-transparent transition-all"
                >
                  <option value="all">All Sources</option>
                  {uniqueSources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Contacts List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-indigo-300 transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedContact(contact)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#1e1b4b]">{contact.name}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <EnvelopeIcon className="w-4 h-4" />
                          <a href={`mailto:${contact.email}`} className="hover:text-indigo-600 transition-colors">
                            {contact.email}
                          </a>
                        </div>
                        {contact.company && (
                          <div className="flex items-center gap-1.5">
                            <BuildingOfficeIcon className="w-4 h-4" />
                            <span>{contact.company}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <StatusBadge contacted={contact.contacted} className="mb-3" />
                </div>

                {!contact.contacted && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsContacted(contact.id);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 font-bold text-sm transition-colors"
                  >
                    <CheckIcon className="w-4 h-4" />
                    Mark Contacted
                  </button>
                )}
              </div>

              {/* Message Preview */}
              <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start gap-2 mb-2">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <h4 className="text-sm font-bold text-gray-700">Message</h4>
                </div>
                <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed pl-7">
                  {contact.message}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{formatDate(contact.created_at)}</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                  {contact.source}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
            <EnvelopeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-600 mb-2">No contact messages found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all" || sourceFilter !== "all"
                ? "Try adjusting your filters"
                : "No contact messages yet"}
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedContact(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-400 text-white p-6 rounded-t-2xl flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {selectedContact.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedContact.name}</h2>
                  <p className="text-white/80">{selectedContact.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <StatusBadge contacted={selectedContact.contacted} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Email</label>
                  <p className="text-lg font-bold text-[#1e1b4b] mt-1">{selectedContact.email}</p>
                </div>
                {selectedContact.company && (
                  <div>
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Company</label>
                    <p className="text-lg font-bold text-[#1e1b4b] mt-1">{selectedContact.company}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Source</label>
                  <p className="text-lg font-bold text-[#1e1b4b] mt-1">{selectedContact.source}</p>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Submitted</label>
                  <p className="text-lg font-bold text-[#1e1b4b] mt-1">{formatDate(selectedContact.created_at)}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 block">Full Message</label>
                <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-indigo-600">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-bold transition-colors shadow-md"
                >
                  <EnvelopeIcon className="w-5 h-5" />
                  Reply via Email
                </a>
                {!selectedContact.contacted && (
                  <button
                    onClick={() => {
                      markAsContacted(selectedContact.id);
                      setSelectedContact(null);
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
