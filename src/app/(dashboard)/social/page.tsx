'use client';

import { motion } from 'framer-motion';
import { usePetStore } from '@/stores/usePetStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useGameStore } from '@/stores/useGameStore';
import { PetAvatar } from '@/components/pet/PetAvatar';
import { Share2, Trophy, Heart, Users } from 'lucide-react';

// Mock leaderboard data for demonstration
const MOCK_LEADERBOARD = [
  { name: 'StarGazer', petName: 'Luna', species: 'cat', level: 24, happiness: 95, streak: 45, emoji: '🐱' },
  { name: 'DragonMaster', petName: 'Inferno', species: 'dragon', level: 21, happiness: 88, streak: 32, emoji: '🐉' },
  { name: 'FoxTamer', petName: 'Rusty', species: 'fox', level: 18, happiness: 91, streak: 28, emoji: '🦊' },
  { name: 'PandaZen', petName: 'Bamboo', species: 'panda', level: 16, happiness: 78, streak: 21, emoji: '🐼' },
  { name: 'BunnyLove', petName: 'Fluffs', species: 'bunny', level: 14, happiness: 96, streak: 19, emoji: '🐰' },
];

export default function SocialPage() {
  const pet = usePetStore((s) => s.pet);
  const appUser = useAuthStore((s) => s.appUser);
  const { coins, streak } = useGameStore();

  function shareProfile() {
    if (navigator.share) {
      navigator.share({
        title: `${pet?.name}'s PetVerse Profile`,
        text: `Check out my Level ${pet?.level} ${pet?.species} named ${pet?.name} on PetVerse!`,
        url: window.location.origin,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/profile/${appUser?.uid}`);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>🌍 Social Universe</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Connect with other pet trainers</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20 }}>
        {/* Your Profile Card */}
        {pet && appUser && (
          <motion.div
            className="glass-card"
            style={{ padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PetAvatar pet={pet} size={90} interactive={false} />
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{pet.name}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Trainer: {appUser.displayName}</p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 10 }}>
                <span className="badge badge-primary">Lv.{pet.level}</span>
                <span className="badge badge-outline">{pet.species}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%' }}>
              {[
                { emoji: '😊', label: 'Happiness', value: pet.happiness },
                { emoji: '⭐', label: 'Level', value: pet.level },
                { emoji: '🔥', label: 'Streak', value: `${streak}d` },
                { emoji: '🪙', label: 'Coins', value: coins },
              ].map((stat) => (
                <div key={stat.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{stat.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>{stat.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={shareProfile}
              className="btn-primary"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <Share2 size={16} /> Share Profile
            </motion.button>
          </motion.div>
        )}

        {/* Leaderboard */}
        <motion.div
          className="glass-card"
          style={{ padding: 24 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <Trophy size={20} style={{ color: '#fbbf24' }} />
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Global Leaderboard</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {MOCK_LEADERBOARD.map((trainer, i) => (
              <motion.div
                key={trainer.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 16px',
                  background: i === 0 ? 'rgba(234,179,8,0.08)' : i === 1 ? 'rgba(156,163,175,0.06)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${i === 0 ? 'rgba(234,179,8,0.2)' : 'rgba(255,255,255,0.05)'}`,
                  borderRadius: 14,
                }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: i === 0 ? 'linear-gradient(135deg,#fbbf24,#f59e0b)' : i === 1 ? 'linear-gradient(135deg,#9ca3af,#6b7280)' : i === 2 ? 'linear-gradient(135deg,#fb923c,#f97316)' : 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 800,
                  color: 'white',
                  flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div style={{ fontSize: 28 }}>{trainer.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{trainer.petName}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>by {trainer.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 15 }}>Lv.{trainer.level}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>😊 {trainer.happiness}%</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ marginTop: 20, padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, textAlign: 'center', border: '1px dashed rgba(255,255,255,0.08)' }}>
            <Users size={24} style={{ color: 'var(--text-secondary)', marginBottom: 8 }} />
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Friend system & pet visits coming soon! 👀</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
