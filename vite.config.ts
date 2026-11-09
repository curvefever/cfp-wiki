import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

function prismComponentImports() {
  return {
    name: 'prism-component-imports',
    transform(code: string, id: string) {
      const modulePath = id.replace(/\\/g, '/').split('?')[0]

      if (!modulePath.includes('/node_modules/prismjs/components/prism-')) {
        return null
      }

      return `import Prism from '../prism.js';\n${code}`
    },
  }
}

export default defineConfig({
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    prismComponentImports(),
    tanstackStart(),
    viteReact(),
    nitro({
      preset: 'cloudflare-module',
      compatibilityDate: '2026-04-25',
    }),
  ],
})