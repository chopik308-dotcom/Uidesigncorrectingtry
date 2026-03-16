import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed pointer-events-none z-[100] mix-blend-difference"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
        }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 400,
        }}
        style={{
          width: 16,
          height: 16,
          border: '1px solid #E9E9E4',
          borderRadius: '50%',
        }}
      />

      {/* Trail cursor */}
      <motion.div
        className="fixed pointer-events-none z-[99]"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          opacity: 0.5,
        }}
        transition={{
          type: 'spring',
          damping: 20,
          stiffness: 200,
        }}
        style={{
          width: 8,
          height: 8,
          backgroundColor: '#49D0D0',
          borderRadius: '50%',
          filter: 'blur(2px)',
          boxShadow: '0 0 10px rgba(73, 208, 208, 0.8)',
        }}
      />
    </>
  );
}
