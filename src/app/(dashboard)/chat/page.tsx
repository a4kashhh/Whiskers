'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { usePetStore } from '@/stores/usePetStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { saveChatMessage, getChatHistory } from '@/lib/firebase/firestore';
import { useTheme } from '@/lib/theme-engine/ThemeProvider';
import type { ChatMessage } from '@/types';

const SPECIES_EMOJI: Record<string, string> = {
  cat: '🐱', dog: '🐶', panda: '🐼', fox: '🦊', dragon: '🐉', bunny: '🐰',
};

const STARTERS = [
  'How are you feeling today?',
  'What do you want to do?',
  'Tell me a secret!',
  "What's your favourite thing?",
  'Do you like PetVerse?',
];

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function ChatPage() {
  const pet     = usePetStore((s) => s.pet);
  const appUser = useAuthStore((s) => s.appUser);
  const theme   = useTheme();

  const [messages, setMessages]     = useState<ChatMessage[]>([]);
  const [input, setInput]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [isTyping, setIsTyping]     = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!pet) return;
    getChatHistory(pet.id, 30)
      .then(setMessages)
      .catch(() => console.warn('Chat history not available yet (index building)'))
      .finally(() => setHistoryLoading(false));
  }, [pet?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  async function sendMessage(text: string) {
    if (!pet || !appUser || !text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      petId: pet.id,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    setMessages((p) => [...p, userMsg]);
    setInput('');
    setLoading(true);
    setIsTyping(true);
    saveChatMessage({ petId: pet.id, role: 'user', content: text, timestamp: Date.now() }).catch(() => {});

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text, petName: pet.name, petSpecies: pet.species,
          petPersonality: pet.personality,
          petMood: pet.mood > 70 ? 'happy' : pet.mood > 40 ? 'content' : 'sad',
          petLevel: pet.level,
        }),
      });
      const data = await res.json();
      setIsTyping(false);
      if (data.response) {
        const petMsg: ChatMessage = {
          id: `p_${Date.now()}`,
          petId: pet.id, role: 'pet', content: data.response, timestamp: Date.now(),
        };
        setMessages((p) => [...p, petMsg]);
        saveChatMessage({ petId: pet.id, role: 'pet', content: data.response, timestamp: Date.now() }).catch(() => {});
      } else {
        throw new Error('No response');
      }
    } catch {
      setIsTyping(false);
      setMessages((p) => [...p, {
        id: `err_${Date.now()}`, petId: pet?.id || '', role: 'pet',
        content: '*nudges you softly* 😿 I seem to be having trouble finding words right now. Try again in a moment!',
        timestamp: Date.now(),
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  if (!pet) return null;

  const petEmoji = SPECIES_EMOJI[pet.species] ?? '🐾';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 112px)', gap: 0 }}>

      {/* ── Chat header ─────────────────────────────────────────────── */}
      <div className="glass-card" style={{
        padding: '14px 20px', borderRadius: '16px 16px 0 0', flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <motion.div
          animate={{ y: [0, -4, 0] }} transition={{ duration: 2.5, repeat: Infinity }}
          style={{ fontSize: 34, flexShrink: 0 }}
        >
          {petEmoji}
        </motion.div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.02em' }}>{pet.name}</div>
          <div style={{ fontSize: 12, color: theme.primaryColor, marginTop: 1, fontWeight: 500 }}>
            {pet.personality} · Lv.{pet.level}
          </div>
        </div>
        {/* Online indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <motion.div
            animate={{ opacity: [1, 0.4, 1], scale: [1, 0.9, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80' }}
          />
          <span style={{ fontSize: 12, color: '#4ade80', fontWeight: 500 }}>Online</span>
        </div>
        {/* Powered by pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'rgba(192,132,252,0.08)', border: '1px solid rgba(192,132,252,0.15)',
          borderRadius: 100, padding: '4px 10px', fontSize: 11, color: 'var(--text-muted)',
        }}>
          <Sparkles size={10} /> Gemini AI
        </div>
      </div>

      {/* ── Messages area ───────────────────────────────────────────── */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '20px 20px 8px',
        background: 'rgba(0,0,0,0.12)', backdropFilter: 'blur(8px)',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        {historyLoading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Loader2 size={20} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-muted)' }} />
          </div>
        ) : messages.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '32px 20px' }}>
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ fontSize: 64, marginBottom: 16 }}
            >
              {petEmoji}
            </motion.div>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, letterSpacing: '-0.02em' }}>
              {pet.name} is waiting!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24, maxWidth: 280, lineHeight: 1.5 }}>
              Start a conversation with your {pet.species} companion. They have a lot to say!
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {STARTERS.map((s) => (
                <motion.button
                  key={s} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                  onClick={() => sendMessage(s)}
                  style={{
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: 100, padding: '8px 14px', color: 'var(--text-secondary)',
                    fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s ease',
                  }}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'flex', gap: 10, alignItems: 'flex-end',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                {/* Pet avatar */}
                {msg.role === 'pet' && (
                  <div style={{
                    width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                    background: `${theme.primaryColor}20`,
                    border: `1px solid ${theme.primaryColor}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                  }}>
                    {petEmoji}
                  </div>
                )}

                <div style={{ maxWidth: '68%' }}>
                  {/* Bubble */}
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.role === 'user'
                      ? `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`
                      : 'rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(10px)',
                    fontSize: 13.5, lineHeight: 1.6,
                    color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                    boxShadow: msg.role === 'user' ? `0 4px 20px ${theme.glowColor}` : '0 2px 8px rgba(0,0,0,0.2)',
                    border: msg.role === 'pet' ? '1px solid rgba(255,255,255,0.07)' : 'none',
                    letterSpacing: '-0.01em',
                  }}>
                    {msg.content}
                  </div>
                  {/* Timestamp */}
                  <div style={{
                    fontSize: 10, color: 'var(--text-muted)', marginTop: 4,
                    textAlign: msg.role === 'user' ? 'right' : 'left',
                  }}>
                    {formatTime(msg.timestamp)}
                  </div>
                </div>

                {/* User avatar */}
                {msg.role === 'user' && (
                  <div style={{
                    width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                    background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, color: 'white',
                    boxShadow: `0 2px 10px ${theme.glowColor}`,
                  }}>
                    {/* Initial */}
                    {(appUser?.displayName?.[0] ?? '?').toUpperCase()}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}
            >
              <div style={{
                width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                background: `${theme.primaryColor}20`, border: `1px solid ${theme.primaryColor}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
              }}>
                {petEmoji}
              </div>
              <div style={{
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px 16px 16px 4px',
                display: 'flex', gap: 5, alignItems: 'center',
              }}>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.55, delay: i * 0.12, repeat: Infinity }}
                    style={{ width: 6, height: 6, borderRadius: '50%', background: theme.primaryColor }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* ── Suggestion chips ─────────────────────────────────────────── */}
      {messages.length > 0 && !loading && (
        <div style={{
          padding: '8px 16px', display: 'flex', gap: 7, overflowX: 'auto',
          background: 'rgba(0,0,0,0.1)', flexShrink: 0, scrollbarWidth: 'none',
        }}>
          {STARTERS.map((s) => (
            <button
              key={s} onClick={() => sendMessage(s)}
              style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 100, padding: '5px 12px', color: 'var(--text-muted)',
                fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                fontFamily: 'inherit', transition: 'all 0.15s ease',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* ── Input bar ────────────────────────────────────────────────── */}
      <div style={{
        padding: '12px 16px',
        background: 'rgba(6,3,14,0.7)',
        backdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '0 0 16px 16px',
        display: 'flex', gap: 10, flexShrink: 0, alignItems: 'center',
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            ref={inputRef}
            id="chat-input"
            type="text"
            placeholder={`Message ${pet.name}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && sendMessage(input)}
            className="input-glass"
            style={{ height: 46, paddingRight: 16 }}
            disabled={loading}
            autoFocus
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          style={{
            width: 46, height: 46, borderRadius: 12, flexShrink: 0,
            background: (!input.trim() || loading)
              ? 'rgba(255,255,255,0.06)'
              : `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
            border: 'none',
            cursor: (!input.trim() || loading) ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white',
            boxShadow: (!input.trim() || loading) ? 'none' : `0 4px 16px ${theme.glowColor}`,
            transition: 'all 0.18s ease',
          }}
        >
          {loading
            ? <Loader2 size={17} style={{ animation: 'spin 1s linear infinite' }} />
            : <Send size={17} />}
        </motion.button>
      </div>
    </div>
  );
}
