import { useState, FormEvent, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Heart, Send } from 'lucide-react';

type JournalEntry = {
  prompt: string;
  answer: string;
  date: string;
};

const SAVED_ENTRIES_STORAGE_KEY = 'greatful.savedEntries';

export default function Gratitude() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('I am grateful for...');
  const [answer, setAnswer] = useState('');
  const [saved, setSaved] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(SAVED_ENTRIES_STORAGE_KEY) : null;
      const parsed: JournalEntry[] = raw ? JSON.parse(raw) : [];

      const entry: JournalEntry = {
        prompt: prompt || 'Gratitude',
        answer: answer.trim(),
        date: new Date().toLocaleDateString(),
      };

      const updated = [entry, ...(Array.isArray(parsed) ? parsed : [])];

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(SAVED_ENTRIES_STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
      }

      setSaved(true);
      // trigger confetti and sound
      setShowConfetti(true);
      playWinSound();

      setTimeout(() => {
        setSaved(false);
        setShowConfetti(false);
        setAnswer('');
        navigate('/entries');
      }, 1200);
    } catch {
      setSaved(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch {}
      }
    };
  }, []);

  function playWinSound() {
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      const now = ctx.currentTime;

      // Primary oscillator sweep (triangular bright tone)
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.6);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.5, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.0);

      // Add short noise burst for slot-machine hit
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.9));

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.0001, now);
      noiseGain.gain.linearRampToValueAtTime(0.6, now + 0.03);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      const band = ctx.createBiquadFilter();
      band.type = 'highpass';
      band.frequency.setValueAtTime(800, now);

      noise.connect(band);
      band.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.6);
    } catch (err) {
      // fail silently
    }
  }

  return (
    <div className="min-h-screen stripe-pattern p-4 md:p-8 relative text-white">
      <div className="max-w-4xl mx-auto text-white relative z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-8 rounded-3xl border-4"
          style={{ background: 'white', borderColor: 'var(--color-neon-pink)', color: 'var(--color-neon-pink)' }}
        >
          <div className="mb-4">
            <h1 className="text-3xl font-display italic text-black">Gratitude Prompt</h1>
            <p className="text-sm text-black">Capture a short gratitude and why it matters.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-black">Prompt</label>
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-black/5 border-2 border-neon-cyan rounded-2xl p-3 text-black placeholder:text-black/40 focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_12px_rgba(0,245,255,0.18)] transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-black">Answer</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write what you're grateful for and why..."
                className="w-full h-24 md:h-40 bg-black/5 border-2 border-neon-cyan rounded-2xl p-4 text-black placeholder:text-black/40 focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_18px_rgba(0,245,255,0.14)] transition-colors resize-none"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex-1 bg-neon-pink text-black py-3 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neon-cyan hover:text-black transition-all border-2 border-neon-pink shadow-[0_0_18px_rgba(255,43,214,0.55)] pulse-neon disabled:opacity-50"
                disabled={!answer.trim() || saved}
              >
                {saved ? 'Saved!' : 'Save Gratitude'}
                <Send className="w-4 h-4" />
              </motion.button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-black text-white rounded-xl font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
          {showConfetti && (
            <div className="confetti-container">
              {Array.from({ length: 28 }).map((_, i) => {
                const left = Math.round(Math.random() * 80) + 5;
                const delay = Math.random() * 300;
                const colors = ['var(--color-neon-pink)', 'var(--color-neon-cyan)', 'var(--color-neon-lime)', '#ffffff', '#ffd7f0'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                const style: any = { left: `${left}%`, backgroundColor: color, animationDelay: `${delay}ms`, transform: `rotate(${Math.random()*360}deg)` };
                return <span key={i} className="confetti" style={style} />;
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
