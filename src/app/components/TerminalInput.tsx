import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

interface TerminalInputProps {
  placeholder?: string;
  onSubmit?: (value: string) => void;
}

export function TerminalInput({ placeholder = '', onSubmit }: TerminalInputProps) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && value.trim()) {
        onSubmit?.(value);
        setValue('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [value, onSubmit]);

  return (
    <div className="relative w-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Glow border */}
        <div
          className="absolute inset-0 rounded-sm transition-all duration-300"
          style={{
            boxShadow: isFocused
              ? '0 0 20px rgba(248, 61, 61, 0.3), inset 0 0 20px rgba(248, 61, 61, 0.1)'
              : '0 0 10px rgba(233, 233, 228, 0.1), inset 0 0 10px rgba(233, 233, 228, 0.05)',
            border: isFocused ? '1px solid rgba(248, 61, 61, 0.5)' : '1px solid rgba(233, 233, 228, 0.2)',
          }}
        />

        {/* Input field */}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="relative w-full bg-transparent px-4 py-3 font-mono text-lg outline-none"
          style={{
            color: '#E9E9E4',
            caretColor: '#F83D3D',
          }}
        />

        {/* Placeholder text styled as part of the field layer */}
        {!value && !isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 0.4, y: 0 }}
            transition={{ duration: 0.35, delay: 0.12 }}
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none font-mono text-lg"
            style={{ color: '#A6B0B9' }}
          >
            {placeholder}
          </motion.div>
        )}

        {/* Cursor blink when empty and focused */}
        {!value && isFocused && (
          <motion.div
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'steps(1)' }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-5 bg-[#F83D3D]"
          />
        )}
      </motion.div>
    </div>
  );
}
