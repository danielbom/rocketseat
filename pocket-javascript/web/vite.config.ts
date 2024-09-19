import { defineConfig } from 'vite'
import swc from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [swc()],
})
