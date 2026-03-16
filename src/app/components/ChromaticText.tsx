import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface ChromaticTextProps {
  children: ReactNode;
  severity: 'info' | 'warning' | 'critical';
  intensity?: number;
}

export function ChromaticText({ children, severity, intensity = 1 }: ChromaticTextProps) {
  if (severity !== 'critical') {
    return <>{children}</>;
  }

  return (
    <div className="relative inline-block">
      {/* Red channel */}
      <div
        className="absolute top-0 left-0 pointer-events-none opacity-40"
        style={{
          color: '#F83D3D',
          transform: `translate(${-1 * intensity}px, 0)`,
          mixBlendMode: 'screen',
        }}
      >
        {children}
      </div>

      {/* Cyan channel */}
      <div
        className="absolute top-0 left-0 pointer-events-none opacity-40"
        style={{
          color: '#49D0D0',
          transform: `translate(${1 * intensity}px, 0)`,
          mixBlendMode: 'screen',
        }}
      >
        {children}
      </div>

      {/* Main content */}
      <div className="relative">{children}</div>
    </div>
  );
}
