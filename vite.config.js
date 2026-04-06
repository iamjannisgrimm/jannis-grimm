import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/",
  assetsInclude: ['src/assets/fonts/*.woff2', 'src/assets/fonts/*.woff']
});
