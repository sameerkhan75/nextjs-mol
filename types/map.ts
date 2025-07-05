export interface Player {
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
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp?: number;
}

export interface MapFilters {
  searchTerm: string;
  selectedGame: string;
  maxDistance: number;
  onlineOnly: boolean;
  minLevel?: number;
}

export interface MapSettings {
  defaultZoom: number;
  maxZoom: number;
  minZoom: number;
  tileLayer: string;
  attribution: string;
} 