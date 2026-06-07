'use client';

import { motion } from 'framer-motion';

/* ── SVG animal shapes ─────────────────────────────────
   Clean geometric silhouettes — no emoji, real SVG paths
───────────────────────────────────────────────────────── */

function CatSVG({ size = 200, opacity = 0.06, color = '#f97316' }: {
  size?: number; opacity?: number; color?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{ opacity }}>
      {/* Body */}
      <ellipse cx="50" cy="72" rx="26" ry="22" fill={color} />
      {/* Head */}
      <ellipse cx="50" cy="42" rx="20" ry="18" fill={color} />
      {/* Left ear */}
      <polygon points="32,28 28,12 42,24" fill={color} />
      {/* Right ear */}
      <polygon points="68,28 72,12 58,24" fill={color} />
      {/* Inner left ear */}
      <polygon points="33,26 30,16 40,24" fill="rgba(0,0,0,0.2)" />
      {/* Inner right ear */}
      <polygon points="67,26 70,16 60,24" fill="rgba(0,0,0,0.2)" />
      {/* Eyes */}
      <ellipse cx="43" cy="40" rx="3.5" ry="4" fill="rgba(0,0,0,0.35)" />
      <ellipse cx="57" cy="40" rx="3.5" ry="4" fill="rgba(0,0,0,0.35)" />
      {/* Nose */}
      <ellipse cx="50" cy="47" rx="2" ry="1.5" fill="rgba(0,0,0,0.25)" />
      {/* Whiskers left */}
      <line x1="50" y1="47" x2="28" y2="44" stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" />
      <line x1="50" y1="47" x2="28" y2="48" stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" />
      {/* Whiskers right */}
      <line x1="50" y1="47" x2="72" y2="44" stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" />
      <line x1="50" y1="47" x2="72" y2="48" stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" />
      {/* Tail */}
      <path d="M76,68 Q92,60 88,48 Q84,38 78,42" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Paws */}
      <ellipse cx="38" cy="91" rx="8" ry="5" fill={color} />
      <ellipse cx="62" cy="91" rx="8" ry="5" fill={color} />
    </svg>
  );
}

function DogSVG({ size = 200, opacity = 0.06, color = '#fbbf24' }: {
  size?: number; opacity?: number; color?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{ opacity }}>
      {/* Body */}
      <ellipse cx="50" cy="72" rx="27" ry="21" fill={color} />
      {/* Head */}
      <ellipse cx="50" cy="43" rx="22" ry="19" fill={color} />
      {/* Floppy left ear */}
      <path d="M30,32 Q18,28 16,46 Q15,56 26,58 Q32,55 32,46 Z" fill={color} style={{ filter: 'brightness(0.85)' }} />
      {/* Floppy right ear */}
      <path d="M70,32 Q82,28 84,46 Q85,56 74,58 Q68,55 68,46 Z" fill={color} style={{ filter: 'brightness(0.85)' }} />
      {/* Eyes */}
      <circle cx="43" cy="41" r="4" fill="rgba(0,0,0,0.35)" />
      <circle cx="57" cy="41" r="4" fill="rgba(0,0,0,0.35)" />
      {/* Eye shine */}
      <circle cx="44.5" cy="39.5" r="1.2" fill="rgba(255,255,255,0.6)" />
      <circle cx="58.5" cy="39.5" r="1.2" fill="rgba(255,255,255,0.6)" />
      {/* Snout */}
      <ellipse cx="50" cy="52" rx="8" ry="6" fill="rgba(0,0,0,0.15)" />
      {/* Nose */}
      <ellipse cx="50" cy="49" rx="4" ry="3" fill="rgba(0,0,0,0.35)" />
      {/* Mouth */}
      <path d="M46,54 Q50,58 54,54" stroke="rgba(0,0,0,0.25)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Tail */}
      <path d="M77,65 Q94,55 91,42 Q88,34 82,38" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* Paws */}
      <ellipse cx="38" cy="91" rx="9" ry="5.5" fill={color} />
      <ellipse cx="62" cy="91" rx="9" ry="5.5" fill={color} />
      {/* Paw toes left */}
      <circle cx="33" cy="90" r="2" fill="rgba(0,0,0,0.12)" />
      <circle cx="38" cy="88" r="2" fill="rgba(0,0,0,0.12)" />
      <circle cx="43" cy="90" r="2" fill="rgba(0,0,0,0.12)" />
    </svg>
  );
}

function PawPrintSVG({ size = 80, opacity = 0.05, color = '#f97316' }: {
  size?: number; opacity?: number; color?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill={color} style={{ opacity }}>
      {/* Main pad */}
      <ellipse cx="50" cy="65" rx="22" ry="18" />
      {/* Toe pads */}
      <ellipse cx="28" cy="42" rx="10" ry="12" />
      <ellipse cx="44" cy="35" rx="10" ry="12" />
      <ellipse cx="60" cy="35" rx="10" ry="12" />
      <ellipse cx="74" cy="42" rx="10" ry="12" />
    </svg>
  );
}

/* ── Positioned animals ─────────────────────────────── */
const ANIMALS = [
  { Component: CatSVG,      size: 220, opacity: 0.055, color: '#f97316', x: '-2%',  y: '8%',  duration: 14, delay: 0   },
  { Component: DogSVG,      size: 200, opacity: 0.05,  color: '#fbbf24', x: '78%', y: '5%',  duration: 18, delay: -4  },
  { Component: CatSVG,      size: 160, opacity: 0.04,  color: '#f43f5e', x: '82%', y: '60%', duration: 16, delay: -8  },
  { Component: DogSVG,      size: 180, opacity: 0.045, color: '#f97316', x: '-3%', y: '65%', duration: 20, delay: -5  },
  { Component: PawPrintSVG, size: 100, opacity: 0.06,  color: '#fbbf24', x: '42%', y: '3%',  duration: 22, delay: -10 },
  { Component: PawPrintSVG, size: 70,  opacity: 0.045, color: '#f43f5e', x: '88%', y: '38%', duration: 19, delay: -3  },
  { Component: PawPrintSVG, size: 80,  opacity: 0.05,  color: '#f97316', x: '6%',  y: '40%', duration: 17, delay: -7  },
];

export function AnimalBackground() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
    }}>
      {ANIMALS.map((a, i) => {
        const { Component, size, opacity, color, x, y, duration, delay } = a;
        return (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
            }}
            animate={{
              y: [0, -16, -6, 0],
              rotate: [0, 2, -1, 0],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Component size={size} opacity={opacity} color={color} />
          </motion.div>
        );
      })}
    </div>
  );
}
