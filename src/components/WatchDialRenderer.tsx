import React from 'react';
import { WatchProduct } from '../types';

interface WatchDialRendererProps {
  product: WatchProduct;
  className?: string;
}

export const WatchDialRenderer: React.FC<WatchDialRendererProps> = ({ product, className = 'w-full h-full' }) => {
  const isGShock = product.series === 'Casio G-Shock';
  const isVintage = product.series === 'Casio Vintage';
  const isEdifice = product.series === 'Casio Edifice';
  const isLTP = product.series === 'Casio LTP';
  const isProTrek = product.series === 'Casio ProTrek';
  const isTiffany = product.name.toLowerCase().includes('tiffany') || product.name.toLowerCase().includes('turquoise');
  const isGreen = product.name.toLowerCase().includes('green') || product.name.toLowerCase().includes('emerald') || product.name.toLowerCase().includes('mint');
  const isBlue = product.name.toLowerCase().includes('blue') || product.name.toLowerCase().includes('navy') || product.name.toLowerCase().includes('ice');
  const isGold = product.name.toLowerCase().includes('gold') || product.name.toLowerCase().includes('champagne');
  const isSalmon = product.name.toLowerCase().includes('salmon') || product.name.toLowerCase().includes('coral') || product.name.toLowerCase().includes('rose');

  // Dial color gradient setup
  let dialFill = '#111827';
  let dialAccent = '#374151';
  let caseColor = '#e2e8f0';
  let bezelColor = '#cbd5e1';
  let textColor = '#ffffff';

  if (isTiffany) {
    dialFill = '#38bdf8';
    dialAccent = '#0ea5e9';
    textColor = '#0f172a';
  } else if (isGreen) {
    dialFill = '#065f46';
    dialAccent = '#047857';
  } else if (isBlue) {
    dialFill = '#1e3a8a';
    dialAccent = '#2563eb';
  } else if (isGold) {
    dialFill = '#fef08a';
    dialAccent = '#eab308';
    caseColor = '#fbbf24';
    bezelColor = '#d97706';
    textColor = '#78350f';
  } else if (isSalmon) {
    dialFill = '#fbcfe8';
    dialAccent = '#f472b6';
    textColor = '#831843';
  } else if (product.name.toLowerCase().includes('white') || product.name.toLowerCase().includes('silver')) {
    dialFill = '#f8fafc';
    dialAccent = '#e2e8f0';
    textColor = '#0f172a';
  }

  if (isGShock) {
    caseColor = '#1e293b';
    bezelColor = '#0f172a';
  }

  // Rectangular Tank for LTP-V007
  if (product.model.includes('V007')) {
    return (
      <svg viewBox="0 0 200 240" className={className} xmlns="http://www.w3.org/2000/svg">
        {/* Metal Bracelet Top & Bottom */}
        <rect x="70" y="0" width="60" height="40" rx="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="70" y1="12" x2="130" y2="12" stroke="#94a3b8" strokeWidth="1" />
        <line x1="70" y1="24" x2="130" y2="24" stroke="#94a3b8" strokeWidth="1" />
        
        <rect x="70" y="200" width="60" height="40" rx="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="70" y1="212" x2="130" y2="212" stroke="#94a3b8" strokeWidth="1" />
        <line x1="70" y1="224" x2="130" y2="224" stroke="#94a3b8" strokeWidth="1" />

        {/* Polished Rectangular Tank Case */}
        <rect x="52" y="35" width="96" height="170" rx="8" fill={isGold ? '#f59e0b' : '#f1f5f9'} stroke={isGold ? '#b45309' : '#94a3b8'} strokeWidth="3" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))" />
        {/* Crown */}
        <circle cx="152" cy="120" r="4.5" fill={isGold ? '#b45309' : '#0284c7'} />
        {/* White Dial */}
        <rect x="64" y="47" width="72" height="146" rx="4" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
        {/* Brand */}
        <text x="100" y="75" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#0f172a" letterSpacing="1">CASIO</text>
        <text x="100" y="85" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="6" textAnchor="middle" fill="#64748b">QUARTZ</text>
        {/* Roman Numerals */}
        <text x="100" y="62" fontFamily="serif" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#1e293b">XII</text>
        <text x="100" y="182" fontFamily="serif" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#1e293b">VI</text>
        <text x="130" y="123" fontFamily="serif" fontSize="7" fontWeight="bold" textAnchor="middle" fill="#1e293b">III</text>
        <text x="70" y="123" fontFamily="serif" fontSize="7" fontWeight="bold" textAnchor="middle" fill="#1e293b">IX</text>
        {/* Blued Hands */}
        <line x1="100" y1="120" x2="100" y2="92" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" />
        <line x1="100" y1="120" x2="120" y2="120" stroke="#1d4ed8" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="100" cy="120" r="2.5" fill="#1e293b" />
        {/* Model Subtitle */}
        <text x="100" y="165" fontFamily="monospace" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#94a3b8">{product.model}</text>
      </svg>
    );
  }

  // Vintage Digital (A168, F-91W, CA-53W, AE-1200)
  if (isVintage) {
    const isGoldVintage = isGold || product.model.includes('WG') || product.model.includes('WGA');
    return (
      <svg viewBox="0 0 200 240" className={className} xmlns="http://www.w3.org/2000/svg">
        {/* Bracelet Top & Bottom */}
        <rect x="65" y="0" width="70" height="45" rx="3" fill={isGoldVintage ? '#fde047' : '#cbd5e1'} stroke={isGoldVintage ? '#ca8a04' : '#94a3b8'} strokeWidth="1.5" />
        <line x1="65" y1="15" x2="135" y2="15" stroke={isGoldVintage ? '#ca8a04' : '#94a3b8'} strokeWidth="1" />
        <line x1="65" y1="30" x2="135" y2="30" stroke={isGoldVintage ? '#ca8a04' : '#94a3b8'} strokeWidth="1" />
        
        <rect x="65" y="195" width="70" height="45" rx="3" fill={isGoldVintage ? '#fde047' : '#cbd5e1'} stroke={isGoldVintage ? '#ca8a04' : '#94a3b8'} strokeWidth="1.5" />
        <line x1="65" y1="210" x2="135" y2="210" stroke={isGoldVintage ? '#ca8a04' : '#94a3b8'} strokeWidth="1" />
        <line x1="65" y1="225" x2="135" y2="225" stroke={isGoldVintage ? '#ca8a04' : '#94a3b8'} strokeWidth="1" />

        {/* Vintage Case */}
        <rect x="42" y="38" width="116" height="164" rx="14" fill={isGoldVintage ? '#eab308' : '#e2e8f0'} stroke={isGoldVintage ? '#a16207' : '#94a3b8'} strokeWidth="3" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))" />
        {/* Bezel Face */}
        <rect x="52" y="48" width="96" height="144" rx="8" fill={isGoldVintage ? '#713f12' : '#0f172a'} />
        {/* Border Graphic Lines */}
        <rect x="56" y="52" width="88" height="136" rx="6" fill="none" stroke={isGoldVintage ? '#eab308' : '#38bdf8'} strokeWidth="1" />
        {/* Brand & Illuminator text */}
        <text x="100" y="68" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#ffffff" letterSpacing="1">CASIO</text>
        <text x="100" y="80" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="6.5" fontWeight="bold" textAnchor="middle" fill={isGoldVintage ? '#facc15' : '#38bdf8'}>ILLUMINATOR</text>
        {/* Digital LCD Window */}
        <rect x="60" y="90" width="80" height="52" rx="4" fill="#a7f3d0" stroke="#059669" strokeWidth="1.5" />
        <text x="66" y="103" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="7" fontWeight="bold" fill="#065f46">24H</text>
        <text x="134" y="103" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="7" fontWeight="bold" textAnchor="end" fill="#065f46">PM 10:58</text>
        <text x="100" y="130" fontFamily="'JetBrains Mono', monospace" fontSize="20" fontWeight="bold" textAnchor="middle" fill="#064e3b" letterSpacing="-1">10:58</text>
        <text x="127" y="123" fontFamily="'JetBrains Mono', monospace" fontSize="10" fontWeight="bold" fill="#064e3b">50</text>
        {/* Water Resist & Model */}
        <text x="100" y="158" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#f87171">WATER RESIST</text>
        <text x="100" y="174" fontFamily="monospace" fontSize="7" fontWeight="bold" textAnchor="middle" fill="#e2e8f0">{product.model}</text>
      </svg>
    );
  }

  // Round Casio Dial (MTP, Edifice, G-Shock Octagon, ProTrek)
  return (
    <svg viewBox="0 0 200 240" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Bracelet Top & Bottom */}
      <rect x="70" y="0" width="60" height="42" rx="2" fill={caseColor} stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="70" y1="14" x2="130" y2="14" stroke="#94a3b8" strokeWidth="1" />
      <line x1="70" y1="28" x2="130" y2="28" stroke="#94a3b8" strokeWidth="1" />
      
      <rect x="70" y="198" width="60" height="42" rx="2" fill={caseColor} stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="70" y1="212" x2="130" y2="212" stroke="#94a3b8" strokeWidth="1" />
      <line x1="70" y1="226" x2="130" y2="226" stroke="#94a3b8" strokeWidth="1" />

      {/* Outer Case */}
      {isGShock ? (
        /* Octagonal CasiOak Bezel */
        <polygon 
          points="70,42 130,42 165,77 165,163 130,198 70,198 35,163 35,77" 
          fill="#1e293b" 
          stroke="#0f172a" 
          strokeWidth="4" 
          filter="drop-shadow(0 6px 8px rgba(0,0,0,0.15))" 
        />
      ) : (
        /* Classic Round Case with Fluting / Tachymeter */
        <circle 
          cx="100" 
          cy="120" 
          r="78" 
          fill={caseColor} 
          stroke={bezelColor} 
          strokeWidth="3.5" 
          filter="drop-shadow(0 6px 8px rgba(0,0,0,0.12))" 
        />
      )}

      {/* Fluted Ring / Bezel Accent */}
      <circle cx="100" cy="120" r="70" fill={bezelColor} stroke="#94a3b8" strokeWidth="1" />

      {/* Main Watch Dial */}
      <circle cx="100" cy="120" r="64" fill={dialFill} />
      {/* Sunburst radial shine */}
      <ellipse cx="100" cy="100" rx="45" ry="30" fill={dialAccent} opacity="0.4" />

      {/* Casio Brand Logo */}
      <text x="100" y="90" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" fill={textColor} letterSpacing="1">CASIO</text>
      {isEdifice && (
        <text x="100" y="99" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#38bdf8" letterSpacing="0.5">EDIFICE</text>
      )}
      {isGShock && (
        <text x="100" y="99" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="6.5" fontWeight="extrabold" textAnchor="middle" fill="#ef4444" letterSpacing="1">G-SHOCK</text>
      )}

      {/* Hour Markers */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
        const isQuarter = deg % 90 === 0;
        return (
          <line
            key={deg}
            x1="100"
            y1={isQuarter ? "60" : "62"}
            x2="100"
            y2="68"
            stroke={deg === 0 ? '#ef4444' : (textColor === '#ffffff' ? '#ffffff' : '#0f172a')}
            strokeWidth={isQuarter ? "3" : "1.8"}
            strokeLinecap="round"
            transform={`rotate(${deg} 100 120)`}
          />
        );
      })}

      {/* Date Window at 3 o'clock */}
      <rect x="135" y="112" width="20" height="15" rx="2" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
      <text x="145" y="123" fontFamily="'JetBrains Mono', monospace" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#0f172a">27</text>

      {/* Subdials for Edifice / Multi-Dial */}
      {isEdifice && (
        <>
          <circle cx="100" cy="140" r="14" fill="none" stroke="#64748b" strokeWidth="1" />
          <circle cx="82" cy="120" r="10" fill="none" stroke="#64748b" strokeWidth="1" />
          <circle cx="118" cy="120" r="10" fill="none" stroke="#64748b" strokeWidth="1" />
        </>
      )}

      {/* Watch Hands */}
      {/* Hour Hand */}
      <line x1="100" y1="120" x2="100" y2="82" stroke={textColor === '#ffffff' ? '#ffffff' : '#0f172a'} strokeWidth="3.5" strokeLinecap="round" />
      {/* Minute Hand */}
      <line x1="100" y1="120" x2="135" y2="100" stroke={textColor === '#ffffff' ? '#ffffff' : '#0f172a'} strokeWidth="2.5" strokeLinecap="round" />
      {/* Second Hand (Red / Gold) */}
      <line x1="95" y1="125" x2="115" y2="105" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" />
      {/* Center Pin */}
      <circle cx="100" cy="120" r="3.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />

      {/* Model Number at bottom */}
      <text x="100" y="152" fontFamily="monospace" fontSize="6.5" fontWeight="bold" textAnchor="middle" fill={textColor} opacity="0.85">
        {product.model}
      </text>
      <text x="100" y="161" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="5" fontWeight="bold" textAnchor="middle" fill={textColor} opacity="0.7">
        {product.specs.waterResistance.toUpperCase()}
      </text>

      {/* Crown */}
      <rect x="178" y="113" width="7" height="14" rx="2" fill={caseColor} stroke="#94a3b8" strokeWidth="1" />
    </svg>
  );
};
