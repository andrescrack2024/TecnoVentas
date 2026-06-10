import React from "react";

export default function TvsPanel() {
  return (
    <svg 
      className="w-full h-full rounded-[26px] overflow-hidden" 
      viewBox="0 0 400 400" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* PCB Background Gradient */}
        <linearGradient id="pcbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e2e3d" />
          <stop offset="50%" stopColor="#15222d" />
          <stop offset="100%" stopColor="#0d161e" />
        </linearGradient>

        {/* CPU Green Gradients */}
        <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6ea724" />
          <stop offset="100%" stopColor="#2f490e" />
        </linearGradient>
        <linearGradient id="lightGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8ec540" />
          <stop offset="100%" stopColor="#5d921b" />
        </linearGradient>
        <linearGradient id="cpuPinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#78909c" />
        </linearGradient>

        {/* Gear Blue Gradients */}
        <linearGradient id="blueGearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#509cc8" />
          <stop offset="100%" stopColor="#255e82" />
        </linearGradient>
        <linearGradient id="recessedGearGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e3e54" />
          <stop offset="100%" stopColor="#0f222e" />
        </linearGradient>

        {/* Gold Gradients for TVS text and gold components */}
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe67e" />
          <stop offset="50%" stopColor="#dfb648" />
          <stop offset="100%" stopColor="#8a6100" />
        </linearGradient>

        {/* Solder Joints / Silver Gradients */}
        <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>

        {/* Glow and Shadows */}
        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="dropShadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="2" dy="6" stdDeviation="4" floodColor="#000000" floodOpacity="0.65" />
        </filter>
        <filter id="shadowGear" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="3" dy="8" stdDeviation="5" floodColor="#000000" floodOpacity="0.75" />
        </filter>

        {/* Reusable Gear Mesh definition */}
        <g id="gear-mesh">
          <circle cx="0" cy="0" r="46" />
          <rect x="-10" y="-58" width="20" height="116" rx="2" />
          <rect x="-10" y="-58" width="20" height="116" rx="2" transform="rotate(30)" />
          <rect x="-10" y="-58" width="20" height="116" rx="2" transform="rotate(60)" />
          <rect x="-10" y="-58" width="20" height="116" rx="2" transform="rotate(90)" />
          <rect x="-10" y="-58" width="20" height="116" rx="2" transform="rotate(120)" />
          <rect x="-10" y="-58" width="20" height="116" rx="2" transform="rotate(150)" />
        </g>
      </defs>

      {/* PCB Base Background */}
      <rect width="400" height="400" fill="url(#pcbGrad)" />

      {/* Grid Pattern / Sub-surface lines */}
      <g stroke="#ffffff" strokeOpacity="0.03" strokeWidth="1">
        <path d="M 0 40 L 400 40 M 0 80 L 400 80 M 0 120 L 400 120 M 0 160 L 400 160 M 0 200 L 400 200 M 0 240 L 400 240 M 0 280 L 400 280 M 0 320 L 400 320 M 0 360 L 400 360" />
        <path d="M 40 0 L 40 400 M 80 0 L 80 400 M 120 0 L 120 400 M 160 0 L 160 400 M 200 0 L 200 400 M 240 0 L 240 400 M 280 0 L 280 400 M 320 0 L 320 400 M 360 0 L 360 400" />
      </g>

      {/* PCB Circuit Tracks (Traces) - Glowing & Gold */}
      <g strokeWidth="2" strokeLinecap="round" fill="none">
        {/* Glowing cyan/green tracks (Active state) */}
        <path d="M 40 180 L 100 180 L 140 220" stroke="#4ade80" strokeOpacity="0.75" filter="url(#neonGlow)" />
        <path d="M 80 360 L 80 320 L 120 280" stroke="#4ade80" strokeOpacity="0.75" filter="url(#neonGlow)" />
        <path d="M 120 380 L 150 350 L 150 320" stroke="#22d3ee" strokeOpacity="0.75" filter="url(#neonGlow)" />
        <path d="M 280 380 L 280 330 L 220 270" stroke="#22d3ee" strokeOpacity="0.75" filter="url(#neonGlow)" />
        <path d="M 360 300 L 300 300 L 250 250" stroke="#4ade80" strokeOpacity="0.75" filter="url(#neonGlow)" />

        {/* Regular gold-plated copper tracks */}
        <path d="M 30 110 L 110 110 L 150 150" stroke="url(#goldGrad)" strokeOpacity="0.8" />
        <path d="M 70 50 L 120 50 L 180 110 L 180 170" stroke="url(#goldGrad)" strokeOpacity="0.8" />
        <path d="M 370 200 L 330 200 L 290 160" stroke="url(#goldGrad)" strokeOpacity="0.8" />
        <path d="M 220 50 L 250 80 L 250 110" stroke="url(#goldGrad)" strokeOpacity="0.8" />
        <path d="M 180 280 L 180 320 L 210 350" stroke="url(#goldGrad)" strokeOpacity="0.8" />
        <path d="M 330 70 L 330 100 M 350 70 L 350 110" stroke="url(#goldGrad)" strokeOpacity="0.8" />
      </g>

      {/* Solder Joints / Terminal Pads */}
      <g fill="url(#silverGrad)" stroke="#475569" strokeWidth="0.5">
        <circle cx="40" cy="180" r="3.5" />
        <circle cx="80" cy="360" r="3.5" />
        <circle cx="120" cy="380" r="3.5" />
        <circle cx="360" cy="300" r="3.5" />
        <circle cx="30" cy="110" r="3.5" />
        <circle cx="70" cy="50" r="3.5" />
        <circle cx="220" cy="50" r="3.5" />
        <circle cx="330" cy="70" r="3" />
        <circle cx="350" cy="70" r="3" />
        <circle cx="370" cy="200" r="3.5" />
      </g>

      {/* Top-Left Corner Microchip (SOP-8) */}
      <g transform="translate(65, 65) rotate(45)" filter="url(#dropShadow)">
        {/* Chip Body */}
        <rect x="-24" y="-16" width="48" height="32" rx="2" fill="#1b222b" stroke="#334155" strokeWidth="1" />
        {/* Pin marker (Notch) */}
        <circle cx="-18" cy="-10" r="2" fill="#0f172a" />
        <circle cx="-18" cy="-10" r="1" fill="#64748b" />
        {/* Pins */}
        <g fill="url(#silverGrad)">
          {/* Top pins */}
          <rect x="-18" y="-22" width="4" height="7" rx="0.5" />
          <rect x="-8" y="-22" width="4" height="7" rx="0.5" />
          <rect x="2" y="-22" width="4" height="7" rx="0.5" />
          <rect x="12" y="-22" width="4" height="7" rx="0.5" />
          {/* Bottom pins */}
          <rect x="-18" y="15" width="4" height="7" rx="0.5" />
          <rect x="-8" y="15" width="4" height="7" rx="0.5" />
          <rect x="2" y="15" width="4" height="7" rx="0.5" />
          <rect x="12" y="15" width="4" height="7" rx="0.5" />
        </g>
        {/* Gold Text or Symbol on Chip */}
        <text x="0" y="4" fill="#475569" fontSize="6" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle" letterSpacing="1">TVS-8</text>
      </g>

      {/* Bottom-Right Corner Microchip (QFN-16) */}
      <g transform="translate(340, 330) rotate(-15)" filter="url(#dropShadow)">
        <rect x="-20" y="-20" width="40" height="40" rx="3" fill="#1b222b" stroke="#334155" strokeWidth="1" />
        {/* Exposed center pad */}
        <rect x="-10" y="-10" width="20" height="20" rx="1" fill="#2d3748" stroke="#1a202c" strokeWidth="0.5" />
        {/* Pin contacts around edge */}
        <g fill="url(#silverGrad)">
          {/* Top */}
          <rect x="-15" y="-22" width="3" height="5" />
          <rect x="-7" y="-22" width="3" height="5" />
          <rect x="1" y="-22" width="3" height="5" />
          <rect x="9" y="-22" width="3" height="5" />
          {/* Bottom */}
          <rect x="-15" y="17" width="3" height="5" />
          <rect x="-7" y="17" width="3" height="5" />
          <rect x="1" y="17" width="3" height="5" />
          <rect x="9" y="17" width="3" height="5" />
          {/* Left */}
          <rect x="-22" y="-15" width="5" height="3" />
          <rect x="-22" y="-7" width="5" height="3" />
          <rect x="-22" y="1" width="5" height="3" />
          <rect x="-22" y="9" width="5" height="3" />
          {/* Right */}
          <rect x="17" y="-15" width="5" height="3" />
          <rect x="17" y="-7" width="5" height="3" />
          <rect x="17" y="1" width="5" height="3" />
          <rect x="17" y="9" width="5" height="3" />
        </g>
      </g>

      {/* Tiny capacitors & resistors scattered (Scream premium details) */}
      <g strokeWidth="0.5">
        {/* Cap 1 */}
        <g transform="translate(130, 80)">
          <rect x="-6" y="-3" width="12" height="6" rx="1" fill="#b45309" stroke="#78350f" />
          <rect x="-6" y="-3" width="3" height="6" fill="url(#silverGrad)" />
          <rect x="3" y="-3" width="3" height="6" fill="url(#silverGrad)" />
        </g>
        {/* Cap 2 */}
        <g transform="translate(290, 310) rotate(90)">
          <rect x="-6" y="-3" width="12" height="6" rx="1" fill="#b45309" stroke="#78350f" />
          <rect x="-6" y="-3" width="3" height="6" fill="url(#silverGrad)" />
          <rect x="3" y="-3" width="3" height="6" fill="url(#silverGrad)" />
        </g>
        {/* Resistor 1 */}
        <g transform="translate(90, 140) rotate(-45)">
          <rect x="-5" y="-2" width="10" height="4" rx="0.5" fill="#0f172a" stroke="#334155" />
          <rect x="-5" y="-2" width="2.5" height="4" fill="url(#silverGrad)" />
          <rect x="2.5" y="-2" width="2.5" height="4" fill="url(#silverGrad)" />
          <rect x="-1" y="-2" width="2" height="4" fill="#ef4444" /> {/* Red band */}
        </g>
      </g>

      {/* TVS GEAR ASSEMBLY (Top-Right) */}
      <g transform="translate(265, 145)" filter="url(#shadowGear)">
        {/* 3D Sides/Bevel Depth (stacked offsets to create extrusion) */}
        <g fill="url(#cpuPinGrad)" opacity="0.3">
          <use href="#gear-mesh" x="4" y="6" />
        </g>
        <g fill="#163950">
          <use href="#gear-mesh" x="3" y="5.5" />
          <use href="#gear-mesh" x="2.5" y="4.5" />
          <use href="#gear-mesh" x="2" y="3.5" />
          <use href="#gear-mesh" x="1.5" y="2.5" />
          <use href="#gear-mesh" x="1" y="1.5" />
          <use href="#gear-mesh" x="0.5" y="0.8" />
        </g>

        {/* Gear Top Face */}
        <use href="#gear-mesh" fill="url(#blueGearGrad)" stroke="#6ba9ce" strokeWidth="1.5" />

        {/* Inner Recessed Hole */}
        <circle cx="0" cy="0" r="33" fill="url(#recessedGearGrad)" stroke="#163950" strokeWidth="2.5" />
        {/* Subtle inner shadow effect */}
        <circle cx="0" cy="0" r="33" fill="none" stroke="#000000" strokeWidth="1.5" strokeOpacity="0.4" />

        {/* 3D "TVS" Text inside Gear */}
        <g transform="rotate(-10)">
          {/* 3D Extrusion Layers */}
          <text x="0.5" y="10.5" fill="#4d3500" fontSize="23" fontFamily="'Outfit', sans-serif" fontWeight="900" textAnchor="middle" letterSpacing="0.5">TVS</text>
          <text x="1" y="10" fill="#704e02" fontSize="23" fontFamily="'Outfit', sans-serif" fontWeight="900" textAnchor="middle" letterSpacing="0.5">TVS</text>
          <text x="1.5" y="9.5" fill="#8f6402" fontSize="23" fontFamily="'Outfit', sans-serif" fontWeight="900" textAnchor="middle" letterSpacing="0.5">TVS</text>
          <text x="2" y="9" fill="#aa7703" fontSize="23" fontFamily="'Outfit', sans-serif" fontWeight="900" textAnchor="middle" letterSpacing="0.5">TVS</text>
          
          {/* Main Gold Face */}
          <text x="0" y="8" fill="url(#goldGrad)" stroke="#fff1b0" strokeWidth="0.5" fontSize="23" fontFamily="'Outfit', sans-serif" fontWeight="900" textAnchor="middle" letterSpacing="0.5">TVS</text>
        </g>
      </g>

      {/* GREEN CPU / MICROCHIP (Bottom-Left) */}
      <g transform="translate(155, 245) rotate(45)" filter="url(#dropShadow)">
        
        {/* CPU Pins / Leads (Extending from body) */}
        <g fill="url(#cpuPinGrad)">
          {/* Top Pins */}
          <rect x="-38" y="-52" width="5" height="12" rx="1" />
          <rect x="-27" y="-52" width="5" height="12" rx="1" />
          <rect x="-16" y="-52" width="5" height="12" rx="1" />
          <rect x="-5" y="-52" width="5" height="12" rx="1" />
          <rect x="6" y="-52" width="5" height="12" rx="1" />
          <rect x="17" y="-52" width="5" height="12" rx="1" />
          <rect x="28" y="-52" width="5" height="12" rx="1" />
          <rect x="39" y="-52" width="5" height="12" rx="1" />

          {/* Bottom Pins */}
          <rect x="-38" y="40" width="5" height="12" rx="1" />
          <rect x="-27" y="40" width="5" height="12" rx="1" />
          <rect x="-16" y="40" width="5" height="12" rx="1" />
          <rect x="-5" y="40" width="5" height="12" rx="1" />
          <rect x="6" y="40" width="5" height="12" rx="1" />
          <rect x="17" y="40" width="5" height="12" rx="1" />
          <rect x="28" y="40" width="5" height="12" rx="1" />
          <rect x="39" y="40" width="5" height="12" rx="1" />

          {/* Left Pins */}
          <rect x="-52" y="-38" width="12" height="5" rx="1" />
          <rect x="-52" y="-27" width="12" height="5" rx="1" />
          <rect x="-52" y="-16" width="12" height="5" rx="1" />
          <rect x="-52" y="-5" width="12" height="5" rx="1" />
          <rect x="-52" y="6" width="12" height="5" rx="1" />
          <rect x="-52" y="17" width="12" height="5" rx="1" />
          <rect x="-52" y="28" width="12" height="5" rx="1" />
          <rect x="-52" y="39" width="12" height="5" rx="1" />

          {/* Right Pins */}
          <rect x="40" y="-38" width="12" height="5" rx="1" />
          <rect x="40" y="-27" width="12" height="5" rx="1" />
          <rect x="40" y="-16" width="12" height="5" rx="1" />
          <rect x="40" y="-5" width="12" height="5" rx="1" />
          <rect x="40" y="6" width="12" height="5" rx="1" />
          <rect x="40" y="17" width="12" height="5" rx="1" />
          <rect x="40" y="28" width="12" height="5" rx="1" />
          <rect x="40" y="39" width="12" height="5" rx="1" />
        </g>

        {/* CPU Base Package (Green) */}
        <rect x="-44" y="-44" width="88" height="88" rx="10" fill="url(#greenGrad)" stroke="#74b524" strokeWidth="2.5" />

        {/* Highlight inner bevel border */}
        <rect x="-41.5" y="-41.5" width="83" height="83" rx="7.5" fill="none" stroke="#a4e444" strokeWidth="1" strokeOpacity="0.4" />

        {/* CPU Cap / Die (Lighter Raised Green Square) */}
        <rect x="-28" y="-28" width="56" height="56" rx="8" fill="url(#lightGreenGrad)" stroke="#a4e444" strokeWidth="1.5" />
        <rect x="-26.5" y="-26.5" width="53" height="53" rx="6.5" fill="none" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.25" />

        {/* Center core / silicon block (Dark Green inset) */}
        <rect x="-16" y="-16" width="32" height="32" rx="4" fill="#1b2f06" stroke="#416713" strokeWidth="1.5" />

        {/* Gold Core Connections / Lines */}
        <g stroke="url(#goldGrad)" strokeWidth="1.5" fill="none">
          <path d="M -8 -8 L -4 -4 M 8 -8 L 4 -4 M -8 8 L -4 4 M 8 8 L 4 4" />
          <circle cx="0" cy="0" r="3.5" fill="url(#goldGrad)" stroke="none" />
        </g>
      </g>
    </svg>
  );
}
