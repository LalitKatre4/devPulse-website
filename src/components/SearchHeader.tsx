import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Activity, Github, Search, Sparkles } from 'lucide-react';

interface SearchHeaderProps {
  onSearch: (username: string) => void;
  loading: boolean;
}

const SAMPLES = ['torvalds', 'gaearon', 'sindresorhus', 'yyx990803'];

export function SearchHeader({ onSearch, loading }: SearchHeaderProps) {
  const [value, setValue] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onSearch(trimmed);
  };

  return (
    <header className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -top-20 right-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-10 pb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-emerald-400/10 ring-1 ring-cyan-400/30">
                <Activity className="h-6 w-6 text-cyan-300" />
              </div>
              <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-70" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-300 glow-dot" />
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-glow-cyan sm:text-3xl">
                DevPulse
              </h1>
              <p className="text-xs text-slate-400 sm:text-sm">
                Analyze GitHub Profiles with AI Insights
              </p>
            </div>
          </div>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-sm text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-300"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">Repo</span>
          </a>
        </div>

        <form onSubmit={submit} className="mt-8">
          <div className="group relative flex items-center gap-2 rounded-2xl glass p-2 transition focus-within:border-cyan-400/40">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center text-slate-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter a GitHub username…"
              spellCheck={false}
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent py-2 text-base text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
            <motion.button
              type="submit"
              disabled={loading || !value.trim()}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-900 transition btn-glow disabled:opacity-50 disabled:shadow-none sm:px-6"
            >
              {loading ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  Pulsing…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Pulse Check
                </>
              )}
            </motion.button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500">Try:</span>
            {SAMPLES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setValue(s);
                  onSearch(s);
                }}
                className="rounded-full border border-slate-700/50 bg-slate-800/30 px-3 py-1 text-xs text-slate-400 transition hover:border-cyan-400/40 hover:text-cyan-300"
              >
                {s}
              </button>
            ))}
          </div>
        </form>
      </div>
    </header>
  );
}
