import { motion } from 'motion/react';
import { ReactNode, useState, useEffect } from 'react';

interface ParallaxContainerProps {
  children: ReactNode;
  depth?: number;
}

export function ParallaxContainer({ children, depth = 1 }: ParallaxContainerProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) / window.innerWidth;
      const y = (e.clientY - window.innerHeight / 2) / window.innerHeight;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      animate={{
        x: mousePosition.x * depth * 20,
        y: mousePosition.y * depth * 20,
      }}
      transition={{
        type: 'spring',
        stiffness: 50,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
}
