'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Users, Filter, Search, Wifi, WifiOff } from 'lucide-react';
import { Player, UserLocation } from '@/types/map';
import { 
  calculatePlayerDistances, 
  filterPlayers, 
  sortPlayersByDistance, 
  getUniqueGames, 
  formatDistance,
  getUserLocation,
  generateMockPlayers
} from '@/lib/map-utils';

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('./map-component'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

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
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user location and generate mock players
    getUserLocation()
      .then((location) => {
        setUserLocation(location);
        const mockPlayers = generateMockPlayers(location);
        const playersWithDistances = calculatePlayerDistances(mockPlayers, location);
        const sortedPlayers = sortPlayersByDistance(playersWithDistances);
        setPlayers(sortedPlayers);
        setFilteredPlayers(sortedPlayers);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error getting location:', error);
        // Default to NYC coordinates
        const defaultLocation = { lat: 40.7128, lng: -74.0060 };
        setUserLocation(defaultLocation);
        const mockPlayers = generateMockPlayers(defaultLocation);
        const playersWithDistances = calculatePlayerDistances(mockPlayers, defaultLocation);
        const sortedPlayers = sortPlayersByDistance(playersWithDistances);
        setPlayers(sortedPlayers);
        setFilteredPlayers(sortedPlayers);
        setIsLoading(false);
      });
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
                  <SelectItem value="1">1 km</SelectItem>
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