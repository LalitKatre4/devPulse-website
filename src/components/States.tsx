import { motion } from 'framer-motion';
import { AlertTriangle, Frown, ServerCrash, Search } from 'lucide-react';
import type { FetchStatus } from '@/types';

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 pb-16">
      <div className="glass rounded-2xl p-6">
        <div className="flex gap-5">
          <div className="skeleton h-28 w-28 rounded-2xl" />
          <div className="flex-1 space-y-3 pt-2">
            <div className="skeleton h-6 w-48 rounded" />
            <div className="skeleton h-4 w-32 rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-3/4 rounded" />
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-20 rounded-xl" />
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="skeleton h-72 rounded-2xl lg:col-span-2" />
        <div className="skeleton h-72 rounded-2xl lg:col-span-3" />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="skeleton h-64 rounded-2xl lg:col-span-3" />
        <div className="skeleton h-64 rounded-2xl lg:col-span-2" />
      </div>
    </div>
  );
}

interface ErrorStateProps {
  status: FetchStatus;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ status, message, onRetry }: ErrorStateProps) {
  const config = {
    notfound: {
      icon: Frown,
      title: 'User Not Found',
      desc: message ?? "That GitHub username doesn't exist. Double-check the spelling and try again.",
      color: 'amber',
    },
    rate: {
      icon: ServerCrash,
      title: 'Rate Limit Reached',
      desc: message ?? "GitHub's API rate limit was hit. Please wait a bit and try again.",
      color: 'rose',
    },
    error: {
      icon: AlertTriangle,
      title: 'Something Went Wrong',
      desc: message ?? 'An unexpected error occurred while fetching data.',
      color: 'amber',
    },
  } as const;

  const c = config[status as keyof typeof config] ?? config.error;
  const Icon = c.icon;
  const colorMap = {
    amber: 'text-amber-300 bg-amber-400/10 border-amber-400/20',
    rose: 'text-rose-300 bg-rose-400/10 border-rose-400/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-md px-4 pb-16"
    >
      <div className="glass rounded-2xl p-8 text-center">
        <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border ${colorMap[c.color]}`}>
          <Icon className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-100">{c.title}</h3>
        <p className="mt-2 text-sm text-slate-400">{c.desc}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300 transition hover:bg-cyan-400/20"
          >
            <Search className="h-4 w-4" />
            Try Again
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-md px-4 pb-16 pt-8 text-center"
    >
      <div className="glass rounded-2xl p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/5">
          <Search className="h-8 w-8 text-cyan-300" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-100">
          Search a GitHub profile
        </h3>
        <p className="mt-2 text-sm text-slate-400">
          Enter any username above to see their stats, language breakdown, top repos, and an AI-powered developer review.
        </p>
      </div>
    </motion.div>
  );
}
