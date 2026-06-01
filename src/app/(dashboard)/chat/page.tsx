'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { usePetStore } from '@/stores/usePetStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { saveChatMessage, getChatHistory } from '@/lib/firebase/firestore';
import { useTheme } from '@/lib/theme-engine/ThemeProvider';
import { PetAvatar } from '@/components/pet/PetAvatar';
import type { ChatMessage } from '@/types';

const STARTER_PROMPTS = [
  'How are you feeling today?',
  'What do you want to do right now?',
  'Tell me a secret about yourself',
  'What\'s your favorite thing in the universe?',
  'Do you like living in PetVerse?',
];

export default function ChatPage() {
  const pet = usePetStore((s) => s.pet);
  const appUser = useAuthStore((s) => s.appUser);
  const theme = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!pet) return;
    getChatHistory(pet.id, 20)
      .then(setMessages)
      .catch(console.error)
      .finally(() => setHistoryLoading(false));
  }, [pet?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  async function sendMessage(text: string) {
    if (!pet || !appUser || !text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      petId: pet.id,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setIsTyping(true);

    // Persist user message
    saveChatMessage({ petId: pet.id, role: 'user', content: text, timestamp: Date.now() }).catch(console.error);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          petName: pet.name,
          petSpecies: pet.species,
          petPersonality: pet.personality,
          petMood: pet.mood > 70 ? 'happy' : pet.mood > 40 ? 'content' : 'sad',
          petLevel: pet.level,
        }),
      });

      const data = await res.json();
      setIsTyping(false);

      if (data.response) {
        const petMsg: ChatMessage = {
          id: `pet_${Date.now()}`,
          petId: pet.id,
          role: 'pet',
          content: data.response,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, petMsg]);
        saveChatMessage({ petId: pet.id, role: 'pet', content: data.response, timestamp: Date.now() }).catch(console.error);
      }
    } catch (e) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          petId: pet?.id || '',
          role: 'pet',
          content: '*curls up and nudges you softly* (Connection lost — check your API key in .env.local)',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!pet) return null;

  const petEmoji = { cat: '🐱', dog: '🐶', panda: '🐼', fox: '🦊', dragon: '🐉', bunny: '🐰' }[pet.species];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', gap: 0 }}>
      {/* Header */}
      <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, borderRadius: '16px 16px 0 0', flexShrink: 0 }}>
        <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: 36 }}>{petEmoji}</motion.span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 17 }}>{pet.name}</div>
          <div style={{ fontSize: 13, color: 'var(--color-primary)' }}>Online • {pet.personality}</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', animation: 'pulse-glow 2s infinite' }} />
          <span style={{ fontSize: 12, color: '#4ade80' }}>Ready to chat</span>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          background: 'rgba(0,0,0,0.15)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {historyLoading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>Loading chat history...</div>
        ) : messages.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>{petEmoji}</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{pet.name} is waiting for you!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>Start a conversation with your pet companion</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {STARTER_PROMPTS.map((p) => (
                <button key={p} onClick={() => sendMessage(p)} style={{ background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, padding: '8px 14px', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer' }}>
                  {p}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                style={{
                  display: 'flex',
                  gap: 12,
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-end',
                }}
              >
                {msg.role === 'pet' && (
                  <div style={{ fontSize: 28, flexShrink: 0 }}>{petEmoji}</div>
                )}
                <div
                  style={{
                    maxWidth: '70%',
                    padding: '12px 16px',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.role === 'user'
                      ? `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`
                      : 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(10px)',
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                    boxShadow: msg.role === 'user' ? `0 4px 16px ${theme.glowColor}` : 'none',
                    border: msg.role === 'pet' ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  }}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 700,
                      color: 'white',
                      flexShrink: 0,
                    }}
                  >
                    🧑
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
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}
            >
              <div style={{ fontSize: 28 }}>{petEmoji}</div>
              <div
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '18px 18px 18px 4px',
                  padding: '14px 18px',
                  display: 'flex',
                  gap: 5,
                  alignItems: 'center',
                }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                    style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-primary)' }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Starter prompts (when messages exist) */}
      {messages.length > 0 && !loading && (
        <div style={{ padding: '10px 20px', display: 'flex', gap: 8, overflowX: 'auto', background: 'rgba(0,0,0,0.1)', flexShrink: 0 }}>
          {STARTER_PROMPTS.map((p) => (
            <button key={p} onClick={() => sendMessage(p)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, padding: '6px 12px', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        style={{
          padding: '16px 20px',
          background: 'rgba(0,0,0,0.2)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '0 0 16px 16px',
          display: 'flex',
          gap: 10,
          flexShrink: 0,
        }}
      >
        <input
          ref={inputRef}
          id="chat-input"
          type="text"
          placeholder={`Talk to ${pet.name}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !loading && sendMessage(input)}
          className="input-glass"
          style={{ flex: 1, height: 48 }}
          disabled={loading}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: !input.trim() || loading ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
            border: 'none',
            cursor: !input.trim() || loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: !input.trim() || loading ? 'none' : `0 4px 16px ${theme.glowColor}`,
            flexShrink: 0,
          }}
        >
          {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={18} />}
        </motion.button>
      </div>
    </div>
  );
}
