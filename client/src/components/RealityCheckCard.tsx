import React from 'react';
import { RealityCheckItem } from '../types/index.js';
import { CheckCircle2, AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { Badge } from './Badge.js';

interface RealityCheckCardProps {
  item: RealityCheckItem;
}

export const RealityCheckCard: React.FC<RealityCheckCardProps> = ({ item }) => {
  const getAssessmentBadge = () => {
    switch (item.assessment) {
      case 'strongly demonstrated':
      case 'demonstrated':
        return (
          <Badge variant="success" size="sm">
            <CheckCircle2 className="w-3 h-3" /> Strongly Demonstrated
          </Badge>
        );
      case 'partially demonstrated':
      case 'partial':
        return (
          <Badge variant="warning" size="sm">
            <AlertCircle className="w-3 h-3" /> Partially Demonstrated
          </Badge>
        );
      case 'needs practice':
      case 'gap':
        return (
          <Badge variant="warning" size="sm">
            <HelpCircle className="w-3 h-3" /> Needs Practice
          </Badge>
        );
      case 'not demonstrated in this interview':
      default:
        return (
          <Badge variant="neutral" size="sm">
            <HelpCircle className="w-3 h-3" /> Not Demonstrated in Session
          </Badge>
        );
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-soft hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
            Resume Claim
          </span>
          <p className="text-sm font-bold text-brand-primary">{item.resumeClaim}</p>
        </div>
        <div>{getAssessmentBadge()}</div>
      </div>

      <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 mb-2.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted block mb-1">
          Interview Observation
        </span>
        <p className="text-xs text-ink leading-relaxed">{item.interviewObservation}</p>
      </div>

      <div className="flex items-start gap-2 text-xs text-brand-accent bg-brand-accentLight/60 p-2.5 rounded-lg border border-brand-accent/20">
        <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block text-[11px]">Recommended Focus:</span>
          <span>{item.recommendation}</span>
        </div>
      </div>
    </div>
  );
};
