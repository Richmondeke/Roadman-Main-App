
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroSearch } from './components/HeroSearch';
import { ResultsList } from './components/ResultsList';
import { ServiceResults } from './components/ServiceResults';
import { BookingProcess } from './components/BookingProcess';
import { ExperiencesView } from './components/ExperiencesView';
import { ExperienceDetail } from './components/ExperienceDetail';
import { AuthModal } from './components/AuthModal'; // Import Auth Modal
import { AdminDashboard } from './components/AdminDashboard'; // Import Admin Dashboard
import { CheapestFlightsWidget } from './components/CheapestFlightsWidget'; // Import Widget
import { RoadmanButton, RoadmanCard } from './components/TronComponents';
import { searchFlights, searchStays } from './services/duffelService';
import { getSession, logout } from './services/authService'; // Import Auth Services
import { MOCK_EXPERIENCES } from './data/mockExperiences';
import { FlightOffer, Order, SearchParams, ViewState, ServiceType, StayOffer, CarOffer, SecurityOffer, SearchResultItem, ExperienceOffer, User, DestinationDeal } from './types';

export default function App() {
  const [view, setView] = useState<ViewState>('HOME');
  const [currentService, setCurrentService] = useState<ServiceType>('FLIGHTS');
  
  // User Authentication State
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // State for different result types
  const [flightOffers, setFlightOffers] = useState<FlightOffer[]>([]);
  const [otherOffers, setOtherOffers] = useState<SearchResultItem[]>([]);
  
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);
  
  // Order Management
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null); // For the immediate confirmation screen
  const [orders, setOrders] = useState<Order[]>([]); // Full booking history
  
  // My Trips Tab State
  const [activeTripTab, setActiveTripTab] = useState<'ALL' | ServiceType>('ALL');

  const [isSearching, setIsSearching] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const sessionUser = getSession();
    if (sessionUser) {
        setUser(sessionUser);
    }
  }, []);

  const handleSearch = async (type: ServiceType, params: SearchParams) => {
    setView('SEARCHING');
    setIsSearching(true);
    setCurrentService(type);
    setOtherOffers([]); // Clear previous results
    
    try {
        // Simulate Network Delay for realism
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (type === 'FLIGHTS') {
            const results = await searchFlights(params);
            setFlightOffers(results || []);
        } else if (type === 'STAYS') {
            const results = await searchStays(params);
            setOtherOffers(results || []);
        } else if (type === 'CARS') {
            // Mock Car Results
            setOtherOffers([
                {
                    id: 'car_1',
                    brand: 'Tesla',
                    model: 'Model X',
                    type: 'Electric SUV',
                    price_per_day: '120',
                    currency: 'USD',
                    seats: 7,
                    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
                },
                {
                    id: 'car_2',
                    brand: 'Range Rover',
                    model: 'Sport',
                    type: 'Luxury SUV',
                    price_per_day: '150',
                    currency: 'USD',
                    seats: 5,
                    image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
                }
            ] as CarOffer[]);
        } else if (type === 'SECURITY') {
            // Mock Security Results
            setOtherOffers([
                 {
                    id: 'sec_1',
                    title: 'Elite Protection Squad',
                    type: 'Event Security Team',
                    personnel_count: params.personnelCount || 4,
                    hourly_rate: '80',
                    currency: 'USD',
                    certification: 'SIA Level 3',
                    image: 'https://images.unsplash.com/photo-1595675024853-0f3ec9098ac7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
                },
                {
                    id: 'sec_2',
                    title: 'Personal Bodyguard',
                    type: 'VIP Close Protection',
                    personnel_count: 1,
                    hourly_rate: '150',
                    currency: 'USD',
                    certification: 'Ex-Military',
                    image: 'https://images.unsplash.com/photo-1555449372-525b41052296?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
                }
            ] as SecurityOffer[]);
        }

        setView('RESULTS');

    } catch (error) {
        console.error("Critical Search Error:", error);
        alert("Something went wrong with the search. Please try again.");
        setView('HOME');
    } finally {
        setIsSearching(false);
    }
  };

  const handleSelectOffer = (offer: any) => {
    setSelectedOffer(offer);
    // GATE: Check Authentication
    if (user) {
        setView('BOOKING');
    } else {
        setShowAuthModal(true);
    }
  };

  const handleSelectExperience = (experience: ExperienceOffer) => {
      setSelectedOffer(experience);
      setView('EXPERIENCE_DETAIL');
  };

  const handleBookExperience = (experience: ExperienceOffer) => {
      setSelectedOffer(experience);
      setCurrentService('EXPERIENCE');
      // GATE: Check Authentication
      if (user) {
        setView('BOOKING');
      } else {
        setShowAuthModal(true);
      }
  };

  const handleSelectDeal = (deal: DestinationDeal) => {
     handleSearch('FLIGHTS', {
         origin: deal.origin,
         destination: deal.destination,
         departureDate: deal.departureDate,
         passengers: 1
     });
  };

  const handleAuthSuccess = (loggedInUser: User) => {
      setUser(loggedInUser);
      setShowAuthModal(false);
      // Automatically proceed to booking after login if an offer was selected
      if (selectedOffer) {
          setView('BOOKING');
      }
  };

  const handleLogout = () => {
      logout();
      setUser(null);
      setView('HOME');
  };

  const handleBookingSuccess = (order: Order) => {
    const newOrder = {
        ...order,
        serviceType: currentService
    };
    setConfirmedOrder(newOrder);
    setOrders(prev => [newOrder, ...prev]);
    setView('CONFIRMATION');
  };

  // Helper to get Order Title
  const getOrderTitle = (order: Order) => {
      switch(order.serviceType) {
          case 'FLIGHTS': return 'Flight to LHR'; // In real app, extract from order details
          case 'STAYS': return 'Hotel Stay';
          case 'CARS': return 'Car Rental';
          case 'SECURITY': return 'Security Detail';
          case 'EXPERIENCE': return 'Experience Package';
          default: return 'Booking';
      }
  };

  // Helper to get color class based on type
  const getTypeColor = (type: ServiceType) => {
      switch(type) {
          case 'FLIGHTS': return 'text-blue-400 border-l-blue-500';
          case 'STAYS': return 'text-purple-400 border-l-purple-500';
          case 'CARS': return 'text-brand-400 border-l-brand-500';
          case 'SECURITY': return 'text-red-400 border-l-red-500';
          case 'EXPERIENCE': return 'text-orange-400 border-l-orange-500';
          default: return 'text-gray-400 border-l-gray-500';
      }
  };

  const filteredOrders = activeTripTab === 'ALL' 
    ? orders 
    : orders.filter(o => o.serviceType === activeTripTab);

  return (
    <div className="min-h-screen font-sans bg-slate-900 text-gray-100 selection:bg-brand-500/30">
      
      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
            <AuthModal 
                isOpen={showAuthModal} 
                onClose={() => setShowAuthModal(false)}
                onSuccess={handleAuthSuccess}
            />
        )}
      </AnimatePresence>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('HOME')}>
          <div className="relative w-10 h-10 flex items-center justify-center rounded-full shadow-[0_0_15px_rgba(14,165,233,0.3)] bg-slate-800 border border-brand-500/30 overflow-hidden">
             <div className="absolute inset-0 bg-brand-500/10 rounded-full group-hover:bg-brand-500/20 transition-all"></div>
             <svg className="w-7 h-7 text-brand-400 animate-[spin_6s_linear_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
             </svg>
          </div>
          <span className="font-display font-bold text-xl text-white tracking-tight group-hover:text-brand-400 transition-colors">Roadman</span>
        </div>
        
        <div className="flex items-center gap-4">
           {orders.length > 0 && view !== 'ADMIN' && (
             <button 
                onClick={() => setView('TRIPS')}
                className={`text-sm font-semibold transition-colors ${view === 'TRIPS' ? 'text-brand-400' : 'text-gray-400 hover:text-white'}`}
             >
                My Trips
             </button>
           )}
           
           {/* Admin Button */}
           <button 
                onClick={() => setView('ADMIN')}
                className={`text-sm font-semibold transition-colors hidden sm:block ${view === 'ADMIN' ? 'text-brand-400' : 'text-gray-400 hover:text-white'}`}
            >
                View as Admin
            </button>
           
           {user ? (
               <div className="flex items-center gap-3">
                   <div className="text-right hidden sm:block">
                       <p className="text-xs text-gray-400">Welcome,</p>
                       <p className="text-sm font-bold text-white">{user.firstName}</p>
                   </div>
                   <div className="relative group/profile">
                        <div className="w-8 h-8 rounded-full bg-brand-700 overflow-hidden border border-brand-500 cursor-pointer">
                            <img src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=0ea5e9&color=fff`} alt="User" />
                        </div>
                        <div className="absolute right-0 mt-2 w-32 bg-slate-800 border border-slate-600 rounded-xl shadow-xl overflow-hidden hidden group-hover/profile:block">
                            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700">Logout</button>
                        </div>
                   </div>
               </div>
           ) : (
               <button 
                onClick={() => setShowAuthModal(true)}
                className="text-sm font-bold text-brand-400 hover:text-white transition-colors border border-brand-900/50 hover:border-brand-500 rounded-full px-4 py-1.5"
               >
                   Sign In
               </button>
           )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          
          {/* ADMIN VIEW */}
          {view === 'ADMIN' && (
              <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <AdminDashboard onBack={() => setView('HOME')} />
              </motion.div>
          )}

          {/* HOME VIEW */}
          {view === 'HOME' && (
            <motion.div key="home" exit={{ opacity: 0 }}>
              <HeroSearch onSearch={handleSearch} />

              {/* Cheapest Flights Widget */}
              <CheapestFlightsWidget onSelectDeal={handleSelectDeal} />
              
              {/* Marketing Section */}
              <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="text-center p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-slate-600 transition-colors">
                    <div className="w-12 h-12 bg-blue-900/30 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-800/50">
                       <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 className="font-display font-bold text-lg text-white mb-2">Instant Booking</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Real-time availability and instant confirmation on thousands of routes.</p>
                 </div>
                 <div className="text-center p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-slate-600 transition-colors">
                    <div className="w-12 h-12 bg-orange-900/30 text-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-800/50">
                       <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <h3 className="font-display font-bold text-lg text-white mb-2">Safe & Secure</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Your data is encrypted, and we offer optional trip insurance for peace of mind.</p>
                 </div>
                 <div className="text-center p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-slate-600 transition-colors">
                    <div className="w-12 h-12 bg-green-900/30 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-800/50">
                       <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    <h3 className="font-display font-bold text-lg text-white mb-2">Family First</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Designed for groups. Easily manage multi-passenger itineraries.</p>
                 </div>
              </div>

              {/* Curated Experiences Section */}
              <div className="max-w-6xl mx-auto px-6 pb-20">
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <h2 className="font-display text-3xl font-bold text-white">Curated Experiences</h2>
                    <p className="text-gray-400 mt-2">Exclusive events and destinations for the modern traveler.</p>
                  </div>
                  <button 
                    onClick={() => setView('EXPERIENCES')}
                    className="hidden md:block text-brand-400 hover:text-white font-medium transition-colors"
                  >
                    View all collections &rarr;
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {MOCK_EXPERIENCES.slice(0, 4).map((exp, idx) => (
                        <motion.div 
                            key={exp.id}
                            layoutId={`card-${exp.id}`}
                            onClick={() => handleSelectExperience(exp)}
                            whileHover={{ y: -10 }}
                            className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-soft hover:shadow-brand-500/20 hover:shadow-2xl transition-all duration-500"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent z-10" />
                            <img src={exp.image} alt={exp.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            
                            <div className="absolute top-4 right-4 z-20">
                                <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                    {exp.tag}
                                </span>
                            </div>
                            
                            <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-brand-400 text-xs font-bold uppercase mb-1 tracking-wider">{exp.location}</p>
                                <h3 className="text-xl font-bold text-white mb-2 leading-tight drop-shadow-md">{exp.title}</h3>
                                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                     <span className="text-gray-300 text-sm font-medium">From {exp.price} {exp.currency}</span>
                                     <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                                     <span className="text-brand-400 text-sm font-bold hover:text-white transition-colors">Book Now &rarr;</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* SEARCHING VIEW (Loader) */}
          {view === 'SEARCHING' && (
            <motion.div 
              key="searching"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh]"
            >
              <div className="flex gap-2 mb-6">
                 <div className="w-4 h-4 bg-brand-500 rounded-full animate-bounce"></div>
                 <div className="w-4 h-4 bg-brand-500 rounded-full animate-bounce delay-100"></div>
                 <div className="w-4 h-4 bg-brand-500 rounded-full animate-bounce delay-200"></div>
              </div>
              <h2 className="font-display text-2xl text-white">Finding the best options...</h2>
            </motion.div>
          )}

          {/* RESULTS VIEW */}
          {view === 'RESULTS' && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {currentService === 'FLIGHTS' ? (
                <ResultsList results={flightOffers} onSelect={handleSelectOffer} onBack={() => setView('HOME')} />
              ) : (
                <ServiceResults 
                    type={currentService} 
                    results={otherOffers as (StayOffer | CarOffer | SecurityOffer)[]} 
                    onSelect={handleSelectOffer} 
                    onBack={() => setView('HOME')} 
                />
              )}
            </motion.div>
          )}

          {/* EXPERIENCES VIEW (LIST/CALENDAR) */}
          {view === 'EXPERIENCES' && (
             <motion.div key="experiences" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ExperiencesView onSelect={handleSelectExperience} onBack={() => setView('HOME')} />
             </motion.div>
          )}

          {/* EXPERIENCE DETAIL VIEW */}
          {view === 'EXPERIENCE_DETAIL' && selectedOffer && (
             <motion.div key="exp_detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ExperienceDetail 
                    experience={selectedOffer} 
                    onBook={handleBookExperience} 
                    onBack={() => setView('EXPERIENCES')} 
                />
             </motion.div>
          )}

          {/* BOOKING VIEW */}
          {view === 'BOOKING' && selectedOffer && (
            <motion.div key="booking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <BookingProcess 
                  offer={selectedOffer} 
                  user={user}
                  onSuccess={handleBookingSuccess} 
                  onCancel={() => setView('RESULTS')} 
              />
            </motion.div>
          )}

          {/* CONFIRMATION VIEW */}
          {view === 'CONFIRMATION' && confirmedOrder && (
            <motion.div 
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="flex flex-col items-center justify-center pt-20 px-4"
            >
              <RoadmanCard className="max-w-md w-full border-t-4 border-t-green-500 shadow-xl">
                <div className="text-center mb-6">
                  <div className="inline-block p-3 rounded-full bg-green-900/30 text-green-400 mb-4 border border-green-800">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-white">You're all set!</h2>
                  <p className="text-gray-400 mt-2">Booking Reference: <span className="font-mono font-bold text-gray-200">{confirmedOrder.booking_reference}</span></p>
                </div>
                
                <div className="bg-slate-700/50 rounded-lg p-4 mb-6 border border-slate-600">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400 text-sm">Status</span>
                    <span className="text-green-400 font-bold uppercase text-sm">{confirmedOrder.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Order ID</span>
                    <span className="text-gray-200 text-sm font-mono">{confirmedOrder.id}</span>
                  </div>
                </div>

                <RoadmanButton className="w-full" onClick={() => setView('TRIPS')}>
                  Go to My Trips
                </RoadmanButton>
              </RoadmanCard>
            </motion.div>
          )}

          {/* TRIPS VIEW */}
          {view === 'TRIPS' && (
             <motion.div key="trips" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="font-display text-3xl font-bold text-white">My Trips</h2>
                      <RoadmanButton variant="secondary" onClick={() => setView('HOME')}>+ New Trip</RoadmanButton>
                    </div>
                    
                    {/* Horizontal Tabs */}
                    <div className="flex overflow-x-auto gap-1 mb-8 pb-2 border-b border-slate-700">
                        {(['ALL', 'FLIGHTS', 'STAYS', 'CARS', 'SECURITY', 'EXPERIENCE'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTripTab(tab)}
                                className={`
                                    px-6 py-2.5 rounded-t-lg font-semibold text-sm transition-all whitespace-nowrap border-b-2
                                    ${activeTripTab === tab 
                                        ? 'border-brand-500 text-white bg-slate-800/50' 
                                        : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-slate-800/30'
                                    }
                                `}
                            >
                                {tab === 'ALL' ? 'All Trips' : tab.charAt(0) + tab.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>

                    {orders.length === 0 ? (
                        <div className="text-center py-20 text-gray-500 bg-slate-800/50 rounded-2xl border border-slate-700">
                            <p>No active trips found.</p>
                            <button onClick={() => setView('HOME')} className="text-brand-400 mt-2 hover:underline">Start booking</button>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p>No {activeTripTab.toLowerCase()} bookings found.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredOrders.map(order => {
                                const typeStyle = getTypeColor(order.serviceType);
                                return (
                                    <RoadmanCard key={order.id} className={`border-l-4 ${typeStyle.split(' ')[1]}`}>
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase bg-slate-900 border border-slate-700 text-gray-300`}>
                                                        {order.serviceType}
                                                    </span>
                                                    <span className="text-xs font-bold px-2 py-0.5 rounded uppercase bg-green-900/30 text-green-400 border border-green-900/50">
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className="text-2xl font-display font-bold text-white mb-1">
                                                    {getOrderTitle(order)}
                                                </div>
                                                <div className="text-gray-400 text-sm">
                                                    Ref: <span className="font-mono text-gray-300 tracking-wide">{order.booking_reference}</span>
                                                </div>

                                                {/* Itinerary Details for Cars */}
                                                {order.serviceType === 'CARS' && order.rideDetails && (
                                                    <div className="mt-3 p-3 bg-slate-900/50 rounded-lg border border-slate-800/50 text-sm">
                                                        <div className="flex items-center gap-2 text-gray-300 mb-1">
                                                            <svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                            <span>Pickup: {order.rideDetails.pickupLocation}</span>
                                                            <span className="text-slate-600">|</span>
                                                            <span>{order.rideDetails.pickupTime}</span>
                                                        </div>
                                                        {order.rideDetails.stops && order.rideDetails.stops.length > 0 && order.rideDetails.stops[0] !== '' && (
                                                            <div className="flex items-start gap-2 text-gray-400 pl-0.5">
                                                                <svg className="w-3.5 h-3.5 mt-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                                                                <span>{order.rideDetails.stops.join(' ➝ ')}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="text-left md:text-right flex flex-col items-start md:items-end gap-2">
                                                <button className={`text-sm font-medium hover:underline ${typeStyle.split(' ')[0]}`}>
                                                    {order.serviceType === 'FLIGHTS' && 'Download Boarding Pass'}
                                                    {order.serviceType === 'CARS' && 'Download Ticket'}
                                                    {order.serviceType === 'STAYS' && 'View Reservation'}
                                                    {order.serviceType === 'SECURITY' && 'View Contract'}
                                                    {order.serviceType === 'EXPERIENCE' && 'View Itinerary'}
                                                </button>
                                            </div>
                                        </div>
                                    </RoadmanCard>
                                );
                            })}
                        </div>
                    )}
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <footer className="py-8 text-center text-gray-500 text-sm bg-slate-900 mt-20 border-t border-slate-800">
        <p>&copy; 2026 Roadman Travel. All rights reserved.</p>
      </footer>
    </div>
  );
}
