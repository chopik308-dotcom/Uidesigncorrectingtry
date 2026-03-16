import { useEffect, useRef } from 'react';

export function NoiseTexture() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 10;
      data[i] = noise;     // R
      data[i + 1] = noise; // G
      data[i + 2] = noise; // B
      data[i + 3] = 8;     // A - very subtle
    }

    ctx.putImageData(imageData, 0, 0);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const newImageData = ctx.createImageData(canvas.width, canvas.height);
      const newData = newImageData.data;

      for (let i = 0; i < newData.length; i += 4) {
        const noise = Math.random() * 10;
        newData[i] = noise;
        newData[i + 1] = noise;
        newData[i + 2] = noise;
        newData[i + 3] = 8;
      }

      ctx.putImageData(newImageData, 0, 0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40 opacity-50"
      style={{ mixBlendMode: 'overlay' }}
    />
  );
}
