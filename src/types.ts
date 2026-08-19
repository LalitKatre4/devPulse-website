export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  topics: string[];
  visibility: string;
  archived: boolean;
  disabled: boolean;
}

export interface RepoStat {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  updated_at: string;
  topics: string[];
  isFork: boolean;
  archived: boolean;
}

export interface LanguageStat {
  name: string;
  count: number;
  percent: number;
}

export interface AggregatedStats {
  totalStars: number;
  totalForks: number;
  totalOpenIssues: number;
  topRepos: RepoStat[];
  languages: LanguageStat[];
}

export type AiMode = 'constructive' | 'roast';

export interface AiReview {
  strengths: string;
  growth: string;
  verdict: string;
  source: 'gemini' | 'fallback';
}

export type FetchStatus = 'idle' | 'loading' | 'success' | 'notfound' | 'rate' | 'error';

export interface FetchState {
  status: FetchStatus;
  user: GitHubUser | null;
  repos: GitHubRepo[];
  stats: AggregatedStats | null;
  message?: string;
}
