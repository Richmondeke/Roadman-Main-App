
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExperienceOffer } from '../types';
import { RoadmanCard, RoadmanButton } from './TronComponents';
import { MOCK_EXPERIENCES } from '../data/mockExperiences';

interface ExperiencesViewProps {
  onSelect: (experience: ExperienceOffer) => void;
  onBack: () => void;
}

export const ExperiencesView: React.FC<ExperiencesViewProps> = ({ onSelect, onBack }) => {
  const [viewMode, setViewMode] = useState<'GRID' | 'CALENDAR'>('GRID');
  
  // For demo purposes, we focus on May 2026 where we have some events
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentMonth = "May 2026";

  const getEventsForDay = (day: number) => {
    return MOCK_EXPERIENCES.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === 4 && expDate.getDate() === day; // Month is 0-indexed (4 = May)
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
       {/* Header */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-gray-400 hover:text-brand-400 mb-2 transition-colors text-sm font-medium"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to Home
            </button>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">Explore Collections</h2>
            <p className="text-gray-400 mt-2 text-sm md:text-base">Curated adventures for the discerning traveler.</p>
          </div>

          <div className="bg-slate-800 p-1 rounded-lg flex border border-slate-700 self-start md:self-auto">
             <button 
                onClick={() => setViewMode('GRID')}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'GRID' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
             >
                Grid View
             </button>
             <button 
                onClick={() => setViewMode('CALENDAR')}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'CALENDAR' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
             >
                Calendar
             </button>
          </div>
       </div>

       <AnimatePresence mode="wait">
         {viewMode === 'GRID' ? (
            <motion.div 
                key="grid"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                {MOCK_EXPERIENCES.map((exp) => (
                    <motion.div 
                        key={exp.id}
                        layoutId={`card-${exp.id}`}
                        onClick={() => onSelect(exp)}
                        className="group cursor-pointer"
                        whileHover={{ y: -5 }}
                    >
                        <RoadmanCard className="h-full !p-0 border-transparent hover:border-brand-500/50 transition-colors bg-slate-800/50">
                            <div className="relative h-64 overflow-hidden">
                                <img src={exp.image} alt={exp.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80" />
                                <div className="absolute top-4 right-4">
                                     <span className="bg-white/10 backdrop-blur border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                                        {exp.tag}
                                     </span>
                                </div>
                                <div className="absolute bottom-4 left-6">
                                     <p className="text-brand-400 text-xs font-bold uppercase tracking-wider mb-1">{exp.location}</p>
                                     <h3 className="text-2xl font-display font-bold text-white">{exp.title}</h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        {new Date(exp.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric'})}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        {exp.duration_days} Days
                                    </div>
                                </div>
                                <div className="flex justify-between items-end border-t border-slate-700 pt-4">
                                    <div>
                                        <span className="text-xs text-gray-500">Starting from</span>
                                        <div className="text-xl font-bold text-white">{exp.price} {exp.currency}</div>
                                    </div>
                                    <span className="text-brand-400 text-sm font-bold group-hover:translate-x-1 transition-transform">View Details &rarr;</span>
                                </div>
                            </div>
                        </RoadmanCard>
                    </motion.div>
                ))}
            </motion.div>
         ) : (
            <motion.div
                key="calendar"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
            >
                <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
                        <h3 className="text-xl md:text-2xl font-display font-bold text-white">{currentMonth}</h3>
                        <div className="flex gap-2">
                             <button className="p-2 hover:bg-slate-700 rounded-full text-gray-400 hover:text-white"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
                             <button className="p-2 hover:bg-slate-700 rounded-full text-gray-400 hover:text-white"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
                        </div>
                    </div>
                    
                    {/* Calendar Grid Wrapper for Scroll */}
                    <div className="overflow-x-auto">
                        <div className="min-w-[800px]">
                            {/* Headings */}
                            <div className="grid grid-cols-7 border-b border-slate-700 bg-slate-900">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                    <div key={d} className="p-4 text-center text-sm font-bold text-gray-500 uppercase tracking-wider">{d}</div>
                                ))}
                            </div>
                            {/* Days */}
                            <div className="grid grid-cols-7 auto-rows-fr bg-slate-800">
                                {/* Empty padding for start of month (Friday start for May 2026) */}
                                {[...Array(5)].map((_, i) => <div key={`pad-${i}`} className="min-h-[140px] border border-slate-700/50 bg-slate-900/30"></div>)}
                                
                                {calendarDays.map(day => {
                                    const events = getEventsForDay(day);
                                    return (
                                        <div key={day} className="min-h-[140px] border border-slate-700/50 p-3 relative group hover:bg-slate-700/30 transition-colors">
                                            <span className={`text-sm font-medium ${events.length > 0 ? 'text-white' : 'text-gray-500'}`}>{day}</span>
                                            
                                            <div className="mt-2 space-y-1">
                                                {events.map(ev => (
                                                    <div 
                                                        key={ev.id}
                                                        onClick={() => onSelect(ev)}
                                                        className="text-xs p-1.5 rounded bg-brand-900/60 border border-brand-500/30 text-brand-100 cursor-pointer hover:bg-brand-600 hover:border-brand-400 hover:text-white transition-all shadow-[0_0_10px_rgba(14,165,233,0.1)] truncate"
                                                    >
                                                        {ev.title}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <p className="text-center text-gray-500 mt-6 text-sm">Showing events for May 2026 only in this demo view. Scroll horizontally to see full week.</p>
            </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
};
