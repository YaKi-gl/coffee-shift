import { motion } from 'framer-motion';
import { isStorageAvailable } from '../../services/storage.js';
import './Header.css';

export function Header() {
  return (
    <header className="header">
      <div>
        <motion.h1 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          Кофейная Смена
        </motion.h1>
        <p className="header__subtitle">Смены бариста, списания и выручка точки в одном месте</p>
      </div>
      <span className="header__badge">
        {isStorageAvailable() ? 'данные хранятся в этом браузере' : 'хранилище недоступно · изменения не сохранятся'}
      </span>
    </header>
  );
}
