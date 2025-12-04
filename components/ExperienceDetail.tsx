
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExperienceOffer } from '../types';
import { RoadmanButton, RoadmanCard } from './TronComponents';

interface ExperienceDetailProps {
  experience: ExperienceOffer;
  onBook: (experience: ExperienceOffer) => void;
  onBack: () => void;
}

export const ExperienceDetail: React.FC<ExperienceDetailProps> = ({ experience, onBook, onBack }) => {
  const [activeTab, setActiveTab] = useState<'ITINERARY' | 'INCLUDED'>('ITINERARY');

  return (
    <div className="w-full min-h-screen pb-20 bg-slate-900">
        {/* Hero Section */}
        <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
            <img 
                src={experience.image} 
                alt={experience.title} 
                className="w-full h-full object-cover" 
            />
            {/* Gradient Overlays for Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-slate-900" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
            
            <div className="absolute top-6 left-6 z-30">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-full text-white hover:bg-white/20 transition-all border border-white/10 text-sm font-medium shadow-lg"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Collection
                </button>
            </div>

            <motion.div 
                layoutId={`card-${experience.id}`}
                className="absolute bottom-0 left-0 right-0 p-6 pb-12 md:pb-24 md:p-16 max-w-5xl mx-auto z-20 flex flex-col justify-end h-full"
            >
                <div className="flex flex-wrap gap-3 mb-4">
                     <span className="bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(14,165,233,0.5)]">
                        {experience.tag}
                     </span>
                     <span className="bg-white/10 backdrop-blur border border-white/20 text-gray-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {experience.location}
                     </span>
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 leading-tight break-words hyphens-auto shadow-black drop-shadow-lg">
                    {experience.title}
                </h1>
                <p className="text-base md:text-xl text-gray-200 max-w-2xl leading-relaxed drop-shadow-md">
                    {experience.description}
                </p>
            </motion.div>
        </div>

        {/* Content Grid */}
        {/* Mobile: No negative margin to prevent overlap. Desktop: Negative margin for overlapping card effect. */}
        <div className="max-w-6xl mx-auto px-4 mt-6 md:-mt-16 relative z-30 grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Sidebar Booking (Appears first on mobile flow, second on desktop via order-2) */}
            <div className="md:col-span-1 order-1 md:order-2">
                <RoadmanCard className="md:sticky md:top-24 border-t-4 border-t-brand-500 shadow-2xl bg-slate-800/95 backdrop-blur-sm">
                    <div className="flex flex-col gap-1 mb-6 border-b border-slate-700 pb-4">
                         <p className="text-sm text-gray-400 font-medium">Total Package Price</p>
                         <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-display font-bold text-white tracking-tight">
                                {experience.price}
                            </span>
                            <span className="text-lg font-normal text-gray-400">{experience.currency}</span>
                         </div>
                         <p className="text-xs text-gray-500">per person • flight not included</p>
                    </div>

                    <div className="space-y-4 mb-8">
                         <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                             <div className="p-2 bg-slate-800 rounded-lg text-gray-300">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                             </div>
                             <div>
                                 <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Start Date</p>
                                 <p className="text-sm font-semibold text-gray-200">{new Date(experience.date).toLocaleDateString(undefined, {weekday:'short', month:'short', day:'numeric', year:'numeric'})}</p>
                             </div>
                         </div>
                         <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                             <div className="p-2 bg-slate-800 rounded-lg text-gray-300">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             </div>
                             <div>
                                 <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Duration</p>
                                 <p className="text-sm font-semibold text-gray-200">{experience.duration_days} Days / {experience.duration_days - 1} Nights</p>
                             </div>
                         </div>
                    </div>

                    <RoadmanButton 
                        onClick={() => onBook(experience)} 
                        className="w-full text-lg font-bold py-4 shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] transition-all"
                    >
                        Reserve Spot
                    </RoadmanButton>
                    
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-green-400 font-medium">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        <span>Free cancellation up to 7 days before</span>
                    </div>
                </RoadmanCard>
            </div>

            {/* Main Content (Itinerary) */}
            <div className="md:col-span-2 space-y-8 order-2 md:order-1 pb-10">
                {/* Tabs */}
                <div className="flex border-b border-slate-700 overflow-x-auto scrollbar-hide">
                    <button 
                        onClick={() => setActiveTab('ITINERARY')}
                        className={`px-6 py-4 font-bold text-sm uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${activeTab === 'ITINERARY' ? 'border-brand-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                    >
                        Itinerary
                    </button>
                    <button 
                        onClick={() => setActiveTab('INCLUDED')}
                        className={`px-6 py-4 font-bold text-sm uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${activeTab === 'INCLUDED' ? 'border-brand-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                    >
                        What's Included
                    </button>
                </div>

                <div className="min-h-[300px]">
                    {activeTab === 'ITINERARY' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-0">
                            {experience.itinerary.map((day, idx) => (
                                <div key={day.day} className="flex gap-4 md:gap-6 group">
                                    <div className="flex flex-col items-center">
                                        <div className={`
                                            w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-lg z-10
                                            transition-colors duration-300
                                            ${idx === 0 ? 'bg-brand-600 text-white' : 'bg-slate-800 border border-slate-700 text-gray-400 group-hover:border-brand-500 group-hover:text-brand-400'}
                                        `}>
                                            {day.day}
                                        </div>
                                        {idx !== experience.itinerary.length - 1 && (
                                            <div className="w-0.5 flex-1 bg-slate-800 my-2 group-hover:bg-slate-700 transition-colors"></div>
                                        )}
                                    </div>
                                    <div className="pb-10 pt-1 flex-1">
                                        <h4 className="text-lg md:text-xl font-bold text-white mb-2">{day.title}</h4>
                                        <p className="text-gray-400 leading-relaxed text-sm md:text-base">{day.description}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'INCLUDED' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {experience.included.map((item, idx) => (
                                <div key={idx} className="bg-slate-800/50 hover:bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-start gap-3 transition-colors">
                                    <div className="text-brand-500 mt-0.5">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <span className="font-medium text-gray-200 text-sm md:text-base">{item}</span>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>

        </div>
    </div>
  );
};
