import { ReactNode, useEffect, useRef } from 'react';

interface ParallaxContainerProps {
  children: ReactNode;
  depth?: number;
}

const MAX_OFFSET_PX = 22;
const LERP_FACTOR = 0.12;
const RESIZE_SETTLE_MS = 180;

export function ParallaxContainer({ children, depth = 1 }: ParallaxContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const resizeTimeoutRef = useRef<number | null>(null);

  const viewportRef = useRef({ width: window.innerWidth, height: window.innerHeight });
  const pointerRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const intensityRef = useRef(1);

  useEffect(() => {
    const updateTarget = () => {
      const { width, height } = viewportRef.current;

      // Normalization is pinned to a stable viewport size while resize is active
      // to avoid jitter from constantly changing vw/vh denominators.
      const normalizedX = (pointerRef.current.x - width / 2) / width;
      const normalizedY = (pointerRef.current.y - height / 2) / height;

      targetRef.current.x = normalizedX * depth * MAX_OFFSET_PX;
      targetRef.current.y = normalizedY * depth * MAX_OFFSET_PX;
    };

    const applyTransform = () => {
      const element = containerRef.current;
      if (!element) return;

      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * LERP_FACTOR;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * LERP_FACTOR;

      const x = currentRef.current.x * intensityRef.current;
      const y = currentRef.current.y * intensityRef.current;

      element.style.transform = `translate3d(${x.toFixed(3)}px, ${y.toFixed(3)}px, 0)`;
    };

    const tick = () => {
      applyTransform();
      frameRef.current = window.requestAnimationFrame(tick);
    };

    const handleMouseMove = (event: MouseEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };
      updateTarget();
    };

    const handleResize = () => {
      // During active drag-resize we dampen parallax intensity to protect readability.
      intensityRef.current = 0.2;

      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = window.setTimeout(() => {
        viewportRef.current = {
          width: window.innerWidth,
          height: window.innerHeight,
        };
        intensityRef.current = 1;
        updateTarget();
      }, RESIZE_SETTLE_MS);
    };

    updateTarget();
    frameRef.current = window.requestAnimationFrame(tick);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }

      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [depth]);

  return (
    <div ref={containerRef} style={{ transform: 'translate3d(0, 0, 0)', willChange: 'transform' }}>
      {children}
    </div>
  );
}
