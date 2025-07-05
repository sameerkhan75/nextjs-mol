import { Player, UserLocation } from '@/types/map';

// Calculate distance between two points using Haversine formula
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Calculate distances for all players from user location
export function calculatePlayerDistances(
  players: Player[],
  userLocation: UserLocation
): Player[] {
  return players.map(player => ({
    ...player,
    distance: calculateDistance(
      userLocation.lat,
      userLocation.lng,
      player.location.lat,
      player.location.lng
    )
  }));
}

// Filter players based on criteria
export function filterPlayers(
  players: Player[],
  filters: {
    searchTerm: string;
    selectedGame: string;
    maxDistance: number;
    onlineOnly: boolean;
  }
): Player[] {
  return players.filter(player => {
    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch = 
        player.name.toLowerCase().includes(searchLower) ||
        player.game.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Game filter
    if (filters.selectedGame !== 'all' && player.game !== filters.selectedGame) {
      return false;
    }

    // Distance filter
    if (player.distance > filters.maxDistance) {
      return false;
    }

    // Online only filter
    if (filters.onlineOnly && !player.isOnline) {
      return false;
    }

    return true;
  });
}

// Sort players by distance
export function sortPlayersByDistance(players: Player[]): Player[] {
  return [...players].sort((a, b) => a.distance - b.distance);
}

// Get unique games from players
export function getUniqueGames(players: Player[]): string[] {
  return Array.from(new Set(players.map(player => player.game)));
}

// Format distance for display
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
}

// Get user location with error handling
export function getUserLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}

// Generate mock players for testing
export function generateMockPlayers(userLocation: UserLocation): Player[] {
  const games = ['FIFA 24', 'Call of Duty', 'Fortnite', 'Apex Legends', 'Valorant'];
  const names = [
    'Alex_Gamer', 'Sarah_Pro', 'Mike_Player', 'Emma_Gamer', 'John_Doe',
    'Lisa_Player', 'David_Pro', 'Anna_Gamer', 'Tom_Player', 'Kate_Pro'
  ];

  return Array.from({ length: 10 }, (_, index) => {
    const latOffset = (Math.random() - 0.5) * 0.1; // ±0.05 degrees
    const lngOffset = (Math.random() - 0.5) * 0.1;
    
    return {
      id: `player-${index + 1}`,
      name: names[index % names.length],
      game: games[index % games.length],
      location: {
        lat: userLocation.lat + latOffset,
        lng: userLocation.lng + lngOffset,
      },
      distance: 0, // Will be calculated later
      isOnline: Math.random() > 0.3,
      lastSeen: `${Math.floor(Math.random() * 60)} minutes ago`,
      level: Math.floor(Math.random() * 100) + 1,
      achievements: ['First Win', 'Team Player', 'MVP'].slice(0, Math.floor(Math.random() * 3) + 1),
    };
  });
} 