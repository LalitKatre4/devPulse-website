import { motion } from 'framer-motion';
import { ExternalLink, GitFork, Star, Archive, Code2 } from 'lucide-react';
import type { RepoStat } from '@/types';
import { formatNumber, languageColor } from '@/lib/github';

interface RepoListProps {
  repos: RepoStat[];
}

export function RepoList({ repos }: RepoListProps) {
  if (repos.length === 0) {
    return (
      <section className="glass rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-200">Top Repositories</h3>
        <p className="mt-3 text-sm text-slate-500">No public repositories found.</p>
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass rounded-2xl p-5 sm:p-6"
    >
      <div className="flex items-center gap-2">
        <Code2 className="h-4 w-4 text-cyan-300" />
        <h3 className="text-sm font-semibold text-slate-200">Top Repositories</h3>
        <span className="ml-auto text-xs text-slate-500">{repos.length} shown</span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {repos.map((repo, i) => (
          <motion.a
            key={repo.full_name}
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 * i }}
            className="group flex flex-col rounded-xl border border-slate-700/40 bg-slate-800/20 p-4 transition hover:border-cyan-400/30 hover:bg-slate-800/40"
          >
            <div className="flex items-start justify-between gap-2">
              <h4 className="truncate text-sm font-semibold text-cyan-300 group-hover:text-cyan-200">
                {repo.name}
              </h4>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-600 transition group-hover:text-cyan-400" />
            </div>

            {repo.description && (
              <p className="mt-1.5 line-clamp-2 text-xs text-slate-400">{repo.description}</p>
            )}

            <div className="mt-auto flex flex-wrap items-center gap-3 pt-3 text-xs text-slate-500">
              {repo.language && (
                <span className="inline-flex items-center gap-1">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: languageColor(repo.language) }}
                  />
                  {repo.language}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <Star className="h-3 w-3 text-amber-400" />
                {formatNumber(repo.stars)}
              </span>
              <span className="inline-flex items-center gap-1">
                <GitFork className="h-3 w-3 text-cyan-400" />
                {formatNumber(repo.forks)}
              </span>
              {repo.archived && (
                <span className="inline-flex items-center gap-1 text-slate-500">
                  <Archive className="h-3 w-3" />
                  Archived
                </span>
              )}
            </div>
          </motion.a>
        ))}
      </div>
    </motion.section>
  );
}
