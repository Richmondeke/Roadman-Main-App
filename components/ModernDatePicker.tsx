
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModernDatePickerProps {
  label: string;
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  className?: string;
  minDate?: string;
}

export const ModernDatePicker: React.FC<ModernDatePickerProps> = ({
  label,
  value,
  onChange,
  className = '',
  minDate = new Date().toISOString().split('T')[0]
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Internal calendar state
  const initialDate = value ? new Date(value) : new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update current month view when external value changes
  useEffect(() => {
    if (value) {
       const date = new Date(value);
       if (!isNaN(date.getTime())) {
           setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
       }
    }
  }, [value]);

  // Calendar Logic
  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handlePrevMonth = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const handleNextMonth = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    // Adjust for timezone offset to ensure the string is correct YYYY-MM-DD
    // Use local time for string construction
    const year = selected.getFullYear();
    const month = String(selected.getMonth() + 1).padStart(2, '0');
    const d = String(selected.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${d}`;
    
    onChange(dateString);
    setIsOpen(false);
  };

  const renderCalendarDays = () => {
    const totalDays = daysInMonth(currentMonth);
    const startPadding = firstDayOfMonth(currentMonth);
    const days = [];

    // Padding
    for (let i = 0; i < startPadding; i++) {
        days.push(<div key={`pad-${i}`} className="h-8 w-8" />);
    }

    // Days
    for (let day = 1; day <= totalDays; day++) {
        const dateToCheck = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const dateString = `${dateToCheck.getFullYear()}-${String(dateToCheck.getMonth() + 1).padStart(2, '0')}-${String(dateToCheck.getDate()).padStart(2, '0')}`;
        
        const isSelected = value === dateString;
        const isPast = dateString < minDate;
        const isToday = dateString === new Date().toISOString().split('T')[0];

        days.push(
            <button
                key={day}
                onClick={(e) => { e.preventDefault(); !isPast && handleDateClick(day); }}
                disabled={isPast}
                className={`
                    h-8 w-8 rounded-full text-sm font-medium transition-all flex items-center justify-center
                    ${isSelected ? 'bg-brand-500 text-white shadow-[0_0_10px_rgba(14,165,233,0.5)]' : ''}
                    ${!isSelected && !isPast ? 'hover:bg-slate-600 text-gray-200' : ''}
                    ${isPast ? 'text-gray-600 cursor-not-allowed' : ''}
                    ${isToday && !isSelected ? 'border border-brand-500 text-brand-400' : ''}
                `}
            >
                {day}
            </button>
        );
    }
    return days;
  };

  const formatDateDisplay = (dateStr: string) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      // We want to display the date in a readable format, e.g., "Tue, Oct 15"
      // Note: Date parsing from YYYY-MM-DD string assumes UTC in some browsers, local in others.
      // We split manually to be safe.
      const [y, m, d] = dateStr.split('-').map(Number);
      const safeDate = new Date(y, m - 1, d);
      return safeDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={`flex flex-col gap-1 w-full relative ${className}`} ref={containerRef}>
      <label className="text-sm font-semibold text-gray-300 ml-1">
        {label}
      </label>
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="relative cursor-pointer group"
      >
        <div className={`
            w-full p-3 pl-10 rounded-xl border transition-all text-white font-medium
            ${isOpen ? 'border-brand-500 ring-2 ring-brand-500/20 bg-slate-800' : 'border-slate-700 bg-slate-800 hover:border-slate-600'}
        `}>
             {value ? formatDateDisplay(value) : <span className="text-gray-500">Select Date</span>}
        </div>
        
        {/* Calendar Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-brand-400 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 p-4 bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl z-50 w-[300px]"
          >
             {/* Header */}
             <div className="flex justify-between items-center mb-4">
                 <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-700 rounded-full text-gray-400 hover:text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                 </button>
                 <span className="font-bold text-white">
                     {currentMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                 </span>
                 <button onClick={handleNextMonth} className="p-1 hover:bg-slate-700 rounded-full text-gray-400 hover:text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                 </button>
             </div>

             {/* Days Header */}
             <div className="grid grid-cols-7 mb-2">
                 {['S','M','T','W','T','F','S'].map(d => (
                     <div key={d} className="text-center text-xs font-bold text-gray-500">{d}</div>
                 ))}
             </div>

             {/* Calendar Grid */}
             <div className="grid grid-cols-7 gap-1">
                 {renderCalendarDays()}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
