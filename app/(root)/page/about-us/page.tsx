export default function AboutUsPage() {
  //improve the ui of about and help page
  //does the read me file
  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: "url('/images/toroto.jpeg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
      }} />
      <div style={{
        maxWidth: 700,
        margin: '0 auto',
        padding: '2rem',
        position: 'relative',
        zIndex: 2,
        color: '#000',
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>About Us</h1>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Our Company: Moltres</h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
          <strong>Moltres</strong> is a social marketplace designed specifically for console gamers. Our mission is to connect gamers, enable safe and easy trading of pre-owned PlayStation and Xbox games, and foster a vibrant gaming community.
        </p>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>What We Do</h3>
        <ul style={{ fontSize: '1.1rem', marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
          <li>• Allow gamers to buy and sell used PS/Xbox titles with others nearby.</li>
          <li>• Help you discover sellers and players in your area using map-based search.</li>
          <li>• Enable team matchmaking based on shared game interests.</li>
          <li>• Build a safe, utility-first platform for the gaming community.</li>
        </ul>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Why Choose Moltres?</h3>
        <ul style={{ fontSize: '1.1rem', marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
          <li>• Location-based discovery for real connections.</li>
          <li>• Secure trading and user verification.</li>
          <li>• Community-driven features and future enhancements like messaging and wishlists.</li>
        </ul>
        <p style={{ fontSize: '1.1rem' }}>
          Whether you want to find your next favorite game, connect with local players, or build your gaming team, <strong>Moltres</strong> is here to make it happen. Join us and be part of the ultimate console gaming community!
        </p>
      </div>
    </div>
  );
} 