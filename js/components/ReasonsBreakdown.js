/**
 * Разбивка списаний по причинам с горизонтальными полосами.
 */
import { escapeHtml, formatRub } from '../utils/format.js';

export function ReasonsBreakdown(rows) {
  if (!rows.length) return '<div class="empty">За период списаний нет.</div>';

  const max = Math.max(...rows.map((r) => r.total));
  return `
    <div class="reasons">
      ${rows
        .map(
          (r) => `
        <div class="reason">
          <span>${escapeHtml(r.reason)}</span>
          <span class="reason__sum">${formatRub(r.total)}</span>
          <div class="reason__bar"><i class="reason__fill" style="width:${(r.total / max) * 100}%"></i></div>
        </div>`,
        )
        .join('')}
    </div>`;
}
