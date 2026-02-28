import React, { ComponentPropsWithoutRef } from 'react';

interface TooltipButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  tooltip: string;
  tooltipAlign?: 'center' | 'right';
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

export function TooltipButton({ icon, tooltip, tooltipAlign = 'center', className = '', ...props }: TooltipButtonProps) {
  const alignClass = tooltipAlign === 'right' 
    ? 'right-0' 
    : 'left-1/2 -translate-x-1/2';
    
  const arrowAlignClass = tooltipAlign === 'right'
    ? 'right-3'
    : 'left-1/2 -translate-x-1/2';

  return (
    <div className="relative group flex items-center justify-center">
      <button
        className={`flex items-center justify-center transition-all duration-200 disabled:opacity-50 ${className}`}
        {...props}
      >
        {icon}
      </button>
      <div className={`absolute top-full mt-2 ${alignClass} px-2.5 py-1.5 bg-slate-700 text-slate-100 text-xs font-medium rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50`}>
        {tooltip}
        <div className={`absolute bottom-full ${arrowAlignClass} border-4 border-transparent border-b-slate-700`}></div>
      </div>
    </div>
  );
}
