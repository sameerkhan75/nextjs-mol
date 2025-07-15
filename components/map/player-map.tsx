'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Users, Filter, Search, Wifi, WifiOff, DollarSign, Package, Copy } from 'lucide-react';

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('./map-component'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

interface GameForSale {
  name: string;
  price: number;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  platform: 'PS5' | 'PS4' | 'Xbox' | 'PC' | 'Nintendo Switch';
  description?: string;
}

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
  gamesForSale?: GameForSale[];
  discordId?: string;
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
  const [showGamesForSale, setShowGamesForSale] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedDiscordId, setCopiedDiscordId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  // Generate mock games for sale
  const generateGamesForSale = useCallback((): GameForSale[] => {
    const allGames = [
      'FIFA 24', 'Call of Duty: Modern Warfare III', 'Fortnite', 'God of War: Ragnarök', 
      'Valorant', 'GTA 5', 'Marvels Spider-Man', 'CS:GO', 'Red Dead Redemption II',
      'The Last of Us Part II', 'Cyberpunk 2077', 'Assassins Creed Valhalla',
      'FIFA 23', 'Call of Duty: Warzone', 'Apex Legends', 'Overwatch 2',
      'Minecraft', 'Among Us','Rocket League'
    ];
    
    const platforms = ['PS5', 'PS4', 'Xbox', 'PC', 'Nintendo Switch'];
    const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];
    
    if (Math.random() > 0.3) {
      const numGames = Math.floor(Math.random() * 3) + 1;
      const gamesForSale: GameForSale[] = [];
      
      for (let i = 0; i < numGames; i++) {
        const gameName = allGames[Math.floor(Math.random() * allGames.length)];
        const price = Math.floor(Math.random() * 601) + 400;
        const condition = conditions[Math.floor(Math.random() * conditions.length)] as GameForSale['condition'];
        const platform = platforms[Math.floor(Math.random() * platforms.length)] as GameForSale['platform'];
        
        gamesForSale.push({
          name: gameName,
          price,
          condition,
          platform,
          description: `Used ${condition.toLowerCase()} condition. Complete with case and manual.`
        });
      }
      
      return gamesForSale;
    }
    
    return [];
  }, []);

  // Generate mock players based on user location
  const generateMockPlayers = useCallback((userLat: number, userLng: number): Player[] => {
    const games = ['FIFA 24', 'Call of Duty', 'Fortnite', 'God of War: Ragnarök', 'Valorant'];
    const names = ['Alex', 'Sarah', 'Mike', 'Emma', 'John', 'Lisa', 'David'];
    
    return Array.from({ length: 10 }, (_, index) => {
      // Generate locations within 10km radius more accurately
      const radius = 10; // km
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.sqrt(Math.random()) * radius;
      
      // Convert distance to latitude/longitude degrees
      const latOffset = (distance * Math.cos(angle)) / 111.32;
      const lngOffset = (distance * Math.sin(angle)) / (111.32 * Math.cos(userLat * Math.PI / 180));
      
      const playerLat = userLat + latOffset;
      const playerLng = userLng + lngOffset;
      
      const distanceKm = calculateDistance(userLat, userLng, playerLat, playerLng);
      
      return {
        id: `player-${index}`,
        name: `${names[index % names.length]}_${Math.floor(Math.random() * 1000)}`,
        game: games[index % games.length],
        location: { lat: playerLat, lng: playerLng },
        distance: distanceKm,
        isOnline: Math.random() > 0.3,
        lastSeen: `${Math.floor(Math.random() * 60)} minutes ago`,
        discordId: `player${index}#${Math.floor(1000 + Math.random() * 9000)}`,
        gamesForSale: generateGamesForSale(),
      };
    });
  }, [calculateDistance]);
  // Format distance for display
  const formatDistance = useCallback((distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  }, []);

  // Filter players based on criteria
  const filterPlayers = useCallback((players: Player[], filters: {
    searchTerm: string;
    selectedGame: string;
    maxDistance: number;
    onlineOnly: boolean;
    showGamesForSale: boolean;
  }): Player[] => {
    return players.filter(player => {
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          player.name.toLowerCase().includes(searchLower) ||
          player.game.toLowerCase().includes(searchLower) ||
          (player.gamesForSale && player.gamesForSale.some(game => 
            game.name.toLowerCase().includes(searchLower)
          ));
        if (!matchesSearch) return false;
      }

      if (filters.selectedGame !== 'all' && player.game !== filters.selectedGame) {
        return false;
      }

      if (player.distance > filters.maxDistance) {
        return false;
      }

      if (filters.onlineOnly && !player.isOnline) {
        return false;
      }

      if (filters.showGamesForSale && (!player.gamesForSale || player.gamesForSale.length === 0)) {
        return false;
      }

      return true;
    });
  }, []);

  // Get unique games from players
  const games = useMemo(() => {
    return Array.from(new Set(players.map(player => player.game)));
  }, [players]);

  // Get unique games for sale from all players
  const gamesForSale = useMemo(() => {
    const allGamesForSale = players.flatMap(player => 
      player.gamesForSale ? player.gamesForSale.map(game => game.name) : []
    );
    return Array.from(new Set(allGamesForSale));
  }, [players]);

  // Save/Load from session storage
  const saveToSession = useCallback((players: Player[], location: { lat: number; lng: number }) => {
    try {
      sessionStorage.setItem('mockPlayers', JSON.stringify(players));
      sessionStorage.setItem('mockPlayersLocation', JSON.stringify(location));
    } catch (e) {
      console.error('Failed to save to session storage:', e);
    }
  }, []);

  const loadFromSession = useCallback(() => {
    try {
      const storedPlayers = sessionStorage.getItem('mockPlayers');
      const storedLocation = sessionStorage.getItem('mockPlayersLocation');
      
      if (!storedPlayers || !storedLocation) return { players: null, location: null };
      
      const players = JSON.parse(storedPlayers);
      const location = JSON.parse(storedLocation);
      
      // Validate loaded data
      if (!Array.isArray(players) || 
          typeof location?.lat !== 'number' || 
          typeof location?.lng !== 'number') {
        return { players: null, location: null };
      }
      
      return { players, location };
    } catch (e) {
      console.error('Failed to load from session storage:', e);
      return { players: null, location: null };
    }
  }, []);

  // Copy Discord ID to clipboard
  const copyDiscordId = useCallback(async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedDiscordId(id);
      setTimeout(() => setCopiedDiscordId(null), 1500);
    } catch (err) {
      console.error('Failed to copy Discord ID:', err);
      setError('Failed to copy Discord ID to clipboard');
      setTimeout(() => setError(null), 3000);
    }
  }, []);

  // Load players data
  useEffect(() => {
    let watchId: number | null = null;
    const defaultLocation = { lat: 40.7128, lng: -74.0060 };

    const handleLocationSuccess = (position: GeolocationPosition) => {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      const { players: sessionPlayers, location: sessionLoc } = loadFromSession();
      if (sessionPlayers && sessionLoc &&
          Math.abs(sessionLoc.lat - location.lat) < 0.01 &&
          Math.abs(sessionLoc.lng - location.lng) < 0.01) {
        setUserLocation(sessionLoc);
        setPlayers(sessionPlayers);
        setFilteredPlayers(sessionPlayers);
        setIsLoading(false);
        return;
      }

      const mockPlayers = generateMockPlayers(location.lat, location.lng);
      const sortedPlayers = mockPlayers.sort((a, b) => a.distance - b.distance);
      saveToSession(sortedPlayers, location);
      setUserLocation(location);
      setPlayers(sortedPlayers);
      setFilteredPlayers(sortedPlayers);
      setIsLoading(false);
    };

    const handleLocationError = (error: GeolocationPositionError) => {
      console.error('Error getting location:', error);
      setError('Could not get your location. Using default location instead.');

      const { players: sessionPlayers, location: sessionLoc } = loadFromSession();
      if (sessionPlayers && sessionLoc &&
          Math.abs(sessionLoc.lat - defaultLocation.lat) < 0.01 &&
          Math.abs(sessionLoc.lng - defaultLocation.lng) < 0.01) {
        setUserLocation(sessionLoc);
        setPlayers(sessionPlayers);
        setFilteredPlayers(sessionPlayers);
        setIsLoading(false);
        return;
      }

      const mockPlayers = generateMockPlayers(defaultLocation.lat, defaultLocation.lng);
      const sortedPlayers = mockPlayers.sort((a, b) => a.distance - b.distance);
      saveToSession(sortedPlayers, defaultLocation);
      setUserLocation(defaultLocation);
      setPlayers(sortedPlayers);
      setFilteredPlayers(sortedPlayers);
      setIsLoading(false);
    };

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        handleLocationSuccess,
        handleLocationError,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Using default location.');
      handleLocationError({ code: 2, message: 'Geolocation not supported' } as GeolocationPositionError);
    }

    return () => {
      // No cleanup needed for getCurrentPosition
    };
  }, [generateMockPlayers, loadFromSession, saveToSession]);

  // Apply filters when any filter changes
  useEffect(() => {
    const filtered = filterPlayers(players, {
      searchTerm,
      selectedGame,
      maxDistance,
      onlineOnly,
      showGamesForSale,
    });
    setFilteredPlayers(filtered);
  }, [searchTerm, selectedGame, maxDistance, onlineOnly, showGamesForSale, players, filterPlayers]);

  return (

    <div className={`space-y-6 ${className}`}>
      {/* Error message */}
      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
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

      {/* Main Card with background image */}
      <div
        className="rounded-xl p-2 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bbg.jpeg')" }}
      >
        {/* Search and Filter */}
        <Card className="relative z-20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Search & Filter</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Players & Games</label>
                <Input
                  placeholder="Search by name, game, or games for sale..."
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
                  <SelectContent className="z-[9999]">
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
                <label className="text-sm font-medium">Filter by Games for Sale</label>
                <Select value="all" onValueChange={(value) => {
                  if (value !== 'all') {
                    setSearchTerm(value);
                    setShowGamesForSale(true);
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select game for sale" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999]">
                    <SelectItem value="all">All Games for Sale</SelectItem>
                    {gamesForSale.map((game) => (
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
                  <SelectContent className="z-[9999]">
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
              <div className="space-y-2">
                <label className="text-sm font-medium">Actions</label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={showGamesForSale ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowGamesForSale(!showGamesForSale)}
                    className="flex items-center space-x-2"
                  >
                    {showGamesForSale ? <DollarSign className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                    <span>{showGamesForSale ? 'Games for Sale' : 'All Players'}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedGame('all');
                      setShowGamesForSale(false);
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map */}
        <Card className="relative z-10">
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
            <CardTitle className="flex items-center justify-between">
              <span>Nearby Players</span>
              {showGamesForSale && (
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <DollarSign className="h-4 w-4" />
                  <span>Showing players with games for sale</span>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredPlayers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? `No players found selling "${searchTerm}"` : 'No players found nearby'}
                </div>
              ) : (
                filteredPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {/* Player Info */}
                    <div className="flex items-center justify-between p-4 border-b">
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
                    
                    {/* Games for Sale */}
                    {player.gamesForSale && player.gamesForSale.length > 0 && (
                      <div className="p-4 bg-green-50">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-2">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <h4 className="font-medium text-green-800">Games for Sale</h4>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-blue-600 font-medium">Message me on Discord:</span>
                            <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{player.discordId}</span>
                            <button
                              type="button"
                              className="p-1 rounded hover:bg-blue-200 transition"
                              onClick={() => copyDiscordId(player.discordId || '')}
                              aria-label="Copy Discord ID"
                            >
                              {copiedDiscordId === player.discordId ? (
                                <span className="text-xs text-green-600 font-semibold">Copied!</span>
                              ) : (
                                <Copy className="w-4 h-4 text-blue-600" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {player.gamesForSale.map((game, index) => (
                            <div key={index} className="bg-white p-3 rounded border">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-sm">{game.name}</h5>
                                <span className="text-green-600 font-bold">₹{game.price}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-600">
                                <span className="capitalize">{game.condition}</span>
                                <span>{game.platform}</span>
                              </div>
                              {game.description && (
                                <p className="text-xs text-gray-500 mt-1">{game.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}