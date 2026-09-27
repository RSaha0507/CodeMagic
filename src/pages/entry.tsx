import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import type { ComponentType } from 'react';
import '../index.css';

const pageName = document.body.dataset.page;

const pages: Record<string, () => Promise<{ default: ComponentType }>> = {
  landing: () => import('./landing'),
  dashboard: () => import('./dashboard'),
  problems: () => import('./problems'),
  roadmap: () => import('./roadmap'),
  leaderboard: () => import('./leaderboard'),
  submissions: () => import('./submissions'),
  problem: () => import('./problem'),
  visualizer: () => import('./visualizer'),
};

const loadPage = pageName ? pages[pageName] : undefined;

if (!loadPage) {
  throw new Error('Unknown CodeMagic page entry.');
}

void loadPage().then(({ default: Page }) => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Page />
    </StrictMode>
  );
});
