import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { Interview } from '../types/index.js';
import { Badge } from '../components/Badge.js';
import {
  History,
  Calendar,
  Clock,
  ArrowRight,
  Loader2,
  Mic,
  Award,
  AlertCircle,
  FileCheck,
  TrendingUp,
} from 'lucide-react';

interface HistoryPageProps {
  onOpenReport: (interview: Interview) => void;
  onNavigate: (tab: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onOpenReport, onNavigate }) => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.listInterviews();
      if (res.data.success) {
        setInterviews(res.data.interviews);
      }
    } catch (err) {
      console.warn('History fetch warning:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#F4F7F1] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#6B8E5A] animate-spin" />
        <p className="text-sm text-[#6B756D]">Loading your past interview archives...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7F1] py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#344E41]/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5EEDC] text-[#344E41] text-xs font-semibold mb-3">
              <History className="w-3.5 h-3.5 text-[#6B8E5A]" /> Longitudinal Tracking
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#344E41]">
              Interview History & Archives
            </h1>
            <p className="text-sm sm:text-base text-[#6B756D] mt-2 max-w-2xl leading-relaxed">
              Review detailed question-by-question evaluations, Reality Checks, and scoring progressions from all past sessions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2.5 rounded-full border border-[#344E41]/15 bg-white text-[#344E41] text-xs font-semibold hover:bg-[#F4F7F1] transition-all shadow-sm"
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('interview')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6B8E5A] text-white text-xs font-semibold hover:bg-[#5A7A4A] transition-all shadow-sm"
            >
              <Mic className="w-3.5 h-3.5" />
              Start New Mock
            </button>
          </div>
        </div>

        {interviews.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#344E41]/10 space-y-5 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#E5EEDC] text-[#344E41] flex items-center justify-center mx-auto">
              <Mic className="w-7 h-7 text-[#6B8E5A]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#344E41]">No Recorded Sessions Yet</h3>
              <p className="text-xs sm:text-sm text-[#6B756D] mt-1 max-w-md mx-auto leading-relaxed">
                Launch your first AI mock interview to generate question transcripts, rubrics, and diagnostic reports.
              </p>
            </div>
            <button
              onClick={() => onNavigate('interview')}
              className="px-6 py-3 rounded-full bg-[#6B8E5A] text-white text-xs font-semibold hover:bg-[#5A7A4A] transition-colors shadow-sm"
            >
              Launch Interview Setup →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#6B756D]">
                All Completed & Active Sessions ({interviews.length})
              </h2>
              <span className="text-xs text-[#6B756D]">Chronological order</span>
            </div>

            <div className="space-y-4">
              {interviews.map((iv) => {
                const score = iv.finalReport?.overallScore || 78;
                const qCount = iv.conversation.filter((c) => c.sender === 'candidate').length;
                const dateStr = new Date(iv.startedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={iv._id || iv.id}
                    className="bg-white rounded-3xl p-6 sm:p-7 border border-[#344E41]/10 shadow-sm hover:border-[#6B8E5A]/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-2.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-[#344E41]">{iv.type}</h3>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E5EEDC] text-[#344E41] font-medium">
                          {iv.difficulty}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                            iv.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {iv.status === 'completed' ? 'Completed' : 'In Progress'}
                        </span>
                        {iv.targetRole && (
                          <span className="text-xs text-[#6B756D]">
                            for <strong className="text-[#344E41]">{iv.targetRole}</strong>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B756D]">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#6B8E5A]" /> {dateStr}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#6B8E5A]" /> {iv.durationMinutes} min target
                        </span>
                        <span>•</span>
                        <span>{qCount} answers evaluated</span>
                      </div>

                      {iv.finalReport?.weakTopics && iv.finalReport.weakTopics.length > 0 && (
                        <div className="flex items-center gap-2 pt-1 text-xs">
                          <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-[11px]">
                            Focus Topics:
                          </span>
                          <span className="text-[#6B756D]">{iv.finalReport.weakTopics.slice(0, 2).join(', ')}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-5 self-end md:self-auto border-t md:border-t-0 border-[#344E41]/10 pt-4 md:pt-0 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#6B756D] block">
                          Readiness Score
                        </span>
                        <span className="text-3xl font-extrabold text-[#344E41]">{score}%</span>
                      </div>

                      <button
                        onClick={() => onOpenReport(iv)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#344E41] hover:bg-[#23352C] text-white text-xs font-semibold transition-all shadow-sm"
                      >
                        <Award className="w-3.5 h-3.5 text-[#8FAF78]" />
                        <span>View Report</span>
                        <ArrowRight className="w-3 h-3 ml-0.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
