export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial' }}>
        <nav style={{ padding: '1rem', backgroundColor: '#f3f4f6' }}>
          <a href="/marketplace" style={{ marginRight: '1rem' }}>🛒 Marketplace</a>
          <a href="/dashboard" style={{ marginRight: '1rem' }}>📦 Dashboard</a>
          <a href="/affiliate" style={{ marginRight: '1rem' }}>💰 Affiliate</a>
          <a href="/profile" style={{ marginRight: '1rem' }}>👤 Profile</a>
        </nav>
        <main style={{ padding: '2rem' }}>
          {children}
        </main>
      </body>
    </html>
  );
          }
