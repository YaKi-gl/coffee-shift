import { motion } from 'framer-motion';
import { fadeUp } from '../motion/presets.js';
import './ui.css';

/** Белая панель с заголовком. Появляется снизу вверх. */
export function Panel({ title, actions, children, className = '' }) {
  return (
    <motion.section className={`panel ${className}`} variants={fadeUp}>
      {(title || actions) && (
        <div className="panel__head">
          {title && <h2>{title}</h2>}
          {actions}
        </div>
      )}
      {children}
    </motion.section>
  );
}
