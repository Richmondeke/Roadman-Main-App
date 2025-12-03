
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlightOffer } from '../types';

interface ResultsListProps {
  results: FlightOffer[];
  onSelect: (offer: FlightOffer) => void;
  onBack: () => void;
}

export const ResultsList: React.FC<ResultsListProps> = ({ results, onSelect, onBack }) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span className="text-sm font-medium">Back to Search</span>
        </button>
        <h2 className="font-display text-xl font-bold text-white">
          {results.length} Flights Found
        </h2>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-800/50 rounded-2xl border border-slate-700">
            <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">No flights found</h3>
            <p className="text-gray-400">Try changing your dates or destinations.</p>
        </div>
      ) : (
      <div className="space-y-4">
        <AnimatePresence>
          {results.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              layoutId={offer.id}
            >
               <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-brand-500/50 transition-all shadow-lg group">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Flight Content Column */}
                     <div className="flex-1">
                         {/* Header with Airline - Display once per card */}
                         <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-900 flex items-center justify-center font-bold text-sm shrink-0">
                                {offer.owner.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <div className="font-bold text-white text-base">{offer.owner.name}</div>
                                <div className="text-xs text-gray-500">Operated by {offer.slices[0].segments[0].marketing_carrier.name}</div>
                            </div>
                         </div>

                         {/* Segments */}
                         <div className="space-y-6">
                            {offer.slices[0].segments.map((seg, i) => {
                                // Calculate simple duration string for display if needed or use slice duration
                                // For simplicity, we use the slice duration for the main segment view
                                const durationStr = offer.slices[0].duration.replace('PT','').toLowerCase();
                                
                                return (
                                <div key={i} className="flex items-center justify-between sm:gap-12 relative">
                                    {/* Departure */}
                                    <div className="text-center min-w-[80px]">
                                        <div className="text-xl font-bold text-white">
                                            {new Date(seg.departing_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                        <div className="text-xs font-bold text-gray-400 bg-slate-700/50 rounded px-2 py-1 inline-block mt-1">
                                            {seg.origin.iata_code}
                                        </div>
                                    </div>

                                    {/* Duration Visual */}
                                    <div className="flex flex-col items-center flex-1 px-2 sm:px-4">
                                        <div className="text-xs text-gray-500 mb-1">{durationStr}</div>
                                        <div className="w-full flex items-center gap-0 relative">
                                            <div className="h-1.5 w-1.5 rounded-full bg-slate-600 shrink-0"></div>
                                            <div className="h-[2px] flex-1 bg-slate-700 relative">
                                                 {/* Center Marker V */}
                                                 <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-600 text-[10px]">▼</div>
                                            </div>
                                            <div className="h-1.5 w-1.5 rounded-full bg-slate-600 shrink-0"></div>
                                        </div>
                                        <div className="text-xs text-green-500 mt-1 font-medium">Non-stop</div>
                                    </div>

                                    {/* Arrival */}
                                    <div className="text-center min-w-[80px]">
                                        <div className="text-xl font-bold text-white">
                                            {new Date(seg.arriving_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                        <div className="text-xs font-bold text-gray-400 bg-slate-700/50 rounded px-2 py-1 inline-block mt-1">
                                            {seg.destination.iata_code}
                                        </div>
                                    </div>
                                </div>
                                );
                            })}
                         </div>
                     </div>

                    {/* Price Column */}
                    <div className="flex flex-row md:flex-col items-center md:justify-center gap-4 md:border-l border-slate-700 md:pl-6 md:w-48 pt-4 md:pt-0 border-t md:border-t-0 border-slate-700/50">
                         <div className="text-right md:text-center ml-auto md:ml-0">
                            <div className="text-3xl font-bold text-brand-500">
                                {offer.total_amount} <span className="text-sm text-gray-500 font-normal">{offer.total_currency}</span>
                            </div>
                            <div className="text-xs text-gray-500">per person</div>
                         </div>
                         <button 
                            onClick={() => onSelect(offer)}
                            className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2.5 px-6 rounded-full transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_20px_rgba(14,165,233,0.5)] whitespace-nowrap"
                         >
                            Select Flight
                         </button>
                    </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      )}
    </div>
  );
};
