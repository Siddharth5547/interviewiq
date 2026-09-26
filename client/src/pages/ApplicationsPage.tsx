import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { Application, ApplicationStatus, ApplicationAnalytics } from '../types/index.js';
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  AlertCircle,
  Loader2,
  Edit3,
  X,
  Sparkles,
} from 'lucide-react';

interface ApplicationsPageProps {
  onNavigate: (tab: string) => void;
  onSelectJobForInterview?: (jobTitle: string, company: string, description: string) => void;
}

export const ApplicationsPage: React.FC<ApplicationsPageProps> = ({
  onNavigate,
  onSelectJobForInterview,
}) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [analytics, setAnalytics] = useState<ApplicationAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Add Application Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newType, setNewType] = useState<'Full-time' | 'Internship' | 'Contract'>('Full-time');
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('Applied');
  const [newUrl, setNewUrl] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newNextAction, setNewNextAction] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Edit notes inline state
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [editedNotesText, setEditedNotesText] = useState('');

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resApps, resAnalytics] = await Promise.allSettled([
        api.listApplications({
          status: statusFilter !== 'All' ? statusFilter : undefined,
          search: search.trim() || undefined,
        }),
        api.getApplicationAnalytics(),
      ]);

      if (resApps.status === 'fulfilled' && resApps.value.data.success) {
        setApplications(resApps.value.data.applications);
      }
      if (resAnalytics.status === 'fulfilled' && resAnalytics.value.data.success) {
        setAnalytics(resAnalytics.value.data.analytics);
      }
    } catch (err) {
      console.warn('Applications fetch warning:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId: string, nextStatus: ApplicationStatus) => {
    try {
      const res = await api.updateApplication(appId, { status: nextStatus });
      if (res.data.success) {
        setApplications((prev) =>
          prev.map((a) => (a._id === appId || a.id === appId ? { ...a, status: nextStatus } : a))
        );
        // Refresh analytics
        const aRes = await api.getApplicationAnalytics();
        if (aRes.data.success) setAnalytics(aRes.data.analytics);
      }
    } catch (err) {
      console.warn('Status change warning:', err);
    }
  };

  const handleDelete = async (appId: string) => {
    if (!window.confirm('Remove this application from your tracker?')) return;
    try {
      const res = await api.deleteApplication(appId);
      if (res.data.success) {
        setApplications((prev) => prev.filter((a) => a._id !== appId && a.id !== appId));
        const aRes = await api.getApplicationAnalytics();
        if (aRes.data.success) setAnalytics(aRes.data.analytics);
      }
    } catch (err) {
      console.warn('Delete warning:', err);
    }
  };

  const handleSaveNotes = async (appId: string) => {
    try {
      await api.updateApplication(appId, { notes: editedNotesText });
      setApplications((prev) =>
        prev.map((a) => (a._id === appId || a.id === appId ? { ...a, notes: editedNotesText } : a))
      );
      setEditingNotesId(null);
    } catch (err) {
      console.warn('Save notes warning:', err);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newRole.trim()) return;

    try {
      setSubmitting(true);
      const res = await api.createApplication({
        company: newCompany.trim(),
        role: newRole.trim(),
        employmentType: newType,
        status: newStatus,
        applicationUrl: newUrl.trim(),
        notes: newNotes.trim(),
        nextAction: newNextAction.trim(),
      });

      if (res.data.success) {
        setShowAddModal(false);
        setNewCompany('');
        setNewRole('');
        setNewUrl('');
        setNewNotes('');
        setNewNextAction('');
        fetchData();
      }
    } catch (err) {
      console.warn('Create application error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'Offer':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Interview':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Assessment':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Applied':
        return 'bg-[#E5EEDC] text-[#344E41] border-[#6B8E5A]/30';
      case 'Saved':
      case 'Interested':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'Rejected':
      case 'Withdrawn':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const statusOptions: ApplicationStatus[] = [
    'Saved',
    'Interested',
    'Applied',
    'Assessment',
    'Interview',
    'Offer',
    'Rejected',
    'Withdrawn',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. Header & Actions */}
      <div className="bg-white rounded-3xl border border-[rgba(52,78,65,0.1)] p-8 sm:p-10 shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5EEDC] text-[#344E41] text-xs font-bold uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5 text-[#6B8E5A]" /> Career Pipeline
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2A22] font-display">
              Application Tracker
            </h1>
            <p className="text-base text-[#6B756D] max-w-2xl">
              Monitor candidate progression from initial save through assessment, interview, and offer.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('opportunities')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#F4F7F1] hover:bg-[#E5EEDC] text-[#344E41] font-bold text-xs transition-colors"
            >
              <Search className="w-4 h-4 text-[#6B8E5A]" />
              Discover New Roles
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#344E41] hover:bg-[#4B6B5B] text-white font-bold text-xs transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 text-[#D4E2C5]" />
              Track External Job
            </button>
          </div>
        </div>

        {/* 2. Real Analytics Funnel */}
        {analytics && (
          <div className="mt-8 pt-8 border-t border-gray-100 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              <div className="p-4 rounded-2xl bg-[#F4F7F1] border border-[rgba(52,78,65,0.06)]">
                <span className="text-[11px] font-semibold text-[#6B756D] block">Saved / Interested</span>
                <span className="text-2xl font-extrabold text-[#1F2A22] font-display">
                  {analytics.funnel.saved}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#E5EEDC] border border-[#6B8E5A]/20">
                <span className="text-[11px] font-semibold text-[#344E41] block">Applied</span>
                <span className="text-2xl font-extrabold text-[#344E41] font-display">
                  {analytics.funnel.applied}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                <span className="text-[11px] font-semibold text-purple-700 block">Assessment</span>
                <span className="text-2xl font-extrabold text-purple-900 font-display">
                  {analytics.funnel.assessment}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                <span className="text-[11px] font-semibold text-blue-700 block">Interviews Reached</span>
                <span className="text-2xl font-extrabold text-blue-900 font-display">
                  {analytics.funnel.interview}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-[11px] font-semibold text-emerald-700 block">Offers</span>
                <span className="text-2xl font-extrabold text-emerald-900 font-display">
                  {analytics.funnel.offer}
                </span>
              </div>
            </div>

            {/* Funnel Visual Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-[#6B756D]">
                <span>Conversion Pipeline</span>
                <span>
                  {analytics.totalApplications} total applications across {analytics.uniqueCompanies} unique companies
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden flex">
                <div
                  style={{
                    width: `${analytics.totalApplications > 0 ? (analytics.funnel.saved / analytics.totalApplications) * 100 : 0}%`,
                  }}
                  className="bg-gray-300"
                  title="Saved"
                />
                <div
                  style={{
                    width: `${analytics.totalApplications > 0 ? (analytics.funnel.applied / analytics.totalApplications) * 100 : 0}%`,
                  }}
                  className="bg-[#6B8E5A]"
                  title="Applied"
                />
                <div
                  style={{
                    width: `${analytics.totalApplications > 0 ? (analytics.funnel.assessment / analytics.totalApplications) * 100 : 0}%`,
                  }}
                  className="bg-purple-500"
                  title="Assessment"
                />
                <div
                  style={{
                    width: `${analytics.totalApplications > 0 ? (analytics.funnel.interview / analytics.totalApplications) * 100 : 0}%`,
                  }}
                  className="bg-blue-500"
                  title="Interview"
                />
                <div
                  style={{
                    width: `${analytics.totalApplications > 0 ? (analytics.funnel.offer / analytics.totalApplications) * 100 : 0}%`,
                  }}
                  className="bg-emerald-500"
                  title="Offer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Filter Bar */}
      <div className="bg-white rounded-2xl border border-[rgba(52,78,65,0.08)] p-4 shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-[#6B756D] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchData()}
            placeholder="Search tracked applications by company, role, or notes..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#F4F7F1] border border-transparent focus:border-[#6B8E5A] rounded-xl text-xs text-[#1F2A22] outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                statusFilter === status
                  ? 'bg-[#344E41] text-white shadow-sm'
                  : 'bg-[#F4F7F1] text-[#6B756D] hover:text-[#1F2A22]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Applications List */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#6B8E5A] animate-spin" />
          <p className="text-sm text-[#6B756D]">Loading your tracked applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[rgba(52,78,65,0.1)] space-y-4">
          <Briefcase className="w-12 h-12 text-[#6B8E5A] mx-auto opacity-70" />
          <h3 className="text-lg font-bold text-[#1F2A22]">No Applications Tracked in This View</h3>
          <p className="text-sm text-[#6B756D] max-w-md mx-auto">
            Find matching roles on the Opportunities page or click "Track External Job" to log an application you submitted elsewhere.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('opportunities')}
              className="px-6 py-2.5 rounded-full bg-[#344E41] text-white font-bold text-xs hover:bg-[#4B6B5B] transition-colors"
            >
              Explore Opportunities
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2.5 rounded-full bg-[#E5EEDC] text-[#344E41] font-bold text-xs hover:bg-[#D4E2C5] transition-colors"
            >
              Track External Job
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const appId = app._id || app.id || '';
            const isEditingNotes = editingNotesId === appId;

            return (
              <div
                key={appId}
                className="bg-white rounded-2xl border border-[rgba(52,78,65,0.09)] p-6 shadow-soft space-y-4 hover:border-[#6B8E5A]/40 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-extrabold text-[#1F2A22]">{app.company}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#F4F7F1] text-[#344E41] font-semibold">
                        {app.employmentType}
                      </span>
                      {app.salary && (
                        <span className="text-xs text-[#6B756D] font-medium">({app.salary})</span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-[#344E41]">{app.role}</h3>
                    <p className="text-[11px] text-[#6B756D]">
                      Logged on {new Date(app.appliedAt).toLocaleDateString()} • Source: {app.source}
                    </p>
                  </div>

                  {/* Status Dropdown Selector */}
                  <div className="flex items-center gap-3">
                    <div className="space-y-1 text-right">
                      <label className="text-[10px] uppercase font-bold text-[#6B756D] block">Status</label>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(appId, e.target.value as ApplicationStatus)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border outline-none cursor-pointer ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {statusOptions.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => handleDelete(appId)}
                      className="p-2 text-gray-400 hover:text-rose-600 transition-colors"
                      title="Delete application"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Notes & Next Actions */}
                <div className="p-3.5 bg-[#F4F7F1] rounded-xl text-xs space-y-2 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#344E41]">Notes & Next Action:</span>
                    {!isEditingNotes ? (
                      <button
                        onClick={() => {
                          setEditingNotesId(appId);
                          setEditedNotesText(app.notes || '');
                        }}
                        className="text-[11px] font-bold text-[#6B8E5A] hover:underline inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveNotes(appId)}
                          className="text-[11px] font-bold text-[#4A7C59] hover:underline"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingNotesId(null)}
                          className="text-[11px] text-[#6B756D] hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {!isEditingNotes ? (
                    <p className="text-[#6B756D] leading-relaxed">
                      {app.notes || 'No custom notes added. Click edit to record interviewer details or next steps.'}
                    </p>
                  ) : (
                    <textarea
                      value={editedNotesText}
                      onChange={(e) => setEditedNotesText(e.target.value)}
                      rows={2}
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs outline-none"
                    />
                  )}
                </div>

                {/* Action Links */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-3 text-xs">
                    {app.applicationUrl && (
                      <a
                        href={app.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-bold text-[#6B8E5A] hover:underline"
                      >
                        Official Job Listing <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (onSelectJobForInterview) {
                        onSelectJobForInterview(app.role, app.company, app.notes || '');
                      }
                      onNavigate('interview');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E5EEDC] text-[#344E41] hover:bg-[#D4E2C5] text-xs font-bold transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#6B8E5A]" />
                    Prepare Interview For This Role
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Add Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-gray-100 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#1F2A22]">Track External Application</h3>
              <p className="text-xs text-[#6B756D]">
                Record a job or internship you applied to outside of InterviewIQ.
              </p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#344E41]">Company *</label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. OpenAI"
                    className="w-full p-2.5 bg-[#F4F7F1] border border-gray-200 rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#344E41]">Role Title *</label>
                  <input
                    type="text"
                    required
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. Software Engineer"
                    className="w-full p-2.5 bg-[#F4F7F1] border border-gray-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#344E41]">Employment Type</label>
                  <select
                    value={newType}
                    onChange={(e: any) => setNewType(e.target.value)}
                    className="w-full p-2.5 bg-[#F4F7F1] border border-gray-200 rounded-xl outline-none"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#344E41]">Initial Status</label>
                  <select
                    value={newStatus}
                    onChange={(e: any) => setNewStatus(e.target.value)}
                    className="w-full p-2.5 bg-[#F4F7F1] border border-gray-200 rounded-xl outline-none"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#344E41]">Job Listing URL</label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://company.com/jobs/..."
                  className="w-full p-2.5 bg-[#F4F7F1] border border-gray-200 rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#344E41]">Notes & Next Action</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={2}
                  placeholder="Submitted portfolio, follow up with recruiter on Friday..."
                  className="w-full p-2.5 bg-[#F4F7F1] border border-gray-200 rounded-xl outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-full border border-gray-200 text-xs font-bold text-[#6B756D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-full bg-[#344E41] hover:bg-[#4B6B5B] text-white text-xs font-bold shadow-sm"
                >
                  {submitting ? 'Adding...' : 'Add to Pipeline'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
