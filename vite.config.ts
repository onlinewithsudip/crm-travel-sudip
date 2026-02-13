import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Use (process as any).cwd() to bypass the TypeScript error where 'cwd' is not defined on the global 'Process' type.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Access process.env through an any cast to ensure compatibility with the build-time environment.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || (process as any).env.API_KEY)
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: false
    },
    server: {
      port: 3000
    }
  };
});