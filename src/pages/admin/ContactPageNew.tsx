import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import DashboardLayout from "../../components/admin/DashboardLayout";
import {
  MagnifyingGlassIcon,
  EnvelopeIcon,
  UserIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  CheckIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  FunnelIcon,
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

export default function ContactPageNew() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "contacted" | "pending">("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();
    
    const channel = supabase
      .channel('contact-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contacts' }, 
        () => fetchContacts())
      .subscribe();
    
    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchTerm, statusFilter]);

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

    if (statusFilter === "contacted") {
      filtered = filtered.filter(c => c.contacted);
    } else if (statusFilter === "pending") {
      filtered = filtered.filter(c => !c.contacted);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.company?.toLowerCase().includes(term) ||
        c.message.toLowerCase().includes(term)
      );
    }

    setFilteredContacts(filtered);
  };

  const toggleContacted = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ 
          contacted: !currentStatus,
          contacted_at: !currentStatus ? new Date().toISOString() : null,
        })
        .eq('id', id);

      if (error) throw error;
      fetchContacts();
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

  if (loading) {
    return (
      <DashboardLayout title="Contact Messages" subtitle="Manage inquiries">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-700 font-semibold">Loading contacts...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Contact Messages" subtitle={`${filteredContacts.length} messages`}>
      <div className="space-y-4">
        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/60">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, company, or message..."
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
                All ({contacts.length})
              </button>
              <button
                onClick={() => setStatusFilter("pending")}
                className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === "pending"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Pending ({contacts.filter(c => !c.contacted).length})
              </button>
              <button
                onClick={() => setStatusFilter("contacted")}
                className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === "contacted"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Contacted ({contacts.filter(c => c.contacted).length})
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
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Message Preview
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Date
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
                {filteredContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="table-row hover:bg-slate-50 transition-all cursor-pointer"
                    onClick={() => setSelectedContact(contact)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                          {contact.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{contact.name}</p>
                          <p className="text-xs text-slate-500">{contact.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-700">{contact.company || 'N/A'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-slate-600 truncate max-w-xs">
                        {contact.message.substring(0, 60)}...
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-500">{formatDate(contact.created_at)}</span>
                    </td>
                    <td className="px-4 py-3">
                      {contact.contacted ? (
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
                          setSelectedContact(contact);
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

            {filteredContacts.length === 0 && (
              <div className="text-center py-12">
                <ChatBubbleLeftRightIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-700 mb-1">No contact messages found</p>
                <p className="text-xs text-slate-500">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedContact && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
          onClick={() => setSelectedContact(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-2xl">
                  {selectedContact.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedContact.name}</h2>
                  <p className="text-white/80 text-sm mt-1">{selectedContact.company || 'Individual'}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
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
                  <EnvelopeIcon className="w-5 h-5 text-purple-600" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <UserIcon className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Name</p>
                      <p className="text-sm font-semibold text-slate-900">{selectedContact.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <EnvelopeIcon className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Email</p>
                      <p className="text-sm text-slate-900 break-all">{selectedContact.email}</p>
                    </div>
                  </div>
                  {selectedContact.company && (
                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg md:col-span-2">
                      <BuildingOfficeIcon className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">Company</p>
                        <p className="text-sm text-slate-900">{selectedContact.company}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-purple-600" />
                  Message
                </h3>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-200">
                <button
                  onClick={() => {
                    toggleContacted(selectedContact.id, selectedContact.contacted);
                    setSelectedContact(null);
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md ${
                    selectedContact.contacted
                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  <CheckIcon className="w-5 h-5" />
                  {selectedContact.contacted ? "Mark as Pending" : "Mark as Contacted"}
                </button>
                <button
                  onClick={() => window.open(`mailto:${selectedContact.email}`, '_blank')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                >
                  <EnvelopeIcon className="w-5 h-5" />
                  Send Email
                </button>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-200 text-xs text-slate-500">
                <CalendarIcon className="w-4 h-4" />
                Received on {formatDate(selectedContact.created_at)}
                {selectedContact.contacted_at && (
                  <>
                    <span className="text-slate-300">•</span>
                    Contacted on {formatDate(selectedContact.contacted_at)}
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
