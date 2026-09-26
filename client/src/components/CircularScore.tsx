import React from 'react';

interface CircularScoreProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
}

export const CircularScore: React.FC<CircularScoreProps> = ({
  score,
  size = 140,
  strokeWidth = 10,
  label = 'Estimated ATS Score',
  sublabel = 'Compatibility',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return '#16A34A'; // success green
    if (s >= 65) return '#6366F1'; // secondary indigo
    if (s >= 50) return '#D97706'; // warning amber
    return '#DC2626'; // danger red
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold tracking-tight text-ink" style={{ color }}>
            {score}
          </span>
          <span className="text-[11px] font-medium text-ink-muted uppercase tracking-wider">
            / 100
          </span>
        </div>
      </div>

      {label && <p className="mt-2.5 text-xs font-semibold text-ink">{label}</p>}
      {sublabel && <p className="text-[11px] text-ink-muted">{sublabel}</p>}
    </div>
  );
};
