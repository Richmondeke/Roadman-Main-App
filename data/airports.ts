
export interface Airport {
  code: string;
  city: string;
  name: string;
  country: string;
}

export const AIRPORTS: Airport[] = [
  // Europe
  { code: 'LHR', city: 'London', name: 'Heathrow Airport', country: 'United Kingdom' },
  { code: 'LGW', city: 'London', name: 'Gatwick Airport', country: 'United Kingdom' },
  { code: 'CDG', city: 'Paris', name: 'Charles de Gaulle Airport', country: 'France' },
  { code: 'ORY', city: 'Paris', name: 'Orly Airport', country: 'France' },
  { code: 'AMS', city: 'Amsterdam', name: 'Schiphol Airport', country: 'Netherlands' },
  { code: 'FRA', city: 'Frankfurt', name: 'Frankfurt Airport', country: 'Germany' },
  { code: 'MUC', city: 'Munich', name: 'Munich Airport', country: 'Germany' },
  { code: 'MAD', city: 'Madrid', name: 'Adolfo Suárez Madrid–Barajas', country: 'Spain' },
  { code: 'BCN', city: 'Barcelona', name: 'Barcelona-El Prat', country: 'Spain' },
  { code: 'FCO', city: 'Rome', name: 'Fiumicino Airport', country: 'Italy' },
  { code: 'ZRH', city: 'Zurich', name: 'Zurich Airport', country: 'Switzerland' },
  { code: 'IST', city: 'Istanbul', name: 'Istanbul Airport', country: 'Turkey' },
  { code: 'DUB', city: 'Dublin', name: 'Dublin Airport', country: 'Ireland' },
  { code: 'CPH', city: 'Copenhagen', name: 'Copenhagen Airport', country: 'Denmark' },
  { code: 'OSL', city: 'Oslo', name: 'Oslo Airport', country: 'Norway' },
  { code: 'ARN', city: 'Stockholm', name: 'Arlanda Airport', country: 'Sweden' },
  { code: 'VIE', city: 'Vienna', name: 'Vienna International', country: 'Austria' },
  { code: 'LIS', city: 'Lisbon', name: 'Lisbon Airport', country: 'Portugal' },
  { code: 'ATH', city: 'Athens', name: 'Eleftherios Venizelos', country: 'Greece' },

  // North America
  { code: 'JFK', city: 'New York', name: 'John F. Kennedy', country: 'United States' },
  { code: 'EWR', city: 'Newark', name: 'Newark Liberty', country: 'United States' },
  { code: 'LGA', city: 'New York', name: 'LaGuardia', country: 'United States' },
  { code: 'LAX', city: 'Los Angeles', name: 'Los Angeles International', country: 'United States' },
  { code: 'SFO', city: 'San Francisco', name: 'San Francisco International', country: 'United States' },
  { code: 'ORD', city: 'Chicago', name: 'O\'Hare International', country: 'United States' },
  { code: 'ATL', city: 'Atlanta', name: 'Hartsfield–Jackson', country: 'United States' },
  { code: 'DFW', city: 'Dallas', name: 'Dallas/Fort Worth', country: 'United States' },
  { code: 'MIA', city: 'Miami', name: 'Miami International', country: 'United States' },
  { code: 'MCO', city: 'Orlando', name: 'Orlando International', country: 'United States' },
  { code: 'LAS', city: 'Las Vegas', name: 'Harry Reid International', country: 'United States' },
  { code: 'DEN', city: 'Denver', name: 'Denver International', country: 'United States' },
  { code: 'SEA', city: 'Seattle', name: 'Seattle-Tacoma', country: 'United States' },
  { code: 'BOS', city: 'Boston', name: 'Logan International', country: 'United States' },
  { code: 'YYZ', city: 'Toronto', name: 'Pearson International', country: 'Canada' },
  { code: 'YVR', city: 'Vancouver', name: 'Vancouver International', country: 'Canada' },
  { code: 'MEX', city: 'Mexico City', name: 'Benito Juárez', country: 'Mexico' },

  // Asia & Pacific
  { code: 'HND', city: 'Tokyo', name: 'Haneda Airport', country: 'Japan' },
  { code: 'NRT', city: 'Tokyo', name: 'Narita International', country: 'Japan' },
  { code: 'SIN', city: 'Singapore', name: 'Changi Airport', country: 'Singapore' },
  { code: 'HKG', city: 'Hong Kong', name: 'Hong Kong International', country: 'Hong Kong' },
  { code: 'ICN', city: 'Seoul', name: 'Incheon International', country: 'South Korea' },
  { code: 'BKK', city: 'Bangkok', name: 'Suvarnabhumi Airport', country: 'Thailand' },
  { code: 'PEK', city: 'Beijing', name: 'Capital International', country: 'China' },
  { code: 'PVG', city: 'Shanghai', name: 'Pudong International', country: 'China' },
  { code: 'DEL', city: 'New Delhi', name: 'Indira Gandhi', country: 'India' },
  { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji', country: 'India' },
  { code: 'SYD', city: 'Sydney', name: 'Kingsford Smith', country: 'Australia' },
  { code: 'MEL', city: 'Melbourne', name: 'Melbourne Airport', country: 'Australia' },

  // Middle East & Africa
  { code: 'DXB', city: 'Dubai', name: 'Dubai International', country: 'UAE' },
  { code: 'DOH', city: 'Doha', name: 'Hamad International', country: 'Qatar' },
  { code: 'AUH', city: 'Abu Dhabi', name: 'Zayed International', country: 'UAE' },
  { code: 'JNB', city: 'Johannesburg', name: 'O.R. Tambo', country: 'South Africa' },
  { code: 'CPT', city: 'Cape Town', name: 'Cape Town International', country: 'South Africa' },
  { code: 'CAI', city: 'Cairo', name: 'Cairo International', country: 'Egypt' },

  // South America
  { code: 'GRU', city: 'São Paulo', name: 'Guarulhos', country: 'Brazil' },
  { code: 'EZE', city: 'Buenos Aires', name: 'Ezeiza International', country: 'Argentina' },
  { code: 'BOG', city: 'Bogotá', name: 'El Dorado', country: 'Colombia' }
];
