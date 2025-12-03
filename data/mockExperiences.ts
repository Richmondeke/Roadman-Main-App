
import { ExperienceOffer } from '../types';

export const MOCK_EXPERIENCES: ExperienceOffer[] = [
  {
      id: "exp_detty_december",
      title: "Detty December with Chief Ugo Mozie",
      location: "Lagos, Nigeria",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      price: "8,000",
      currency: "USD",
      date: "2025-12-15",
      duration_days: 7,
      tag: "Culture",
      description: "Dive into the vibrant heart of Lagos during its most electric season. Curated by Chief Ugo Mozie, this experience offers unparalleled access to the Afrobeat scene, high fashion, and luxury beach culture.",
      itinerary: [
          { day: 1, title: "Akwaaba to Lagos", description: "VIP Airport arrival service. Check-in at The Wheatbaker. Welcome dinner at Nok by Alara." },
          { day: 2, title: "Art & Culture", description: "Private tour of Nike Art Gallery and Lekki Conservation Centre." },
          { day: 3, title: "Ilashe Beach Escape", description: "Private yacht cruise to a luxury beach house in Ilashe. Jet skis and grilled feast." },
          { day: 4, title: "The Concert", description: "All-access VVIP table at the headline Afrobeat concert of the season." },
          { day: 5, title: "Fashion & Style", description: "Personal styling session and shopping tour with Chief Ugo Mozie." },
          { day: 6, title: "Lagos Nightlife", description: "Guided tour of Victoria Island's most exclusive clubs." },
          { day: 7, title: "Departure", description: "Relaxed brunch and airport transfer." }
      ],
      included: ["5-Star Accommodation", "VVIP Concert Access", "Private Yacht", "Security Detail", "Stylist Session"]
  },
  {
      id: "exp_met_2026",
      title: "Met Gala 2026",
      location: "New York, USA",
      image: "https://images.unsplash.com/photo-1545167622-3a6ac15604e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      price: "15,000",
      currency: "USD",
      date: "2026-05-04",
      duration_days: 3,
      tag: "Exclusive",
      description: "Secure your place at the most exclusive fashion event of the year. This package includes VIP red carpet access, a 5-star stay at The Pierre, and a private stylist consultation.",
      itinerary: [
          { day: 1, title: "Arrival & Fittings", description: "Private car transfer to The Pierre. Afternoon fitting with celebrity stylist and final alterations." },
          { day: 2, title: "The Main Event", description: "Red carpet arrival at the Metropolitan Museum of Art. Dinner and gala access. Official after-party entry." },
          { day: 3, title: "Decompression Spa", description: "Morning brunch followed by a full-service spa treatment before departure." }
      ],
      included: ["Gala Ticket", "2 Nights at The Pierre", "Stylist", "Private Transport", "Security Detail"]
  },
  {
      id: "exp_f1_monaco",
      title: "F1 Monaco Grand Prix",
      location: "Monte Carlo, Monaco",
      image: "https://images.unsplash.com/photo-1533591380348-14193f1de18f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      price: "4,500",
      currency: "USD",
      date: "2026-05-22",
      duration_days: 4,
      tag: "Sports",
      description: "Experience the crown jewel of Formula 1 from a private yacht in the harbor. Includes pit lane walks and meet-and-greets with drivers.",
      itinerary: [
          { day: 1, title: "Welcome to Monaco", description: "Helicopter transfer from Nice. Welcome drinks on the Roadman Superyacht." },
          { day: 2, title: "Qualifying", description: "Watch the intense qualifying session from the trackside terrace. Evening casino access." },
          { day: 3, title: "Race Day", description: "Premium hospitality viewing of the Grand Prix. Champagne reception." },
          { day: 4, title: "Departure", description: "Private transfer to airport." }
      ],
      included: ["Yacht Access", "Paddock Club Pass", "4-Star Hotel", "Helicopter Transfer"]
  },
  {
      id: "exp_santorini",
      title: "Santorini Sunset Yacht",
      location: "Santorini, Greece",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      price: "1,200",
      currency: "USD",
      date: "2026-06-10",
      duration_days: 5,
      tag: "Luxury",
      description: "A romantic and relaxing escape to the Aegean Sea. Private sunset cruises, wine tasting, and cliffside dining.",
      itinerary: [
          { day: 1, title: "Arrival in Oia", description: "Check-in to your cave suite. Sunset dinner overlooking the caldera." },
          { day: 2, title: "Catamaran Cruise", description: "Full day private sailing with snorkeling and BBQ on board." },
          { day: 3, title: "Winery Tour", description: "Visit 3 ancient vineyards with a sommelier." },
          { day: 4, title: "Free Day", description: "Explore Fira or relax by the infinity pool." },
          { day: 5, title: "Departure", description: "Transfer to airport." }
      ],
      included: ["Cave Suite Stay", "Private Yacht Charter", "Wine Tasting", "Breakfast Daily"]
  },
  {
      id: "exp_lapland",
      title: "Northern Lights Igloo",
      location: "Lapland, Finland",
      image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      price: "3,000",
      currency: "USD",
      date: "2026-11-15",
      duration_days: 4,
      tag: "Adventure",
      description: "Sleep under the stars in a heated glass igloo. Husky sledding, reindeer safari, and aurora hunting.",
      itinerary: [
          { day: 1, title: "Arctic Arrival", description: "Transfer to Kakslauttanen. Check into Glass Igloo." },
          { day: 2, title: "Husky Safari", description: "Drive your own team of huskies across the snowy wilderness." },
          { day: 3, title: "Aurora Hunting", description: "Snowmobile adventure to chase the Northern Lights." },
          { day: 4, title: "Farewell", description: "Visit Santa Claus Village before departure." }
      ],
      included: ["Glass Igloo Stay", "All Excursions", "Thermal Gear Rental", "Half Board Meals"]
  },
  {
      id: "exp_cyber_tokyo",
      title: "Neon Tokyo Drift",
      location: "Tokyo, Japan",
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      price: "5,200",
      currency: "USD",
      date: "2026-05-15",
      duration_days: 6,
      tag: "Urban",
      description: "Deep dive into Tokyo's car culture and cyberpunk aesthetic. Daikoku Futo meetups, Akihabara gaming, and robot restaurants.",
      itinerary: [
          { day: 1, title: "Shinjuku Nights", description: "Arrival and street food tour in Omoide Yokocho." },
          { day: 2, title: "Drift Culture", description: "Private JDM car tour to Daikoku Futo PA." },
          { day: 3, title: "Tech & Gaming", description: "VIP access to TGS exhibits and Akihabara retro shopping." },
          { day: 4, title: "Modern Tradition", description: "TeamLabs Planets private viewing and Meiji Shrine." },
          { day: 5, title: "Cyber Dinner", description: "Robot Restaurant show and high-end sushi." },
          { day: 6, title: "Sayonara", description: "Bullet train experience to airport." }
      ],
      included: ["5-Star Hotel", "Private Driver", "Translator", "All Entry Fees"]
  }
];
