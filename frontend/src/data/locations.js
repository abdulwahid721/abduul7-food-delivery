// Authentic Addis Ababa Delivery Neighborhoods & Geolocation Engine

export const ADDIS_NEIGHBORHOODS = [
  {
    id: 'bole-medhanialem',
    name: 'Bole Medhanialem',
    area: 'Cameroon St, Edna Mall area',
    lat: 8.9984,
    lng: 38.7885,
  },
  {
    id: 'gerji',
    name: 'Gerji & Imperial',
    area: 'Jackros, Imperial Hotel, Bole Subcity',
    lat: 9.0065,
    lng: 38.8150,
  },
  {
    id: 'bole-atlas',
    name: 'Bole Atlas & Kazanchis',
    area: 'Mickey Leland St, ECA, Kazanchis',
    lat: 9.0145,
    lng: 38.7735,
  },
  {
    id: 'piazza',
    name: 'Piazza & Adwa Memorial',
    area: 'Churchill Ave, Arada Subcity',
    lat: 9.0350,
    lng: 38.7520,
  },
  {
    id: 'sarbet',
    name: 'Sarbet & Old Airport',
    area: 'African Union, Mekanisa, Vatican',
    lat: 8.9890,
    lng: 38.7350,
  },
  {
    id: 'olympia',
    name: 'Olympia & Meskel Flower',
    area: 'Bole Road, Dembel, Meskel Sq.',
    lat: 9.0070,
    lng: 38.7690,
  },
  {
    id: 'cmc',
    name: 'CMC & Ayat',
    area: 'Megenagna, Civil Service, CMC St. Michael',
    lat: 9.0220,
    lng: 38.8400,
  },
  {
    id: 'mexico',
    name: 'Mexico & Lideta',
    area: 'Commerce, Sengatera, Tor Hailoch',
    lat: 9.0100,
    lng: 38.7450,
  },
];

// Restaurant real locations in Addis Ababa
export const RESTAURANT_COORDINATES = {
  'totot-traditional': { lat: 9.0065, lng: 38.8150, subcity: 'Gerji' },
  'kategna-restaurant': { lat: 8.9984, lng: 38.7885, subcity: 'Bole Medhanialem' },
  'yod-abyssinia': { lat: 8.9920, lng: 38.7850, subcity: 'Bole Japan' },
  'effoi-pizza': { lat: 9.0145, lng: 38.7735, subcity: 'Bole Atlas' },
  'moyos-burger': { lat: 8.9960, lng: 38.7870, subcity: 'Bole' },
  'castelli-restaurant': { lat: 9.0350, lng: 38.7520, subcity: 'Piazza' },
  'bait-al-mandi': { lat: 9.0070, lng: 38.7690, subcity: 'Bole Olympia' },
};

// Haversine distance in kilometers
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // 1 decimal place
}

export function getRestaurantDeliveryInfo(restaurant, currentNeighborhood) {
  const coords = RESTAURANT_COORDINATES[restaurant.id] || {
    lat: 9.0000,
    lng: 38.7800,
    subcity: 'Bole',
  };

  const distKm = calculateDistanceKm(
    currentNeighborhood.lat,
    currentNeighborhood.lng,
    coords.lat,
    coords.lng
  );

  let deliveryTime = '25-35 min';
  let deliveryFee = 150;

  if (distKm <= 1.5) {
    deliveryTime = '15-20 min';
    deliveryFee = 100;
  } else if (distKm <= 4.0) {
    deliveryTime = '20-30 min';
    deliveryFee = 150;
  } else if (distKm <= 7.0) {
    deliveryTime = '30-40 min';
    deliveryFee = 180;
  } else {
    deliveryTime = '40-50 min';
    deliveryFee = 220;
  }

  return {
    distanceKm: distKm,
    deliveryTime,
    deliveryFee,
    subcity: coords.subcity,
  };
}
