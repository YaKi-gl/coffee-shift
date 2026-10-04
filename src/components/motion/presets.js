/**
 * Общие настройки анимаций, чтобы панели и списки двигались одинаково.
 */

/** Смена содержимого правой панели: въезд справа, уход влево. */
export const panelMotion = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.25, ease: 'easeOut' },
};

/** Каскадное появление дочерних элементов. */
export const staggerContainer = (stagger = 0.06, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

export const fadeUp = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };
