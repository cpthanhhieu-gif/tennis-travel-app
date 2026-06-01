export default function IPhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="iphone-frame">
      <div className="iphone-screen">

        {/* ── Status Bar ── */}
        <div className="iphone-status-bar">
          <span className="iphone-time">9:41</span>
          {/* Dynamic Island (centered) */}
          <div className="iphone-island" />
          {/* Right: signal + wifi + battery */}
          <div className="iphone-indicators">
            {/* Signal bars */}
            <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor" aria-hidden="true">
              <rect x="0"    y="8"  width="3" height="4"  rx="0.6" />
              <rect x="4.5"  y="5"  width="3" height="7"  rx="0.6" />
              <rect x="9"    y="2"  width="3" height="10" rx="0.6" />
              <rect x="13.5" y="0"  width="3" height="12" rx="0.6" />
            </svg>
            {/* WiFi */}
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <path d="M1 4.2C3.7 1.6 6.8 0.5 8 0.5s4.3 1.1 7 3.7"/>
              <path d="M3.2 6.8C5 5.1 6.6 4.2 8 4.2s3 .9 4.8 2.6"/>
              <path d="M5.6 9.4C6.5 8.6 7.3 8.2 8 8.2s1.5.4 2.4 1.2"/>
              <circle cx="8" cy="11.4" r="0.9" fill="currentColor" stroke="none"/>
            </svg>
            {/* Battery */}
            <svg width="26" height="12" viewBox="0 0 26 12" fill="currentColor" aria-hidden="true">
              <rect x="0.5" y="1" width="21" height="10" rx="2.5" stroke="currentColor" strokeWidth="1" fill="none"/>
              <rect x="2" y="2.5" width="16" height="7" rx="1.5"/>
              <path d="M23 4v4c1.1-.4 1.8-1.1 1.8-2s-.7-1.6-1.8-2z"/>
            </svg>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="iphone-content">
          {children}
        </div>

        {/* Home indicator */}
        <div className="iphone-home" />
      </div>
    </div>
  );
}
