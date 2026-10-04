import { AnimatePresence, motion } from 'framer-motion';
import { Header } from './components/Header/Header.jsx';
import { OverviewView } from './components/Overview/OverviewView.jsx';
import { RevenueView } from './components/Revenue/RevenueView.jsx';
import { ShiftsView } from './components/Shifts/ShiftsView.jsx';
import { Tabs } from './components/Tabs/Tabs.jsx';
import { WriteoffsView } from './components/Writeoffs/WriteoffsView.jsx';
import { useCoffeeShop } from './hooks/useCoffeeShop.js';

export default function App() {
  const { state, actions } = useCoffeeShop();
  const { data, tab, weekStart, weekDirection } = state;

  const views = {
    overview: <OverviewView data={data} />,
    shifts: (
      <ShiftsView
        shifts={data.shifts}
        weekStart={weekStart}
        direction={weekDirection}
        onMoveWeek={actions.moveWeek}
        onAdd={actions.addShift}
        onRemove={actions.remove}
      />
    ),
    writeoffs: <WriteoffsView writeoffs={data.writeoffs} onAdd={actions.addWriteoff} onRemove={actions.remove} />,
    revenue: <RevenueView days={data.days} onSave={actions.saveDay} onRemove={actions.remove} />,
  };

  return (
    <div className="app">
      <Header />
      <Tabs active={tab} onChange={actions.setTab} />

      <AnimatePresence mode="wait">
        <motion.main
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {views[tab]}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
