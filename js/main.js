/**
 * Точка входа: рендер активной вкладки и связывание событий с actions.
 */
import { OverviewView } from './components/OverviewView.js';
import { RevenueView } from './components/RevenueView.js';
import { ShiftsView } from './components/ShiftsView.js';
import { WriteoffsView } from './components/WriteoffsView.js';
import { isStorageAvailable } from './services/storage.js';
import { actions, state, subscribe } from './store.js';

const views = {
  overview: (s) => OverviewView(s.data),
  shifts: (s) => ShiftsView(s.data, s.weekStart),
  writeoffs: (s) => WriteoffsView(s.data),
  revenue: (s) => RevenueView(s.data),
};

const dom = {
  view: document.getElementById('view'),
  tabs: document.querySelectorAll('[data-tab]'),
  storageBadge: document.getElementById('storage-badge'),
};

function render(currentState) {
  dom.tabs.forEach((tab) => tab.setAttribute('aria-selected', String(tab.dataset.tab === currentState.tab)));
  dom.view.innerHTML = views[currentState.tab](currentState);
}

/** Отправка форм: какой action вызвать для какой формы. */
const formHandlers = {
  shift: (values) => actions.addShift(values),
  writeoff: (values) => actions.addWriteoff(values),
  day: (values) => actions.saveDay(values),
};

document.addEventListener('click', (event) => {
  const tab = event.target.closest('[data-tab]');
  if (tab) return actions.setTab(tab.dataset.tab);

  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const { action, offset, collection, id } = button.dataset;
  if (action === 'move-week') actions.moveWeek(Number(offset));
  if (action === 'remove') actions.remove(collection, id);
});

document.addEventListener('submit', (event) => {
  const handler = formHandlers[event.target.dataset.form];
  if (!handler) return;
  event.preventDefault();
  handler(Object.fromEntries(new FormData(event.target)));
});

dom.storageBadge.textContent = isStorageAvailable()
  ? 'данные хранятся в этом браузере'
  : 'хранилище недоступно · изменения не сохранятся';

subscribe(render);
render(state);
