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
  location: { lat: number; lng: number };
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

  // On mount: request geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setIsLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserLocation({ lat: coords.latitude, lng: coords.longitude });
        setIsLoading(false);
      },
      () => {
        setError('Unable to retrieve your location.');
        setIsLoading(false);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  // Helpers
  const calculateDistance = useCallback(
    (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },
    []
  );

  const generateGamesForSale = useCallback((): GameForSale[] => {
    const allGames = [
      'FIFA 24', 'Call of Duty: Modern Warfare III', 'Fortnite', 'God of War: Ragnarök',
      'Valorant', 'GTA 5', 'Marvels Spider-Man', 'CS:GO', 'Red Dead Redemption II',
      'The Last of Us Part II', 'Cyberpunk 2077', 'Assassins Creed Valhalla',
      'FIFA 23', 'Call of Duty: Warzone', 'Apex Legends', 'Overwatch 2',
      'Minecraft', 'Among Us', 'Rocket League'
    ];
    const platforms = ['PS5', 'PS4', 'Xbox', 'PC', 'Nintendo Switch'];
    const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];
    if (Math.random() < 0.3) return [];
    const count = Math.floor(Math.random() * 3) + 1;
    return Array.from({ length: count }).map(() => ({
      name: allGames[Math.floor(Math.random() * allGames.length)],
      price: Math.floor(Math.random() * 601) + 400,
      condition: conditions[Math.floor(Math.random() * conditions.length)] as GameForSale['condition'],
      platform: platforms[Math.floor(Math.random() * platforms.length)] as GameForSale['platform'],
      description: `Used ${conditions[Math.floor(Math.random() * conditions.length)].toLowerCase()} condition. Complete with case and manual.`
    }));
  }, []);

  const generateMockPlayers = useCallback(
    (userLat: number, userLng: number): Player[] => {
      const gamesList = ['FIFA 24', 'Call of Duty', 'Fortnite', 'God of War: Ragnarök', 'Valorant'];
      const names = ['Alex', 'Sarah', 'Mike', 'Emma', 'John', 'Lisa', 'David'];
      return Array.from({ length: 10 }).map((_, i) => {
        const angle = Math.random() * 2 * Math.PI;
        const radius = maxDistance;
        const distance = Math.sqrt(Math.random()) * radius;
        const latOffset = (distance * Math.cos(angle)) / 111.32;
        const lngOffset = (distance * Math.sin(angle)) / (111.32 * Math.cos(userLat * Math.PI / 180));
        const lat = userLat + latOffset;
        const lng = userLng + lngOffset;
        return {
          id: `player-${i}`,
          name: `${names[i % names.length]}_${Math.floor(Math.random() * 1000)}`,
          game: gamesList[i % gamesList.length],
          location: { lat, lng },
          distance: calculateDistance(userLat, userLng, lat, lng),
          isOnline: Math.random() > 0.3,
          lastSeen: `${Math.floor(Math.random() * 60)} minutes ago`,
          gamesForSale: generateGamesForSale(),
          discordId: `user${i}#${1000 + i}`
        };
      });
    },
    [calculateDistance, generateGamesForSale, maxDistance]
  );

  const formatDistance = useCallback(
    (d: number) => (d < 1 ? `${Math.round(d * 1000)}m` : `${d.toFixed(1)}km`),
    []
  );

  const filterPlayers = useCallback(
    (list: Player[]) =>
      list.filter(p => {
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          if (!p.name.toLowerCase().includes(term) && !p.game.toLowerCase().includes(term)) return false;
        }
        if (selectedGame !== 'all' && p.game !== selectedGame) return false;
        if (p.distance > maxDistance) return false;
        if (onlineOnly && !p.isOnline) return false;
        if (showGamesForSale && (!p.gamesForSale || !p.gamesForSale.length)) return false;
        return true;
      }),
    [searchTerm, selectedGame, maxDistance, onlineOnly, showGamesForSale]
  );

  const games = useMemo(() => Array.from(new Set(players.map(p => p.game))), [players]);
  const gamesForSale = useMemo(
    () => Array.from(new Set(players.flatMap(p => p.gamesForSale?.map(g => g.name) || []))),
    [players]
  );

  const copyDiscordId = useCallback((id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedDiscordId(id);
    setTimeout(() => setCopiedDiscordId(null), 1500);
  }, []);

  // Generate players once location is known
  useEffect(() => {
    if (userLocation) {
      const mockPlayers = generateMockPlayers(userLocation.lat, userLocation.lng);
      setPlayers(mockPlayers);
      setFilteredPlayers(mockPlayers);
      setIsLoading(false);
    }
  }, [userLocation, generateMockPlayers]);

  // Re-apply filters
  useEffect(() => {
    setFilteredPlayers(filterPlayers(players));
  }, [players, filterPlayers]);

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

      {/* Main Card with background image */}
      <div className="rounded-xl p-2 bg-cover bg-center" style={{ backgroundImage: "url('/images/bbg.jpeg')" }}>
        {/* Search and Filter */}
        <Card className="relative z-20 mb-4">
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
                  onChange={e => setSearchTerm(e.target.value)}
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
                    {games.map(game => (
                      <SelectItem key={game} value={game}>{game}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Filter by Games for Sale</label>
                <Select value={showGamesForSale ? 'sale' : 'all'} onValueChange={val => setShowGamesForSale(val === 'sale')}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Games for Sale" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999]">
                    <SelectItem value="all">All Games for Sale</SelectItem>
                    {gamesForSale.map(game => (
                      <SelectItem key={game} value={game}>{game}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Distance (km)</label>
                <Select value={maxDistance.toString()} onValueChange={val => setMaxDistance(Number(val))}>
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
        <Card className="relative z-10 mb-4">
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
                filteredPlayers.map(player => (
                  <div key={player.id} className="border rounded-lg hover:bg-gray-50 transition-colors">
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
