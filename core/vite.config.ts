import type { UserConfig } from 'vite';
import { resolve } from 'path';

export default {
  base: './',
  build: {
    outDir: 'dist/browser',
    sourcemap: true,
    minify: 'terser',
    lib: {
      entry: './src/index.ts',
      formats: ['es']
    },
    cssCodeSplit: true,
    rollupOptions: {
      input: [
        resolve(__dirname, './src/index.ts'),
      ],
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: '[name].js',
        assetFileNames: `[name].[ext]`
      }
    }
  }
} satisfies UserConfig;
