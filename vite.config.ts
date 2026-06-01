import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";

import manifest from "./src/manifest.json";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        index: "index.html", // popup HTML
      },
      onwarn(warning, warn) {
        if (warning.code === 'INVALID_ANNOTATION') return;
        warn(warning);
      }
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: [
      '@polkadot/api',
      '@polkadot/api-derive',
      '@polkadot/types-codec',
      '@polkadot/x-global',
    ]
  }
});
