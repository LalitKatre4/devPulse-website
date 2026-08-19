import { useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SearchHeader } from '@/components/SearchHeader';
import { ProfileOverview } from '@/components/ProfileOverview';
import { StatsCharts } from '@/components/StatsCharts';
import { AiReviewCard } from '@/components/AiReviewCard';
import { RepoList } from '@/components/RepoList';
import { DashboardSkeleton, ErrorState, EmptyState } from '@/components/States';
import { aggregateStats, fetchGitHubRepos, fetchGitHubUser, GitHubError } from '@/lib/github';
import type { FetchStatus, GitHubRepo, GitHubUser, AggregatedStats } from '@/types';

function App() {
  const [status, setStatus] = useState<FetchStatus>('idle');
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [stats, setStats] = useState<AggregatedStats | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | undefined>();
  const [lastQuery, setLastQuery] = useState('');

  const runSearch = useCallback(async (username: string) => {
    setLastQuery(username);
    setStatus('loading');
    setErrorMsg(undefined);
    try {
      const [u, r] = await Promise.all([
        fetchGitHubUser(username),
        fetchGitHubRepos(username),
      ]);
      setUser(u);
      setRepos(r);
      setStats(aggregateStats(r));
      setStatus('success');
    } catch (err) {
      if (err instanceof GitHubError) {
        if (err.status === 404) setStatus('notfound');
        else if (err.status === 403) setStatus('rate');
        else setStatus('error');
        setErrorMsg(err.message);
      } else {
        setStatus('error');
        setErrorMsg(err instanceof Error ? err.message : undefined);
      }
      setUser(null);
      setRepos([]);
      setStats(null);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-200">
      <SearchHeader onSearch={runSearch} loading={status === 'loading'} />

      <main className="pb-16">
        <AnimatePresence mode="wait">
          {status === 'idle' && <EmptyState key="empty" />}

          {status === 'loading' && <DashboardSkeleton key="loading" />}

          {status === 'success' && user && stats && (
            <div
              key="success"
              className="mx-auto max-w-6xl space-y-4 px-4"
            >
              <ProfileOverview user={user} />
              <StatsCharts stats={stats} />
              <div className="grid gap-4 lg:grid-cols-5">
                <div className="lg:col-span-3">
                  <RepoList repos={stats.topRepos} />
                </div>
                <div className="lg:col-span-2">
                  <AiReviewCard user={user} stats={stats} />
                </div>
              </div>
            </div>
          )}

          {(status === 'notfound' || status === 'rate' || status === 'error') && (
            <ErrorState
              key={status}
              status={status}
              message={errorMsg}
              onRetry={() => runSearch(lastQuery)}
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-slate-800/50 py-6">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs text-slate-600">
         Developed by Lalit katre. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
