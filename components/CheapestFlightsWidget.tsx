
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LocationAutocomplete } from './LocationAutocomplete';
import { getTrendingDestinations } from '../services/duffelService';
import { DestinationDeal } from '../types';
import { RoadmanCard } from './TronComponents';

interface CheapestFlightsWidgetProps {
    onSelectDeal: (deal: DestinationDeal) => void;
}

export const CheapestFlightsWidget: React.FC<CheapestFlightsWidgetProps> = ({ onSelectDeal }) => {
    const [origin, setOrigin] = useState('JFK');
    const [deals, setDeals] = useState<DestinationDeal[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDeals = async () => {
            if (!origin) return;
            setLoading(true);
            try {
                const results = await getTrendingDestinations(origin);
                setDeals(results);
            } catch (error) {
                console.error("Failed to fetch deals", error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce effect
        const timer = setTimeout(() => {
            fetchDeals();
        }, 500);

        return () => clearTimeout(timer);
    }, [origin]);

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
            <div className="border border-brand-500/30 rounded-2xl p-6 md:p-8 bg-slate-900/50 backdrop-blur-sm shadow-[0_0_20px_rgba(14,165,233,0.05)]">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
                        <h2 className="font-display text-xl md:text-2xl font-bold text-white whitespace-nowrap">
                            Cheapest Flights from
                        </h2>
                        <div className="w-full md:w-48 relative z-30">
                            {/* Integrated styling for LocationAutocomplete */}
                            <LocationAutocomplete 
                                label="" 
                                value={origin} 
                                onChange={(val) => setOrigin(val)}
                                placeholder="Home Airport"
                                className="!w-full"
                            />
                        </div>
                    </div>
                    <div className="text-xs md:text-sm text-gray-400">
                        Best deals found in the last 24 hours
                    </div>
                </div>

                <div className="relative min-h-[300px]">
                    {loading ? (
                        <div className="flex gap-4 overflow-hidden">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="w-64 h-80 bg-slate-800 rounded-xl animate-pulse border border-slate-700 flex-shrink-0" />
                            ))}
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x"
                        >
                            <AnimatePresence mode="popLayout">
                                {deals.map((deal) => (
                                    <motion.div
                                        key={deal.id}
                                        layoutId={deal.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        whileHover={{ y: -5 }}
                                        onClick={() => onSelectDeal(deal)}
                                        className="snap-start flex-shrink-0 w-64 cursor-pointer group"
                                    >
                                        <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-brand-500/50 transition-all h-full shadow-lg group-hover:shadow-brand-500/10">
                                            {/* Image Section */}
                                            <div className="h-44 relative overflow-hidden">
                                                <img 
                                                    src={deal.imageUrl} 
                                                    alt={deal.destinationCity} 
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/20" />
                                                
                                                {/* Airport Code Badge (Top Right) */}
                                                <div className="absolute top-3 right-3">
                                                    <span className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                                        {deal.destination}
                                                    </span>
                                                </div>

                                                {/* Location Text (Bottom Left) */}
                                                <div className="absolute bottom-3 left-3">
                                                    <h3 className="text-xl font-bold text-white leading-tight drop-shadow-md">
                                                        {deal.destinationCity}
                                                    </h3>
                                                    <p className="text-xs text-gray-300 font-medium drop-shadow-md">{deal.destinationCountry}</p>
                                                </div>
                                            </div>

                                            {/* Info Section */}
                                            <div className="p-4 bg-slate-800 relative">
                                                <div className="flex justify-between items-end">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">One-way from</span>
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-2xl font-bold text-white tracking-tight">{deal.price}</span>
                                                            <span className="text-xs text-gray-500 font-bold">{deal.currency}</span>
                                                        </div>
                                                        <div className="text-xs text-brand-400 mt-1 font-medium truncate max-w-[120px]">
                                                            {deal.airline}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-400">
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                            <span>Depart: {new Date(deal.departureDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
                                                        </div>
                                                    </div>

                                                    {/* Arrow Button */}
                                                    <div className="mb-1">
                                                        <div className="w-8 h-8 rounded-full border border-slate-600 flex items-center justify-center text-gray-400 group-hover:border-brand-500 group-hover:text-brand-400 transition-colors">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {deals.length === 0 && !loading && (
                                <div className="w-full text-center py-10 text-gray-500 border border-dashed border-slate-700 rounded-xl">
                                    No deals found for this airport right now.
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};
