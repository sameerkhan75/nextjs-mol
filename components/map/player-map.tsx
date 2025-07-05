'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Users, Filter, Search, Wifi, WifiOff } from 'lucide-react';

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('./map-component'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

interface Player {
  id: string;
  name: string;
  game: string;
  location: {
    lat: number;
    lng: number;
  };
  distance: number;
  isOnline: boolean;
  lastSeen: string;
  avatar?: string;
  level?: number;
  achievements?: string[];
}

interface PlayerMapProps {
  className?: string;
}

export default function PlayerMap({ className }: PlayerMapProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState('all');
  const [maxDistance, setMaxDistance] = useState(10);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
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
  };

  // Generate mock players based on user location
  const generateMockPlayers = (userLat: number, userLng: number): Player[] => {
    const games = ['FIFA 24', 'Call of Duty', 'Fortnite', 'Apex Legends', 'Valorant', 'League of Legends', 'Dota 2', 'CS:GO'];
    const names = [
      'Alex_Gamer', 'Sarah_Pro', 'Mike_Player', 'Emma_Gamer', 'John_Doe',
      'Lisa_Player', 'David_Pro', 'Anna_Gamer', 'Tom_Player', 'Kate_Pro',
      'Chris_Elite', 'Maria_Queen', 'Jake_Slayer', 'Sophie_Pro', 'Ryan_Gamer'
    ];

    return Array.from({ length: 15 }, (_, index) => {
      // Generate locations within 10km radius
      const radius = 10; // km
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * radius;
      
      const latOffset = (distance * Math.cos(angle)) / 111; // Convert km to degrees
      const lngOffset = (distance * Math.sin(angle)) / (111 * Math.cos(userLat * Math.PI / 180));
      
      const playerLat = userLat + latOffset;
      const playerLng = userLng + lngOffset;
      
      return {
        id: `player-${index + 1}`,
        name: names[index % names.length],
        game: games[index % games.length],
        location: {
          lat: playerLat,
          lng: playerLng,
        },
        distance: calculateDistance(userLat, userLng, playerLat, playerLng),
        isOnline: Math.random() > 0.3,
        lastSeen: `${Math.floor(Math.random() * 60)} minutes ago`,
        level: Math.floor(Math.random() * 100) + 1,
        achievements: ['First Win', 'Team Player', 'MVP', 'Kill Leader', 'Survivor'].slice(0, Math.floor(Math.random() * 3) + 1),
      };
    });
  };

  // Format distance for display
  const formatDistance = (distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  // Filter players based on criteria
  const filterPlayers = (players: Player[], filters: {
    searchTerm: string;
    selectedGame: string;
    maxDistance: number;
    onlineOnly: boolean;
  }): Player[] => {
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
  };

  // Get unique games from players
  const getUniqueGames = (players: Player[]): string[] => {
    return Array.from(new Set(players.map(player => player.game)));
  };

  useEffect(() => {
    // Get user location and generate mock players
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          
          // Generate mock players around user location
          const mockPlayers = generateMockPlayers(location.lat, location.lng);
          const sortedPlayers = mockPlayers.sort((a, b) => a.distance - b.distance);
          
          setPlayers(sortedPlayers);
          setFilteredPlayers(sortedPlayers);
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to NYC coordinates
          const defaultLocation = { lat: 40.7128, lng: -74.0060 };
          setUserLocation(defaultLocation);
          
          const mockPlayers = generateMockPlayers(defaultLocation.lat, defaultLocation.lng);
          const sortedPlayers = mockPlayers.sort((a, b) => a.distance - b.distance);
          
          setPlayers(sortedPlayers);
          setFilteredPlayers(sortedPlayers);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    } else {
      const defaultLocation = { lat: 40.7128, lng: -74.0060 };
      setUserLocation(defaultLocation);
      
      const mockPlayers = generateMockPlayers(defaultLocation.lat, defaultLocation.lng);
      const sortedPlayers = mockPlayers.sort((a, b) => a.distance - b.distance);
      
      setPlayers(sortedPlayers);
      setFilteredPlayers(sortedPlayers);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const filtered = filterPlayers(players, {
      searchTerm,
      selectedGame,
      maxDistance,
      onlineOnly,
    });
    setFilteredPlayers(filtered);
  }, [searchTerm, selectedGame, maxDistance, onlineOnly, players]);

  const games = getUniqueGames(players);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Find Players Nearby</h2>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{filteredPlayers.length} players found</span>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search & Filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Players</label>
              <Input
                placeholder="Search by name or game..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter by Game</label>
              <Select value={selectedGame} onValueChange={setSelectedGame}>
                <SelectTrigger>
                  <SelectValue placeholder="Select game" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Games</SelectItem>
                  {games.map((game) => (
                    <SelectItem key={game} value={game}>
                      {game}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Distance (km)</label>
              <Select value={maxDistance.toString()} onValueChange={(value) => setMaxDistance(Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 km</SelectItem>
                  <SelectItem value="5">5 km</SelectItem>
                  <SelectItem value="10">10 km</SelectItem>
                  <SelectItem value="25">25 km</SelectItem>
                  <SelectItem value="50">50 km</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <div className="flex items-center space-x-4">
                <Button
                  variant={onlineOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setOnlineOnly(!onlineOnly)}
                  className="flex items-center space-x-2"
                >
                  {onlineOnly ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                  <span>{onlineOnly ? 'Online Only' : 'All Players'}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="w-full h-96 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
              <div className="text-gray-500">Loading map...</div>
            </div>
          ) : (
            <MapComponent
              players={filteredPlayers}
              userLocation={userLocation}
              className="w-full h-96 rounded-lg"
            />
          )}
        </CardContent>
      </Card>

      {/* Players List */}
      <Card>
        <CardHeader>
          <CardTitle>Nearby Players</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredPlayers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No players found nearby
              </div>
            ) : (
              filteredPlayers.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${player.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <div>
                      <h3 className="font-medium">{player.name}</h3>
                      <p className="text-sm text-gray-600">{player.game}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatDistance(player.distance)} away</p>
                    <p className="text-xs text-gray-500">{player.lastSeen}</p>
                    {player.level && (
                      <p className="text-xs text-blue-600">Level {player.level}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 