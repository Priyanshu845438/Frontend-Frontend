
import { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';
import useOnScreen from '../hooks/useOnScreen.ts';

interface CounterProps {
  target: number;
  duration?: number;
}

const Counter = ({ target, duration = 1.5 }: CounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [containerRef, isVisible] = useOnScreen<HTMLSpanElement>({ threshold: 0.5 });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isVisible && !hasAnimated.current) {
        const node = ref.current;
        if(node) {
            const controls = animate(0, target, {
              duration: duration,
              onUpdate(value) {
                node.textContent = Math.round(value).toLocaleString();
              },
            });
            hasAnimated.current = true;
            return () => controls.stop();
        }
    }
  }, [target, duration, isVisible]);

  return <span ref={containerRef}><span ref={ref}>0</span></span>;
};

export default Counter;
