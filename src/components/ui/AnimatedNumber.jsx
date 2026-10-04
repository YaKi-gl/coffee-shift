import { animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/** Число, которое плавно «докручивается» до нового значения. */
export function AnimatedNumber({ value, format = (v) => Math.round(v) }) {
  const [display, setDisplay] = useState(value);
  const previous = useRef(value);

  useEffect(() => {
    const controls = animate(previous.current, value, {
      duration: 0.6,
      ease: 'easeOut',
      onUpdate: setDisplay,
    });
    previous.current = value;
    return () => controls.stop();
  }, [value]);

  return <>{format(display)}</>;
}
