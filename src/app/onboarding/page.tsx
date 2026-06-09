'use client';

import { useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, Check, Loader2 } from 'lucide-react';
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

const SPRITE_TO_SPECIES: Record<string, PetSpecies> = {
  kebo: 'cat',
  boba: 'dog',
  'pixel-panda': 'panda',
  'noir-webling': 'fox',
  cosmo: 'dragon',
  scoop: 'bunny',
  cat: 'cat',
  dog: 'dog',
  panda: 'panda',
  fox: 'fox',
  dragon: 'dragon',
  bunny: 'bunny',
};

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const petParam = searchParams.get('pet');
  const initialSpecies = (petParam && SPRITE_TO_SPECIES[petParam.toLowerCase()]) || 'cat';

  const user = useAuthStore((s) => s.user);
  const createAndAdoptPet = usePetStore((s) => s.createAndAdoptPet);
  const { success, error: showError } = useToast();

  const [step, setStep] = useState(0);
  const [selectedSpecies, setSelectedSpecies] = useState<PetSpecies>(initialSpecies);
  const [petName, setPetName] = useState('');
  const [selectedPersonality, setSelectedPersonality] = useState<PersonalityTrait>('curious');
  const [adopting, setAdopting] = useState(false);
  const [previewSpecies, setPreviewSpecies] = useState<PetSpecies>(initialSpecies);

  const steps = ['Choose Your Pet', 'Name Them', 'Their Personality', 'Welcome Home!'];

  const handleAdopt = useCallback(async () => {
    if (!user) return;
    if (!petName.trim()) {
      showError('Name required', 'Please give your pet a name!');
      return;
    }
    setAdopting(true);
    try {
      await createAndAdoptPet(user.uid, selectedSpecies, petName.trim(), selectedPersonality);
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
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${selectedTheme.bgGradientFrom}, ${selectedTheme.bgGradientTo})`,
        transition: 'background 0.8s ease',
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
          height: 4,
          background: 'rgba(0,0,0,0.06)',
          zIndex: 100,
        }}
      >
        <motion.div
          animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.5 }}
          style={{
            height: '100%',
            background: `linear-gradient(90deg, ${selectedTheme.primaryColor}, ${selectedTheme.accentColor})`,
          }}
        />
      </div>

      {/* Step Indicator */}
      <div className="flex gap-2 mb-8 z-10 items-center justify-center">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: i <= step
                  ? '#050505'
                  : 'rgba(0,0,0,0.08)',
                fontSize: 12,
                fontWeight: 700,
                color: 'white',
                transition: 'all 0.3s ease',
              }}
            >
              {i < step ? <Check size={12} /> : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div
                style={{
                  width: 32,
                  height: 2,
                  background: i < step ? '#050505' : 'rgba(0,0,0,0.08)',
                  transition: 'background 0.3s ease',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="w-full max-w-2xl relative z-10">
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
              <h1 className="text-center text-4xl font-extrabold text-[#050505] mb-2 tracking-tight">
                Choose Your Companion
              </h1>
              <p className="text-center text-[#4f515c] mb-8 text-base font-medium">
                Each pet transforms your entire universe
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.values(PET_THEMES).map((theme) => (
                  <motion.button
                    key={theme.species}
                    whileHover={{ scale: 1.03, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedSpecies(theme.species);
                      setPreviewSpecies(theme.species);
                    }}
                    onMouseEnter={() => setPreviewSpecies(theme.species)}
                    onMouseLeave={() => setPreviewSpecies(selectedSpecies)}
                    className="glass-panel"
                    style={{
                      background: selectedSpecies === theme.species
                        ? 'rgba(255, 255, 255, 0.92)'
                        : 'rgba(255,255,255,0.52)',
                      border: selectedSpecies === theme.species
                        ? `2px solid ${theme.primaryColor}`
                        : '2px solid rgba(0,0,0,0.06)',
                      borderRadius: 20,
                      padding: '24px 16px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.25s ease',
                      boxShadow: selectedSpecies === theme.species
                        ? `0 12px 32px ${theme.primaryColor}1a`
                        : '0 4px 16px rgba(42,55,120,0.04)',
                    }}
                  >
                    <div style={{ fontSize: 48, marginBottom: 8 }}>{theme.emoji}</div>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 16,
                        color: selectedSpecies === theme.species ? theme.primaryColor : '#202127',
                        marginBottom: 4
                      }}
                    >
                      {theme.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.55)', lineHeight: 1.4, fontWeight: 500 }}>
                      {theme.description}
                    </div>
                  </motion.button>
                ))}
              </div>
              <div className="text-center mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="btn-primary"
                  style={{ padding: '14px 48px', fontSize: 16 }}
                >
                  Continue <ChevronRight size={18} className="inline ml-1" />
                </button>
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
              <div className="text-center mb-8">
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ fontSize: 80, marginBottom: 16 }}
                >
                  {selectedTheme.emoji}
                </motion.div>
                <h1 className="text-4xl font-extrabold text-[#050505] mb-2 tracking-tight">
                  What's their name?
                </h1>
                <p className="text-[#4f515c] text-base font-medium">
                  Give your {selectedTheme.name} a special name
                </p>
              </div>
              <div className="w-full max-w-sm mx-auto flex flex-col gap-4">
                <input
                  id="pet-name-input"
                  type="text"
                  placeholder={`Name your ${selectedTheme.name}...`}
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="w-full h-16 rounded-2xl border border-black/10 bg-white/60 text-xl text-black text-center focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black placeholder-[#4f515c]/50 font-bold"
                  maxLength={20}
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && petName.trim() && setStep(2)}
                />
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setStep(0)}
                    className="flex-1 inline-flex h-12 items-center justify-center gap-2 rounded-full border border-black/10 bg-white/70 px-6 text-sm font-medium text-black backdrop-blur transition hover:bg-white"
                  >
                    <ChevronLeft size={16} /> Back
                  </button>
                  <button
                    onClick={() => petName.trim() && setStep(2)}
                    disabled={!petName.trim()}
                    className="flex-2 btn-primary"
                  >
                    {petName.trim() ? `Yes, ${petName}!` : 'Enter a name'} <ChevronRight size={16} className="inline ml-1" />
                  </button>
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
              <h1 className="text-center text-4xl font-extrabold text-[#050505] mb-2 tracking-tight">
                {petName}'s Personality
              </h1>
              <p className="text-center text-[#4f515c] mb-8 text-base font-medium">
                This shapes how they interact with you
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PERSONALITIES.map((p) => (
                  <motion.button
                    key={p.trait}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPersonality(p.trait)}
                    className="glass-panel"
                    style={{
                      background: selectedPersonality === p.trait
                        ? 'rgba(255, 255, 255, 0.92)'
                        : 'rgba(255, 255, 255, 0.52)',
                      border: selectedPersonality === p.trait
                        ? `2px solid ${selectedTheme.primaryColor}`
                        : '2px solid rgba(0,0,0,0.06)',
                      borderRadius: 16,
                      padding: '18px 20px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      transition: 'all 0.2s ease',
                      boxShadow: selectedPersonality === p.trait
                        ? `0 8px 24px ${selectedTheme.primaryColor}12`
                        : '0 2px 8px rgba(42,55,120,0.02)',
                    }}
                  >
                    <span style={{ fontSize: 28, flexShrink: 0 }}>{p.emoji}</span>
                    <div>
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: 15,
                          color: selectedPersonality === p.trait ? selectedTheme.primaryColor : '#202127',
                          marginBottom: 2
                        }}
                      >
                        {p.label}
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.55)', fontWeight: 500 }}>
                        {p.description}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 inline-flex h-12 items-center justify-center gap-2 rounded-full border border-black/10 bg-white/70 px-6 text-sm font-medium text-black backdrop-blur transition hover:bg-white"
                >
                  <ChevronLeft size={16} /> Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-2 btn-primary"
                >
                  Perfect! <ChevronRight size={16} className="inline ml-1" />
                </button>
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
              className="text-center"
            >
              <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ fontSize: 100, marginBottom: 24 }}
              >
                {selectedTheme.emoji}
              </motion.div>
              <h1 className="text-4xl font-extrabold text-[#050505] mb-2 tracking-tight">
                Meet {petName}!
              </h1>
              <div className="flex justify-center gap-2.5 mb-6">
                <span
                  className="rounded-full px-3.5 py-1 text-xs font-bold text-white"
                  style={{ background: selectedTheme.primaryColor }}
                >
                  {selectedTheme.name}
                </span>
                <span className="rounded-full px-3.5 py-1 text-xs font-bold bg-[#050505] text-white capitalize">
                  {selectedPersonality}
                </span>
              </div>
              <p className="text-[#4f515c] text-base font-medium mb-10 max-w-sm mx-auto leading-relaxed">
                {petName} is ready to enter your universe. They can't wait to meet you!
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setStep(2)}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-black/10 bg-white/70 px-6 text-sm font-medium text-black backdrop-blur transition hover:bg-white"
                >
                  <ChevronLeft size={16} /> Back
                </button>
                <button
                  onClick={handleAdopt}
                  disabled={adopting}
                  className="btn-primary"
                  style={{ padding: '14px 40px', fontSize: 16 }}
                >
                  {adopting ? (
                    <>Creating universe... ✨</>
                  ) : (
                    <><Sparkles size={18} className="inline mr-1" /> Adopt {petName}!</>
                  )}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f7f8ff] flex items-center justify-center p-6 w-full">
        <div className="glass-panel rounded-2xl p-8 flex items-center justify-center min-h-[300px] w-full max-w-md">
          <Loader2 className="size-8 animate-spin text-black/40" />
        </div>
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
