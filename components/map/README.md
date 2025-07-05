# Map Components

This directory contains the components for the "Find Players Nearby You" feature using Leaflet maps.

## Components

### `player-map.tsx`
The main component that handles the player search and map functionality. It includes:
- Search and filter functionality
- User location detection
- Player list display
- Integration with the map component

### `map-component.tsx`
The Leaflet map component that renders the interactive map with:
- User location marker (blue dot)
- Player markers (green for online, gray for offline)
- Popup information for each player
- Real-time updates when filters change

## Features

### Search & Filter
- **Search by name or game**: Type to search for specific players or games
- **Filter by game**: Select specific games to show only those players
- **Distance filter**: Set maximum distance (1km to 50km)
- **Online status**: Toggle to show only online players

### Map Features
- **Interactive markers**: Click on player markers to see details
- **Real-time updates**: Map updates automatically when filters change
- **User location**: Shows your current location with a blue marker
- **Player status**: Green markers for online players, gray for offline

### Player Information
- Player name and game
- Distance from your location
- Online/offline status
- Last seen time
- Player level (if available)

## Dependencies

- `leaflet`: The main mapping library
- `react-leaflet`: React wrapper for Leaflet
- `@types/leaflet`: TypeScript definitions

## Usage

```tsx
import PlayerMap from '@/components/map/player-map';

export default function PlayersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PlayerMap />
    </div>
  );
}
```

## File Structure

```
components/map/
├── player-map.tsx      # Main component
├── map-component.tsx    # Leaflet map component
└── README.md          # This documentation
```

## Utilities

The map functionality uses utilities from:
- `@/lib/map-utils.ts`: Distance calculations, filtering, and mock data generation
- `@/types/map.ts`: TypeScript interfaces for map data

## Styling

The components use Tailwind CSS for styling and include:
- Responsive design for mobile and desktop
- Loading states with skeleton animations
- Hover effects and transitions
- Custom marker styling with animations

## Browser Compatibility

- Requires geolocation API support
- Works best in modern browsers
- Graceful fallback to default location if geolocation fails 