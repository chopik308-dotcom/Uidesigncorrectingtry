import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const setPosition = (x: number, y: number) => {
      setMousePosition({ x, y });
      setIsVisible(true);
    };

    const handlePointerMove = (e: PointerEvent) => {
      setPosition(e.clientX, e.clientY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setPosition(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      setPosition(touch.clientX, touch.clientY);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    setPosition(window.innerWidth / 2, window.innerHeight / 2);

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
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
          top: 0,
          left: 0,
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
          top: 0,
          left: 0,
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
