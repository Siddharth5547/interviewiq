import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { Resume, ParsedResume } from '../types/index.js';
import {
  Upload,
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  User,
  Briefcase,
  Code2,
  FolderGit2,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

interface ResumePageProps {
  onNavigate: (tab: string) => void;
}

export const ResumePage: React.FC<ResumePageProps> = ({ onNavigate }) => {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<ParsedResume | null>(null);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const res = await api.getLatestResume();
      if (res.data.success && res.data.resume) {
        setResume(res.data.resume);
        setFormData(res.data.resume.parsedData);
      }
    } catch (err) {
      console.warn('Resume load notice:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('resume', file);

    setUploading(true);
    setError('');
    try {
      const res = await api.uploadResume(data);
      if (res.data.success) {
        setResume(res.data.resume);
        setFormData(res.data.resume.parsedData);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to parse resume file. Supported formats: PDF, DOC, DOCX, TXT.');
    } finally {
      setUploading(false);
    }
  };

  const handleLoadDemo = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.loadDemoResume();
      if (res.data.success) {
        setResume(res.data.resume);
        setFormData(res.data.resume.parsedData);
      }
    } catch (err: any) {
      setError('Failed to load sample resume.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCorrections = async () => {
    if (!resume || !formData) return;
    setSaving(true);
    setError('');
    try {
      const resumeId = resume._id || resume.id || '';
      const res = await api.updateResumeParsedData(resumeId, formData);
      if (res.data.success) {
        setResume(res.data.resume);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      setError('Failed to save corrections.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = (category: keyof ParsedResume['skills'], skillName: string) => {
    if (!formData || !skillName.trim()) return;
    const catList = formData.skills[category] || [];
    if (!catList.includes(skillName.trim())) {
      const updated = {
        ...formData,
        skills: {
          ...formData.skills,
          [category]: [...catList, skillName.trim()],
          all: [...new Set([...formData.skills.all, skillName.trim()])],
        },
      };
      setFormData(updated);
    }
  };

  const handleRemoveSkill = (category: keyof ParsedResume['skills'], skillName: string) => {
    if (!formData) return;
    const catList = (formData.skills[category] || []).filter((s) => s !== skillName);
    const updated = {
      ...formData,
      skills: {
        ...formData.skills,
        [category]: catList,
        all: formData.skills.all.filter((s) => s !== skillName),
      },
    };
    setFormData(updated);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#6B8E5A] animate-spin" />
        <p className="text-sm text-[#6B756D]">Parsing structured resume entities...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E5EEDC] text-[#344E41] text-xs font-bold uppercase tracking-wider mb-2">
            <FileText className="w-3.5 h-3.5 text-[#6B8E5A]" /> Resume Intelligence
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2A22] font-display">
            Resume Management
          </h1>
          <p className="text-sm text-[#6B756D] mt-1 max-w-xl">
            Review and adjust extracted entities. Everything is stored privately and used as your interview blueprint.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLoadDemo}
            className="px-4 py-2.5 rounded-full bg-[#E5EEDC] hover:bg-[#D4E2C5] text-xs font-bold text-[#344E41] transition-colors"
          >
            Load Sample Profile
          </button>

          <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#344E41] text-white text-xs font-bold hover:bg-[#4B6B5B] transition-all shadow-sm">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>{uploading ? 'Parsing...' : 'Upload PDF / DOCX'}</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-status-danger flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-[#E5EEDC] text-[#344E41] text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#6B8E5A] flex-shrink-0" />
          <span>Resume entities successfully verified and saved.</span>
        </div>
      )}

      {/* Inferred Competency Bar */}
      {resume?.intelligenceTags && resume.intelligenceTags.length > 0 && (
        <div className="p-6 bg-white rounded-3xl border border-[rgba(52,78,65,0.1)] shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B8E5A]">Inferred Domains</span>
            <h4 className="text-base font-bold text-[#1F2A22]">Semantic Architecture Profile</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {resume.intelligenceTags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-full bg-[#F4F7F1] text-[#344E41] text-xs font-semibold border border-[rgba(52,78,65,0.08)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Document-Style Structured Editor */}
      {formData && (
        <div className="space-y-8">
          {/* Section 1: Contact & Summary */}
          <div className="p-8 bg-white rounded-3xl border border-[rgba(52,78,65,0.1)] shadow-soft space-y-6">
            <h3 className="text-base font-bold text-[#1F2A22] font-display pb-3 border-b border-gray-100 flex items-center gap-2">
              <User className="w-5 h-5 text-[#6B8E5A]" /> Personal Details & Executive Summary
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1F2A22] mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs p-3 rounded-2xl border border-[rgba(52,78,65,0.15)] outline-none focus:ring-2 focus:ring-[#6B8E5A] bg-[#F4F7F1]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2A22] mb-1.5">Email</label>
                <input
                  type="email"
                  value={formData.contact?.email || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, email: e.target.value },
                    })
                  }
                  className="w-full text-xs p-3 rounded-2xl border border-[rgba(52,78,65,0.15)] outline-none focus:ring-2 focus:ring-[#6B8E5A] bg-[#F4F7F1]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2A22] mb-1.5">Phone</label>
                <input
                  type="text"
                  value={formData.contact?.phone || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, phone: e.target.value },
                    })
                  }
                  className="w-full text-xs p-3 rounded-2xl border border-[rgba(52,78,65,0.15)] outline-none focus:ring-2 focus:ring-[#6B8E5A] bg-[#F4F7F1]/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F2A22] mb-1.5">Professional Summary</label>
              <textarea
                rows={3}
                value={formData.summary || ''}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full text-xs p-3.5 rounded-2xl border border-[rgba(52,78,65,0.15)] outline-none focus:ring-2 focus:ring-[#6B8E5A] leading-relaxed bg-[#F4F7F1]/40"
              />
            </div>
          </div>

          {/* Section 2: Technical Skills */}
          <div className="p-8 bg-white rounded-3xl border border-[rgba(52,78,65,0.1)] shadow-soft space-y-6">
            <h3 className="text-base font-bold text-[#1F2A22] font-display pb-3 border-b border-gray-100 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-[#6B8E5A]" /> Categorized Technical Skills ({formData.skills.all.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { key: 'programmingLanguages' as const, label: 'Languages' },
                { key: 'frameworks' as const, label: 'Frameworks & Libraries' },
                { key: 'databases' as const, label: 'Databases & Storage' },
                { key: 'tools' as const, label: 'Tools, DevOps & Cloud' },
              ].map(({ key, label }) => (
                <div key={key} className="p-5 rounded-2xl bg-[#F4F7F1] space-y-3">
                  <span className="text-xs font-bold text-[#344E41] block">{label}</span>
                  <div className="flex flex-wrap gap-2">
                    {(formData.skills[key] || []).map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-xs font-semibold text-[#1F2A22] border border-[rgba(52,78,65,0.1)] shadow-2xs"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(key, skill)}
                          className="text-[#6B756D] hover:text-[#C64545] font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder={`+ Add ${label} and press Enter`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = (e.target as HTMLInputElement).value;
                        if (val) {
                          handleAddSkill(key, val);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                    className="w-full text-xs p-2.5 bg-white border border-[rgba(52,78,65,0.12)] rounded-xl outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Projects */}
          <div className="p-8 bg-white rounded-3xl border border-[rgba(52,78,65,0.1)] shadow-soft space-y-6">
            <h3 className="text-base font-bold text-[#1F2A22] font-display pb-3 border-b border-gray-100 flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-[#6B8E5A]" /> Projects (Used for Project Deep Dives)
            </h3>

            <div className="space-y-4">
              {(formData.projects || []).map((proj, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#F4F7F1] space-y-3">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={proj.title || ''}
                      onChange={(e) => {
                        const copy = [...formData.projects];
                        copy[idx].title = e.target.value;
                        setFormData({ ...formData, projects: copy });
                      }}
                      className="font-bold text-xs p-2 bg-white border border-gray-200 rounded-xl text-[#344E41] w-2/3"
                    />
                    <span className="text-[11px] text-[#6B756D]">
                      Tech: {proj.technologies?.join(', ')}
                    </span>
                  </div>

                  <textarea
                    rows={2}
                    value={proj.description || ''}
                    onChange={(e) => {
                      const copy = [...formData.projects];
                      copy[idx].description = e.target.value;
                      setFormData({ ...formData, projects: copy });
                    }}
                    className="w-full text-xs p-3 bg-white border border-gray-200 rounded-xl leading-relaxed outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Save Bar */}
          <div className="p-6 bg-white rounded-3xl border border-[rgba(52,78,65,0.12)] shadow-premium flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#6B756D]">
              <ShieldCheck className="w-4 h-4 text-[#6B8E5A]" />
              <span>All updates strictly preserve integrity and are used in live mock interviews.</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveCorrections}
                disabled={saving}
                className="px-7 py-3 rounded-full bg-[#344E41] text-white text-xs font-bold hover:bg-[#4B6B5B] transition-all shadow-sm disabled:opacity-70 flex items-center gap-1.5"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Corrections
              </button>

              <button
                type="button"
                onClick={() => onNavigate('ats')}
                className="px-7 py-3 rounded-full bg-[#6B8E5A] text-white text-xs font-bold hover:bg-[#587649] transition-all shadow-sm"
              >
                Proceed to ATS Analysis →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
