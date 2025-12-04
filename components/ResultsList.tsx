
import React, { useState } from 'react';
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
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
        <div className="flex flex-col items-center justify-center py-20 bg-slate-800/50 rounded-2xl border border-slate-700 mx-auto max-w-md">
            <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">No flights found</h3>
            <p className="text-gray-400 text-center px-4">Try changing your dates or destinations to find available flights.</p>
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
               <div className="bg-slate-800 rounded-xl p-4 md:p-5 border border-slate-700 hover:border-brand-500/50 transition-all shadow-lg group">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Flight Content Column */}
                     <div className="flex-1">
                         {/* Header with Airline */}
                         <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-900 flex items-center justify-center font-bold text-sm shrink-0">
                                {offer.owner.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <div className="font-bold text-white text-base truncate">{offer.owner.name}</div>
                                <div className="text-xs text-gray-500 truncate">Operated by {offer.slices[0].segments[0].marketing_carrier.name}</div>
                            </div>
                         </div>

                         {/* Segments */}
                         <div className="space-y-6">
                            {offer.slices[0].segments.map((seg, i) => {
                                const durationStr = offer.slices[0].duration.replace('PT','').toLowerCase();
                                
                                return (
                                <div key={i} className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-6 relative">
                                    {/* Departure */}
                                    <div className="flex flex-row sm:flex-col items-center sm:items-center justify-between w-full sm:w-auto min-w-[80px]">
                                        <div className="text-xl font-bold text-white order-2 sm:order-1">
                                            {new Date(seg.departing_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                        <div className="text-xs font-bold text-gray-400 bg-slate-700/50 rounded px-2 py-1 inline-block mt-0 sm:mt-1 order-1 sm:order-2">
                                            {seg.origin.iata_code}
                                        </div>
                                    </div>

                                    {/* Duration Visual - Hidden on very small screens or styled differently */}
                                    <div className="flex flex-col items-center flex-1 w-full sm:px-4">
                                        <div className="text-xs text-gray-500 mb-1">{durationStr}</div>
                                        
                                        <div className="w-full flex items-center gap-0 relative max-w-[200px]">
                                            <div className="h-1.5 w-1.5 rounded-full bg-slate-600 shrink-0"></div>
                                            <div className="h-[2px] flex-1 bg-slate-700 relative">
                                                 <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-600 text-[10px]">▼</div>
                                            </div>
                                            <div className="h-1.5 w-1.5 rounded-full bg-slate-600 shrink-0"></div>
                                        </div>
                                        
                                        <div className="text-xs text-green-500 mt-1 font-medium">Non-stop</div>
                                    </div>

                                    {/* Arrival */}
                                    <div className="flex flex-row sm:flex-col items-center sm:items-center justify-between w-full sm:w-auto min-w-[80px]">
                                        <div className="text-xs font-bold text-gray-400 bg-slate-700/50 rounded px-2 py-1 inline-block mb-0 sm:mb-1 order-1 sm:order-1">
                                            {seg.destination.iata_code}
                                        </div>
                                        <div className="text-xl font-bold text-white order-2 sm:order-2">
                                            {new Date(seg.arriving_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                    </div>
                                </div>
                                );
                            })}
                         </div>
                     </div>

                    {/* Price Column */}
                    <div className="flex flex-row lg:flex-col items-center lg:justify-center gap-4 lg:border-l border-slate-700 lg:pl-6 lg:w-48 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-700/50">
                         <div className="text-right lg:text-center ml-auto lg:ml-0">
                            <div className="text-2xl md:text-3xl font-bold text-brand-500 whitespace-nowrap">
                                {offer.total_amount} <span className="text-sm text-gray-500 font-normal">{offer.total_currency}</span>
                            </div>
                            <div className="text-xs text-gray-500">per person</div>
                         </div>
                         <button 
                            onClick={() => onSelect(offer)}
                            className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2.5 px-6 rounded-full transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_20px_rgba(14,165,233,0.5)] whitespace-nowrap text-sm md:text-base"
                         >
                            Select
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
