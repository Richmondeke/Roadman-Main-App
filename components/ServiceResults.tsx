import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StayOffer, CarOffer, SecurityOffer, ServiceType } from '../types';
import { RoadmanButton, RoadmanCard } from './TronComponents';

interface ServiceResultsProps {
  type: ServiceType;
  results: (StayOffer | CarOffer | SecurityOffer)[];
  onSelect: (item: any) => void;
  onBack: () => void;
}

export const ServiceResults: React.FC<ServiceResultsProps> = ({ type, results, onSelect, onBack }) => {
  
  const getTitle = () => {
    switch(type) {
      case 'STAYS': return 'Available Stays';
      case 'CARS': return 'Available Vehicles';
      case 'SECURITY': return 'Verified Security Teams';
      default: return 'Results';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-300 hover:text-brand-400 font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Search
        </button>
        <h2 className="font-display text-2xl font-bold text-white">
          {results.length} {getTitle()} Found
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {results.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              layoutId={item.id}
              className="h-full"
            >
              <RoadmanCard className="h-full flex flex-col group hover:shadow-lg transition-shadow border-t-4 border-t-transparent hover:border-t-brand-500">
                <div className="h-48 mb-4 overflow-hidden rounded-xl bg-slate-700 relative">
                   <img src={item.image} alt="Service" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   {type === 'STAYS' && (
                     <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur text-yellow-400 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        {(item as StayOffer).rating}
                     </div>
                   )}
                   {type === 'SECURITY' && (
                     <div className="absolute top-2 right-2 bg-green-900/80 backdrop-blur text-green-400 text-xs font-bold px-2 py-1 rounded-full">
                        VERIFIED
                     </div>
                   )}
                </div>

                <div className="flex-1 flex flex-col">
                  {type === 'STAYS' && (
                      <>
                        <h3 className="text-xl font-bold text-white mb-1">{(item as StayOffer).name}</h3>
                        <p className="text-gray-400 text-sm mb-4 flex items-center gap-1">
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                           {(item as StayOffer).location}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {(item as StayOffer).amenities.slice(0,3).map(am => (
                                <span key={am} className="text-xs bg-slate-700 text-gray-300 px-2 py-1 rounded">{am}</span>
                            ))}
                        </div>
                      </>
                  )}

                  {type === 'CARS' && (
                      <>
                        <h3 className="text-xl font-bold text-white mb-1">{(item as CarOffer).brand} {(item as CarOffer).model}</h3>
                        <p className="text-gray-400 text-sm mb-4">{(item as CarOffer).type} • {(item as CarOffer).seats} Seats</p>
                      </>
                  )}

                  {type === 'SECURITY' && (
                      <>
                        <h3 className="text-xl font-bold text-white mb-1">{(item as SecurityOffer).title}</h3>
                        <p className="text-gray-400 text-sm mb-2">{(item as SecurityOffer).type}</p>
                         <p className="text-brand-400 text-xs bg-brand-900/20 inline-block px-2 py-1 rounded border border-brand-900 mb-4">
                           {(item as SecurityOffer).certification}
                        </p>
                      </>
                  )}

                  <div className="mt-auto pt-4 border-t border-slate-700 flex justify-between items-center">
                     <div>
                        <span className="text-2xl font-bold text-white">
                            {type === 'STAYS' && (item as StayOffer).price_per_night}
                            {type === 'CARS' && (item as CarOffer).price_per_day}
                            {type === 'SECURITY' && (item as SecurityOffer).hourly_rate}
                        </span>
                        <span className="text-sm text-gray-400 ml-1">
                             {type === 'STAYS' && 'per night'}
                             {type === 'CARS' && 'per day'}
                             {type === 'SECURITY' && 'per hour'}
                        </span>
                     </div>
                     <RoadmanButton onClick={() => onSelect(item)} className="px-6 py-2 text-sm">
                        Select
                     </RoadmanButton>
                  </div>
                </div>
              </RoadmanCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};