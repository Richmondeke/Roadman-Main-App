
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlightOffer } from '../types';
import { RoadmanButton } from './TronComponents';

interface ResultsListProps {
  results: FlightOffer[];
  onSelect: (offer: FlightOffer) => void;
  onBack: () => void;
}

// Helper to parse ISO duration (e.g. PT7H30M) to minutes for sorting
const parseDurationToMinutes = (isoDuration: string): number => {
    const hoursMatch = isoDuration.match(/(\d+)H/);
    const minutesMatch = isoDuration.match(/(\d+)M/);
    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
    return (hours * 60) + minutes;
};

// Helper to get cabin class display name
const formatCabinClass = (code: string | undefined): string => {
    if (!code) return 'Economy';
    switch(code.toLowerCase()) {
        case 'economy': return 'Economy';
        case 'premium_economy': return 'Premium Econ';
        case 'business': return 'Business';
        case 'first': return 'First Class';
        default: return code;
    }
};

export const ResultsList: React.FC<ResultsListProps> = ({ results, onSelect, onBack }) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // --- Derived Data for Filters ---
  const allAirlines = useMemo(() => {
      const airlines = new Set<string>();
      results.forEach(r => airlines.add(r.owner.name));
      return Array.from(airlines);
  }, [results]);

  const priceRange = useMemo(() => {
      if (results.length === 0) return { min: 0, max: 1000 };
      const prices = results.map(r => parseFloat(r.total_amount));
      return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [results]);

  // --- Filter State ---
  const [priceLimit, setPriceLimit] = useState<number>(priceRange.max);
  const [selectedStops, setSelectedStops] = useState<number[]>([]); // 0 = Direct, 1 = 1 Stop
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedCabinClasses, setSelectedCabinClasses] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'CHEAPEST' | 'FASTEST'>('CHEAPEST');

  // Update price limit initially when results load
  React.useEffect(() => {
      setPriceLimit(priceRange.max);
  }, [priceRange.max]);

  // --- Filtering Logic ---
  const filteredResults = useMemo(() => {
      let filtered = results.filter(offer => {
          // 1. Price Filter
          const price = parseFloat(offer.total_amount);
          if (price > priceLimit) return false;

          // 2. Stops Filter
          const stops = offer.slices[0].segments.length - 1;
          if (selectedStops.length > 0) {
              const normalizedStops = stops > 1 ? 2 : stops;
              if (!selectedStops.includes(normalizedStops)) return false;
          }

          // 3. Airline Filter
          if (selectedAirlines.length > 0) {
              if (!selectedAirlines.includes(offer.owner.name)) return false;
          }

          // 4. Cabin Class Filter
          // Use optional chaining to safely access nested passengers property
          const cabinClass = offer.slices[0].segments[0].passengers?.[0]?.cabin_class || 'economy';
          if (selectedCabinClasses.length > 0) {
              if (!selectedCabinClasses.includes(cabinClass)) return false;
          }

          return true;
      });

      // 5. Sorting
      return filtered.sort((a, b) => {
          if (sortBy === 'CHEAPEST') {
              return parseFloat(a.total_amount) - parseFloat(b.total_amount);
          } else {
              // Fastest
              return parseDurationToMinutes(a.slices[0].duration) - parseDurationToMinutes(b.slices[0].duration);
          }
      });

  }, [results, priceLimit, selectedStops, selectedAirlines, selectedCabinClasses, sortBy]);


  // --- Handlers ---
  const toggleStop = (stop: number) => {
      setSelectedStops(prev => prev.includes(stop) ? prev.filter(s => s !== stop) : [...prev, stop]);
  };

  const toggleAirline = (airline: string) => {
      setSelectedAirlines(prev => prev.includes(airline) ? prev.filter(a => a !== airline) : [...prev, airline]);
  };

  const toggleCabinClass = (cabin: string) => {
      setSelectedCabinClasses(prev => prev.includes(cabin) ? prev.filter(c => c !== cabin) : [...prev, cabin]);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span className="text-sm font-medium">Back to Search</span>
        </button>
        
        <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400 hidden md:block">
                Showing {filteredResults.length} of {results.length} flights
            </div>
            <button 
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg text-sm font-bold text-white border border-slate-700"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                Filters
            </button>
            <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5"
            >
                <option value="CHEAPEST">Cheapest First</option>
                <option value="FASTEST">Fastest First</option>
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* SIDEBAR FILTERS */}
          <div className={`lg:col-span-1 space-y-6 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
             <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700 p-6 sticky top-24">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-display font-bold text-white text-lg">Filters</h3>
                    <button 
                        onClick={() => {
                            setPriceLimit(priceRange.max);
                            setSelectedStops([]);
                            setSelectedAirlines([]);
                            setSelectedCabinClasses([]);
                        }}
                        className="text-xs text-brand-400 hover:text-brand-300 underline"
                    >
                        Reset
                    </button>
                </div>

                {/* Price Filter */}
                <div className="mb-8">
                    <label className="text-sm font-bold text-gray-300 mb-2 block">Max Price</label>
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>{priceRange.min}</span>
                        <span className="text-white font-mono font-bold">${priceLimit}</span>
                        <span>{priceRange.max}</span>
                    </div>
                    <input 
                        type="range" 
                        min={priceRange.min} 
                        max={priceRange.max} 
                        value={priceLimit}
                        onChange={(e) => setPriceLimit(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                    />
                </div>

                {/* Stops Filter */}
                <div className="mb-8">
                    <label className="text-sm font-bold text-gray-300 mb-3 block">Stops</label>
                    <div className="space-y-2">
                        {[
                            { label: 'Non-stop', val: 0 },
                            { label: '1 Stop', val: 1 },
                            { label: '2+ Stops', val: 2 }
                        ].map((opt) => (
                            <label key={opt.val} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedStops.includes(opt.val) ? 'bg-brand-600 border-brand-600' : 'border-slate-600 bg-slate-900 group-hover:border-slate-500'}`}>
                                    {selectedStops.includes(opt.val) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="hidden"
                                    checked={selectedStops.includes(opt.val)}
                                    onChange={() => toggleStop(opt.val)}
                                />
                                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{opt.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Cabin Class Filter */}
                <div className="mb-8">
                    <label className="text-sm font-bold text-gray-300 mb-3 block">Cabin Class</label>
                    <div className="space-y-2">
                        {[
                            { label: 'Economy', val: 'economy' },
                            { label: 'Premium Economy', val: 'premium_economy' },
                            { label: 'Business', val: 'business' },
                            { label: 'First', val: 'first' }
                        ].map((opt) => (
                            <label key={opt.val} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedCabinClasses.includes(opt.val) ? 'bg-brand-600 border-brand-600' : 'border-slate-600 bg-slate-900 group-hover:border-slate-500'}`}>
                                    {selectedCabinClasses.includes(opt.val) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="hidden"
                                    checked={selectedCabinClasses.includes(opt.val)}
                                    onChange={() => toggleCabinClass(opt.val)}
                                />
                                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{opt.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Airlines Filter */}
                <div>
                    <label className="text-sm font-bold text-gray-300 mb-3 block">Airlines</label>
                    <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                        {allAirlines.map((airline) => (
                             <label key={airline} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedAirlines.includes(airline) ? 'bg-brand-600 border-brand-600' : 'border-slate-600 bg-slate-900 group-hover:border-slate-500'}`}>
                                    {selectedAirlines.includes(airline) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="hidden"
                                    checked={selectedAirlines.includes(airline)}
                                    onChange={() => toggleAirline(airline)}
                                />
                                <span className="text-sm text-gray-300 group-hover:text-white transition-colors truncate">{airline}</span>
                            </label>
                        ))}
                    </div>
                </div>

             </div>
          </div>

          {/* RESULTS COLUMN */}
          <div className="lg:col-span-3">
                {filteredResults.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-slate-800/50 rounded-2xl border border-slate-700 mx-auto w-full">
                        <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <h3 className="text-xl font-bold text-white mb-2">No flights match your filters</h3>
                        <button 
                            onClick={() => {
                                setPriceLimit(priceRange.max);
                                setSelectedStops([]);
                                setSelectedAirlines([]);
                                setSelectedCabinClasses([]);
                            }}
                            className="text-brand-400 hover:text-white underline mt-2"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                    {filteredResults.map((offer, index) => (
                        <motion.div
                        key={offer.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        layoutId={offer.id}
                        >
                        <div className="bg-slate-800 rounded-xl p-4 md:p-5 border border-slate-700 hover:border-brand-500/50 transition-all shadow-lg group">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Flight Content Column */}
                                <div className="flex-1">
                                    {/* Header with Airline and Class */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-900 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                                            {offer.owner.logo_symbol_url ? (
                                                <img src={offer.owner.logo_symbol_url} alt={offer.owner.name} className="w-full h-full object-cover" />
                                            ) : (
                                                offer.owner.name.substring(0, 2).toUpperCase()
                                            )}
                                        </div>
                                        <div className="overflow-hidden flex-1">
                                            <div className="flex items-center gap-2">
                                                <div className="font-bold text-white text-base truncate">{offer.owner.name}</div>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-700 text-gray-300 uppercase tracking-wide border border-slate-600">
                                                    {formatCabinClass(offer.slices[0].segments[0].passengers?.[0]?.cabin_class)}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500 truncate">Operated by {offer.slices[0].segments[0].marketing_carrier.name}</div>
                                        </div>
                                    </div>

                                    {/* Segments */}
                                    <div className="space-y-6">
                                        {offer.slices[0].segments.map((seg, i) => {
                                            const durationStr = offer.slices[0].duration.replace('PT','').toLowerCase();
                                            const stops = offer.slices[0].segments.length - 1;
                                            
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

                                                {/* Duration Visual */}
                                                <div className="flex flex-col items-center flex-1 w-full sm:px-4">
                                                    <div className="text-xs text-gray-500 mb-1">{durationStr}</div>
                                                    
                                                    <div className="w-full flex items-center gap-0 relative max-w-[200px]">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-slate-600 shrink-0"></div>
                                                        <div className="h-[2px] flex-1 bg-slate-700 relative">
                                                            {stops > 0 && <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-500 ring-2 ring-slate-800"></div>}
                                                        </div>
                                                        <div className="h-1.5 w-1.5 rounded-full bg-slate-600 shrink-0"></div>
                                                    </div>
                                                    
                                                    <div className={`text-xs mt-1 font-medium ${stops === 0 ? 'text-green-500' : 'text-yellow-500'}`}>
                                                        {stops === 0 ? 'Non-stop' : `${stops} Stop${stops > 1 ? 's' : ''}`}
                                                    </div>
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
                                <div className="flex flex-row md:flex-col items-center md:justify-center gap-4 md:border-l border-slate-700 md:pl-6 md:w-48 pt-4 md:pt-0 border-t md:border-t-0 border-slate-700/50">
                                    <div className="text-right md:text-center ml-auto md:ml-0">
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
      </div>
    </div>
  );
};
