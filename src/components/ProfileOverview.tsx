import { motion } from 'framer-motion';
import {
  Building2,
  Calendar,
  ExternalLink,
  GitFork,
  Github,
  Globe,
  Heart,
  Link2,
  MapPin,
  Package,
  Users,
} from 'lucide-react';
import type { GitHubUser } from '@/types';
import { formatNumber, yearFromDate } from '@/lib/github';

interface ProfileOverviewProps {
  user: GitHubUser;
}

export function ProfileOverview({ user }: ProfileOverviewProps) {
  const stats = [
    { icon: Users, label: 'Followers', value: formatNumber(user.followers), accent: 'cyan' },
    { icon: Heart, label: 'Following', value: formatNumber(user.following), accent: 'rose' },
    { icon: Package, label: 'Public Repos', value: formatNumber(user.public_repos), accent: 'emerald' },
    { icon: GitFork, label: 'Public Gists', value: formatNumber(user.public_gists), accent: 'amber' },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-2xl p-5 sm:p-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="relative shrink-0">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-cyan-400/30 to-emerald-400/20 blur-md" />
          <img
            src={user.avatar_url}
            alt={user.login}
            className="relative h-24 w-24 rounded-2xl object-cover ring-1 ring-cyan-400/30 sm:h-28 sm:w-28"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-50 sm:text-2xl">
                {user.name ?? user.login}
              </h2>
              <a
                href={user.html_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300"
              >
                <Github className="h-3.5 w-3.5" />
                @{user.login}
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
              <Calendar className="h-3.5 w-3.5" />
              Joined {yearFromDate(user.created_at)}
            </div>
          </div>

          {user.bio && (
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{user.bio}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
            {user.company && (
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-slate-500" />
                {user.company}
              </span>
            )}
            {user.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-500" />
                {user.location}
              </span>
            )}
            {user.blog && (
              <a
                href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 transition hover:text-cyan-300"
              >
                <Globe className="h-3.5 w-3.5 text-slate-500" />
                {user.blog.replace(/^https?:\/\//, '')}
              </a>
            )}
            {user.twitter_username && (
              <span className="inline-flex items-center gap-1.5">
                <Link2 className="h-3.5 w-3.5 text-slate-500" />
                @{user.twitter_username}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          const colorMap: Record<string, string> = {
            cyan: 'text-cyan-300 border-cyan-400/20 bg-cyan-400/5',
            rose: 'text-rose-300 border-rose-400/20 bg-rose-400/5',
            emerald: 'text-emerald-300 border-emerald-400/20 bg-emerald-400/5',
            amber: 'text-amber-300 border-amber-400/20 bg-amber-400/5',
          };
          return (
            <div
              key={s.label}
              className={`rounded-xl border p-3 ${colorMap[s.accent]}`}
            >
              <Icon className="h-4 w-4 opacity-80" />
              <div className="mt-2 text-lg font-semibold text-slate-50">{s.value}</div>
              <div className="text-[11px] uppercase tracking-wide text-slate-400">
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
