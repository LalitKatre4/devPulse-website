import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Star, GitFork, AlertCircle, TrendingUp, Code2 } from 'lucide-react';
import type { AggregatedStats } from '@/types';
import { formatNumber, languageColor } from '@/lib/github';

interface StatsChartsProps {
  stats: AggregatedStats;
}

export function StatsCharts({ stats }: StatsChartsProps) {
  const topRepo = stats.topRepos[0];
  const chartData = stats.languages.slice(0, 8).map((l) => ({
    name: l.name,
    value: l.count,
    percent: l.percent,
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="glass rounded-2xl p-5 lg:col-span-2"
      >
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-cyan-300" />
          <h3 className="text-sm font-semibold text-slate-200">Language Breakdown</h3>
        </div>

        {chartData.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-slate-500">
            No language data available
          </div>
        ) : (
          <>
            <div className="relative mt-2 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={80}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={languageColor(entry.name)} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const p = payload[0].payload as { name: string; value: number; percent: number };
                        return (
                          <div className="rounded-lg border border-slate-700 bg-slate-900/95 px-3 py-2 text-xs text-slate-200 shadow-xl">
                            <span className="font-semibold">{p.name}</span>
                            <span className="ml-2 text-slate-400">
                              {p.value} repos · {p.percent.toFixed(1)}%
                            </span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-slate-100">
                  {chartData.length}
                </span>
                <span className="text-[10px] uppercase tracking-wide text-slate-500">
                  Languages
                </span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
              {chartData.slice(0, 6).map((l) => (
                <div key={l.name} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: languageColor(l.name) }}
                  />
                  {l.name}
                  <span className="text-slate-600">{l.percent.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass rounded-2xl p-5 lg:col-span-3"
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-300" />
          <h3 className="text-sm font-semibold text-slate-200">Repository Stats</h3>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <StatTile
            icon={Star}
            label="Total Stars"
            value={formatNumber(stats.totalStars)}
            color="amber"
          />
          <StatTile
            icon={GitFork}
            label="Total Forks"
            value={formatNumber(stats.totalForks)}
            color="cyan"
          />
          <StatTile
            icon={AlertCircle}
            label="Open Issues"
            value={formatNumber(stats.totalOpenIssues)}
            color="rose"
          />
        </div>

        {topRepo && (
          <div className="mt-4 rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-amber-300">
              <Star className="h-3.5 w-3.5" />
              Most Starred Repository
            </div>
            <a
              href={topRepo.html_url}
              target="_blank"
              rel="noreferrer"
              className="mt-1.5 block truncate text-base font-semibold text-cyan-300 hover:text-cyan-200"
            >
              {topRepo.full_name}
            </a>
            {topRepo.description && (
              <p className="mt-1 line-clamp-2 text-xs text-slate-400">
                {topRepo.description}
              </p>
            )}
            <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Star className="h-3 w-3 text-amber-400" />
                {formatNumber(topRepo.stars)}
              </span>
              <span className="inline-flex items-center gap-1">
                <GitFork className="h-3 w-3 text-cyan-400" />
                {formatNumber(topRepo.forks)}
              </span>
              {topRepo.language && (
                <span className="inline-flex items-center gap-1">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: languageColor(topRepo.language) }}
                  />
                  {topRepo.language}
                </span>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Star;
  label: string;
  value: string;
  color: 'amber' | 'cyan' | 'rose';
}) {
  const colorMap = {
    amber: 'text-amber-300',
    cyan: 'text-cyan-300',
    rose: 'text-rose-300',
  };
  return (
    <div className="rounded-xl border border-slate-700/40 bg-slate-800/20 p-3 text-center">
      <Icon className={`mx-auto h-5 w-5 ${colorMap[color]}`} />
      <div className="mt-1.5 text-xl font-bold text-slate-50">{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
    </div>
  );
}
