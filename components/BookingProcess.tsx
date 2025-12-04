
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SearchResultItem, Order, FlightOffer, StayOffer, CarOffer, SecurityOffer, ExperienceOffer } from '../types';
import { RoadmanButton, RoadmanInput, RoadmanCard } from './TronComponents';
import { ModernDatePicker } from './ModernDatePicker';
import { createOrder } from '../services/duffelService';

interface BookingProcessProps {
  offer: SearchResultItem;
  onSuccess: (order: Order) => void;
  onCancel: () => void;
}

// Mock Exchange Rates for Demo
const EXCHANGE_RATES: Record<string, number> = {
    'USD': 1,
    'EUR': 0.92,
    'GBP': 0.79,
    'JPY': 150.5,
    'NGN': 1650.0
};

export const BookingProcess: React.FC<BookingProcessProps> = ({ offer, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState(
      'total_currency' in offer ? (offer as any).total_currency : 
      'currency' in offer ? (offer as any).currency : 'USD'
  );

  const [formData, setFormData] = useState({
    givenName: '',
    familyName: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  // --- Type Guards ---
  const isFlight = (item: SearchResultItem): item is FlightOffer => 'slices' in item;
  const isStay = (item: SearchResultItem): item is StayOffer => 'amenities' in item;
  const isCar = (item: SearchResultItem): item is CarOffer => 'brand' in item;
  const isSecurity = (item: SearchResultItem): item is SecurityOffer => 'certification' in item;
  const isExperience = (item: SearchResultItem): item is ExperienceOffer => 'itinerary' in item;

  // --- State for Car Ride Itinerary ---
  const [rideConfig, setRideConfig] = useState({
    pickupLocation: '',
    pickupTime: '10:00',
    stops: ['']
  });

  // --- State for Stay Dates ---
  // Default to tomorrow + 3 nights for demo purposes
  const getTomorrow = () => {
    const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0];
  };
  const getFourDaysFromNow = () => {
    const d = new Date(); d.setDate(d.getDate() + 4); return d.toISOString().split('T')[0];
  };

  const [stayDates, setStayDates] = useState({
    checkIn: getTomorrow(),
    checkOut: getFourDaysFromNow()
  });

  // --- Calculations for Stays ---
  const calculateNights = () => {
    const start = new Date(stayDates.checkIn);
    const end = new Date(stayDates.checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays > 0 ? diffDays : 1; // Minimum 1 night
  };

  const getStayTotal = () => {
    if (!isStay(offer)) return '0';
    const nights = calculateNights();
    const pricePerNight = parseFloat(offer.price_per_night);
    return (pricePerNight * nights).toFixed(2);
  };

  // --- Handlers for Ride Configuration ---
  const addStop = () => {
    setRideConfig(prev => ({ ...prev, stops: [...prev.stops, ''] }));
  };

  const removeStop = (index: number) => {
    setRideConfig(prev => ({ ...prev, stops: prev.stops.filter((_, i) => i !== index) }));
  };

  const updateStop = (index: number, value: string) => {
    const newStops = [...rideConfig.stops];
    newStops[index] = value;
    setRideConfig(prev => ({ ...prev, stops: newStops }));
  };

  // --- Helpers ---
  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString([], {weekday: 'short', month: 'short', day: 'numeric'});
  
  const formatDuration = (isoDuration: string) => {
      const match = isoDuration.match(/PT(\d+H)?(\d+M)?/);
      if (!match) return isoDuration.replace('PT', '').toLowerCase();
      const h = match[1] ? match[1].toLowerCase() : '';
      const m = match[2] ? match[2].toLowerCase() : '';
      return `${h} ${m}`.trim();
  };

  // Price Conversion
  const getDisplayPrice = (amountStr: string, baseCurrency: string) => {
      if (baseCurrency === currency) return amountStr;
      
      const baseAmount = parseFloat(amountStr);
      if (isNaN(baseAmount)) return amountStr;

      // Convert to USD first (Base)
      const rateToBase = EXCHANGE_RATES[baseCurrency] || 1;
      const inUSD = baseAmount / rateToBase;
      
      // Convert to Target
      const rateToTarget = EXCHANGE_RATES[currency] || 1;
      const finalAmount = inUSD * rateToTarget;
      
      return finalAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate Payment Processing
    await new Promise(r => setTimeout(r, 1500));
    
    // Determine Passenger ID (required for Flights via Duffel)
    let passengerId: string | undefined = undefined;
    if (isFlight(offer) && offer.passengers && offer.passengers.length > 0) {
        passengerId = offer.passengers[0].id;
    }

    // Create Order
    try {
      const order = await createOrder({
        offerId: offer.id,
        passengerId: passengerId,
        ...formData,
        rideDetails: isCar(offer) ? rideConfig : undefined
      });
      onSuccess(order);
    } catch (err) {
      console.error(err);
      alert("Booking failed. Please try again.");
      setLoading(false);
    }
  };

  const renderSummary = () => {
    // Dynamic Price Logic
    let basePrice = '0';
    if (isFlight(offer)) basePrice = offer.total_amount;
    else if (isStay(offer)) basePrice = getStayTotal(); // Use calculated total
    else if (isCar(offer)) basePrice = offer.price_per_day;
    else if (isSecurity(offer)) basePrice = offer.hourly_rate;
    else if (isExperience(offer)) basePrice = offer.price;

    const baseCurrency = isFlight(offer) ? offer.total_currency : 
                        (offer as any).currency || 'USD';

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-700 pb-4">
                <div className="w-full md:w-auto">
                    <h3 className="text-xl font-bold font-display text-white">
                        {isFlight(offer) ? 'Review Flight Details' : 'Review Booking'}
                    </h3>
                    <p className="text-sm text-gray-400">Please check your details.</p>
                </div>
                <div className="w-full md:w-auto text-left md:text-right bg-slate-900/50 p-3 rounded-xl border border-slate-700">
                    <p className="text-xs text-gray-500 mb-1">Total Price</p>
                    <div className="text-2xl font-bold text-brand-400 font-mono flex items-center justify-start md:justify-end gap-2 flex-wrap">
                        <span>{getDisplayPrice(basePrice, baseCurrency)}</span>
                        <select 
                            value={currency} 
                            onChange={(e) => setCurrency(e.target.value)}
                            className="bg-slate-800 text-sm text-white border border-slate-600 rounded px-1 py-0.5 focus:ring-0 cursor-pointer font-sans"
                        >
                            {Object.keys(EXCHANGE_RATES).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    {currency !== baseCurrency && (
                        <p className="text-[10px] text-gray-500 mt-1">
                            Approx. conversion from {basePrice} {baseCurrency}
                        </p>
                    )}
                </div>
            </div>

            {/* --- FLIGHT SUMMARY --- */}
            {isFlight(offer) && (
                <div className="space-y-6">
                    {offer.slices.map((slice, sIdx) => (
                        <div key={sIdx} className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="bg-slate-700 text-xs font-bold px-2 py-1 rounded text-white">
                                    {sIdx === 0 ? 'OUTBOUND' : 'RETURN'}
                                </span>
                                <span className="text-sm text-gray-400">
                                    {formatDuration(slice.duration)} duration
                                </span>
                            </div>

                            <div className="relative pl-4 space-y-8 border-l border-slate-700 ml-2">
                                {slice.segments.map((seg, i) => (
                                    <div key={i} className="relative">
                                        <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-brand-500 ring-4 ring-slate-900"></div>
                                        <div className="flex flex-col sm:flex-row gap-4 sm:items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <span className="text-lg font-bold text-white">{formatTime(seg.departing_at)}</span>
                                                    <span className="text-gray-500">→</span>
                                                    <span className="text-lg font-bold text-white">{formatTime(seg.arriving_at)}</span>
                                                </div>
                                                <div className="text-sm text-gray-400 mb-2">
                                                    {formatDate(seg.departing_at)}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-300">
                                                    <span className="font-bold text-white">{seg.origin.iata_code}</span>
                                                    <span className="text-xs text-gray-500">to</span>
                                                    <span className="font-bold text-white">{seg.destination.iata_code}</span>
                                                </div>
                                                <div className="mt-2 text-xs text-brand-400 flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                                                    {seg.marketing_carrier.name}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- STAY SUMMARY --- */}
            {isStay(offer) && (
                <div className="flex flex-col gap-6 bg-slate-900/50 p-4 md:p-6 rounded-xl border border-slate-700">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <img src={offer.image} alt={offer.name} className="w-full sm:w-32 h-48 sm:h-32 object-cover rounded-lg bg-slate-800" />
                        <div className="flex-1">
                            <h4 className="font-bold text-white text-xl break-words">{offer.name}</h4>
                            <p className="text-sm text-gray-400 mb-2 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                {offer.location}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {offer.amenities.slice(0, 3).map(am => (
                                    <span key={am} className="text-[10px] bg-slate-700 px-2 py-1 rounded text-gray-300">{am}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-700 pt-4">
                        <h5 className="text-xs uppercase font-bold text-gray-500 mb-3 tracking-wider">Select Dates</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <ModernDatePicker 
                                label="Check-In" 
                                value={stayDates.checkIn} 
                                onChange={(val) => setStayDates(prev => ({...prev, checkIn: val}))}
                                minDate={new Date().toISOString().split('T')[0]}
                            />
                            <ModernDatePicker 
                                label="Check-Out" 
                                value={stayDates.checkOut} 
                                onChange={(val) => setStayDates(prev => ({...prev, checkOut: val}))}
                                minDate={stayDates.checkIn}
                            />
                        </div>
                        <div className="flex justify-between items-center bg-slate-800 p-3 rounded-lg">
                            <div className="text-sm text-gray-300">
                                {offer.price_per_night} {offer.currency} x {calculateNights()} nights
                            </div>
                            <div className="font-mono font-bold text-brand-400 text-lg">
                                {getStayTotal()} {offer.currency}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* --- OTHER SUMMARIES --- */}
            {(isCar(offer) || isSecurity(offer) || isExperience(offer)) && (
                 <div className="flex flex-col sm:flex-row gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                    <img src={offer.image} alt={'title' in offer ? offer.title : offer.model} className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-lg bg-slate-800" />
                    <div className="flex-1">
                        <h4 className="font-bold text-white text-lg break-words">{'title' in offer ? offer.title : `${offer.brand} ${offer.model}`}</h4>
                        <p className="text-sm text-gray-400">
                            {'location' in offer ? offer.location : 'type' in offer ? offer.type : ''}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <button 
        onClick={onCancel}
        className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Results
      </button>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        layoutId={offer.id}
      >
        <RoadmanCard className="mb-8 !p-4 md:!p-8 border-t-4 border-t-brand-500">
          <div className="mb-8">
            {renderSummary()}
          </div>
          
          <form onSubmit={handleBooking} className="space-y-6">
            
            {/* CAR SPECIFIC: Ride Configuration */}
            {isCar(offer) && (
                <div className="bg-slate-700/30 p-4 md:p-6 rounded-xl border border-slate-600 mb-8">
                    <h4 className="text-sm uppercase tracking-wider text-brand-400 font-bold mb-4 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                        Trip Itinerary
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                         <RoadmanInput 
                            label="Origin Location" 
                            placeholder="Enter pickup address"
                            value={rideConfig.pickupLocation}
                            onChange={e => setRideConfig({...rideConfig, pickupLocation: e.target.value})}
                        />
                         <RoadmanInput 
                            label="Pickup Time" 
                            type="time"
                            value={rideConfig.pickupTime}
                            onChange={e => setRideConfig({...rideConfig, pickupTime: e.target.value})}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-300 ml-1">Destinations / Stops</label>
                        {rideConfig.stops.map((stop, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                     className="w-full p-3 rounded-xl border border-slate-600 bg-slate-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all shadow-sm"
                                     placeholder={`Stop #${index + 1}`}
                                     value={stop}
                                     onChange={(e) => updateStop(index, e.target.value)}
                                />
                                {rideConfig.stops.length > 1 && (
                                    <button 
                                        type="button"
                                        onClick={() => removeStop(index)}
                                        className="p-3 rounded-xl bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-900 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                )}
                            </div>
                        ))}
                        <button 
                            type="button"
                            onClick={addStop}
                            className="text-sm font-medium text-brand-400 hover:text-brand-300 flex items-center gap-1 mt-2 px-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Add another destination
                        </button>
                    </div>
                </div>
            )}

            <div>
                <h4 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-4 border-b border-slate-700 pb-2">Customer Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <RoadmanInput 
                    label="First Name" 
                    required
                    placeholder="e.g. John"
                    value={formData.givenName}
                    onChange={e => setFormData({...formData, givenName: e.target.value})}
                />
                <RoadmanInput 
                    label="Last Name" 
                    required
                    placeholder="e.g. Doe"
                    value={formData.familyName}
                    onChange={e => setFormData({...formData, familyName: e.target.value})}
                />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <RoadmanInput 
                label="Email Address" 
                type="email" 
                required
                placeholder="john@example.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
              <RoadmanInput 
                label="Phone Number" 
                type="tel" 
                required
                placeholder="+1 234 567 8900"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div className="bg-slate-900/40 p-4 md:p-6 rounded-xl border border-slate-700 mt-8">
                <h4 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-4">Payment Method</h4>
                <RoadmanInput 
                label="Card Number" 
                placeholder="0000 0000 0000 0000"
                value={formData.cardNumber}
                onChange={e => setFormData({...formData, cardNumber: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4 mt-4">
                <RoadmanInput 
                    label="Expiry Date" 
                    placeholder="MM/YY"
                    value={formData.expiry}
                    onChange={e => setFormData({...formData, expiry: e.target.value})}
                />
                <RoadmanInput 
                    label="CVC" 
                    placeholder="123"
                    value={formData.cvc}
                    onChange={e => setFormData({...formData, cvc: e.target.value})}
                />
                </div>
            </div>

            <RoadmanButton 
              type="submit" 
              isLoading={loading}
              className="w-full mt-8 text-lg py-4 shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]"
            >
              Complete Booking
            </RoadmanButton>
            <p className="text-center text-xs text-gray-500 mt-2">
                By booking you agree to Roadman's Terms of Service and Privacy Policy.
            </p>
          </form>
        </RoadmanCard>
      </motion.div>
    </div>
  );
};
