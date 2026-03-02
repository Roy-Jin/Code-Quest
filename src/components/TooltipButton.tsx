import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  tooltip: string;
  tooltipAlign?: 'center' | 'right';
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

export function TooltipButton({ icon, tooltip, tooltipAlign = 'center', className = '', ...props }: TooltipButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isHovered && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = tooltipAlign === 'right' 
        ? rect.right 
        : rect.left + rect.width / 2;
      const y = rect.bottom + 8;
      setTooltipPosition({ x, y });
    }
  }, [isHovered, tooltipAlign]);

  const arrowAlignClass = tooltipAlign === 'right'
    ? 'right-3'
    : 'left-1/2 -translate-x-1/2';

  const tooltipAlignClass = tooltipAlign === 'right'
    ? '-translate-x-full'
    : '-translate-x-1/2';

  return (
    <>
      <button
        ref={buttonRef}
        className={`flex items-center justify-center transition-all duration-200 disabled:opacity-50 ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {icon}
      </button>
      {isHovered && createPortal(
        <div 
          className={`fixed px-2.5 py-1.5 bg-slate-700 text-slate-100 text-xs font-medium rounded shadow-lg whitespace-nowrap pointer-events-none z-[9999] transition-opacity duration-200 ${tooltipAlignClass}`}
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
          }}
        >
          {tooltip}
          <div className={`absolute bottom-full ${arrowAlignClass} border-4 border-transparent border-b-slate-700`}></div>
        </div>,
        document.body
      )}
    </>
  );
}
