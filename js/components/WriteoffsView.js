/**
 * Вкладка «Списания»: форма и журнал списаний.
 */
import { UNITS, WRITEOFF_REASONS } from '../config.js';
import { formatDay, todayIso } from '../utils/date.js';
import { escapeHtml, formatRub } from '../utils/format.js';

const options = (values) => values.map((v) => `<option>${v}</option>`).join('');

const Row = (w) => `
  <tr>
    <td>${formatDay(w.date)}</td>
    <td>${escapeHtml(w.item)} ${w.example ? '<span class="tag">пример</span>' : ''}</td>
    <td>${escapeHtml(w.reason)}</td>
    <td class="num">${escapeHtml(w.qty)} ${escapeHtml(w.unit)}</td>
    <td class="num">${formatRub(Number(w.cost) || 0)}</td>
    <td><button class="icon-btn" aria-label="Удалить" data-action="remove" data-collection="writeoffs" data-id="${w.id}">×</button></td>
  </tr>`;

export function WriteoffsView({ writeoffs }) {
  const rows = [...writeoffs].sort((a, b) => b.date.localeCompare(a.date));

  const table = rows.length
    ? `<div class="table-wrap"><table>
         <thead><tr><th>Дата</th><th>Позиция</th><th>Причина</th><th class="num">Кол-во</th><th class="num">Сумма</th><th></th></tr></thead>
         <tbody>${rows.map(Row).join('')}</tbody>
       </table></div>`
    : '<div class="empty">Списаний пока нет. Заполните форму выше.</div>';

  return `
    <section class="panel">
      <h2>Журнал списаний</h2>
      <form class="entry-form" data-form="writeoff">
        <label>Дата<input type="date" id="wo-date" name="date" required value="${todayIso()}"></label>
        <label>Позиция<input type="text" id="wo-item" name="item" required placeholder="Молоко 3,2%"></label>
        <label>Кол-во<input type="number" id="wo-qty" name="qty" min="0" step="0.1" required value="1"></label>
        <label>Ед.<select id="wo-unit" name="unit">${options(UNITS)}</select></label>
        <label>Сумма, ₽<input type="number" id="wo-cost" name="cost" min="0" required></label>
        <label>Причина<select id="wo-reason" name="reason">${options(WRITEOFF_REASONS)}</select></label>
        <button class="btn">Списать</button>
      </form>
      ${table}
    </section>`;
}
