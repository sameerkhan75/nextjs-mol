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

export interface Player {
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

interface MapComponentProps {
  players: Player[];
  userLocation: { lat: number; lng: number } | null;
  className?: string;
}

export default function MapComponent({
  players,
  userLocation,
  className,
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // initialize map once when we first get userLocation
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView(
      [userLocation.lat, userLocation.lng],
      13
    );
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);
    mapInstanceRef.current = map;

    // inject copy-to-clipboard helper once
    const script = document.createElement('script');
    script.textContent = `
      window.copyDiscordId = function(id, evt) {
        navigator.clipboard.writeText(id).then(() => {
          const btn = evt.currentTarget;
          btn.textContent = 'Copied!';
          setTimeout(() => (btn.textContent = '⎘'), 2000);
        });
      };
    `;
    document.body.appendChild(script);

    // add pulse keyframes once
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    // cleanup on unmount only
    return () => {
      map.remove();
      mapInstanceRef.current = null;
      document.body.removeChild(script);
      document.head.removeChild(style);
    };
  }, [userLocation]);

  // update markers any time userLocation or players change
  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation) return;

    // remove old
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // helper to format distance
    const formatDistance = (d: number) =>
      d < 1 ? `${Math.round(d * 1000)}m` : `${d.toFixed(1)}km`;

    // user icon
    const userIcon = L.divIcon({
      className: 'user-marker',
      html: `<div style="
        width:20px;height:20px;
        background:#3b82f6;
        border:3px solid white;
        border-radius:50%;
        box-shadow:0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    // add “You are here”
    L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(mapInstanceRef.current)
      .bindPopup('<b>Your Location</b><br>You are here')
      .openPopup();
    markersRef.current.push(
      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
    );

    // player markers
    players.forEach((player) => {
      console.log('Adding marker for player:', player.name, player.location);

      const html = `
        <div style="
          width:16px;height:16px;
          background:${player.isOnline ? '#10b981' : '#6b7280'};
          border:2px solid white;
          border-radius:50%;
          box-shadow:0 2px 4px rgba(0,0,0,0.3);
          position:relative;
        ">
          ${
            player.isOnline
              ? `<div style="
                  position:absolute;
                  top:-2px;right:-2px;
                  width:6px;height:6px;
                  background:#10b981;
                  border-radius:50%;
                  animation:pulse 2s infinite;
                "></div>`
              : ''
          }
        </div>
      `;

      const playerIcon = L.divIcon({
        className: 'player-marker',
        html,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      const popup = `
        <div style="min-width:250px">
          <h3 style="margin:0 0 4px 0;color:#1f2937;font-weight:600">
            ${player.name}
          </h3>
          ${
            player.discordId
              ? `<div style="display:flex;align-items:center;gap:4px;margin-bottom:8px">
                  <span style="
                    font-size:12px;
                    background:#5865F2;color:white;
                    padding:2px 6px;border-radius:4px;
                  ">Discord</span>
                  <span style="font-family:monospace">${player.discordId}</span>
                  <button
                    onclick="copyDiscordId('${player.discordId}', event)"
                    style="background:none;border:none;cursor:pointer;color:#5865F2"
                    title="Copy Discord ID"
                  >⎘</button>
                </div>`
              : ''
          }
          <p style="margin:0;font-size:14px;color:#6b7280">
            <strong>Game:</strong> ${player.game}
          </p>
          <p style="margin:0;font-size:14px;color:#6b7280">
            <strong>Distance:</strong> ${formatDistance(player.distance)}
          </p>
          <p style="margin:0;font-size:14px;color:#6b7280">
            <strong>Status:</strong>
            <span style="
              color:${player.isOnline ? '#10b981' : '#6b7280'};
              font-weight:500
            ">
              ${player.isOnline ? 'Online' : 'Offline'}
            </span>
          </p>
          ${
            player.gamesForSale && player.gamesForSale.length
              ? `<div style="
                    margin-top:8px;
                    padding:8px;
                    background:#f0fdf4;
                    border-left:3px solid #10b981;
                  ">
                  <p style="margin:0 0 4px 0;color:#065f46;font-weight:600">
                    🎮 Games for Sale (${player.gamesForSale.length})
                  </p>
                  ${player.gamesForSale
                    .map(
                      (g) => `
                    <div style="
                      margin-bottom:4px;
                      padding:4px;
                      background:white;
                      border-radius:2px;
                    ">
                      <div style="
                        display:flex;
                        justify-content:space-between;
                      ">
                        <span style="font-size:12px;color:#1f2937">
                          ${g.name}
                        </span>
                        <span style="font-size:12px;font-weight:bold;color:#10b981">
                          ₹${g.price}
                        </span>
                      </div>
                      <div style="
                        display:flex;
                        justify-content:space-between;
                        font-size:10px;
                        color:#6b7280;
                      ">
                        <span>${g.condition}</span>
                        <span>${g.platform}</span>
                      </div>
                    </div>
                  `
                    )
                    .join('')}
                </div>`
              : ''
          }
        </div>
      `;

      const m = L.marker(
        [player.location.lat, player.location.lng],
        { icon: playerIcon }
      )
        .addTo(mapInstanceRef.current!)
        .bindPopup(popup);

      markersRef.current.push(m);
    });

    // fit map to show all
    if (players.length > 0) {
      const group = L.featureGroup(
        markersRef.current.map((m) => L.marker(m.getLatLng()))
      );
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.2));
    }
  }, [userLocation, players]);

  return (
    <div
      ref={mapRef}
      className={className}
      style={{ width: '100%', height: '400px' }}
    />
  );
}
