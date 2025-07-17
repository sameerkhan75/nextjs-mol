'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

interface MapComponentProps {
  players: Player[];
  userLocation: { lat: number; lng: number } | null;
  className?: string;
}

export default function MapComponent({ players, userLocation, className }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const formatDistance = (distance: number): string => {
    if (distance < 1) return `${Math.round(distance * 1000)}m`;
    return `${distance.toFixed(1)}km`;
  };

  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    const script = document.createElement('script');
    script.textContent = `
      window.copyDiscordId = function(event, id) {
        navigator.clipboard.writeText(id).then(() => {
          const button = event.target;
          button.textContent = 'Copied!';
          setTimeout(() => button.textContent = '⎘', 2000);
        });
      }
    `;
    document.body.appendChild(script);
//updated code
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([userLocation.lat, userLocation.lng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;

      const style = document.createElement('style');
      style.textContent = `
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `;
      document.head.appendChild(style);

      return () => {
        map.remove();
        mapInstanceRef.current = null;
        document.head.removeChild(style);
        document.body.removeChild(script);
      };
    }

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    if (mapInstanceRef.current) {
      const userIcon = L.divIcon({
        className: 'user-marker',
        html: `<div style="width: 20px; height: 20px; background: #3b82f6; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup('<b>Your Location</b><br>You are here');

      players.forEach((player) => {
        const playerIcon = L.divIcon({
          className: 'player-marker',
          html: `
            <div style="width:16px;height:16px;background:${player.isOnline ? '#10b981' : '#6b7280'};border:2px solid white;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,0.3);position:relative;">
              ${player.isOnline ? `<div style="position:absolute;top:-2px;right:-2px;width:6px;height:6px;background:#10b981;border-radius:50%;animation:pulse 2s infinite;"></div>` : ''}
            </div>
          `,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });

        const marker = L.marker([player.location.lat, player.location.lng], { icon: playerIcon })
          .addTo(mapInstanceRef.current!)
          .bindPopup(`
            <div style="min-width:300px;">
              <h3 style="margin:0 0 8px;color:#1f2937;font-weight:600;">${player.name}</h3>
              ${player.discordId ? `
                <button onclick="copyDiscordId(event,'${player.discordId}')" style="background:none;border:none;cursor:pointer;color:#5865F2;">⎘ Copy Discord ID</button>
              ` : ''}
              <p><strong>Game:</strong> ${player.game}</p>
              <p><strong>Distance:</strong> ${formatDistance(player.distance)}</p>
              <p><strong>Status:</strong> <span style="color:${player.isOnline ? '#10b981' : '#6b7280'};">${player.isOnline ? 'Online' : 'Offline'}</span></p>
            </div>
          `);

        markersRef.current.push(marker);
      });

      if (players.length > 0) {
        const group = L.featureGroup(players.map(p => L.marker([p.location.lat, p.location.lng])));
        group.addLayer(L.marker([userLocation.lat, userLocation.lng]));
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.2));
      }
    }
  }, [userLocation, players]);

  return <div ref={mapRef} className={className} style={{ width: '100%', height: '400px' }} />;
}