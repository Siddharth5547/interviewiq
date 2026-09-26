import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { WeakAreaItem, PracticeSession } from '../types/index.js';
import {
  Dumbbell,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Send,
  RefreshCw,
  Trophy,
  Target,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PracticePageProps {
  initialTopic?: string;
  onNavigate: (tab: string) => void;
}

export const PracticePage: React.FC<PracticePageProps> = ({ initialTopic, onNavigate }) => {
  const [weakAreas, setWeakAreas] = useState<WeakAreaItem[]>([]);
  const [activeSession, setActiveSession] = useState<PracticeSession | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWeakAreas();
  }, []);

  const fetchWeakAreas = async () => {
    try {
      setLoading(true);
      const res = await api.getWeakAreas();
      if (res.data.success) {
        setWeakAreas(res.data.weakAreas);
        if (initialTopic) {
          startDrill(initialTopic);
        }
      }
    } catch (err) {
      console.warn('Weak area fetch warning:', err);
    } finally {
      setLoading(false);
    }
  };

  const startDrill = async (topic: string) => {
    setStarting(true);
    setError('');
    try {
      const res = await api.startPractice(topic);
      if (res.data.success) {
        setActiveSession(res.data.session);
        setCurrentQIndex(0);
        setAnswerText('');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to start practice drill.');
    } finally {
      setStarting(false);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSession || !answerText.trim() || submitting) return;

    setSubmitting(true);
    setError('');
    try {
      const q = activeSession.questions[currentQIndex];
      const sessionId = activeSession._id || activeSession.id || '';
      const res = await api.submitPracticeAnswer(sessionId, q.id, answerText.trim());

      if (res.data.success) {
        setActiveSession(res.data.session);
        setAnswerText('');
        if (res.data.isComplete) {
          try {
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
          } catch (e) {
            // ignore
          }
        } else {
          setCurrentQIndex((prev) => prev + 1);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit answer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#F4F7F1] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#6B8E5A] animate-spin" />
        <p className="text-sm text-[#6B756D]">Scanning interview history for weak concept clusters...</p>
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
              <Dumbbell className="w-3.5 h-3.5 text-[#6B8E5A]" /> Targeted Concept Remediation
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#344E41]">
              Targeted Topic Practice
            </h1>
            <p className="text-sm sm:text-base text-[#6B756D] mt-2 max-w-2xl leading-relaxed">
              Drill down on specific technical nuances where past mock interviews detected hesitation or missing depth.
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
              className="px-5 py-2.5 rounded-full bg-[#6B8E5A] text-white text-xs font-semibold hover:bg-[#5A7A4A] transition-all shadow-sm"
            >
              Full AI Mock →
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Weak Areas Selection Grid */}
        {!activeSession && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#344E41]">Detected Topics for Review</h2>
              <span className="text-xs text-[#6B756D]">Synthesized from past evaluation reports</span>
            </div>

            {weakAreas.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#344E41]/10 space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#E5EEDC] text-[#344E41] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7 text-[#6B8E5A]" />
                </div>
                <h3 className="text-lg font-bold text-[#344E41]">No Critical Weak Areas Detected Yet</h3>
                <p className="text-xs text-[#6B756D] max-w-md mx-auto">
                  As you complete full mock interviews, any questions that score below benchmark will automatically populate here for targeted drilling.
                </p>
                <button
                  onClick={() => startDrill('System Design Fundamentals')}
                  className="px-5 py-2.5 rounded-full bg-[#6B8E5A] text-white text-xs font-semibold hover:bg-[#5A7A4A] transition-all shadow-sm"
                >
                  Practice System Design Fundamentals
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {weakAreas.map((area, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-3xl p-7 border border-[#344E41]/10 shadow-sm hover:border-[#6B8E5A]/40 transition-all flex flex-col justify-between space-y-5"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                          Identified {area.frequency}x
                        </span>
                        <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/60">
                          Prior Score: {area.lowestScore}%
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#344E41] leading-snug">{area.topic}</h3>
                      <p className="text-xs text-[#6B756D] mt-1.5 leading-relaxed">
                        Interactive drill with 3 progressive questions, instant rubric grading, and model answers.
                      </p>
                    </div>

                    <button
                      onClick={() => startDrill(area.topic)}
                      disabled={starting}
                      className="w-full py-3 px-4 rounded-full bg-[#344E41] text-white text-xs font-semibold hover:bg-[#23352C] transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Dumbbell className="w-4 h-4 text-[#8FAF78]" />
                      <span>Start Drill on This Topic</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Active Drill Session Room */}
        {activeSession && activeSession.status === 'active' && (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#344E41]/10 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#344E41]/10">
              <div>
                <span className="text-[11px] uppercase font-bold text-[#6B8E5A] tracking-wider block mb-1">
                  Active Practice Drill
                </span>
                <h2 className="text-2xl font-bold text-[#344E41]">{activeSession.topic}</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E5EEDC] text-[#344E41]">
                  Question {currentQIndex + 1} of {activeSession.questions.length}
                </span>
              </div>
            </div>

            {/* Current Question */}
            <div className="p-6 rounded-3xl bg-[#F4F7F1] border border-[#344E41]/10 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B8E5A]">
                Drill Difficulty: {activeSession.questions[currentQIndex]?.difficulty || 'Medium'}
              </span>
              <p className="text-base sm:text-lg font-bold text-[#344E41] leading-relaxed">
                {activeSession.questions[currentQIndex]?.question}
              </p>
            </div>

            {/* Answer Input */}
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#344E41] mb-2">
                  Your Answer (Be specific: explain mechanisms, code abstractions, and system trade-offs)
                </label>
                <textarea
                  rows={5}
                  required
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Structure your answer clearly: start with the concept definition, give a concrete implementation or architectural pattern, and address trade-offs..."
                  className="w-full text-sm p-4 rounded-2xl border border-[#344E41]/20 focus:ring-2 focus:ring-[#6B8E5A] focus:border-transparent outline-none leading-relaxed bg-[#F4F7F1]/40"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveSession(null)}
                  className="text-xs font-semibold text-[#6B756D] hover:text-[#344E41] transition-colors"
                >
                  Cancel Drill
                </button>

                <button
                  type="submit"
                  disabled={submitting || !answerText.trim()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#6B8E5A] text-white text-xs font-semibold hover:bg-[#5A7A4A] transition-all shadow-sm disabled:opacity-60"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Submit & Evaluate Answer
                </button>
              </div>
            </form>

            {/* Previously answered questions in this drill */}
            {activeSession.answers.length > 0 && (
              <div className="pt-8 border-t border-[#344E41]/10 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B756D]">
                  Completed Drill Items ({activeSession.answers.length})
                </h4>
                {activeSession.answers.map((ans, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-[#F4F7F1] border border-[#344E41]/10 space-y-2 text-xs">
                    <div className="flex justify-between items-start font-bold">
                      <span className="text-[#344E41] text-sm">{ans.question}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                        {ans.score}%
                      </span>
                    </div>
                    <p className="text-[#6B756D] italic font-mono">"{ans.candidateAnswer}"</p>
                    <p className="text-xs text-[#344E41] pt-1">
                      <strong className="text-[#6B8E5A]">Feedback:</strong> {ans.feedback}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Completed Drill Session Summary Card */}
        {activeSession && activeSession.status === 'completed' && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#344E41]/10 shadow-sm space-y-8 text-center">
            <div className="w-20 h-20 rounded-full bg-[#E5EEDC] text-[#344E41] flex items-center justify-center mx-auto shadow-sm">
              <Trophy className="w-10 h-10 text-[#6B8E5A]" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> Drill Complete
              </div>
              <h2 className="text-3xl font-bold text-[#344E41]">Drill Session Completed!</h2>
              <p className="text-sm text-[#6B756D] mt-1.5 max-w-md mx-auto">
                You worked through all targeted questions on <strong>{activeSession.topic}</strong>.
              </p>
            </div>

            <div className="inline-block p-6 rounded-3xl bg-[#F4F7F1] border border-[#344E41]/10">
              <span className="text-xs uppercase font-bold tracking-wider text-[#6B756D] block">
                Session Mastery Score
              </span>
              <span className="text-5xl font-extrabold text-[#344E41]">{activeSession.overallScore}%</span>
            </div>

            <div className="max-w-md mx-auto space-y-2 text-left p-5 rounded-2xl bg-[#E5EEDC]/40 border border-[#6B8E5A]/20">
              <h4 className="text-xs font-bold text-[#344E41] uppercase tracking-wider">
                Key Takeaways:
              </h4>
              {activeSession.improvementNotes.map((note, idx) => (
                <p key={idx} className="text-xs text-[#1F2A22] font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#6B8E5A] flex-shrink-0" />
                  {note}
                </p>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <button
                onClick={() => setActiveSession(null)}
                className="px-6 py-3 rounded-full border border-[#344E41]/15 text-[#344E41] text-xs font-semibold hover:bg-[#F4F7F1] transition-colors"
              >
                Choose Another Topic
              </button>
              <button
                onClick={() => onNavigate('interview')}
                className="px-6 py-3 rounded-full bg-[#6B8E5A] text-white text-xs font-semibold hover:bg-[#5A7A4A] transition-all shadow-sm"
              >
                Launch Full AI Mock Interview →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
