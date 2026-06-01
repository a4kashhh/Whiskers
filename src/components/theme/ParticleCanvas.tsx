'use client';

import { useEffect, useRef } from 'react';
import type { PetSpecies } from '@/types';

interface Particle {
  x: number;
  y: number;
  vy: number;
  vx: number;
  size: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  emoji: string;
}

const PARTICLES: Record<PetSpecies, string[]> = {
  cat: ['🐾', '🧶', '✨', '💜', '🌙'],
  dog: ['🦴', '⭐', '🐾', '🧡', '✨'],
  panda: ['🎋', '🌿', '⬛', '⬜', '🍃'],
  fox: ['🍂', '🍁', '🌿', '✨', '🧡'],
  dragon: ['🔥', '⚡', '✨', '💎', '🌟'],
  bunny: ['🌸', '🌺', '💗', '⭐', '🌙'],
};

interface ParticleCanvasProps {
  species: PetSpecies;
  count?: number;
}

export function ParticleCanvas({ species, count = 20 }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const emojis = PARTICLES[species];
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vy: -(0.3 + Math.random() * 0.8),
      vx: (Math.random() - 0.5) * 0.5,
      size: 12 + Math.random() * 16,
      opacity: 0.4 + Math.random() * 0.5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.5,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    particlesRef.current = particles;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.font = `${p.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.emoji, 0, 0);
        ctx.restore();

        // Update position
        p.y += p.vy;
        p.x += p.vx;
        p.rotation += p.rotationSpeed;

        // Wrap around
        if (p.y < -40) {
          p.y = canvas.height + 20;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -40) p.x = canvas.width + 20;
        if (p.x > canvas.width + 40) p.x = -20;
      }

      animFrameRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [species, count]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.6,
      }}
    />
  );
}
