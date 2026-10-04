/** Анимация строк таблиц: новая строка вспыхивает цветом «крема», удалённая уходит влево. */
export const rowMotion = {
  layout: true,
  initial: { opacity: 0, backgroundColor: 'var(--crema-soft)' },
  animate: { opacity: 1, backgroundColor: 'rgba(0, 0, 0, 0)', transition: { backgroundColor: { delay: 0.4, duration: 0.8 } } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.2 } },
};
