import { useState, FormEvent } from 'react';
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
      setTimeout(() => {
        setSaved(false);
        setAnswer('');
        navigate('/entries');
      }, 900);
    } catch {
      setSaved(false);
    }
  };

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
                className="w-full bg-black/5 border-2 border-black/10 rounded-2xl p-3 text-black placeholder:text-black/40 focus:outline-none focus:border-neon-pink transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-black">Answer</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write what you're grateful for and why..."
                className="w-full h-40 bg-black/5 border-2 border-black/10 rounded-2xl p-4 text-black placeholder:text-black/40 focus:outline-none focus:border-neon-pink transition-colors resize-none"
              />
            </div>

            <div className="flex gap-3">
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
        </motion.div>
      </div>
    </div>
  );
}
