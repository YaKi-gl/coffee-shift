/**
 * Утилиты форматирования и безопасного вывода.
 */

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Экранирует пользовательский текст перед вставкой в HTML (защита от XSS). */
export const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);

/** 44328 → «44 328 ₽» */
export const formatRub = (value) => `${Math.round(value).toLocaleString('ru-RU')} ₽`;

/** +11.2% / −3.4% */
export const formatPercent = (value) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;

export const createId = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

const compact = new Intl.NumberFormat('ru-RU', { notation: 'compact', maximumFractionDigits: 1 });

/** 105042 → «105 тыс. ₽» — для коротких подписей */
export const formatRubCompact = (value) => `${compact.format(Math.round(value))} ₽`;
