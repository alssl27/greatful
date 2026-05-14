import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Heart, Flower2, Sparkles, Sun } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen stripe-pattern flex items-center justify-center p-4 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white p-12 rounded-3xl border-4 border-neon-pink shadow-2xl flex flex-col items-center max-w-lg w-full text-center relative"
      >
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="p-4 border-8 border-neon-pink inline-block relative border-neon-glow transform -rotate-1 shadow-[0_0_50px_rgba(255,20,147,0.3)]">
             <h1 className="text-6xl md:text-9xl font-display font-black text-black italic tracking-tighter uppercase leading-none px-4 py-2 text-neon-glow">
                Blessed
             </h1>
          </div>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-black text-xl md:text-2xl font-black mb-12 tracking-widest uppercase"
        >
          Sarah Collins 2026
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/journal')}
          className="group relative flex items-center gap-3 bg-neon-pink text-white px-8 py-4 rounded-full font-bold text-lg uppercase tracking-widest transition-all hover:bg-white hover:text-neon-pink border-2 border-neon-pink"
        >
          Start Your Journal
          <Heart className="w-5 h-5 group-hover:fill-current" />
        </motion.button>
      </motion.div>
    </div>
  );
}
