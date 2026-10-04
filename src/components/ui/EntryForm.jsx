import { motion } from 'framer-motion';
import { useState } from 'react';
import './ui.css';

/**
 * Форма добавления записи. Отдаёт значения полей наружу через onSubmit
 * и коротко подсвечивает кнопку «Готово» после отправки.
 */
export function EntryForm({ children, submitLabel, onSubmit }) {
  const [justSaved, setJustSaved] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    onSubmit(Object.fromEntries(new FormData(form)));
    form.reset();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1200);
  }

  return (
    <form className="entry-form" onSubmit={handleSubmit}>
      {children}
      <motion.button
        className="btn"
        whileTap={{ scale: 0.95 }}
        animate={{ backgroundColor: justSaved ? 'var(--ok)' : 'var(--accent)' }}
      >
        {justSaved ? '✓ Готово' : submitLabel}
      </motion.button>
    </form>
  );
}

export function Field({ label, children }) {
  return (
    <label>
      {label}
      {children}
    </label>
  );
}
