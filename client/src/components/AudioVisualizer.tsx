import React from 'react';
import { Mic, Volume2, Loader2, Clock } from 'lucide-react';

export type InterviewState = 'Listening' | 'Processing' | 'Speaking' | 'Waiting';

interface AudioVisualizerProps {
  state: InterviewState;
  interviewerName?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  state,
  interviewerName = 'Dr. Sarah Vance (AI Interviewer)',
}) => {
  const getBadgeStyle = () => {
    switch (state) {
      case 'Speaking':
        return 'bg-brand-accent/10 text-brand-accent border-brand-accent/30';
      case 'Listening':
        return 'bg-status-success/10 text-status-success border-status-success/30 animate-pulse';
      case 'Processing':
        return 'bg-status-warning/10 text-status-warning border-status-warning/30';
      case 'Waiting':
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getIcon = () => {
    switch (state) {
      case 'Speaking':
        return <Volume2 className="w-3.5 h-3.5 animate-bounce" />;
      case 'Listening':
        return <Mic className="w-3.5 h-3.5 text-status-success" />;
      case 'Processing':
        return <Loader2 className="w-3.5 h-3.5 animate-spin text-status-warning" />;
      case 'Waiting':
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-200 shadow-soft">
      {/* Avatar with dynamic pulsing halo */}
      <div className="relative mb-4">
        {state === 'Speaking' && (
          <span className="absolute -inset-2 rounded-full bg-brand-accent/20 blur-sm animate-ping" />
        )}
        {state === 'Listening' && (
          <span className="absolute -inset-2 rounded-full bg-status-success/20 blur-sm animate-pulse" />
        )}

        <div className="relative w-20 h-20 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-premium border-2 border-white">
          <span className="text-2xl font-bold tracking-tight">IQ</span>
        </div>
      </div>

      <h3 className="text-base font-semibold text-brand-primary">{interviewerName}</h3>
      <p className="text-xs text-ink-muted mb-3">Senior Technical Staff & Engineering Lead</p>

      {/* Dynamic State Pill */}
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getBadgeStyle()}`}
      >
        {getIcon()}
        <span>
          {state === 'Speaking' && 'AI Speaking...'}
          {state === 'Listening' && 'Listening to your answer...'}
          {state === 'Processing' && 'Analyzing response & formulating follow-up...'}
          {state === 'Waiting' && 'Waiting for your response'}
        </span>
      </div>

      {/* Animated Sound Wave Bars */}
      <div className="flex items-center gap-1.5 h-8 mt-4 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => {
          const isAnimated = state === 'Speaking' || state === 'Listening';
          return (
            <div
              key={idx}
              className={`w-1 rounded-full transition-all duration-300 ${
                state === 'Listening'
                  ? 'bg-status-success'
                  : state === 'Speaking'
                  ? 'bg-brand-accent'
                  : 'bg-gray-300'
              } ${isAnimated ? `animate-soundwave-${(idx % 5) + 1}` : 'h-2'}`}
              style={{
                height: isAnimated ? undefined : `${(idx % 3) * 4 + 6}px`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
