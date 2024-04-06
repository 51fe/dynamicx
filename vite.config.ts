import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig(({ mode }) => {
  const isEs = mode === 'es'
  return {
    build: {
      lib: {
        entry: './lib/index.ts',
        name: 'dynamicx',
        fileName: 'dynamicx',
        formats: [isEs ? 'es' : 'umd']
      },
      emptyOutDir: isEs,
      minify: !isEs
    },
    plugins: isEs ? [dts({ rollupTypes: true })] : []
  }
})