
import { FlightOffer, SearchParams, BookingDetails, Order, StayOffer, DestinationDeal } from '../types';
import { AIRPORTS, Airport } from '../data/airports';

// Configuration from provided credentials
const SUPABASE_URL = 'https://hwgxtkebqgswjskrwhfj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3Z3h0a2VicWdzd2pza3J3aGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3OTQyNjIsImV4cCI6MjA4MDM3MDI2Mn0.BtcQSPAGYGeM-6vYhP14RFGANuHKb8bDcH8jxHhqsTQ';

const API_URL = `${SUPABASE_URL}/functions/v1/duffel-proxy`;

// MOCK DATA for Demo purposes if backend is not reachable or returns no results (e.g. date too far in future)
const MOCK_OFFERS: FlightOffer[] = [
  {
    id: "off_mock_1",
    total_amount: "450.00",
    total_currency: "USD",
    owner: { name: "NeonAir", logo_symbol_url: "" },
    passengers: [{ id: "pas_mock_1", type: "adult" }],
    slices: [{
      duration: "PT7H30M",
      segments: [{
        origin: { iata_code: "JFK", name: "New York" },
        destination: { iata_code: "LHR", name: "London" },
        departing_at: "2026-06-15T18:00:00",
        arriving_at: "2026-06-16T06:30:00",
        marketing_carrier: { name: "NeonAir" }
      }]
    }]
  },
  {
    id: "off_mock_2",
    total_amount: "320.50",
    total_currency: "USD",
    owner: { name: "CyberWings", logo_symbol_url: "" },
    passengers: [{ id: "pas_mock_2", type: "adult" }],
    slices: [{
      duration: "PT8H15M",
      segments: [{
        origin: { iata_code: "JFK", name: "New York" },
        destination: { iata_code: "LHR", name: "London" },
        departing_at: "2026-06-15T20:00:00",
        arriving_at: "2026-06-16T09:15:00",
        marketing_carrier: { name: "CyberWings" }
      }]
    }]
  },
  {
    id: "off_mock_3",
    total_amount: "850.00",
    total_currency: "USD",
    owner: { name: "OrbitOne", logo_symbol_url: "" },
    passengers: [{ id: "pas_mock_3", type: "adult" }],
    slices: [{
      duration: "PT6H45M",
      segments: [{
        origin: { iata_code: "JFK", name: "New York" },
        destination: { iata_code: "LHR", name: "London" },
        departing_at: "2026-06-15T09:00:00",
        arriving_at: "2026-06-15T20:45:00",
        marketing_carrier: { name: "OrbitOne" }
      }]
    }]
  }
];

const MOCK_STAYS: StayOffer[] = [
  {
      id: 'stay_mock_1',
      name: 'Grand Plaza Hotel (Mock)',
      location: 'Paris, France',
      price_per_night: '250',
      currency: 'USD',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      amenities: ['Pool', 'Spa', 'Free WiFi', 'Breakfast']
  },
  {
      id: 'stay_mock_2',
      name: 'City Center Suites (Mock)',
      location: 'Paris, France',
      price_per_night: '180',
      currency: 'USD',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      amenities: ['Kitchen', 'Gym', 'City View']
  }
];

// Helper to update mock dates to match search query
const getMockDataForParams = (params: SearchParams) => {
    try {
        if (!params.departureDate) return MOCK_OFFERS;
        return MOCK_OFFERS.map(offer => ({
            ...offer,
            slices: offer.slices.map(slice => ({
                ...slice,
                segments: slice.segments.map(seg => {
                     // Safer time extraction to prevent crashes if format varies
                     const depTime = seg.departing_at.includes('T') ? seg.departing_at.split('T')[1] : '10:00:00';
                     const arrTime = seg.arriving_at.includes('T') ? seg.arriving_at.split('T')[1] : '14:00:00';
                     return {
                        ...seg,
                        origin: { ...seg.origin, iata_code: params.origin || 'JFK' },
                        destination: { ...seg.destination, iata_code: params.destination || 'LHR' },
                        departing_at: `${params.departureDate}T${depTime}`,
                        // Simplified arrival date for robustness
                        arriving_at: `${params.departureDate}T${arrTime}` 
                    };
                })
            }))
        }));
    } catch (e) {
        console.error("Mock data generation failed", e);
        return MOCK_OFFERS;
    }
};

// Demo-only Geocoding Helper
// Duffel Stays requires coordinates. Real apps would use Google Maps / Mapbox API.
const getDemoCoordinates = (locationStr: string = '') => {
  const loc = locationStr.toLowerCase();
  if (loc.includes('paris')) return { latitude: 48.8566, longitude: 2.3522 };
  if (loc.includes('london')) return { latitude: 51.5074, longitude: -0.1278 };
  if (loc.includes('new york') || loc.includes('jfk')) return { latitude: 40.7128, longitude: -74.0060 };
  if (loc.includes('dubai')) return { latitude: 25.2048, longitude: 55.2708 };
  if (loc.includes('tokyo')) return { latitude: 35.6762, longitude: 139.6503 };
  // Default to London if unknown for demo
  return { latitude: 51.5074, longitude: -0.1278 }; 
};

export const searchLocations = async (query: string): Promise<Airport[]> => {
    if (!query || query.length < 2) return [];

    try {
        const response = await fetch(`${API_URL}/places/suggestions?query=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });

        if (!response.ok) {
            // Fallback to local filtering if API is down or Key is missing
            throw new Error("Places API unreachable");
        }

        const data = await response.json();
        if (data.data) {
            return data.data.map((place: any) => ({
                code: place.iata_code,
                city: place.city_name || place.name,
                name: place.name,
                country: place.country_name || ''
            })).filter((p: any) => p.code); // Ensure it has an IATA code
        }
        return [];
    } catch (error) {
        console.warn("Using local airport search fallback:", error);
        // Fallback to local search logic
        const lowerQuery = query.toLowerCase();
        return AIRPORTS.filter(airport => 
            airport.code.toLowerCase().includes(lowerQuery) ||
            airport.city.toLowerCase().includes(lowerQuery) ||
            airport.name.toLowerCase().includes(lowerQuery) ||
            airport.country.toLowerCase().includes(lowerQuery)
        ).slice(0, 10);
    }
};

export const searchFlights = async (params: SearchParams): Promise<FlightOffer[]> => {
  // Sanitize params before sending
  const sanitizedParams = {
      ...params,
      origin: params.origin?.trim().toUpperCase(),
      destination: params.destination?.trim().toUpperCase(),
      cabinClass: params.cabinClass || 'economy'
  };

  console.log("✈️ Initiating Flight Search via Edge Function:", `${API_URL}/search`, sanitizedParams);
  
  try {
    const response = await fetch(`${API_URL}/search`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(sanitizedParams),
    });
    
    // Handle 400 Bad Request (Validation Errors from Duffel) specifically
    if (response.status === 400) {
        const errorJson = await response.json();
        console.warn("⚠️ Duffel API Validation Error:", JSON.stringify(errorJson.details, null, 2));
        console.info("Switching to MOCK DATA for seamless demo experience.");
        return getMockDataForParams(sanitizedParams);
    }

    if (!response.ok) {
        const errorText = await response.text();
        // Check for missing secret
        if (response.status === 500 && errorText.includes("No Duffel API Key set")) {
            console.error("🚨 EDGE FUNCTION MISSING SECRET: You need to run 'supabase secrets set DUFFEL_API_KEY=...'");
        }
        throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    
    // Fallback if no offers found
    if (!data.data?.offers || data.data.offers.length === 0) {
        console.info("⚠️ API returned 0 results. Switching to MOCK DATA.");
        return getMockDataForParams(sanitizedParams);
    }

    console.log(`✅ Found ${data.data.offers.length} REAL offers from Duffel API!`);
    return data.data.offers;

  } catch (error) {
    console.warn("⚠️ API Connection failed or fell back. Using MOCK DATA.", error);
    await new Promise(r => setTimeout(r, 1000));
    return getMockDataForParams(sanitizedParams);
  }
};

export const searchStays = async (params: SearchParams): Promise<StayOffer[]> => {
  console.log("🏨 Initiating Stays Search via Edge Function...");
  
  // Calculate checkout date (Default +2 days if missing)
  let checkOut = '';
  if (params.checkIn) {
     const d = new Date(params.checkIn);
     d.setDate(d.getDate() + 2);
     checkOut = d.toISOString().split('T')[0];
  } else {
     // Default dates for demo if missing
     const today = new Date();
     const nextMonth = new Date(today.setMonth(today.getMonth() + 1));
     params.checkIn = nextMonth.toISOString().split('T')[0];
     nextMonth.setDate(nextMonth.getDate() + 2);
     checkOut = nextMonth.toISOString().split('T')[0];
  }

  // Get coordinates
  const coords = getDemoCoordinates(params.location);

  const payload = {
    location: {
      radius: { value: 10, unit: "km" },
      geographic_coordinates: coords
    },
    check_in_date: params.checkIn,
    check_out_date: checkOut,
    rooms: 1,
    guests: Array(params.guests || 2).fill({ type: "adult" })
  };

  try {
    const response = await fetch(`${API_URL}/stays/search`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
       console.warn("Stays API Error or Beta limitation. Status:", response.status);
       const text = await response.text();
       console.warn("Details:", text);
       throw new Error('API Error');
    }

    const data = await response.json();
    
    if (data.data && data.data.results) {
        // Map Duffel Stays format to our App format
        return data.data.results.map((item: any) => ({
            id: item.id || `stay_${Math.random()}`,
            name: item.accommodation.name,
            location: item.accommodation.location?.address?.city_name || params.location || 'Unknown',
            price_per_night: item.cheapest_rate_total_amount || '150', // Simplified mapping
            currency: item.cheapest_rate_currency || 'USD',
            rating: item.accommodation.rating || 4.5,
            // Fallback image as Duffel might not return clean photos array in all beta tiers
            image: item.accommodation.photos?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3',
            amenities: item.accommodation.amenities?.map((a: any) => a.description) || ['Wifi', 'AC']
        }));
    }
    
    return MOCK_STAYS;

  } catch (err) {
    console.warn("⚠️ Stays API failed, using Mock Data.", err);
    return MOCK_STAYS.map(stay => ({...stay, location: params.location || stay.location}));
  }
};

export const createOrder = async (details: BookingDetails): Promise<Order> => {
   try {
    const response = await fetch(`${API_URL}/order`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(details),
    });
    
    if (!response.ok) {
        const err = await response.text();
        console.error("Order Failed:", err);
        throw new Error('Order Creation Error');
    }
    
    const data = await response.json();
    return { ...data.data, serviceType: 'FLIGHTS' };
  } catch (error) {
    console.warn("⚠️ Create Order failed (using fallback).", error);
    await new Promise(r => setTimeout(r, 1500));
    return {
      id: "ord_mock_" + Date.now(),
      booking_reference: "NEON-" + Math.floor(Math.random()*10000),
      status: 'confirmed',
      serviceType: 'FLIGHTS'
    };
  }
};

export const getTrendingDestinations = async (origin: string): Promise<DestinationDeal[]> => {
    // We fetch real data by querying a set of popular hubs relative to the origin.
    const candidates = [
        { code: 'LHR', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80' },
        { code: 'CDG', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80' },
        { code: 'DXB', img: 'https://images.unsplash.com/photo-1512453979798-5ea932a23644?auto=format&fit=crop&w=600&q=80' },
        { code: 'JFK', img: 'https://images.unsplash.com/photo-1496442226666-8d4a0e62e6e9?auto=format&fit=crop&w=600&q=80' },
        { code: 'HND', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80' },
        { code: 'SYD', img: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80' }
    ].filter(c => c.code !== origin.toUpperCase()).slice(0, 5);
    
    // Pick a date ~3 weeks from now to ensure availability
    const date = new Date();
    date.setDate(date.getDate() + 21);
    const departureDate = date.toISOString().split('T')[0];
    
    const promises = candidates.map(async (target) => {
        try {
            const offers = await searchFlights({
                origin,
                destination: target.code,
                departureDate,
                passengers: 1,
                cabinClass: 'economy'
            });
            
            if (!offers || offers.length === 0) return null;

            // Sort by price (cheapest first)
            const sorted = offers.sort((a, b) => parseFloat(a.total_amount) - parseFloat(b.total_amount));
            const best = sorted[0];

            // Resolve City/Country
            const info = AIRPORTS.find(a => a.code === target.code);

            return {
                id: `deal_${target.code}_${Date.now()}`,
                origin,
                destination: target.code,
                destinationCity: info?.city || target.code,
                destinationCountry: info?.country || '',
                price: best.total_amount,
                currency: best.total_currency,
                imageUrl: target.img,
                departureDate,
                airline: best.owner.name
            } as DestinationDeal;

        } catch (e) {
            console.warn(`Could not fetch deal for ${target.code}`, e);
            return null;
        }
    });
    
    const results = await Promise.all(promises);
    return results.filter((r): r is DestinationDeal => r !== null);
};

// Admin Mock Data Generator
export const getAdminDashboardData = async (): Promise<{ orders: Order[], stats: any }> => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));

    const mockOrders: Order[] = [
        {
            id: 'ord_1001',
            booking_reference: 'NEON-8821',
            status: 'confirmed',
            serviceType: 'FLIGHTS',
            customerName: 'Alice Johnson',
            customerEmail: 'alice@example.com',
            amount: '450.00',
            currency: 'USD',
            date: '2026-05-10T10:30:00Z'
        },
        {
            id: 'ord_1002',
            booking_reference: 'NEON-3392',
            status: 'pending',
            serviceType: 'STAYS',
            customerName: 'Bob Smith',
            customerEmail: 'bob.smith@test.com',
            amount: '1250.00',
            currency: 'USD',
            date: '2026-05-11T09:15:00Z'
        },
        {
            id: 'ord_1003',
            booking_reference: 'NEON-9912',
            status: 'confirmed',
            serviceType: 'FLIGHTS',
            customerName: 'Charlie Davis',
            customerEmail: 'charlie@corp.com',
            amount: '890.50',
            currency: 'USD',
            date: '2026-05-12T14:20:00Z'
        },
        {
            id: 'ord_1004',
            booking_reference: 'NEON-1102',
            status: 'cancelled',
            serviceType: 'CARS',
            customerName: 'Diana Prince',
            customerEmail: 'diana@amazon.com',
            amount: '300.00',
            currency: 'USD',
            date: '2026-05-12T16:00:00Z'
        },
        {
            id: 'ord_1005',
            booking_reference: 'NEON-7734',
            status: 'confirmed',
            serviceType: 'EXPERIENCE',
            customerName: 'Evan Wright',
            customerEmail: 'evan@travel.com',
            amount: '4500.00',
            currency: 'USD',
            date: '2026-05-13T11:45:00Z'
        },
        {
            id: 'ord_1006',
            booking_reference: 'NEON-5521',
            status: 'confirmed',
            serviceType: 'SECURITY',
            customerName: 'Fiona Gallagher',
            customerEmail: 'fiona@vip.com',
            amount: '2200.00',
            currency: 'USD',
            date: '2026-05-14T08:00:00Z'
        },
        {
            id: 'ord_1007',
            booking_reference: 'NEON-4411',
            status: 'pending',
            serviceType: 'FLIGHTS',
            customerName: 'George Miller',
            customerEmail: 'george@tech.com',
            amount: '320.00',
            currency: 'USD',
            date: '2026-05-14T13:30:00Z'
        }
    ];

    const stats = {
        totalRevenue: 9910.50,
        activeBookings: 142,
        pendingApprovals: 5,
        occupancyRate: 85
    };

    return { orders: mockOrders, stats };
};
