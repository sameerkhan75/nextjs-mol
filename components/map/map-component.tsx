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
//find the map why it is nt u

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

    // Clipboard function
    const script = document.createElement('script');
    script.textContent = `
      window.copyDiscordId = function(id) {
        navigator.clipboard.writeText(id).then(() => {
          const button = event.target;
          button.textContent = 'Copied!';
          setTimeout(() => button.textContent = '⎘', 2000);
        });
      }
    `;
    document.body.appendChild(script);

    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([userLocation.lat, userLocation.lng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Add pulse animation
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

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    if (mapInstanceRef.current) {
      // User marker
      const userIcon = L.divIcon({
        className: 'user-marker',
        html: `<div style="width: 20px; height: 20px; background: #3b82f6; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup('<b>Your Location</b><br>You are here');

      // Player markers
      players.forEach((player) => {
        console.log('Adding marker for player:', player.name, player.location);
        const playerIcon = L.divIcon({
          className: 'player-marker',
          html: `
            <div style="width: 16px; height: 16px; 
                        background: ${player.isOnline ? '#10b981' : '#6b7280'}; 
                        border: 2px solid white; 
                        border-radius: 50%; 
                        box-shadow: 0 2px 4px rgba(0,0,0,0.3); 
                        position: relative;">
              ${player.isOnline ? 
                `<div style="position: absolute; top: -2px; right: -2px; 
                            width: 6px; height: 6px; 
                            background: #10b981; 
                            border-radius: 50%; 
                            animation: pulse 2s infinite;"></div>` 
                : ''}
            </div>
          `,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });

        const marker = L.marker([player.location.lat, player.location.lng], { icon: playerIcon })
          .addTo(mapInstanceRef.current!)
          .bindPopup(`
            <div style="min-width: 300px;">
              <h3 style="margin: 0 0 8px 0; color: #1f2937; font-weight: 600;">${player.name}</h3>
              
              ${player.discordId ? `
                <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px;">
                  <span style="font-size: 12px; background: #5865F2; color: white; padding: 2px 6px; border-radius: 4px;">
                    Discord
                  </span>
                  <span style="font-size: 14px; font-family: monospace;">${player.discordId}</span>
                  <button onclick="copyDiscordId('${player.discordId}')" 
                          style="background: none; border: none; cursor: pointer; color: #5865F2;"
                          title="Copy Discord ID">
                    ⎘
                  </button>
                </div>
              ` : ''}

              <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">
                <strong>Game:</strong> ${player.game}
              </p>
              <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">
                <strong>Distance:</strong> ${formatDistance(player.distance)}
              </p>
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
                <strong>Status:</strong> 
                <span style="color: ${player.isOnline ? '#10b981' : '#6b7280'}; font-weight: 500;">
                  ${player.isOnline ? 'Online' : 'Offline'}
                </span>
              </p>
              
              ${player.gamesForSale?.length ? `
                <div style="margin: 8px 0 0 0; padding: 8px; background: #f0fdf4; border-radius: 4px; border-left: 3px solid #10b981;">
                  <p style="margin: 0 0 6px 0; color: #065f46; font-size: 14px; font-weight: 600;">
                    🎮 Games for Sale (${player.gamesForSale.length})
                  </p>
                  ${player.gamesForSale.map(game => `
                    <div style="margin: 4px 0; padding: 4px; background: white; border-radius: 2px;">
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 12px; font-weight: 500; color: #1f2937;">${game.name}</span>
                        <span style="font-size: 12px; font-weight: bold; color: #10b981;">₹${game.price}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; font-size: 10px; color: #6b7280; margin-top: 2px;">
                        <span>${game.condition}</span>
                        <span>${game.platform}</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          `);

        markersRef.current.push(marker);
      });
      console.log('Adding markers for players:', players);
      if (mapInstanceRef.current && players.length > 0) {
        const group = L.featureGroup([
          L.marker([userLocation.lat, userLocation.lng]),
          ...players.map(p => L.marker([p.location.lat, p.location.lng]))
        ]);
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.2));
      }
    }
  }, [userLocation, players]);

  return <div ref={mapRef} className={className} style={{ width: '100%', height: '400px' }} />;
}