
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoadmanButton, RoadmanInput, RoadmanCard } from './TronComponents';
import { LocationAutocomplete } from './LocationAutocomplete';
import { ModernDatePicker } from './ModernDatePicker';
import { SearchParams, ServiceType } from '../types';

interface HeroSearchProps {
  onSearch: (type: ServiceType, params: SearchParams) => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ onSearch }) => {
  const [activeService, setActiveService] = useState<ServiceType>('FLIGHTS');
  
  // Calculate dynamic default dates to ensure API availability.
  // API Test environments often don't have flights > 6 months out.
  // Default to 14 days from today for maximum reliability.
  const getFutureDate = (daysToAdd: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    // Format YYYY-MM-DD manually to avoid timezone issues with toISOString() in some cases
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // State for Flight Inputs
  const [flightParams, setFlightParams] = useState<SearchParams>({
    origin: 'JFK',
    destination: 'LHR',
    departureDate: getFutureDate(14), // Default to 2 weeks from now (Safe Zone)
    passengers: 1
  });

  // State for Stays Inputs
  const [stayParams, setStayParams] = useState<SearchParams>({
    location: 'Paris, France',
    checkIn: getFutureDate(30),
    guests: 2,
    roomType: 'Family Suite'
  });

  // State for Cars Inputs
  const [carParams, setCarParams] = useState<SearchParams>({
    pickupLocation: 'MIA',
    pickupDate: getFutureDate(45),
    carType: 'SUV',
    days: 3
  });

  // State for Security Inputs
  const [securityParams, setSecurityParams] = useState<SearchParams>({
    location: 'Ibiza Club',
    securityDate: getFutureDate(21),
    securityType: 'Bouncer / Door Security',
    personnelCount: 2
  });

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    let params: SearchParams = {};
    
    switch (activeService) {
      case 'FLIGHTS':
        params = flightParams;
        break;
      case 'STAYS':
        params = stayParams;
        break;
      case 'CARS':
        params = carParams;
        break;
      case 'SECURITY':
        params = securityParams;
        break;
    }
    
    onSearch(activeService, params);
  };

  const services: {id: ServiceType, label: string, icon: React.ReactNode}[] = [
      { 
        id: 'FLIGHTS', 
        label: 'Flights', 
        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg> 
      },
      { 
        id: 'STAYS', 
        label: 'Stays', 
        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
      },
      { 
        id: 'CARS', 
        label: 'Cars', 
        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> 
      },
      { 
        id: 'SECURITY', 
        label: 'Security', 
        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
      },
  ];

  return (
    <div className="relative w-full">
      {/* Hero Background */}
      <div className="absolute inset-0 z-0 overflow-hidden h-[500px] md:h-[600px] rounded-b-[2rem] md:rounded-b-[3rem]">
        <img 
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80" 
          alt="Travel Background" 
          className="w-full h-full object-cover opacity-90 dark:opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 dark:from-slate-900/50 dark:to-slate-900"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center pt-24 px-4 pb-12 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 max-w-3xl px-2"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs md:text-sm font-semibold mb-4 border border-white/30">
            Adventure Awaits
          </span>
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-md leading-tight">
            All in one hospitality app <br/>
            <span className="text-brand-orange">for Adventurers.</span>
          </h1>
          <p className="text-white/90 text-sm md:text-lg font-medium px-4">
            Book flights, stays, and safe transport for your next big journey.
          </p>
        </motion.div>

        {/* Tabbed Card */}
        <div className="w-full max-w-4xl">
           <div className="flex justify-center mb-6 gap-2 flex-wrap">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveService(s.id)}
                className={`
                    flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full font-medium text-xs md:text-sm transition-all
                    ${activeService === s.id 
                        ? 'bg-white text-brand-600 shadow-lg scale-105' 
                        : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md'
                    }
                `}
              >
                {s.icon}
                {s.label}
              </button>
            ))}
           </div>

          <motion.div layout>
            <RoadmanCard className="w-full min-h-[300px] shadow-2xl border-0 !p-4 md:!p-8">
              <AnimatePresence mode="wait">
                {activeService === 'FLIGHTS' && (
                    <motion.form 
                        key="flights"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        onSubmit={handleSearch} 
                        className="flex flex-col gap-4 md:gap-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 relative z-30">
                          <LocationAutocomplete 
                            label="Where from?"
                            value={flightParams.origin || ''}
                            onChange={(val) => setFlightParams({...flightParams, origin: val})}
                            placeholder="City or Airport"
                          />
                          <LocationAutocomplete 
                            label="Where to?"
                            value={flightParams.destination || ''}
                            onChange={(val) => setFlightParams({...flightParams, destination: val})}
                            placeholder="Dream Destination"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 relative z-20">
                          <ModernDatePicker 
                              label="When are you going?"
                              value={flightParams.departureDate || ''}
                              onChange={(val) => setFlightParams({...flightParams, departureDate: val})}
                          />
                          <RoadmanInput 
                              type="number" 
                              label="Travelers" 
                              min={1} 
                              max={9}
                              value={flightParams.passengers}
                              onChange={e => setFlightParams({...flightParams, passengers: parseInt(e.target.value)})}
                          />
                        </div>
                        <RoadmanButton type="submit" className="w-full mt-4 text-lg">
                          Search Flights
                        </RoadmanButton>
                    </motion.form>
                )}

                {activeService === 'STAYS' && (
                     <motion.div
                        key="stays"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-col gap-4 md:gap-6"
                     >
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <RoadmanInput 
                                label="Destination" 
                                placeholder="e.g. Paris, France" 
                                value={stayParams.location}
                                onChange={e => setStayParams({...stayParams, location: e.target.value})}
                            />
                            <ModernDatePicker 
                                label="Check-in"
                                value={stayParams.checkIn || ''}
                                onChange={(val) => setStayParams({...stayParams, checkIn: val})}
                            />
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <RoadmanInput 
                                label="Guests" 
                                type="number" 
                                value={stayParams.guests}
                                onChange={e => setStayParams({...stayParams, guests: parseInt(e.target.value)})}
                            />
                            <div className="flex flex-col gap-1 w-full">
                                <label className="text-sm font-semibold text-gray-300 ml-1">
                                Room Type
                                </label>
                                <select 
                                    className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-sm"
                                    value={stayParams.roomType}
                                    onChange={e => setStayParams({...stayParams, roomType: e.target.value})}
                                >
                                    <option>Standard Room</option>
                                    <option>Double Room</option>
                                    <option>Executive Suite</option>
                                    <option>Family Suite</option>
                                    <option>Penthouse</option>
                                </select>
                           </div>
                         </div>
                         <RoadmanButton onClick={() => handleSearch()} variant="secondary" className="w-full mt-2">Find Stays</RoadmanButton>
                     </motion.div>
                )}

                {activeService === 'CARS' && (
                     <motion.div key="cars" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4 md:gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <LocationAutocomplete 
                                label="Pickup Location"
                                value={carParams.pickupLocation || ''}
                                onChange={(val) => setCarParams({...carParams, pickupLocation: val})}
                                placeholder="Airport Code"
                            />
                            <ModernDatePicker 
                                label="Pickup Date"
                                value={carParams.pickupDate || ''}
                                onChange={(val) => setCarParams({...carParams, pickupDate: val})}
                            />
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                           <div className="flex flex-col gap-1 w-full">
                                <label className="text-sm font-semibold text-gray-300 ml-1">
                                Car Type
                                </label>
                                <select 
                                    className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-sm"
                                    value={carParams.carType}
                                    onChange={e => setCarParams({...carParams, carType: e.target.value})}
                                >
                                    <option>Economy</option>
                                    <option>Sedan</option>
                                    <option>SUV</option>
                                    <option>Luxury</option>
                                    <option>Van</option>
                                    <option>Convertible</option>
                                    <option>Electric</option>
                                </select>
                           </div>
                           <RoadmanInput 
                                label="Duration (Days)" 
                                type="number" 
                                value={carParams.days}
                                onChange={e => setCarParams({...carParams, days: parseInt(e.target.value)})}
                           />
                        </div>
                        <RoadmanButton onClick={() => handleSearch()} variant="secondary" className="w-full mt-2">Search Cars</RoadmanButton>
                     </motion.div>
                )}

                 {activeService === 'SECURITY' && (
                     <motion.div
                        key="security"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-col gap-4 md:gap-6"
                     >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <RoadmanInput 
                                label="Location" 
                                placeholder="Event venue, Club, or Address"
                                value={securityParams.location}
                                onChange={e => setSecurityParams({...securityParams, location: e.target.value})}
                            />
                            <ModernDatePicker 
                                label="Date"
                                value={securityParams.securityDate || ''}
                                onChange={(val) => setSecurityParams({...securityParams, securityDate: val})}
                            />
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                           <div className="flex flex-col gap-1 w-full">
                                <label className="text-sm font-semibold text-gray-300 ml-1">
                                Service Type
                                </label>
                                <select 
                                    className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-sm"
                                    value={securityParams.securityType}
                                    onChange={e => setSecurityParams({...securityParams, securityType: e.target.value})}
                                >
                                    <option>Bouncer / Door Security</option>
                                    <option>Personal Security Escort</option>
                                    <option>Event Security Team</option>
                                    <option>VIP Close Protection</option>
                                </select>
                           </div>
                           <RoadmanInput 
                                label="Personnel Count" 
                                type="number" 
                                min={1} 
                                value={securityParams.personnelCount}
                                onChange={e => setSecurityParams({...securityParams, personnelCount: parseInt(e.target.value)})}
                           />
                        </div>
                        
                        <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-800 flex gap-3">
                             <div className="shrink-0 mt-0.5 text-brand-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                             </div>
                             <p className="text-sm text-gray-300">
                                All security personnel are SIA licensed and background checked for your peace of mind.
                             </p>
                        </div>

                        <RoadmanButton onClick={() => handleSearch()} className="w-full mt-2">Search Security</RoadmanButton>
                     </motion.div>
                )}
              </AnimatePresence>
            </RoadmanCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
        