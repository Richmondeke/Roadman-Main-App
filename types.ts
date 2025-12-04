
export type ServiceType = 'FLIGHTS' | 'STAYS' | 'CARS' | 'SECURITY' | 'EXPERIENCE';

export interface FlightOffer {
  id: string;
  total_amount: string;
  total_currency: string;
  owner: {
    name: string;
    logo_symbol_url: string;
  };
  // Added passengers array to match Duffel API structure
  passengers: Array<{
    id: string;
    type: string;
  }>;
  slices: Array<{
    duration: string;
    segments: Array<{
      origin: { iata_code: string; name: string };
      destination: { iata_code: string; name: string };
      departing_at: string;
      arriving_at: string;
      marketing_carrier: { name: string };
      // Added passengers array for segment-level details like cabin class
      passengers?: Array<{
        cabin_class?: string;
        cabin_class_marketing_name?: string;
      }>;
    }>;
  }>;
}

export interface StayOffer {
  id: string;
  name: string;
  location: string;
  price_per_night: string;
  currency: string;
  rating: number;
  image: string;
  amenities: string[];
}

export interface CarOffer {
  id: string;
  model: string;
  brand: string;
  type: string;
  price_per_day: string;
  currency: string;
  image: string;
  seats: number;
}

export interface SecurityOffer {
  id: string;
  title: string;
  type: string;
  personnel_count: number;
  hourly_rate: string;
  currency: string;
  certification: string;
  image: string;
}

export interface ExperienceOffer {
  id: string;
  title: string;
  location: string;
  price: string;
  currency: string;
  date: string; // ISO Date for start
  duration_days: number;
  image: string;
  tag: string;
  description: string;
  itinerary: Array<{
    day: number;
    title: string;
    description: string;
  }>;
  included: string[];
}

export interface DestinationDeal {
  id: string;
  origin: string;
  destination: string; // IATA
  destinationCity: string;
  destinationCountry: string;
  price: string;
  currency: string;
  imageUrl: string;
  departureDate: string;
  airline: string;
}

// Union type for all possible results
export type SearchResultItem = FlightOffer | StayOffer | CarOffer | SecurityOffer | ExperienceOffer;

export interface SearchParams {
  origin?: string;
  destination?: string;
  departureDate?: string;
  passengers?: number;
  cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first';
  // Stays
  checkIn?: string;
  guests?: number;
  roomType?: string;
  location?: string;
  // Cars
  pickupLocation?: string;
  pickupDate?: string;
  carType?: string;
  days?: number;
  // Security
  securityType?: string;
  personnelCount?: number;
  securityDate?: string;
}

export interface BookingDetails {
  offerId: string;
  // Added passengerId to link details to the specific passenger in the offer
  passengerId?: string; 
  givenName: string;
  familyName: string;
  email: string;
  phone: string;
  // Optional field for Car bookings
  rideDetails?: {
    pickupLocation: string;
    pickupTime: string;
    stops: string[];
  };
}

export interface Order {
  id: string;
  booking_reference: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  documents?: Array<{ unique_identifier: string }>;
  serviceType: ServiceType; // Track what kind of order this is
  details?: any; // Store snapshot of the offer
  rideDetails?: {
    pickupLocation: string;
    pickupTime: string;
    stops: string[];
  };
  // Admin View Fields
  customerName?: string; 
  customerEmail?: string;
  amount?: string; 
  currency?: string;
  date?: string; 
}

export type ViewState = 'HOME' | 'SEARCHING' | 'RESULTS' | 'BOOKING' | 'CONFIRMATION' | 'TRIPS' | 'EXPERIENCES' | 'EXPERIENCE_DETAIL' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}
