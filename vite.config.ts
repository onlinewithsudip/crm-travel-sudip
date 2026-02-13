import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Fix: Property 'cwd' does not exist on type 'Process'. 
  // Cast process to any to access Node.js specific methods and properties in the Vite config context.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Fix: Ensure process.env.API_KEY is correctly defined by casting process to any.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || (process as any).env.API_KEY)
    },
    server: {
      port: 3000,
      host: true
    },
    build: {
      outDir: 'dist',
      sourcemap: true
    }
  };
});
