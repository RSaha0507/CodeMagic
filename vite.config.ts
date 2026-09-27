import { access, mkdir, rename, rm } from 'node:fs/promises';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const secondaryPages = ['dashboard', 'problems', 'roadmap', 'leaderboard', 'submissions', 'problem', 'visualizer'] as const;

function hasSecondaryPage(value: string): value is typeof secondaryPages[number] {
  return (secondaryPages as readonly string[]).includes(value);
}

function organizeMpaEntries(): Plugin {
  let outputDirectory = path.join(projectRoot, 'dist');

  return {
    name: 'codemagic-organize-mpa-entries',
    configResolved(config) {
      outputDirectory = path.resolve(config.build.outDir);
    },
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        const requestUrl = request.url ?? '/';
        const [pathname, query = ''] = requestUrl.split('?');
        const match = pathname.match(/^\/([^/]+)\/$/);
        const pageName = match?.[1];

        if (pageName && hasSecondaryPage(pageName)) {
          request.url = `/pages/${pageName}.html${query ? `?${query}` : ''}`;
        }

        next();
      });
    },
    async closeBundle() {
      const sourceDirectory = path.join(outputDirectory, 'pages');

      for (const pageName of secondaryPages) {
        const source = path.join(sourceDirectory, `${pageName}.html`);
        const destinationDirectory = path.join(outputDirectory, pageName);
        const destination = path.join(destinationDirectory, 'index.html');

        try {
          await access(source);
        } catch {
          continue;
        }

        await mkdir(destinationDirectory, { recursive: true });
        await rename(source, destination);
      }

      await rm(sourceDirectory, { recursive: true, force: true });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), organizeMpaEntries()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  build: {
    rollupOptions: {
      input: {
        landing: fileURLToPath(new URL('./index.html', import.meta.url)),
        dashboard: fileURLToPath(new URL('./pages/dashboard.html', import.meta.url)),
        problems: fileURLToPath(new URL('./pages/problems.html', import.meta.url)),
        roadmap: fileURLToPath(new URL('./pages/roadmap.html', import.meta.url)),
        leaderboard: fileURLToPath(new URL('./pages/leaderboard.html', import.meta.url)),
        submissions: fileURLToPath(new URL('./pages/submissions.html', import.meta.url)),
        problem: fileURLToPath(new URL('./pages/problem.html', import.meta.url)),
        visualizer: fileURLToPath(new URL('./pages/visualizer.html', import.meta.url)),
      },
    },
  },
});
