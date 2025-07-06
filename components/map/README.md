# Map Components

This directory contains the components for the "Find Players Nearby You" feature using Leaflet maps.

## Components

### `player-map.tsx`
The main component that handles the player search and map functionality. It includes:
- Search and filter functionality
- User location detection
- Player list display
- Integration with the map component
- **NEW**: Games for sale feature

### `map-component.tsx`
The Leaflet map component that renders the interactive map with:
- User location marker (blue dot)
- Player markers (green for online, gray for offline)
- Popup information for each player
- Real-time updates when filters change
- **NEW**: Games for sale information in popups

## Features

### Search & Filter
- **Search by name, game, or games for sale**: Type to search for specific players, games, or games being sold
- **Filter by game**: Select specific games to show only those players
- **Filter by games for sale**: Quick dropdown to find specific games being sold
- **Distance filter**: Set maximum distance (2km to 50km)
- **Online status**: Toggle to show only online players
- **Games for sale filter**: Toggle to show only players with games for sale

### Map Features
- **Interactive markers**: Click on player markers to see details
- **Real-time updates**: Map updates automatically when filters change
- **User location**: Shows your current location with a blue marker
- **Player status**: Green markers for online players, gray for offline
- **Games for sale popups**: Shows games being sold by each player

### Player Information
- Player name and game
- Distance from your location
- Online/offline status
- Last seen time
- Player level (if available)
- **NEW**: Games for sale with prices, conditions, and platforms

### Games for Sale Feature
- **Search functionality**: Type any game name to find players selling it
- **Price display**: Shows prices for each game
- **Condition ratings**: Excellent, Good, Fair, Poor
- **Platform support**: PS5, PS4, Xbox, PC, Nintendo Switch
- **No results handling**: Shows "No players found selling [game]" when no matches
- **Visual indicators**: Green highlighting for games for sale sections

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

### Mock Data Generation
- Generates realistic player data around user location
- Creates games for sale with varied prices ($10-$60)
- Includes different game conditions and platforms
- 70% of players have games for sale

### Search Logic
- Searches across player names, current games, and games for sale
- Case-insensitive matching
- Real-time filtering as you type
- Clear search functionality

### Distance Calculation
- Uses Haversine formula for accurate distance calculation
- Displays distances in meters (for <1km) or kilometers
- Sorts players by distance from user

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