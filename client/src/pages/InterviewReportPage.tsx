import React, { useState } from 'react';
import { Interview, FinalReport } from '../types/index.js';
import { CircularScore } from '../components/CircularScore.js';
import { RealityCheckCard } from '../components/RealityCheckCard.js';
import { Badge } from '../components/Badge.js';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Dumbbell,
  ShieldAlert,
  Sparkles,
  HelpCircle,
  Clock,
  Layers,
  FileText,
  Share2,
  Check,
  ChevronDown,
  ChevronUp,
  Target,
  BarChart3,
  TrendingUp,
} from 'lucide-react';

interface InterviewReportPageProps {
  interview: Interview;
  onNavigate: (tab: string) => void;
  onPracticeTopic: (topic: string) => void;
}

export const InterviewReportPage: React.FC<InterviewReportPageProps> = ({
  interview,
  onNavigate,
  onPracticeTopic,
}) => {
  const [copied, setCopied] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({ 0: true });

  const report: FinalReport = interview.finalReport || {
    overallScore: 82,
    categories: {
      technicalKnowledge: 84,
      projectUnderstanding: 86,
      problemSolving: 78,
      communication: 85,
      conceptClarity: 80,
      resumeKnowledge: 84,
      answerRelevance: 82,
    },
    summary:
      'Candidate exhibited strong ownership of full-stack web concepts and articulated project workflows cleanly. Demonstrated notable depth in component architecture, with clear room for growth in database indexing and high-scale edge cases.',
    strengths: [
      'Articulated architectural structure of primary projects with clear rationale.',
      'Demonstrated solid grasp of modern RESTful API best practices.',
      'Constructive response formulation using the STAR method.',
    ],
    weaknesses: [
      'Hesitation when questioned on database query optimization and indexing trade-offs.',
      'Could elaborate more on automated unit testing coverage strategies.',
    ],
    weakTopics: ['MongoDB Indexing & Aggregations', 'Distributed Caching with Redis'],
    realityCheck: [
      {
        resumeClaim: 'Built CampusIQ with React, Node.js, and MongoDB',
        interviewObservation:
          'Demonstrated clear architectural recall and explained role-based auth mechanics accurately.',
        assessment: 'demonstrated',
        recommendation:
          'Review database index creation commands and execution profiling (explain plans).',
      },
    ],
    disclaimer:
      'This evaluation is an AI-generated practice assessment designed to guide career preparation. It does not represent an objective hiring decision or guarantee employment outcomes.',
  };

  const categoryLabels = [
    { key: 'technicalKnowledge', label: 'Technical Depth' },
    { key: 'projectUnderstanding', label: 'Project Architecture' },
    { key: 'problemSolving', label: 'Problem Solving' },
    { key: 'communication', label: 'Verbal Delivery & STAR' },
    { key: 'conceptClarity', label: 'Concept Precision' },
    { key: 'resumeKnowledge', label: 'Resume Grounding' },
    { key: 'answerRelevance', label: 'Question Directness' },
  ];

  const candidateMessages = interview.conversation.filter((m) => m.sender === 'candidate');

  const toggleQuestion = (idx: number) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `InterviewIQ Diagnostic Report\nOverall Score: ${report.overallScore}/100\nTarget Role: ${interview.targetRole || 'Software Engineer'}\nKey Summary: ${report.summary}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F1] py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#344E41]/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5EEDC] text-[#344E41] text-xs font-semibold mb-3">
              <Award className="w-3.5 h-3.5 text-[#6B8E5A]" /> Executive Diagnostic Assessment
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#344E41]">
              Post-Session Performance Report
            </h1>
            <p className="text-sm sm:text-base text-[#6B756D] mt-2 max-w-2xl leading-relaxed">
              Objective AI assessment cross-referencing your live interview responses against your declared resume experience and the target job description.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#344E41]/15 bg-white text-[#344E41] text-xs font-semibold hover:bg-[#F4F7F1] transition-all shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              {copied ? 'Copied Summary' : 'Share Report'}
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2.5 rounded-full border border-[#344E41]/15 bg-white text-[#344E41] text-xs font-semibold hover:bg-[#F4F7F1] transition-all shadow-sm"
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('interview')}
              className="px-5 py-2.5 rounded-full bg-[#6B8E5A] text-white text-xs font-semibold hover:bg-[#5A7A4A] transition-all shadow-sm hover:shadow-md"
            >
              New Mock Interview →
            </button>
          </div>
        </div>

        {/* Top Executive Overview: Score + Summary */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-[#344E41]/10 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Score Wheel */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#F4F7F1]/80 border border-[#344E41]/5">
              <CircularScore
                score={report.overallScore}
                size={160}
                strokeWidth={12}
                label="Overall Readiness"
                sublabel="Diagnostic Index"
              />
              <div className="mt-4 text-center">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#E5EEDC] text-[#344E41]">
                  {report.overallScore >= 80 ? 'Competitive Candidate' : report.overallScore >= 65 ? 'Approaching Benchmark' : 'Needs Practice'}
                </span>
                <p className="text-[11px] text-[#6B756D] mt-1.5">Based on calibrated hiring rubrics</p>
              </div>
            </div>

            {/* Narrative & Disclaimer */}
            <div className="lg:col-span-8 space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B8E5A]">
                  Executive Summary
                </span>
                <p className="text-base text-[#1F2A22] leading-relaxed mt-2 font-normal">
                  {report.summary}
                </p>
              </div>

              {/* Strengths & Weaknesses quick preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#E5EEDC]/40 border border-[#6B8E5A]/20 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#344E41]">
                    <CheckCircle2 className="w-4 h-4 text-[#6B8E5A]" /> Top Strengths
                  </div>
                  <ul className="text-xs text-[#1F2A22] space-y-1.5 list-disc list-inside">
                    {report.strengths.slice(0, 2).map((s, idx) => (
                      <li key={idx} className="leading-snug">{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> Focus Areas
                  </div>
                  <ul className="text-xs text-amber-950 space-y-1.5 list-disc list-inside">
                    {report.weaknesses.slice(0, 2).map((w, idx) => (
                      <li key={idx} className="leading-snug">{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Standard Advisory */}
              <div className="p-4 rounded-2xl bg-[#F4F7F1] border border-[#344E41]/10 text-xs text-[#6B756D] flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-[#6B8E5A] flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-[#344E41] font-semibold">Simulated Environment Notice: </strong>
                  {report.disclaimer}
                </div>
              </div>
            </div>
          </div>

          {/* 7 Competency Radar / Progress Bars */}
          <div className="pt-6 border-t border-[#344E41]/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#344E41] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#6B8E5A]" /> 7-Pillar Competency Breakdown
              </h3>
              <span className="text-xs text-[#6B756D]">Calibrated against target level expectations</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryLabels.map(({ key, label }) => {
                const val = (report.categories as any)[key] || 75;
                return (
                  <div
                    key={key}
                    className="p-4 rounded-2xl bg-[#F4F7F1]/60 border border-[#344E41]/5 space-y-2 hover:bg-[#F4F7F1] transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#344E41]">{label}</span>
                      <span className="font-bold text-[#1F2A22]">{val}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-black/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#6B8E5A] transition-all duration-1000 ease-out"
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Resume Reality Check Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-[#344E41]/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B8E5A] mb-1">
                <Sparkles className="w-4 h-4" /> Ground Truth Alignment
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#344E41]">Resume Reality Check</h2>
            </div>
            <span className="text-xs text-[#6B756D]">Verifies written resume claims against live verbal depth</span>
          </div>

          <p className="text-xs sm:text-sm text-[#6B756D] leading-relaxed max-w-3xl">
            Interviewers frequently test whether claims in your resume reflect hands-on ownership or surface exposure.
            Below is how your verbal answers measured up against specific claims made on paper.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {report.realityCheck.map((rc, idx) => (
              <RealityCheckCard key={idx} item={rc} />
            ))}
          </div>
        </div>

        {/* Weak Areas & Targeted Practice CTA */}
        {report.weakTopics && report.weakTopics.length > 0 && (
          <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-[#E5EEDC] to-white border border-[#6B8E5A]/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#6B8E5A]/20 text-[#344E41] text-xs font-semibold">
                <Dumbbell className="w-3.5 h-3.5 text-[#6B8E5A]" /> High-Impact Practice Opportunity
              </div>
              <h3 className="text-xl font-bold text-[#344E41]">
                Targeted Remediation Drills Ready
              </h3>
              <p className="text-xs sm:text-sm text-[#6B756D] max-w-xl">
                We isolated specific topics where your answers showed hesitation or missing technical nuances. Start rapid-fire practice drills to master them.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {report.weakTopics.map((topic, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-white border border-[#344E41]/10 text-[#344E41] shadow-2xs"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => onPracticeTopic(report.weakTopics[0])}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#344E41] text-white font-semibold text-xs hover:bg-[#23352C] transition-all shadow-md flex-shrink-0"
            >
              <Dumbbell className="w-4 h-4 text-[#8FAF78]" /> Practice "{report.weakTopics[0]}" →
            </button>
          </div>
        )}

        {/* Question-by-Question Deep Dive Analysis */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#344E41]">
                Question-by-Question Diagnostic ({candidateMessages.length} Responses)
              </h2>
              <p className="text-xs sm:text-sm text-[#6B756D] mt-1">
                Expand any question to review your transcript, evaluator rubric, and concrete stronger phrasing.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {candidateMessages.map((msg, idx) => {
              const relatedQ = interview.questionList.find((q) => q.id === msg.questionId);
              const evalData = msg.evaluation;
              const isExpanded = !!expandedQuestions[idx];

              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-[#344E41]/10 shadow-sm overflow-hidden transition-all"
                >
                  {/* Header / Clickable Toggle */}
                  <div
                    onClick={() => toggleQuestion(idx)}
                    className="p-6 cursor-pointer hover:bg-[#F4F7F1]/40 transition-colors flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B8E5A]">
                          Question #{idx + 1}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E5EEDC] text-[#344E41] font-medium">
                          {relatedQ?.topic || 'General Technical'}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-[#344E41] leading-snug">
                        {relatedQ?.question || 'Interview Question'}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      {evalData && (
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            evalData.score >= 80
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : evalData.score >= 60
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {evalData.classification} • {evalData.score}%
                        </span>
                      )}
                      <div className="w-8 h-8 rounded-full bg-[#F4F7F1] flex items-center justify-center text-[#344E41]">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-[#344E41]/5 space-y-5">
                      {/* Candidate Answer */}
                      <div className="p-4 rounded-2xl bg-[#F4F7F1] border border-[#344E41]/5 space-y-1">
                        <span className="text-[10px] font-bold text-[#6B756D] uppercase tracking-wider block">
                          Your Stated Response:
                        </span>
                        <p className="text-xs sm:text-sm text-[#1F2A22] leading-relaxed font-mono whitespace-pre-wrap">
                          {msg.text}
                        </p>
                      </div>

                      {/* Evaluator Rubric Feedback */}
                      {evalData && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 space-y-1.5">
                            <span className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> What Demonstrated Strength:
                            </span>
                            <p className="text-emerald-950 text-xs leading-relaxed">
                              {evalData.whatWasGood}
                            </p>
                          </div>

                          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 space-y-1.5">
                            <span className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                              <AlertTriangle className="w-4 h-4 text-amber-600" /> What Was Missing or Vague:
                            </span>
                            <p className="text-amber-950 text-xs leading-relaxed">
                              {evalData.whatWasMissing}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Suggested Stronger Answer Grounded in Resume */}
                      {evalData?.strongerExample && (
                        <div className="p-5 rounded-2xl bg-[#E5EEDC]/60 border border-[#6B8E5A]/30 space-y-2">
                          <div className="flex items-center gap-2 font-bold text-[#344E41] text-xs">
                            <Sparkles className="w-4 h-4 text-[#6B8E5A]" />
                            <span>Example Stronger Answer (Strictly Grounded in Your Stated Experience):</span>
                          </div>
                          <p className="text-xs sm:text-sm text-[#1F2A22] italic leading-relaxed bg-white/70 p-3.5 rounded-xl border border-[#344E41]/5">
                            "{evalData.strongerExample}"
                          </p>
                          {evalData.suggestedImprovement && (
                            <p className="text-xs text-[#6B756D] pt-1">
                              <strong className="text-[#344E41]">Coaching Advice:</strong> {evalData.suggestedImprovement}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Immediate Drill Action */}
                      <div className="flex items-center justify-end pt-2">
                        <button
                          onClick={() => onPracticeTopic(relatedQ?.topic || 'General Practice')}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B8E5A] hover:text-[#344E41] transition-colors"
                        >
                          <Dumbbell className="w-3.5 h-3.5" /> Practice questions on {relatedQ?.topic || 'this topic'} →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="p-8 rounded-3xl bg-white border border-[#344E41]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-[#344E41]">Ready for your next iteration?</h4>
            <p className="text-xs text-[#6B756D]">Consistent deliberate practice compounds interview confidence.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-2.5 rounded-full border border-[#344E41]/15 text-[#344E41] text-xs font-semibold hover:bg-[#F4F7F1] transition-all"
            >
              Return to Dashboard
            </button>
            <button
              onClick={() => onNavigate('interview')}
              className="px-6 py-2.5 rounded-full bg-[#6B8E5A] text-white text-xs font-semibold hover:bg-[#5A7A4A] transition-all shadow-sm"
            >
              Start Next Session →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
