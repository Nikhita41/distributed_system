import { useEffect, useRef, useState } from 'react';

/**
 * Smoothly animate a number from 0 (or its previous value) to the target value.
 * Uses requestAnimationFrame for buttery-smooth transitions.
 */
export function useAnimatedCounter(target: number, duration = 600): number {
  const [current, setCurrent] = useState(0);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    fromRef.current = current;
    startRef.current = null;

    const step = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(fromRef.current + (target - fromRef.current) * eased);
      setCurrent(value);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      }
    };

    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return current;
}
