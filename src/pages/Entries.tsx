import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Sparkles } from 'lucide-react';

type JournalEntry = {
  prompt: string;
  answer: string;
  date: string;
};

const SAVED_ENTRIES_STORAGE_KEY = 'greatful.savedEntries';

const DEFAULT_HISTORY: JournalEntry[] = [
  {
    prompt: "What is a habit you’ve built that you’re proud of?",
    answer: "Not smoking all day",
    date: new Date().toLocaleDateString()
  },
  {
    prompt: "What part of your body do you often overlook but are grateful for today?",
    answer: "My fingers",
    date: new Date().toLocaleDateString()
  },
  {
    prompt: "What is a personality trait of yours that has helped you in a crisis?",
    answer: "I can sell icicles to eskimos and sand to the arrab s also my honesty",
    date: new Date().toLocaleDateString()
  }
];

const loadSavedEntries = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_HISTORY;
  }

  try {
    const storedEntries = window.localStorage.getItem(SAVED_ENTRIES_STORAGE_KEY);

    if (!storedEntries) {
      return DEFAULT_HISTORY;
    }

    const parsedEntries = JSON.parse(storedEntries) as JournalEntry[];

    return Array.isArray(parsedEntries) && parsedEntries.length > 0 ? parsedEntries : DEFAULT_HISTORY;
  } catch {
    return DEFAULT_HISTORY;
  }
};

export default function Entries() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<JournalEntry[]>(loadSavedEntries);

  useEffect(() => {
    const syncEntries = () => {
      setHistory(loadSavedEntries());
    };

    syncEntries();
    window.addEventListener('storage', syncEntries);

    return () => {
      window.removeEventListener('storage', syncEntries);
    };
  }, []);

  return (
    <div className="min-h-screen leopard-pattern p-4 md:p-8 relative">
      <div className="max-w-6xl mx-auto text-black relative z-10">
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => navigate('/journal')}
          className="flex items-center gap-2 text-black bg-white px-4 py-2 rounded-full font-bold uppercase tracking-tighter mb-8 hover:bg-neon-pink hover:text-white transition-colors border-2 border-black"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Journal
        </motion.button>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white p-8 rounded-3xl border-4 border-black shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6 border-b-2 border-black pb-2">
            <h1 className="text-3xl md:text-4xl font-display italic text-black flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              Saved Entries
            </h1>
            <span className="bg-black text-white text-xs px-2 py-1 rounded font-bold">{history.length}</span>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {history.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 opacity-40 italic"
                >
                  <Sparkles className="w-10 h-10 mx-auto mb-3 text-neon-pink" />
                  <p>No saved entries yet.</p>
                  <p className="text-sm">Go back and capture a moment above.</p>
                </motion.div>
              ) : (
                history.map((entry, index) => (
                  <motion.div
                    key={`${entry.date}-${index}`}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                    className="bg-white p-4 rounded-xl border-l-4 border-neon-pink"
                  >
                    <p className="text-[10px] font-bold text-gray-500 uppercase">{entry.date}</p>
                    <p className="text-sm font-bold text-black italic mb-1">Q: {entry.prompt}</p>
                    <p className="text-gray-700 leading-relaxed font-medium whitespace-pre-line">{entry.answer}</p>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}