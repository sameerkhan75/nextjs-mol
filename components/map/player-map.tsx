'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Users, Filter, Search, Wifi, WifiOff, DollarSign, Package, Copy } from 'lucide-react';

// Dynamically import the map component with SSR off
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

  const DEFAULT_LOCATION = { lat: 40.7128, lng: -74.0060 }; // NYC fallback

  // Distance between two lat/lng points (Haversine)
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  // Mock games for sale
  const generateGamesForSale = useCallback((): GameForSale[] => {
    const titles = [
      'FIFA 24', 'Call of Duty', 'Fortnite', 'God of War: Ragnarök', 
      'Valorant', 'GTA 5', 'Spider-Man', 'CS:GO', 'Red Dead Redemption II'
    ];
    const platforms = ['PS5', 'PS4', 'Xbox', 'PC', 'Nintendo Switch'];
    const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];

    if (Math.random() > 0.3) {
      return Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => ({
        name: titles[Math.floor(Math.random() * titles.length)],
        price: Math.floor(Math.random() * 601) + 400,
        condition: conditions[Math.floor(Math.random() * conditions.length)] as GameForSale['condition'],
        platform: platforms[Math.floor(Math.random() * platforms.length)] as GameForSale['platform'],
        description: `Used condition. Complete with case.`
      }));
    }
    return [];
  }, []);

  // Generate mock players near location
  const generateMockPlayers = useCallback((lat: number, lng: number): Player[] => {
    const games = ['FIFA 24', 'Call of Duty', 'Fortnite', 'God of War', 'Valorant'];
    const names = ['Alex', 'Sarah', 'Mike', 'Emma', 'John', 'Lisa'];

    return Array.from({ length: 10 }, (_, i) => {
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.sqrt(Math.random()) * 10;
      const latOffset = distance * Math.cos(angle) / 111.32;
      const lngOffset = distance * Math.sin(angle) / (111.32 * Math.cos(lat * Math.PI / 180));
      const playerLat = lat + latOffset;
      const playerLng = lng + lngOffset;

      return {
        id: `player-${i}`,
        name: `${names[i % names.length]}_${Math.floor(Math.random() * 1000)}`,
        game: games[i % games.length],
        location: { lat: playerLat, lng: playerLng },
        distance: calculateDistance(lat, lng, playerLat, playerLng),
        isOnline: Math.random() > 0.3,
        lastSeen: `${Math.floor(Math.random() * 60)} minutes ago`,
        discordId: `player${i}#${Math.floor(1000 + Math.random() * 9000)}`,
        gamesForSale: generateGamesForSale(),
      };
    });
  }, [calculateDistance, generateGamesForSale]);

  // Distance formatter
  const formatDistance = useCallback((d: number) => (d < 1 ? `${Math.round(d * 1000)}m` : `${d.toFixed(1)}km`), []);

  // Filtering logic
  const filterPlayers = useCallback((players: Player[], filters: {
    searchTerm: string;
    selectedGame: string;
    maxDistance: number;
    onlineOnly: boolean;
    showGamesForSale: boolean;
  }) => {
    return players.filter(player => {
      if (filters.searchTerm) {
        const s = filters.searchTerm.toLowerCase();
        const matches = player.name.toLowerCase().includes(s) ||
          player.game.toLowerCase().includes(s) ||
          (player.gamesForSale?.some(g => g.name.toLowerCase().includes(s)));
        if (!matches) return false;
      }
      if (filters.selectedGame !== 'all' && player.game !== filters.selectedGame) return false;
      if (player.distance > filters.maxDistance) return false;
      if (filters.onlineOnly && !player.isOnline) return false;
      if (filters.showGamesForSale && (!player.gamesForSale?.length)) return false;
      return true;
    });
  }, []);

  // Unique games
  const games = useMemo(() => Array.from(new Set(players.map(p => p.game))), [players]);

  const gamesForSale = useMemo(() => {
    return Array.from(new Set(players.flatMap(p => p.gamesForSale?.map(g => g.name) ?? [])));
  }, [players]);

  // Session storage
  const saveToSession = useCallback((players: Player[], loc: { lat: number; lng: number }) => {
    try {
      sessionStorage.setItem('mockPlayers', JSON.stringify(players));
      sessionStorage.setItem('mockPlayersLocation', JSON.stringify(loc));
    } catch {}
  }, []);

  const loadFromSession = useCallback(() => {
    try {
      const p = sessionStorage.getItem('mockPlayers');
      const l = sessionStorage.getItem('mockPlayersLocation');
      if (!p || !l) return { players: null, location: null };
      const players = JSON.parse(p);
      const location = JSON.parse(l);
      return { players, location };
    } catch {
      return { players: null, location: null };
    }
  }, []);

  const copyDiscordId = useCallback(async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedDiscordId(id);
      setTimeout(() => setCopiedDiscordId(null), 1500);
    } catch {
      setError('Failed to copy Discord ID');
      setTimeout(() => setError(null), 3000);
    }
  }, []);

  // Fallback default location
  const useDefaultLocation = useCallback(() => {
    setError('Using default location.');
    const mock = generateMockPlayers(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng);
    saveToSession(mock, DEFAULT_LOCATION);
    setUserLocation(DEFAULT_LOCATION);
    setPlayers(mock);
    setFilteredPlayers(mock);
    setIsLoading(false);
  }, [generateMockPlayers, saveToSession]);

  // Geolocation effect
  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      useDefaultLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const session = loadFromSession();
        if (session.players && session.location &&
          Math.abs(session.location.lat - loc.lat) < 0.01 &&
          Math.abs(session.location.lng - loc.lng) < 0.01) {
          setUserLocation(session.location);
          setPlayers(session.players);
          setFilteredPlayers(session.players);
          setIsLoading(false);
        } else {
          const mock = generateMockPlayers(loc.lat, loc.lng);
          saveToSession(mock, loc);
          setUserLocation(loc);
          setPlayers(mock);
          setFilteredPlayers(mock);
          setIsLoading(false);
        }
      },
      () => useDefaultLocation(),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [generateMockPlayers, loadFromSession, saveToSession, useDefaultLocation]);

  // Apply filters
  useEffect(() => {
    setFilteredPlayers(filterPlayers(players, { searchTerm, selectedGame, maxDistance, onlineOnly, showGamesForSale }));
  }, [searchTerm, selectedGame, maxDistance, onlineOnly, showGamesForSale, players, filterPlayers]);

  // 🎯 Clean UI below (same as yours but safe)
  // ... (You can reuse your existing UI return block unchanged!)
  // Just ensure `setMaxDistance`, `setOnlineOnly` reset on clear:
  //
  // onClick={() => {
  //   setSearchTerm('');
  //   setSelectedGame('all');
  //   setShowGamesForSale(false);
  //   setMaxDistance(10);
  //   setOnlineOnly(false);
  // }}
  //
  // 

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Your existing return JSX here remains unchanged */}
      {/* It's too big for this box but keep your design. Just ensure the fixes above. */}
    </div>
  );
}
