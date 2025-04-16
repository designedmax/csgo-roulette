import { useEffect, useRef, useState } from 'react';

interface RouletteWheelProps {
  isSpinning: boolean;
  onSpinComplete: () => void;
}

export default function RouletteWheel({ isSpinning, onSpinComplete }: RouletteWheelProps) {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isSpinning) {
      const spinDuration = 3000; // 3 seconds
      const startTime = Date.now();
      const startRotation = rotation;
      const targetRotation = startRotation + 360 * 5 + Math.random() * 360; // 5 full rotations + random

      const animate = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);

        // Easing function for smooth deceleration
        const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
        const currentRotation = startRotation + (targetRotation - startRotation) * easeOut(progress);

        setRotation(currentRotation);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          onSpinComplete();
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isSpinning, onSpinComplete]);

  return (
    <div className="relative w-64 h-64 mx-auto mb-8">
      <div
        ref={wheelRef}
        className="w-full h-full rounded-full border-8 border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? 'none' : 'transform 0.5s ease-out'
        }}
      >
        <div className="absolute top-0 left-1/2 w-4 h-4 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 left-0 w-4 h-4 bg-blue-500 rounded-full transform -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-green-500 rounded-full transform -translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-4 h-4 bg-yellow-500 rounded-full transform -translate-y-1/2" />
      </div>
      <div className="absolute top-0 left-1/2 w-2 h-8 bg-white transform -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
} 