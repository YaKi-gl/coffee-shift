import { motion } from 'framer-motion';
import { TAB_LABELS } from '../../config/constants.js';
import './Tabs.css';

/** Вкладки с подчёркиванием, которое «переезжает» к активной. */
export function Tabs({ active, onChange }) {
  return (
    <nav className="tabs" role="tablist">
      {Object.entries(TAB_LABELS).map(([id, label]) => (
        <button key={id} role="tab" className="tabs__tab" aria-selected={active === id} onClick={() => onChange(id)}>
          {label}
          {active === id && (
            <motion.span layoutId="tabs-underline" className="tabs__underline" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />
          )}
        </button>
      ))}
    </nav>
  );
}
