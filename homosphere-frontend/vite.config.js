import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import http from 'http';
import {defineConfig, loadEnv} from 'vite';

function paypalRedirectPlugin() {
  return {
    name: 'paypal-redirect-plugin',
    configureServer() {
      const server = http.createServer((req, res) => {
        if (req.url && req.url.startsWith('/paypal-checkout')) {
          res.writeHead(302, { Location: `http://localhost:3000${req.url}` });
          res.end();
        } else {
          res.writeHead(404);
          res.end('Not Found');
        }
      });
      
      server.on('error', (e) => {
        console.error('PayPal proxy port 5173 could not be started:', e.message);
      });
      
      server.listen(5173, () => {
        console.log('PayPal redirect proxy listening on port 5173 -> forwarding to 3000');
      });
    }
  };
}

export default defineConfig(({mode}) => {
  const envFilePath = path.resolve(__dirname, 'env');
  const envFromFile = fs.existsSync(envFilePath)
    ? dotenv.parse(fs.readFileSync(envFilePath))
    : {};
  const env = {
    ...envFromFile,
    ...loadEnv(mode, '.', ''),
  };

  return {
    plugins: [react(), tailwindcss(), paypalRedirectPlugin()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || ''),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || ''),
      'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(
        env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
      ),
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: 'localhost',
    },
  };
});
