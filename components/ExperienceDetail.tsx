
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
    <div className="w-full min-h-screen pb-20">
        {/* Hero Section */}
        <div className="relative h-[60vh] w-full">
            <img src={experience.image} alt={experience.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
            
            <div className="absolute top-6 left-6 z-20">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full text-white hover:bg-white/20 transition-all border border-white/10"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Collection
                </button>
            </div>

            <motion.div 
                layoutId={`card-${experience.id}`}
                className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-5xl mx-auto"
            >
                <div className="flex gap-3 mb-4">
                     <span className="bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(14,165,233,0.5)]">
                        {experience.tag}
                     </span>
                     <span className="bg-white/10 backdrop-blur border border-white/20 text-gray-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {experience.location}
                     </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 leading-tight">
                    {experience.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
                    {experience.description}
                </p>
            </motion.div>
        </div>

        <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
                {/* Tabs */}
                <div className="flex border-b border-slate-700">
                    <button 
                        onClick={() => setActiveTab('ITINERARY')}
                        className={`px-6 py-4 font-bold text-sm uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'ITINERARY' ? 'border-brand-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                    >
                        Itinerary
                    </button>
                    <button 
                        onClick={() => setActiveTab('INCLUDED')}
                        className={`px-6 py-4 font-bold text-sm uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'INCLUDED' ? 'border-brand-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                    >
                        What's Included
                    </button>
                </div>

                <div className="min-h-[300px]">
                    {activeTab === 'ITINERARY' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            {experience.itinerary.map((day) => (
                                <div key={day.day} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-brand-500/50 flex items-center justify-center text-brand-400 font-bold text-sm shadow-[0_0_10px_rgba(14,165,233,0.2)]">
                                            {day.day}
                                        </div>
                                        <div className="w-0.5 flex-1 bg-slate-800 my-2"></div>
                                    </div>
                                    <div className="pb-8">
                                        <h4 className="text-xl font-bold text-white mb-2">{day.title}</h4>
                                        <p className="text-gray-400 leading-relaxed">{day.description}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'INCLUDED' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {experience.included.map((item, idx) => (
                                <div key={idx} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-3">
                                    <div className="text-green-400">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <span className="font-semibold text-gray-200">{item}</span>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Sticky Sidebar Booking */}
            <div className="md:col-span-1">
                <RoadmanCard className="sticky top-24 border-t-4 border-t-brand-500 shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                             <p className="text-sm text-gray-400">Total Package Price</p>
                             <div className="text-3xl font-display font-bold text-white">
                                {experience.price} <span className="text-lg font-normal text-gray-500">{experience.currency}</span>
                             </div>
                             <p className="text-xs text-gray-500">per person</p>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                         <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                             <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                             <div>
                                 <p className="text-xs text-gray-500 uppercase font-bold">Start Date</p>
                                 <p className="text-sm font-semibold text-gray-200">{new Date(experience.date).toLocaleDateString()}</p>
                             </div>
                         </div>
                         <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                             <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             <div>
                                 <p className="text-xs text-gray-500 uppercase font-bold">Duration</p>
                                 <p className="text-sm font-semibold text-gray-200">{experience.duration_days} Days / {experience.duration_days - 1} Nights</p>
                             </div>
                         </div>
                    </div>

                    <RoadmanButton onClick={() => onBook(experience)} className="w-full text-lg shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]">
                        Reserve Spot
                    </RoadmanButton>
                    <p className="text-center text-xs text-gray-500 mt-3">Limited availability. Instant confirmation.</p>
                </RoadmanCard>
            </div>
        </div>
    </div>
  );
};
