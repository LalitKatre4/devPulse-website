import type { AiMode, AiReview, AggregatedStats, GitHubUser } from '@/types';

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

interface GeminiRequestBody {
  contents: { parts: { text: string }[] }[];
}

interface GeminiResponse {
  candidates?: { content: { parts: { text: string }[] } }[];
  error?: { message: string };
}

function buildPrompt(
  user: GitHubUser,
  stats: AggregatedStats,
  mode: AiMode
): string {
  const topLangs = stats.languages.slice(0, 5).map((l) => l.name).join(', ') || 'N/A';
  const topRepo = stats.topRepos[0];
  const bio = user.bio ?? 'No bio provided';
  const accountYear = new Date(user.created_at).getFullYear();

  const persona =
    mode === 'roast'
      ? 'You are a sharp-witted senior developer doing a comedic roast of another developer based on their GitHub profile. Be funny, sarcastic, but not cruel. Keep it lighthearted.'
      : 'You are a thoughtful senior developer giving constructive, encouraging feedback to another developer based on their GitHub profile. Be specific and genuinely helpful.';

  return `${persona}

Analyze this GitHub developer profile and return EXACTLY three sections, each on its own line, prefixed with a label in this exact format:

STRENGTH: <one sentence>
GROWTH: <one sentence>
VERDICT: <one sentence>

Developer profile:
- Username: ${user.login}
- Name: ${user.name ?? user.login}
- Bio: ${bio}
- Followers: ${user.followers}
- Following: ${user.following}
- Public repos: ${user.public_repos}
- Account created: ${accountYear}
- Top languages: ${topLangs}
- Total stars: ${stats.totalStars}
- Total forks: ${stats.totalForks}
- Most starred repo: ${topRepo ? `${topRepo.name} (${topRepo.stars} stars)` : 'N/A'}

Return only the three labeled lines. No markdown, no extra commentary.`;
}

function parseReview(text: string): AiReview {
  const get = (label: string): string => {
    const re = new RegExp(`${label}:\\s*(.+)`, 'i');
    const m = text.match(re);
    return m ? m[1].trim() : '';
  };
  const strengths = get('STRENGTH');
  const growth = get('GROWTH');
  const verdict = get('VERDICT');
  return { strengths, growth, verdict, source: 'gemini' };
}

export async function generateReview(
  user: GitHubUser,
  stats: AggregatedStats,
  mode: AiMode
): Promise<AiReview> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  if (!apiKey) {
    return fallbackReview(user, stats, mode);
  }

  const body: GeminiRequestBody = {
    contents: [{ parts: [{ text: buildPrompt(user, stats, mode) }] }],
  };

  try {
    const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`Gemini HTTP ${res.status}`);
    }
    const data = (await res.json()) as GeminiResponse;
    if (data.error) throw new Error(data.error.message);
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    if (!text) throw new Error('Empty Gemini response');
    const parsed = parseReview(text);
    if (!parsed.strengths && !parsed.growth && !parsed.verdict) {
      throw new Error('Unparseable Gemini response');
    }
    return parsed;
  } catch {
    return fallbackReview(user, stats, mode);
  }
}

function fallbackReview(
  user: GitHubUser,
  stats: AggregatedStats,
  mode: AiMode
): AiReview {
  const topLang = stats.languages[0]?.name ?? 'a language';
  const secondLang = stats.languages[1]?.name;
  const year = new Date(user.created_at).getFullYear();
  const tenure = new Date().getFullYear() - year;
  const repoCount = user.public_repos;
  const starCount = stats.totalStars;
  const followerCount = user.followers;

  if (mode === 'roast') {
    const roasts = [
      `${repoCount} repos and only ${starCount} stars — that's a lot of projects nobody asked for.`,
      `Committing in ${topLang}${secondLang ? ` and ${secondLang}` : ''} — bold choice for someone with ${followerCount} followers.`,
      `${tenure} years on GitHub and this is what we have to show for it? The internet remembers everything.`,
    ];
    return {
      strengths: roasts[0],
      growth: roasts[1],
      verdict: roasts[2],
      source: 'fallback',
    };
  }

  return {
    strengths: `Solid foundation in ${topLang}${
      secondLang ? ` with breadth across ${secondLang}` : ''
    }, and ${repoCount} public repos shows consistent output over ${tenure} years.`,
    growth: `${starCount} total stars suggest room to grow community engagement — consider better READMEs, demos, and sharing work.`,
    verdict: `A ${tenure}-year veteran with ${followerCount} followers and a portfolio that keeps growing — steady and dependable.`,
    source: 'fallback',
  };
}
