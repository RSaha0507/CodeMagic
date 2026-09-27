export type PageName = 'home' | 'dashboard' | 'problems' | 'roadmap' | 'leaderboard' | 'submissions';

export const pagePaths: Record<PageName, string> = {
  home: '/',
  dashboard: '/dashboard/',
  problems: '/problems/',
  roadmap: '/roadmap/',
  leaderboard: '/leaderboard/',
  submissions: '/submissions/',
};

export function problemPath(problemId: string): string {
  return `/problem/?id=${encodeURIComponent(problemId)}`;
}

export function visualizerPath(algorithmId: string): string {
  return `/visualizer/?algorithm=${encodeURIComponent(algorithmId)}`;
}
