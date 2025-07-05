'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Player, UserLocation } from '@/types/map';
import { formatDistance } from '@/lib/map-utils';

interface MapComponentProps {
  players: Player[];
  userLocation: UserLocation | null;
  className?: string;
}

export default function MapComponent({ players, userLocation, className }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([userLocation.lat, userLocation.lng], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    // Add user location marker
    const userIcon = L.divIcon({
      className: 'user-marker',
      html: `
        <div style="
          width: 20px;
          height: 20px;
          background: #3b82f6;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(map)
      .bindPopup('<b>Your Location</b><br>You are here');

    // Add player markers
    const playerMarkers: L.Marker[] = [];
    
    players.forEach((player) => {
      const playerIcon = L.divIcon({
        className: 'player-marker',
        html: `
          <div style="
            width: 16px;
            height: 16px;
            background: ${player.isOnline ? '#10b981' : '#6b7280'};
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            position: relative;
          ">
            ${player.isOnline ? `
              <div style="
                position: absolute;
                top: -2px;
                right: -2px;
                width: 6px;
                height: 6px;
                background: #10b981;
                border-radius: 50%;
                animation: pulse 2s infinite;
              "></div>
            ` : ''}
          </div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      const marker = L.marker([player.location.lat, player.location.lng], { icon: playerIcon })
        .addTo(map)
        .bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937; font-weight: 600;">${player.name}</h3>
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
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
              Last seen: ${player.lastSeen}
            </p>
            ${player.level ? `<p style="margin: 0; color: #3b82f6; font-size: 12px;">Level ${player.level}</p>` : ''}
          </div>
        `);

      playerMarkers.push(marker);
    });

    // Store references
    mapInstanceRef.current = map;
    markersRef.current = playerMarkers;

    // Add custom CSS for animations
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
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersRef.current = [];
      document.head.removeChild(style);
    };
  }, [userLocation]);

  // Update markers when players change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    players.forEach((player) => {
      const playerIcon = L.divIcon({
        className: 'player-marker',
        html: `
          <div style="
            width: 16px;
            height: 16px;
            background: ${player.isOnline ? '#10b981' : '#6b7280'};
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            position: relative;
          ">
            ${player.isOnline ? `
              <div style="
                position: absolute;
                top: -2px;
                right: -2px;
                width: 6px;
                height: 6px;
                background: #10b981;
                border-radius: 50%;
                animation: pulse 2s infinite;
              "></div>
            ` : ''}
          </div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      const marker = L.marker([player.location.lat, player.location.lng], { icon: playerIcon })
        .addTo(mapInstanceRef.current!)
        .bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937; font-weight: 600;">${player.name}</h3>
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
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
              Last seen: ${player.lastSeen}
            </p>
            ${player.level ? `<p style="margin: 0; color: #3b82f6; font-size: 12px;">Level ${player.level}</p>` : ''}
          </div>
        `);

      markersRef.current.push(marker);
    });
  }, [players]);

  return (
    <div 
      ref={mapRef} 
      className={className}
      style={{ 
        width: '100%', 
        height: '100%',
        minHeight: '400px',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    />
  );
} 