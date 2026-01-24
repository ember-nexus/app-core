import * as path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    isolate: false,
    reporters: ['default', 'html'],
    root: path.resolve(__dirname, '../.local'),
    include: [path.resolve(__dirname, '../test') + '/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: 'coverage',
      allowExternal: true,
      include: [path.resolve(__dirname, '../src') + '/**/*.ts'],
    },
  },
});
