import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base — путь, по которому сайт открывается на GitHub Pages: https://<user>.github.io/coffee-shift/
export default defineConfig({
  plugins: [react()],
  base: '/coffee-shift/',
});
