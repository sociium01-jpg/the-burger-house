export function Footer() {
  return (
    <footer
      style={{
        background: '#0A0908',
        borderTop: '1px solid rgba(245,239,231,0.10)',
        padding: '3.2rem 6vw 1.6rem',
        color: '#A8A099',
      }}
    >
      {/* PLACEHOLDER: hours, address, phone, and socials need real venue values before launch. */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: '2rem',
        }}
        className="footer-grid"
      >
        <div>
          <p className="display" style={{ color: '#F5EFE7', fontSize: '2rem', margin: 0 }}>
            The Burger House
          </p>
          <p style={{ margin: '0.7rem 0 0', maxWidth: 220, lineHeight: 1.5 }}>
            Flame-grilled burgers, built to order. No steam trays. No shortcuts.
          </p>
        </div>
        <div>
          <p className="label" style={{ marginBottom: '0.8rem' }}>
            Hours
          </p>
          <p style={{ margin: 0, lineHeight: 1.8 }}>
            Mon–Thu · 12:00–23:00
            <br />
            Fri–Sat · 12:00–01:00
            <br />
            Sun · 12:00–22:00
          </p>
        </div>
        <div>
          <p className="label" style={{ marginBottom: '0.8rem' }}>
            Find us
          </p>
          <p style={{ margin: 0, lineHeight: 1.8 }}>
            Marine Drive
            <br />
            Cochin, Kerala 682031
            <br />
            +91 00000 00000
          </p>
        </div>
        <div>
          <p className="label" style={{ marginBottom: '0.8rem' }}>
            Social
          </p>
          <p style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <a href="https://instagram.com" rel="noreferrer">
              Instagram
            </a>
            <a href="https://x.com" rel="noreferrer">
              X
            </a>
            <a href="mailto:hello@example.com">hello@example.com</a>
          </p>
        </div>
      </div>
      <p
        style={{
          margin: '2.4rem 0 0',
          paddingTop: '1.2rem',
          borderTop: '1px solid rgba(245,239,231,0.10)',
          fontSize: '0.8rem',
          color: '#6E6660',
        }}
      >
        © {new Date().getFullYear()} The Burger House. All rights reserved.
      </p>
      <style>{`
        @media (max-width: 767px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}
