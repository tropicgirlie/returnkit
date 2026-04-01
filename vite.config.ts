
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';
  import tailwindcss from '@tailwindcss/vite';
  import path from 'path';

  export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        // figma:asset/ imports used in App.tsx (Figma Make export convention)
        'figma:asset/b79a2440b820226820205d8f1d771dd38cb5472f.png': path.resolve(__dirname, './src/assets/b79a2440b820226820205d8f1d771dd38cb5472f.png'),
        'figma:asset/4245d1eebb3ccdc1cc917aafeef7ba6e41981f4e.png': path.resolve(__dirname, './src/assets/4245d1eebb3ccdc1cc917aafeef7ba6e41981f4e.png'),
        'figma:asset/0295926140d4bd7df6ef13dd691844127b299fbf.png': path.resolve(__dirname, './src/assets/0295926140d4bd7df6ef13dd691844127b299fbf.png'),
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
    },
    server: {
      port: 3000,
      open: true,
    },
  });