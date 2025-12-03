import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
}

export const RoadmanButton: React.FC<ButtonProps> = ({ children, variant = 'primary', isLoading, className = '', ...props }) => {
  const baseClass = "relative overflow-hidden font-display font-semibold rounded-full py-3 px-8 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-500",
    secondary: "bg-slate-800 text-brand-400 border border-slate-700 hover:bg-slate-700 hover:text-white",
    ghost: "bg-transparent text-gray-300 hover:bg-slate-800 shadow-none"
  };

  return (
    <button
      className={`${baseClass} ${variants[variant]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          Loading...
        </span>
      ) : children}
    </button>
  );
};

export const RoadmanInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, onClick, className = '', ...props }) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-sm font-semibold text-gray-300 ml-1">
      {label}
    </label>
    <input
      className={`
        w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white 
        placeholder-gray-500
        focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
        transition-all shadow-sm
        [color-scheme:dark]
        ${props.type === 'date' ? 'cursor-pointer' : 'cursor-text'}
        ${className}
      `}
      onClick={(e) => {
        // Automatically open date picker on click anywhere in the input for date types
        if (props.type === 'date') {
           try {
             if ('showPicker' in e.currentTarget) {
                (e.currentTarget as any).showPicker();
             }
           } catch (err) {
             // Ignore errors if feature not supported or context invalid
             console.debug('Date picker open error:', err);
           }
        }
        // Chain the original onClick handler if provided
        if (onClick) {
          onClick(e);
        }
      }}
      {...props}
    />
  </div>
);

export const RoadmanCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-slate-800 rounded-2xl shadow-none border border-slate-700 p-6 overflow-hidden ${className}`}>
    {children}
  </div>
);