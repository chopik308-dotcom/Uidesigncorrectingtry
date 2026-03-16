import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

export function GlitchOverlay() {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const triggerGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    };

    // Random glitch effect every 8-15 seconds
    const scheduleNextGlitch = () => {
      const delay = Math.random() * 7000 + 8000; // 8-15 seconds
      setTimeout(() => {
        triggerGlitch();
        scheduleNextGlitch();
      }, delay);
    };

    scheduleNextGlitch();
  }, []);

  if (!isGlitching) return null;

  return (
    <>
      {/* Horizontal line glitches */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.8, 0.3, 0.9, 0] }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(233, 233, 228, 0.1) 2px,
            rgba(233, 233, 228, 0.1) 4px
          )`,
        }}
      />

      {/* RGB split effect */}
      <motion.div
        initial={{ opacity: 0, x: 0 }}
        animate={{
          opacity: [0, 0.3, 0],
          x: [-5, 5, -3, 3, 0],
        }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          mixBlendMode: 'screen',
        }}
      >
        <div
          className="w-full h-full"
          style={{
            background: 'rgba(248, 61, 61, 0.2)',
          }}
        />
      </motion.div>
    </>
  );
}
