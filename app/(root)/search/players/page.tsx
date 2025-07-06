import PlayerMap from '@/components/map/player-map';

export default function PlayersPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#fff',
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <PlayerMap />
        </div>
      </div>
    </div>
  );
} 