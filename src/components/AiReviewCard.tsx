import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Flame,
  Heart,
  Lightbulb,
  Loader2,
  RefreshCw,
  Scale,
  Sparkles,
} from 'lucide-react';
import type { AiMode, AiReview, AggregatedStats, GitHubUser } from '@/types';
import { generateReview } from '@/lib/gemini';

interface AiReviewCardProps {
  user: GitHubUser;
  stats: AggregatedStats;
}

export function AiReviewCard({ user, stats }: AiReviewCardProps) {
  const [mode, setMode] = useState<AiMode>('constructive');
  const [review, setReview] = useState<AiReview | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setReview(null);
    generateReview(user, stats, mode).then((r) => {
      if (active) {
        setReview(r);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [user, stats, mode]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="glass rounded-2xl p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400/20 to-emerald-400/10 ring-1 ring-cyan-400/30">
            <Bot className="h-4 w-4 text-cyan-300" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">AI Developer Review</h3>
            <p className="text-[11px] text-slate-500">Powered by Gemini</p>
          </div>
        </div>

        <div className="inline-flex rounded-lg border border-slate-700/60 bg-slate-800/40 p-0.5">
          <button
            onClick={() => setMode('constructive')}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              mode === 'constructive'
                ? 'bg-cyan-400/15 text-cyan-300'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <Scale className="h-3.5 w-3.5" />
            Constructive
          </button>
          <button
            onClick={() => setMode('roast')}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              mode === 'roast'
                ? 'bg-rose-400/15 text-rose-300'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            Dev Roast
          </button>
        </div>
      </div>

      <div className="mt-5">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <SkeletonLine />
              <SkeletonLine />
              <SkeletonLine />
            </motion.div>
          ) : review ? (
            <motion.div
              key={`${mode}-${review.source}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <ReviewRow
                icon={Heart}
                label="Strength"
                color="emerald"
                text={review.strengths}
              />
              <ReviewRow
                icon={Lightbulb}
                label="Growth Area"
                color="cyan"
                text={review.growth}
              />
              <ReviewRow
                icon={mode === 'roast' ? Flame : Sparkles}
                label={mode === 'roast' ? 'Roast Verdict' : 'Fun Verdict'}
                color={mode === 'roast' ? 'rose' : 'amber'}
                text={review.verdict}
              />

              {review.source === 'fallback' && (
                <p className="pt-1 text-[11px] text-slate-600">
                  Fallback analysis shown — set VITE_GEMINI_API_KEY in your .env for live AI reviews.
                </p>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <button
        onClick={() => {
          setLoading(true);
          setReview(null);
          generateReview(user, stats, mode).then((r) => {
            setReview(r);
            setLoading(false);
          });
        }}
        disabled={loading}
        className="mt-5 inline-flex items-center gap-1.5 text-xs text-slate-400 transition hover:text-cyan-300 disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
        Regenerate
      </button>
    </motion.section>
  );
}

function ReviewRow({
  icon: Icon,
  label,
  color,
  text,
}: {
  icon: typeof Heart;
  label: string;
  color: 'emerald' | 'cyan' | 'rose' | 'amber';
  text: string;
}) {
  const colorMap = {
    emerald: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20',
    cyan: 'text-cyan-300 bg-cyan-400/10 border-cyan-400/20',
    rose: 'text-rose-300 bg-rose-400/10 border-rose-400/20',
    amber: 'text-amber-300 bg-amber-400/10 border-amber-400/20',
  };
  return (
    <div className="flex gap-3">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${colorMap[color]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </div>
        <p className="mt-0.5 text-sm leading-relaxed text-slate-200">{text}</p>
      </div>
    </div>
  );
}

function SkeletonLine() {
  return (
    <div className="flex gap-3">
      <div className="skeleton h-8 w-8 shrink-0 rounded-lg" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-4/5 rounded" />
      </div>
    </div>
  );
}
