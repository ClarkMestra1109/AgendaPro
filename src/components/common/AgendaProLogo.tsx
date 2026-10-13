import React from 'react';

interface AgendaProLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  subtitleText?: string;
  theme?: 'light' | 'dark';
  className?: string;
}

export const AgendaProLogo: React.FC<AgendaProLogoProps> = ({
  size = 'md',
  showSubtitle = false,
  subtitleText = 'WORKSPACE',
  theme = 'light',
  className = ''
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  }[size];

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Calendar Icon with Blue Background, Grid dots and Green Checkmark */}
      <div className={`relative ${iconDimensions} bg-[#2563EB] rounded-xl flex items-center justify-center shadow-xs shrink-0 p-1.5`}>
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white" strokeWidth="2.2" stroke="currentColor">
          <rect x="3" y="5" width="18" height="16" rx="3.5" stroke="currentColor" fill="none" />
          <line x1="8" y1="2.5" x2="8" y2="5.5" stroke="currentColor" strokeLinecap="round" />
          <line x1="16" y1="2.5" x2="16" y2="5.5" stroke="currentColor" strokeLinecap="round" />
          <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" />
          {/* Inner dots */}
          <circle cx="8" cy="14" r="1.1" fill="currentColor" />
          <circle cx="12" cy="14" r="1.1" fill="currentColor" />
          <circle cx="8" cy="18" r="1.1" fill="currentColor" />
        </svg>
        {/* Vibrant Green Checkmark Badge overlay */}
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#10B981] rounded-full flex items-center justify-center border-2 border-white">
          <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="2.5 6 4.8 8.5 9.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col">
        <div className={`font-display font-bold tracking-tight leading-none ${textSizes} ${theme === 'dark' ? 'text-white' : 'text-[#0B1C30]'}`}>
          Agenda<span className="text-[#2563EB]">Pro</span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 mt-0.5">
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );
};
