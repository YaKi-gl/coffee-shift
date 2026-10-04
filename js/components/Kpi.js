/**
 * Карточка ключевого показателя с подсказкой или динамикой.
 */
import { formatPercent } from '../utils/format.js';

/** Подпись динамики: зелёная при росте, красная при падении. */
export function changeHint(change) {
  if (change === null || !Number.isFinite(change) || change === 0) return '';
  const modifier = change > 0 ? 'up' : 'down';
  return `<small class="kpi__hint kpi__hint--${modifier}">${formatPercent(change)} к пред. неделе</small>`;
}

export const Kpi = ({ label, value, hint = '' }) => `
  <div class="kpi">
    <span class="kpi__label">${label}</span>
    <b class="kpi__value">${value}</b>
    ${hint}
  </div>`;
