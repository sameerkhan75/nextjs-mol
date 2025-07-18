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
    <div className={className}>
      {error && <div className="bg-red-100 text-red-800 p-2 rounded mb-4">{error}</div>}

      {/* Search & Filters */}
      <Card className="mb-4">
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search by name or game..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full"
             />
            <Select value={selectedGame} onValueChange={setSelectedGame}>
              <SelectTrigger><SelectValue placeholder="All Games" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Games</SelectItem>
                {games.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={showGamesForSale ? 'sale' : 'all'} onValueChange={val => setShowGamesForSale(val === 'sale')}>
              <SelectTrigger><SelectValue placeholder="Games for Sale" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Players</SelectItem>
                <SelectItem value="sale">With Games for Sale</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Map Section */}
      <Card className="mb-4">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="w-full h-96 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
              <div className="text-gray-500">Loading map...</div>
            </div>
          ) : userLocation ? (
            <MapComponent
              players={filteredPlayers}
              userLocation={userLocation}
              className="w-full h-96 rounded-lg"
            />
          ) : (
            <div className="w-full h-96 flex items-center justify-center text-gray-500">
              Could not determine your location.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Players List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Players Nearby ({filteredPlayers.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredPlayers.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No players found.</div>
          ) : (
            filteredPlayers.map(player => (
              <div key={player.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{player.name}</h3>
                    <p className="text-sm text-gray-600">{player.game}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatDistance(player.distance)}</p>
                    <p className="text-xs text-gray-500">{player.lastSeen}</p>
                  </div>
                </div>
                {player.gamesForSale && player.gamesForSale.length > 0 && (
                  <div className="mt-4 p-4 bg-green-50 rounded">
                    <h4 className="font-medium text-green-800">Games for Sale</h4>
                    <ul className="mt-2 space-y-2">
                      {player.gamesForSale.map((game, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span className="font-medium">{game.name}</span>
                          <span className="text-green-600">₹{game.price}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2 flex items-center space-x-2">
                      <Copy className="w-4 h-4 text-blue-600" />
                      <button onClick={() => copyDiscordId(player.discordId || '')} className="text-blue-600 underline underline-offset-2">
                        {copiedDiscordId === player.discordId ? 'Copied!' : player.discordId}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
