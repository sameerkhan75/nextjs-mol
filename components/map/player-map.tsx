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

// Interfaces
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
  // State
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

  // Helpers
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  const generateGamesForSale = useCallback((): GameForSale[] => {
    const allGames = ['FIFA 24','Call of Duty','Fortnite','God of War','Valorant','GTA 5','Minecraft','Among Us'];
    const platforms = ['PS5','PS4','Xbox','PC','Nintendo Switch'];
    const conditions = ['Excellent','Good','Fair','Poor'];
    if (Math.random() < 0.5) return [];
    const count = Math.floor(Math.random() * 3) + 1;
    return Array.from({length: count}).map(() => ({
      name: allGames[Math.floor(Math.random() * allGames.length)],
      price: Math.floor(Math.random() * 500) + 100,
      condition: conditions[Math.floor(Math.random() * conditions.length)] as GameForSale['condition'],
      platform: platforms[Math.floor(Math.random() * platforms.length)] as GameForSale['platform'],
      description: 'Used in good condition.'
    }));
  }, []);

  const generateMockPlayers = useCallback((lat: number, lng: number): Player[] => {
    const names = ['Alex','Sara','Mike','Emma','John','Lisa'];
    const games = ['FIFA 24','Fortnite','Valorant','GTA 5','Minecraft'];
    return Array.from({length: 10}).map((_, i) => {
      const angle = Math.random()*2*Math.PI;
      const dist = Math.sqrt(Math.random()) * maxDistance;
      const dLat = (dist/111) * Math.cos(angle);
      const dLng = (dist/111) * Math.sin(angle) / Math.cos(lat*Math.PI/180);
      const pl = { lat: lat + dLat, lng: lng + dLng };
      const distance = calculateDistance(lat,lng,pl.lat,pl.lng);
      return {
        id: `p${i}`,
        name: names[i%names.length],
        game: games[i%games.length],
        location: pl,
        distance,
        isOnline: Math.random()>0.5,
        lastSeen: `${Math.floor(Math.random()*60)}m ago`,
        gamesForSale: generateGamesForSale(),
        discordId: `user${i}#${1000+i}`
      };
    });
  }, [calculateDistance, generateGamesForSale, maxDistance]);

  const formatDistance = useCallback((d: number) => d<1?
    `${Math.round(d*1000)}m`:`${d.toFixed(1)}km`, []);

  const filterPlayers = useCallback((list: Player[]) => list.filter(p => {
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase()) && !p.game.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (selectedGame!=='all' && p.game!==selectedGame) return false;
    if (p.distance>maxDistance) return false;
    if (onlineOnly&& !p.isOnline) return false;
    if (showGamesForSale && (!p.gamesForSale||!p.gamesForSale.length)) return false;
    return true;
  }), [searchTerm, selectedGame, maxDistance, onlineOnly, showGamesForSale]);

  const games = useMemo(()=>Array.from(new Set(players.map(p=>p.game))),[players]);

  const gamesForSale = useMemo(()=>Array.from(new Set(players.flatMap(p=>p.gamesForSale?.map(g=>g.name)||[]))),[players]);

  const copyDiscordId = useCallback((id:string)=>{
    navigator.clipboard.writeText(id);
    setCopiedDiscordId(id);
    setTimeout(()=>setCopiedDiscordId(null),2000);
  },[]);

  // Load geo + players
  useEffect(()=>{
    if(!navigator.geolocation){setError('No geo');setIsLoading(false);return;}
    navigator.geolocation.getCurrentPosition(pos=>{
      const loc={lat:pos.coords.latitude,lng:pos.coords.longitude};
      setUserLocation(loc);
      const mocks=generateMockPlayers(loc.lat,loc.lng);
      setPlayers(mocks);
      setFilteredPlayers(mocks);
      setIsLoading(false);
    },err=>{
      setError('Geo failed');
      const def={lat:0,lng:0};
      setUserLocation(def);
      const mocks=generateMockPlayers(def.lat,def.lng);
      setPlayers(mocks);
      setFilteredPlayers(mocks);
      setIsLoading(false);
    });
  },[generateMockPlayers]);

  // Re-filter
  useEffect(()=>{
    setFilteredPlayers(filterPlayers(players));
  },[players,filterPlayers]);

  return (
    <div className={className}>
      {error&&<div className="text-red-600">{error}</div>}
      <div className="grid grid-cols-2 gap-2">
        <Input placeholder="Search..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
        <Select value={selectedGame} onValueChange={setSelectedGame}>
          <SelectTrigger><SelectValue placeholder="Game"/></SelectTrigger>
          <SelectContent>{['all',...games].map(g=><SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <Card>
        <CardContent className="p-0">
          {isLoading?
            <div className="w-full h-96 bg-gray-100 animate-pulse"/>:
            userLocation? <MapComponent players={filteredPlayers} userLocation={userLocation} className="w-full h-96"/>:
            <div className="h-96 flex items-center justify-center">No location</div>
          }
        </CardContent>
      </Card>
      <ul className="space-y-2">
        {filteredPlayers.map(p=><li key={p.id} className="p-2 border rounded">
          <div className="flex justify-between">
            <span>{p.name} ({formatDistance(p.distance)})</span>
            <Button size="sm" onClick={()=>copyDiscordId(p.discordId||'')}>
              {copiedDiscordId===p.discordId?'Copied':<Copy className="w-4 h-4" />}
            </Button>
          </div>
        </li>)}
      </ul>
    </div>
  );
}
