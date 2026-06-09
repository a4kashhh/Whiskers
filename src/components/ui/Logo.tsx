import React from 'react';
import { motion } from 'framer-motion';

export function Logo({ size = 48, className = '' }: { size?: number, className?: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }} className={className}>
      {/* Cute Stylized Cat Logo SVG */}
      <motion.div
        whileHover={{ rotate: [0, -10, 10, -5, 5, 0], scale: 1.1 }}
        transition={{ duration: 0.5 }}
        style={{ width: size, height: size, cursor: 'pointer' }}
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          {/* Glowing Drop Shadow */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <g filter="url(#glow)">
            {/* Main Head Shape (Rounded Hexagon/Blob) */}
            <path 
              d="M 20 55 C 20 80, 40 90, 50 90 C 60 90, 80 80, 80 55 C 80 30, 70 25, 50 25 C 30 25, 20 30, 20 55 Z" 
              fill="var(--color-primary)" 
            />
            {/* Left Ear */}
            <path 
              d="M 22 45 L 15 15 L 40 30 Z" 
              fill="var(--color-primary)" 
              stroke="var(--color-primary)" 
              strokeWidth="2" 
              strokeLinejoin="round" 
            />
            {/* Right Ear */}
            <path 
              d="M 78 45 L 85 15 L 60 30 Z" 
              fill="var(--color-primary)" 
              stroke="var(--color-primary)" 
              strokeWidth="2" 
              strokeLinejoin="round" 
            />

            {/* Inner Left Ear */}
            <path d="M 24 38 L 22 22 L 35 32 Z" fill="#121212" opacity="0.3" />
            {/* Inner Right Ear */}
            <path d="M 76 38 L 78 22 L 65 32 Z" fill="#121212" opacity="0.3" />

            {/* Cute Big Eyes */}
            <circle cx="35" cy="55" r="7" fill="#121212" />
            <circle cx="65" cy="55" r="7" fill="#121212" />
            
            {/* Eye Highlights */}
            <circle cx="37" cy="53" r="2.5" fill="#FFFFFF" />
            <circle cx="67" cy="53" r="2.5" fill="#FFFFFF" />

            {/* Little Nose */}
            <path d="M 47 65 Q 50 68 53 65 Z" fill="#121212" />

            {/* Cat Mouth */}
            <path d="M 47 65 Q 43 70 50 72 Q 57 70 53 65" fill="none" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" />

            {/* Whiskers Left */}
            <path d="M 25 55 L 5 50" stroke="#121212" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            <path d="M 23 62 L 3 62" stroke="#121212" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            
            {/* Whiskers Right */}
            <path d="M 75 55 L 95 50" stroke="#121212" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            <path d="M 77 62 L 97 62" stroke="#121212" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          </g>
        </svg>
      </motion.div>
      <span className="serif-heading" style={{ fontSize: size * 0.8, letterSpacing: '0.5px', lineHeight: 1 }}>
        Whiskers
      </span>
    </div>
  );
}
