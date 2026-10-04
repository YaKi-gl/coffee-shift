/**
 * Константы предметной области.
 */

/** Вкладки приложения: id → подпись. */
export const TAB_LABELS = {
  overview: 'Обзор',
  shifts: 'Смены',
  writeoffs: 'Списания',
  revenue: 'Выручка',
};

export const WRITEOFF_REASONS = [
  'Истёк срок',
  'Брак / порча',
  'Ошибка приготовления',
  'Дегустация / проработка',
  'Другое',
];

export const UNITS = ['шт', 'л', 'кг'];

/** Сколько дней показывать на графике выручки. */
export const CHART_DAYS = 14;

/** За какой период считать списания на обзоре. */
export const WRITEOFF_PERIOD_DAYS = 30;

export const STORAGE_KEY = 'coffee-shift:data';
