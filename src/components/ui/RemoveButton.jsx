import { motion } from 'framer-motion';
import './ui.css';

export function RemoveButton({ label = 'Удалить', onClick }) {
  return (
    <motion.button className="icon-btn" aria-label={label} onClick={onClick} whileHover={{ rotate: 90 }} whileTap={{ scale: 0.8 }}>
      ×
    </motion.button>
  );
}
