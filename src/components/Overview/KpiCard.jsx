import { motion } from 'framer-motion';
import { formatPercent } from '../../utils/format.js';
import { fadeUp } from '../motion/presets.js';
import { AnimatedNumber } from '../ui/AnimatedNumber.jsx';

/** Подпись динамики: зелёная при росте, красная при падении. */
function Change({ value }) {
  if (value === null || !Number.isFinite(value) || value === 0) return null;
  const up = value > 0;
  return (
    <small className={`kpi__hint kpi__hint--${up ? 'up' : 'down'}`}>
      {up ? '▲' : '▼'} {formatPercent(value)} к пред. неделе
    </small>
  );
}

/** Карточка показателя: число «докручивается» при изменении данных. */
export function KpiCard({ label, value, format, change, hint }) {
  return (
    <motion.div className="kpi" variants={fadeUp} whileHover={{ y: -3 }}>
      <span className="kpi__label">{label}</span>
      <b className="kpi__value">
        <AnimatedNumber value={value} format={format} />
      </b>
      {change !== undefined ? <Change value={change} /> : <small className="kpi__hint">{hint}</small>}
    </motion.div>
  );
}
