import type {
  GitHubRepo,
  GitHubUser,
  AggregatedStats,
  LanguageStat,
  RepoStat,
} from '@/types';

const API_BASE = 'https://api.github.com';

export class GitHubError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'GitHubError';
  }
}

async function parseRateLimit(res: Response): Promise<string | undefined> {
  const remaining = res.headers.get('x-ratelimit-remaining');
  const reset = res.headers.get('x-ratelimit-reset');
  if (remaining === '0' && reset) {
    const resetDate = new Date(Number(reset) * 1000);
    const minutes = Math.max(1, Math.ceil((resetDate.getTime() - Date.now()) / 60000));
    return `GitHub API rate limit reached. Resets in ~${minutes} min.`;
  }
  return undefined;
}

export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  const res = await fetch(`${API_BASE}/users/${encodeURIComponent(username)}`, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (res.status === 404) {
    throw new GitHubError(404, `User "${username}" was not found on GitHub.`);
  }
  if (res.status === 403) {
    const rateMsg = await parseRateLimit(res);
    throw new GitHubError(403, rateMsg ?? 'GitHub API access forbidden.');
  }
  if (!res.ok) {
    throw new GitHubError(res.status, `Failed to fetch user (HTTP ${res.status}).`);
  }
  return (await res.json()) as GitHubUser;
}

export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  const res = await fetch(
    `${API_BASE}/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
    { headers: { Accept: 'application/vnd.github+json' } }
  );
  if (res.status === 404) {
    throw new GitHubError(404, `User "${username}" was not found on GitHub.`);
  }
  if (res.status === 403) {
    const rateMsg = await parseRateLimit(res);
    throw new GitHubError(403, rateMsg ?? 'GitHub API access forbidden.');
  }
  if (!res.ok) {
    throw new GitHubError(res.status, `Failed to fetch repositories (HTTP ${res.status}).`);
  }
  return (await res.json()) as GitHubRepo[];
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Scala: '#c22d40',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Lua: '#000080',
  Elixir: '#6e4a7e',
  Haskell: '#5e5086',
  Jupyter: '#DA5B0B',
  'Jupyter Notebook': '#DA5B0B',
  Astro: '#ff5a03',
  MDX: '#fcb32c',
  Dockerfile: '#384d54',
  Makefile: '#427819',
  PowerShell: '#012456',
};

export function languageColor(name: string): string {
  return LANG_COLORS[name] ?? '#22d3ee';
}

export function aggregateStats(repos: GitHubRepo[]): AggregatedStats {
  const langCounts: Record<string, number> = {};
  let totalStars = 0;
  let totalForks = 0;
  let totalOpenIssues = 0;

  const repoStats: RepoStat[] = repos.map((r) => {
    totalStars += r.stargazers_count;
    totalForks += r.forks_count;
    totalOpenIssues += r.open_issues_count;
    if (r.language) {
      langCounts[r.language] = (langCounts[r.language] ?? 0) + 1;
    }
    return {
      name: r.name,
      full_name: r.full_name,
      html_url: r.html_url,
      description: r.description,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      openIssues: r.open_issues_count,
      updated_at: r.updated_at,
      topics: r.topics ?? [],
      isFork: r.fork,
      archived: r.archived,
    };
  });

  const totalLangRepos = Object.values(langCounts).reduce((a, b) => a + b, 0) || 1;
  const languages: LanguageStat[] = Object.entries(langCounts)
    .map(([name, count]) => ({
      name,
      count,
      percent: (count / totalLangRepos) * 100,
    }))
    .sort((a, b) => b.count - a.count);

  const topRepos = [...repoStats].sort((a, b) => b.stars - a.stars).slice(0, 6);

  return { totalStars, totalForks, totalOpenIssues, topRepos, languages };
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export function yearFromDate(iso: string): string {
  return new Date(iso).getFullYear().toString();
}
