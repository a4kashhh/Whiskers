'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, Check } from 'lucide-react';
import { PET_THEMES } from '@/lib/theme-engine/themes';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePetStore } from '@/stores/usePetStore';
import { useToast } from '@/components/ui/ToastProvider';
import { ParticleCanvas } from '@/components/theme/ParticleCanvas';
import type { PetSpecies, PersonalityTrait } from '@/types';

const PERSONALITIES: { trait: PersonalityTrait; label: string; emoji: string; description: string }[] = [
  { trait: 'energetic', label: 'Energetic', emoji: '⚡', description: 'Always ready to play and explore' },
  { trait: 'lazy', label: 'Laid-back', emoji: '😴', description: 'Chill and relaxed, loves napping' },
  { trait: 'curious', label: 'Curious', emoji: '🔍', description: 'Always investigating new things' },
  { trait: 'intelligent', label: 'Intelligent', emoji: '🧠', description: 'Quick learner, solves puzzles fast' },
  { trait: 'loyal', label: 'Loyal', emoji: '💝', description: 'Deeply bonded and always by your side' },
  { trait: 'mischievous', label: 'Mischievous', emoji: '😈', description: 'Loves pranks and surprises' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const createAndAdoptPet = usePetStore((s) => s.createAndAdoptPet);
  const { success, error: showError } = useToast();

  const [step, setStep] = useState(0);
  const [selectedSpecies, setSelectedSpecies] = useState<PetSpecies>('cat');
  const [petName, setPetName] = useState('');
  const [selectedPersonality, setSelectedPersonality] = useState<PersonalityTrait>('curious');
  const [adopting, setAdopting] = useState(false);
  const [previewSpecies, setPreviewSpecies] = useState<PetSpecies>('cat');

  const steps = ['Choose Your Pet', 'Name Them', 'Their Personality', 'Welcome Home!'];

  const handleAdopt = useCallback(async () => {
    if (!user) return;
    if (!petName.trim()) {
      showError('Name required', 'Please give your pet a name!');
      return;
    }
    setAdopting(true);
    try {
      const petId = await createAndAdoptPet(user.uid, selectedSpecies, petName.trim(), selectedPersonality);
      success(`${petName} has been adopted! 🎉`, 'Your universe is now alive!');
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (e) {
      showError('Adoption failed', 'Please try again');
      setAdopting(false);
    }
  }, [user, petName, selectedSpecies, selectedPersonality, createAndAdoptPet, success, showError, router]);

  const selectedTheme = PET_THEMES[selectedSpecies];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${selectedTheme.bgGradientFrom}, ${selectedTheme.bgGradientTo})`,
        transition: 'background 0.8s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <ParticleCanvas species={previewSpecies} count={15} />

      {/* Progress Bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'rgba(255,255,255,0.08)',
          zIndex: 100,
        }}
      >
        <motion.div
          animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.5 }}
          style={{
            height: '100%',
            background: `linear-gradient(90deg, ${selectedTheme.primaryColor}, ${selectedTheme.accentColor})`,
            boxShadow: `0 0 10px ${selectedTheme.glowColor}`,
          }}
        />
      </div>

      {/* Step Indicator */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, zIndex: 10 }}>
        {steps.map((s, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: i <= step
                  ? `linear-gradient(135deg, ${selectedTheme.primaryColor}, ${selectedTheme.accentColor})`
                  : 'rgba(255,255,255,0.1)',
                fontSize: 12,
                fontWeight: 700,
                color: 'white',
                transition: 'all 0.3s ease',
                boxShadow: i <= step ? `0 0 10px ${selectedTheme.glowColor}` : 'none',
              }}
            >
              {i < step ? <Check size={12} /> : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div
                style={{
                  width: 40,
                  height: 2,
                  background: i < step ? selectedTheme.primaryColor : 'rgba(255,255,255,0.1)',
                  transition: 'background 0.3s ease',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ width: '100%', maxWidth: 720, position: 'relative', zIndex: 10 }}>
        <AnimatePresence mode="wait">

          {/* Step 0: Choose Species */}
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
            >
              <h1
                style={{
                  textAlign: 'center',
                  fontSize: 36,
                  fontWeight: 800,
                  color: selectedTheme.textPrimary,
                  marginBottom: 8,
                  letterSpacing: '-0.5px',
                }}
              >
                Choose Your Companion
              </h1>
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: 32, fontSize: 15 }}>
                Each pet transforms your entire universe
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 16,
                }}
              >
                {Object.values(PET_THEMES).map((theme) => (
                  <motion.button
                    key={theme.species}
                    whileHover={{ scale: 1.04, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedSpecies(theme.species);
                      setPreviewSpecies(theme.species);
                    }}
                    onMouseEnter={() => setPreviewSpecies(theme.species)}
                    onMouseLeave={() => setPreviewSpecies(selectedSpecies)}
                    style={{
                      background: selectedSpecies === theme.species
                        ? `linear-gradient(135deg, ${theme.primaryColor}30, ${theme.accentColor}20)`
                        : 'rgba(255,255,255,0.04)',
                      border: selectedSpecies === theme.species
                        ? `2px solid ${theme.primaryColor}`
                        : '2px solid rgba(255,255,255,0.06)',
                      borderRadius: 20,
                      padding: '20px 16px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      boxShadow: selectedSpecies === theme.species
                        ? `0 0 24px ${theme.glowColor}`
                        : 'none',
                    }}
                  >
                    <div style={{ fontSize: 48, marginBottom: 8 }}>{theme.emoji}</div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: selectedSpecies === theme.species ? theme.primaryColor : 'rgba(255,255,255,0.8)', marginBottom: 4 }}>
                      {theme.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>
                      {theme.description}
                    </div>
                  </motion.button>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: 32 }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(1)}
                  className="btn-primary"
                  style={{ padding: '14px 48px', fontSize: 16, display: 'inline-flex', alignItems: 'center', gap: 8 }}
                >
                  Continue <ChevronRight size={18} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 1: Name */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
            >
              <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ fontSize: 80, marginBottom: 16 }}
                >
                  {selectedTheme.emoji}
                </motion.div>
                <h1 style={{ fontSize: 36, fontWeight: 800, color: selectedTheme.textPrimary, marginBottom: 8 }}>
                  What's their name?
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>
                  Give your {selectedTheme.name} a special name
                </p>
              </div>
              <div style={{ maxWidth: 400, margin: '0 auto' }}>
                <input
                  id="pet-name-input"
                  type="text"
                  placeholder={`Name your ${selectedTheme.name}...`}
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="input-glass"
                  maxLength={20}
                  style={{ textAlign: 'center', fontSize: 22, fontWeight: 600, height: 64 }}
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && petName.trim() && setStep(2)}
                />
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button onClick={() => setStep(0)} className="btn-ghost" style={{ flex: 1 }}>
                    <ChevronLeft size={16} style={{ display: 'inline', marginRight: 4 }} /> Back
                  </button>
                  <motion.button
                    onClick={() => petName.trim() && setStep(2)}
                    disabled={!petName.trim()}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary"
                    style={{ flex: 2 }}
                  >
                    {petName.trim() ? `Yes, ${petName}!` : 'Enter a name'} <ChevronRight size={16} style={{ display: 'inline', marginLeft: 4 }} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Personality */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
            >
              <h1 style={{ textAlign: 'center', fontSize: 36, fontWeight: 800, color: selectedTheme.textPrimary, marginBottom: 8 }}>
                {petName}'s Personality
              </h1>
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: 32, fontSize: 15 }}>
                This shapes how they interact with you
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {PERSONALITIES.map((p) => (
                  <motion.button
                    key={p.trait}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPersonality(p.trait)}
                    style={{
                      background: selectedPersonality === p.trait
                        ? `linear-gradient(135deg, ${selectedTheme.primaryColor}25, ${selectedTheme.accentColor}15)`
                        : 'rgba(255,255,255,0.04)',
                      border: selectedPersonality === p.trait
                        ? `2px solid ${selectedTheme.primaryColor}`
                        : '2px solid rgba(255,255,255,0.06)',
                      borderRadius: 16,
                      padding: '16px 20px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      transition: 'all 0.2s ease',
                      boxShadow: selectedPersonality === p.trait ? `0 0 16px ${selectedTheme.glowColor}` : 'none',
                    }}
                  >
                    <span style={{ fontSize: 28, flexShrink: 0 }}>{p.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: selectedPersonality === p.trait ? selectedTheme.primaryColor : 'rgba(255,255,255,0.9)', marginBottom: 2 }}>
                        {p.label}
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                        {p.description}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
                <button onClick={() => setStep(1)} className="btn-ghost" style={{ flex: 1 }}>
                  <ChevronLeft size={16} style={{ display: 'inline', marginRight: 4 }} /> Back
                </button>
                <motion.button
                  onClick={() => setStep(3)}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary"
                  style={{ flex: 2 }}
                >
                  Perfect! <ChevronRight size={16} style={{ display: 'inline', marginLeft: 4 }} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirm Adoption */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, type: 'spring' }}
              style={{ textAlign: 'center' }}
            >
              <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ fontSize: 100, marginBottom: 24 }}
              >
                {selectedTheme.emoji}
              </motion.div>
              <h1 style={{ fontSize: 40, fontWeight: 800, color: selectedTheme.textPrimary, marginBottom: 8 }}>
                Meet {petName}!
              </h1>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
                <span className="badge badge-primary">{selectedTheme.name}</span>
                <span className="badge badge-outline">{selectedPersonality}</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, marginBottom: 40, maxWidth: 400, margin: '0 auto 40px' }}>
                {petName} is ready to enter your universe. They can't wait to meet you!
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button onClick={() => setStep(2)} className="btn-ghost">
                  <ChevronLeft size={16} style={{ display: 'inline', marginRight: 4 }} /> Back
                </button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAdopt}
                  disabled={adopting}
                  className="btn-primary"
                  style={{ padding: '14px 40px', fontSize: 16, display: 'inline-flex', alignItems: 'center', gap: 8 }}
                >
                  {adopting ? (
                    <>Creating universe... ✨</>
                  ) : (
                    <><Sparkles size={18} /> Adopt {petName}!</>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
