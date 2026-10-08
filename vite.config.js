import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'

// https://vite.dev/config/
function readOnlyCatalogProxy(origin) {
  const allowed = new Set(['coach-profiles', 'plans', 'couple-plans', 'tiers', 'site-settings', 'program-content', 'testimonials']);
  return { name: 'read-only-catalog-preview', configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (!req.url?.startsWith('/catalog-preview/')) return next();
      const match = req.url.match(/^\/catalog-preview\/admin_functions\/([a-z-]+)\/$/);
      if (req.method !== 'GET' || !match || !allowed.has(match[1])) { res.statusCode=405; res.end('Read-only preview'); return; }
      try {
        const url = new URL(origin);
        if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Invalid origin');
        const response = await fetch(`${url.origin}/admin_functions/${match[1]}/`, { signal: AbortSignal.timeout(10000), headers: { Accept: 'application/json' } });
        res.statusCode=response.status; res.setHeader('Content-Type','application/json'); res.end(await response.text());
      } catch { res.statusCode=502; res.end(JSON.stringify({detail:'Preview catalogue unavailable'})); }
    });
  }};
}
export default defineConfig(({ mode }) => ({
  resolve: { dedupe: ['react', 'react-dom'] },
  plugins: [react(), readOnlyCatalogProxy(loadEnv(mode, process.cwd()).VITE_CATALOG_PREVIEW_URL || 'https://apibe.betrufit.com')],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'framer-motion': ['framer-motion'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    sourcemap: false, // Disable sourcemaps in production for smaller builds
    minify: 'esbuild', // Fast minification
  },
  esbuild: {
    // Strip console.log and console.warn in production builds
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
  },
}))
