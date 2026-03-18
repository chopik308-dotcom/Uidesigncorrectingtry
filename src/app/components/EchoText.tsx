import { motion } from 'motion/react';
import { useEffect, useState, useRef } from 'react';

interface EchoTextProps {
  text: string;
  severity: 'info' | 'warning' | 'critical';
  animHint?: 'steady' | 'type_on' | 'blink_slow' | 'pulse_soft' | 'pulse_hard' | 'glitch_soft';
  delay?: number;
  className?: string;
  lcdEffect?: boolean;
  palette?: 'default' | 'cold';
}

const severityColors = {
  default: {
    info: '#E9E9E4',
    warning: '#F3B643',
    critical: '#F83D3D',
  },
  cold: {
    info: '#F2F7FF',
    warning: '#F3B643',
    critical: '#F83D3D',
  },
};

const severityGlow = {
  default: {
    info: 'rgba(233, 233, 228, 0.3)',
    warning: 'rgba(243, 182, 67, 0.4)',
    critical: 'rgba(248, 61, 61, 0.5)',
  },
  cold: {
    info: 'rgba(242, 247, 255, 0.32)',
    warning: 'rgba(243, 182, 67, 0.4)',
    critical: 'rgba(248, 61, 61, 0.5)',
  },
};

const ECHO_DEAD_ZONE_PX = 180;
const ECHO_MAX_OFFSET_PX = 14;

export function EchoText({
  text,
  severity,
  animHint = 'steady',
  delay = 0,
  className = '',
  lcdEffect = true,
  palette = 'default',
}: EchoTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(animHint === 'type_on');
  const elementRef = useRef<HTMLDivElement>(null);
  const [echoOffset, setEchoOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (animHint === 'type_on') {
      let currentIndex = 0;
      const typeTimeout = setTimeout(() => {
        const interval = setInterval(() => {
          if (currentIndex <= text.length) {
            setDisplayedText(text.slice(0, currentIndex));
            currentIndex++;
          } else {
            clearInterval(interval);
            setIsTyping(false);
          }
        }, Math.random() * 20 + 20); // 20-40ms random

        return () => clearInterval(interval);
      }, delay);

      return () => clearTimeout(typeTimeout);
    } else {
      const timeout = setTimeout(() => {
        setDisplayedText(text);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [text, animHint, delay]);

  useEffect(() => {
    const updateEchoOffset = () => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;

      // Calculate distance from center
      const distanceX = elementCenterX - centerX;
      const distanceY = elementCenterY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      // No echo pull in the central read-safe zone.
      if (distance <= ECHO_DEAD_ZONE_PX) {
        setEchoOffset({ x: 0, y: 0 });
        return;
      }

      // Farther from center = stronger pull toward center, with a dead zone.
      const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
      const normalizedDistance = (distance - ECHO_DEAD_ZONE_PX) / Math.max(maxDistance - ECHO_DEAD_ZONE_PX, 1);
      const pullStrength = Math.min(Math.max(normalizedDistance, 0), 1) * ECHO_MAX_OFFSET_PX;

      // Direction toward center (normalized)
      const angle = Math.atan2(distanceY, distanceX);
      const pullX = -Math.cos(angle) * pullStrength;
      const pullY = -Math.sin(angle) * pullStrength;

      setEchoOffset({ x: pullX, y: pullY });
    };

    updateEchoOffset();

    // Update on scroll and resize
    window.addEventListener('resize', updateEchoOffset);
    window.addEventListener('scroll', updateEchoOffset);

    let frameId = window.requestAnimationFrame(function tick() {
      updateEchoOffset();
      frameId = window.requestAnimationFrame(tick);
    });

    return () => {
      window.removeEventListener('resize', updateEchoOffset);
      window.removeEventListener('scroll', updateEchoOffset);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  const color = severityColors[palette][severity];
  const glow = severityGlow[palette][severity];

  const baseVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const pulseVariants = {
    pulse: {
      opacity: [1, 0.6, 1],
      textShadow: [
        `0 0 10px ${glow}, 0 0 20px ${glow}`,
        `0 0 15px ${glow}, 0 0 30px ${glow}`,
        `0 0 10px ${glow}, 0 0 20px ${glow}`,
      ],
    },
  };

  const blinkVariants = {
    blink: {
      opacity: [1, 0.3, 1],
    },
  };

  const getAnimation = () => {
    switch (animHint) {
      case 'pulse_soft':
        return {
          animate: 'pulse',
          variants: pulseVariants,
          transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        };
      case 'pulse_hard':
        return {
          animate: 'pulse',
          variants: pulseVariants,
          transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
        };
      case 'blink_slow':
        return {
          animate: 'blink',
          variants: blinkVariants,
          transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        };
      case 'glitch_soft':
        return {
          animate: {
            x: [0, -2, 2, -1, 1, 0],
            opacity: [1, 0.8, 1, 0.9, 1],
          },
          transition: {
            duration: 0.3,
            repeat: Infinity,
            repeatDelay: 3,
            ease: 'easeInOut',
          },
        };
      default:
        return {};
    }
  };

  const textDisplay = animHint === 'type_on' ? displayedText : text;

  return (
    <div ref={elementRef} className={`relative inline-block ${className}`}>
      {/* Echo layers - появляются вместе с текстом */}
      {textDisplay && (
        <>
          {/* LCD ghost - vertical afterimage */}
          {lcdEffect && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.14 }}
                transition={{ duration: 0.35, delay: delay / 1000 }}
                className="absolute top-0 left-0 pointer-events-none select-none whitespace-pre-wrap"
                style={{
                  color,
                  transform: `translate(${echoOffset.x * 0.4}px, ${echoOffset.y * 0.8 + 6}px)`,
                  filter: 'blur(0.4px)',
                }}
              >
                {textDisplay}
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.08 }}
                transition={{ duration: 0.35, delay: delay / 1000 }}
                className="absolute top-0 left-0 pointer-events-none select-none whitespace-pre-wrap"
                style={{
                  color,
                  transform: `translate(${echoOffset.x * 0.6}px, ${echoOffset.y * 1.1 + 11}px)`,
                  filter: 'blur(1.4px)',
                }}
              >
                {textDisplay}
              </motion.div>
            </>
          )}

          {/* Layer 1 - closest */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            transition={{ duration: 0.3, delay: delay / 1000 }}
            className="absolute top-0 left-0 pointer-events-none select-none whitespace-pre-wrap"
            style={{
              color: color,
              transform: `translate(${echoOffset.x * 0.5}px, ${echoOffset.y * 0.5}px)`,
              filter: 'blur(1px)',
            }}
          >
            {textDisplay}
          </motion.div>
          
          {/* Layer 2 - middle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 0.3, delay: delay / 1000 }}
            className="absolute top-0 left-0 pointer-events-none select-none whitespace-pre-wrap"
            style={{
              color: color,
              transform: `translate(${echoOffset.x}px, ${echoOffset.y}px)`,
              filter: 'blur(2px)',
            }}
          >
            {textDisplay}
          </motion.div>
          
          {/* Layer 3 - farthest */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            transition={{ duration: 0.3, delay: delay / 1000 }}
            className="absolute top-0 left-0 pointer-events-none select-none whitespace-pre-wrap"
            style={{
              color: color,
              transform: `translate(${echoOffset.x * 1.8}px, ${echoOffset.y * 1.8}px)`,
              filter: 'blur(4px)',
            }}
          >
            {textDisplay}
          </motion.div>
        </>
      )}

      {/* Main text */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={baseVariants}
        transition={{ duration: 0.3, delay: delay / 1000 }}
        {...getAnimation()}
        className="relative whitespace-pre-wrap"
        style={{
          color: color,
          textShadow: `0 0 10px ${glow}, 0 0 20px ${glow}`,
        }}
      >
        {textDisplay}
        {isTyping && <span className="animate-pulse">_</span>}
      </motion.div>
    </div>
  );
}
