import { renderIntroCard } from "./components/IntroCard.js";
import { renderSubredditChart } from "./components/SubredditChart.js";
import { renderKarmaTrophy } from "./components/KarmaTrophy.js";
import { renderAccountCard } from "./components/AccountCard.js";
import { renderActivityCard } from "./components/ActivityCard.js";
import { renderEngagementCard } from "./components/EngagementCard.js";

const MONTHS_SV = [
  "Januari",
  "Februari",
  "Mars",
  "April",
  "Maj",
  "Juni",
  "Juli",
  "Augusti",
  "September",
  "Oktober",
  "November",
  "December",
];

const TARGET_YEAR = 2025;
const MOCK_PATH = "./public/data/mock_stats.json";

function renderLayout() {
  const app = document.getElementById("app");
  if (!app) {
    console.log("Hittade inget #app-element");
    return;
  }

  app.innerHTML = `
    <section class="card hero">
      <div>
        <p class="eyebrow">Reddit Wrapped</p>
        <h1>Din personliga Reddit-resa</h1>
        <p class="tagline">Ange ditt Reddit-användarnamn för att hämta färska siffror direkt från Reddit API.</p>
        <form id="username-form" class="username-form" novalidate>
          <label for="username-input">Reddit-användarnamn</label>
          <div class="input-row">
            <span class="prefix">u/</span>
            <input id="username-input" name="username" type="text" placeholder="spez" autocomplete="off" required />
            <button type="submit">Hämta min wrapped</button>
          </div>
          <p id="status-message" class="status" aria-live="polite"></p>
        </form>
      </div>
      <div class="hero-badge" aria-hidden="true">2025</div>
    </section>
    <section id="results" class="results-grid"></section>
    <footer>Reddit Wrapped 2025 · Live-data med fallback till mock</footer>
  `;
}

function renderStats(data) {
  const results = document.getElementById("results");
  if (!results) {
    console.log("Kunde inte hitta results-kontainer");
    return;
  }

  const intro = renderIntroCard(data);
  const account = renderAccountCard(data);
  const chart = renderSubredditChart(data);
  const trophy = renderKarmaTrophy(data);
  const activity = renderActivityCard(data);
  const engagement = renderEngagementCard(data);

  results.innerHTML = `${intro}${account}${chart}${trophy}${activity}${engagement}`;
}

function setStatus(message, tone = "neutral") {
  const status = document.getElementById("status-message");
  if (!status) return;

  status.textContent = message;
  status.dataset.tone = tone;
}

async function fetchJson(url, label) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${label} kunde inte hämtas: ${response.status}`);
  }
  const json = await response.json();
  console.log(`Lyckades hämta ${label}`, json);
  return json;
}

async function fetchMockStats() {
  try {
    return await fetchJson(MOCK_PATH, "mockad statistik");
  } catch (error) {
    console.log("Kunde inte ladda mockdata", error);
    return null;
  }
}

function countEmojis(text) {
  if (!text) return [];
  const matches = text.match(/[\p{Extended_Pictographic}]/gu) || [];
  return matches;
}

function deriveEmojiUsage(items) {
  const emojiCounter = new Map();

  items.forEach((item) => {
    const content = item.body || item.title || item.selftext || "";
    const emojis = countEmojis(content);
    emojis.forEach((emoji) => {
      emojiCounter.set(emoji, (emojiCounter.get(emoji) || 0) + 1);
    });
  });

  if (!emojiCounter.size) {
    return { emoji: "🔥", count: 0 };
  }

  const [emoji, count] = [...emojiCounter.entries()].sort((a, b) => b[1] - a[1])[0];
  return { emoji, count };
}

function deriveMostActiveMonth(items) {
  if (!items.length) {
    return { month: "Ingen aktivitet ännu", count: 0 };
  }

  const monthCounts = new Map();

  items.forEach((item) => {
    const date = new Date(item.created_utc * 1000);
    const monthName = MONTHS_SV[date.getMonth()] || "Okänd";
    monthCounts.set(monthName, (monthCounts.get(monthName) || 0) + 1);
  });

  const [month, count] = [...monthCounts.entries()].sort((a, b) => b[1] - a[1])[0];
  return { month, count };
}

function deriveTopSubreddits(items) {
  const subredditCounts = new Map();

  items.forEach((item) => {
    if (!item.subreddit) return;
    subredditCounts.set(item.subreddit, (subredditCounts.get(item.subreddit) || 0) + 1);
  });

  if (!subredditCounts.size) return [];

  return [...subredditCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => ({ name: `r/${name}`, count }));
}

function deriveBestPost(posts, comments) {
  const combined = [
    ...posts.map((post) => ({ ...post, kind: "Inlägg", content: post.title || post.selftext || "" })),
    ...comments.map((comment) => ({ ...comment, kind: "Kommentar", content: comment.body || "" })),
  ];

  if (!combined.length) {
    return {
      type: "Inlägg",
      subreddit: "r/reddit",
      excerpt: "Gör ditt första avtryck så dyker den upp här!",
      karma: 0,
      published: new Date().toISOString().slice(0, 10),
    };
  }

  const sorted = combined.sort((a, b) => (b.score || 0) - (a.score || 0));
  const best = sorted[0];

  return {
    type: best.kind,
    subreddit: `r/${best.subreddit}`,
    excerpt: best.content.slice(0, 140) || "Inget innehåll angivet",
    karma: best.score || 0,
    published: new Date(best.created_utc * 1000).toISOString().slice(0, 10),
  };
}

function calculateAverages(posts, comments) {
  const totalPostKarma = posts.reduce((sum, post) => sum + (post.score || 0), 0);
  const totalCommentKarma = comments.reduce((sum, comment) => sum + (comment.score || 0), 0);

  const postAverage = posts.length ? Math.round(totalPostKarma / posts.length) : 0;
  const commentAverage = comments.length ? Math.round(totalCommentKarma / comments.length) : 0;

  return {
    post_average: postAverage,
    comment_average: commentAverage,
    total_post_karma: totalPostKarma,
    total_comment_karma: totalCommentKarma,
  };
}

function normalizeRedditStats(username, profile, postsResponse, commentsResponse) {
  const rawPosts = (postsResponse?.data?.children || []).map((entry) => entry.data);
  const rawComments = (commentsResponse?.data?.children || []).map((entry) => entry.data);
  const targetYear = TARGET_YEAR || new Date().getFullYear();

  const posts = rawPosts.filter((post) => new Date(post.created_utc * 1000).getFullYear() === targetYear);
  const comments = rawComments.filter(
    (comment) => new Date(comment.created_utc * 1000).getFullYear() === targetYear
  );

  const filteredPosts = posts.length ? posts : rawPosts;
  const filteredComments = comments.length ? comments : rawComments;
  const combined = [...filteredPosts, ...filteredComments];

  const totalUpvotes = combined.reduce((sum, item) => sum + (item.score || 0), 0);
  const topSubreddits = deriveTopSubreddits(combined);
  const mostActiveMonth = deriveMostActiveMonth(combined);
  const bestPost = deriveBestPost(filteredPosts, filteredComments);
  const emojiUsage = deriveEmojiUsage(combined);

  const totalActivity = combined.length;
  const postShare = totalActivity ? Math.round((filteredPosts.length / totalActivity) * 100) : 0;
  const commentShare = totalActivity ? 100 - postShare : 0;

  const createdSeconds = profile?.data?.created_utc || Date.now() / 1000;
  const daysActive = Math.max(1, Math.floor((Date.now() / 1000 - createdSeconds) / 86400));
  const averages = calculateAverages(filteredPosts, filteredComments);
  const awards = combined.reduce((sum, item) => sum + (item.total_awards_received || 0), 0);

  return {
    username: username || profile?.data?.name || "redditör",
    year: targetYear,
    total_activity: totalActivity,
    total_upvotes: totalUpvotes,
    days_active: daysActive,
    top_subreddits: topSubreddits,
    most_active_month: mostActiveMonth,
    best_post: bestPost,
    activity_breakdown: {
      comments_percentage: commentShare,
      posts_percentage: postShare,
      persona: commentShare > 65 ? "Deep Diver" : postShare > 65 ? "Storyteller" : "Explorer",
    },
    most_used_emoji: emojiUsage,
    totals: { posts: filteredPosts.length, comments: filteredComments.length },
    averages,
    engagement: {
      awards,
      average_karma_per_day: Math.round(totalUpvotes / Math.max(1, daysActive)),
    },
    profile: {
      avatar: profile?.data?.icon_img || "",
      cake_day: new Date(createdSeconds * 1000).toISOString().slice(0, 10),
      is_gold: Boolean(profile?.data?.is_gold || profile?.data?.is_premium),
      post_karma: profile?.data?.link_karma ?? averages.total_post_karma,
      comment_karma: profile?.data?.comment_karma ?? averages.total_comment_karma,
    },
  };
}

async function fetchRedditStats(username) {
  const cleanUsername = username.replace(/^u\//i, "").trim();
  const profileUrl = `https://www.reddit.com/user/${cleanUsername}/about.json`;
  const postsUrl = `https://www.reddit.com/user/${cleanUsername}/submitted.json?limit=100&t=year`;
  const commentsUrl = `https://www.reddit.com/user/${cleanUsername}/comments.json?limit=100&t=year`;

  const [profile, posts, comments] = await Promise.all([
    fetchJson(profileUrl, "profil"),
    fetchJson(postsUrl, "inlägg"),
    fetchJson(commentsUrl, "kommentarer"),
  ]);

  return normalizeRedditStats(cleanUsername, profile, posts, comments);
}

async function handleSubmit(event) {
  event.preventDefault();
  const input = document.getElementById("username-input");
  if (!input) return;

  const username = input.value.trim();
  if (!username) {
    setStatus("Skriv in ett Reddit-användarnamn först", "error");
    return;
  }

  setStatus("Hämtar data från Reddit...", "info");

  try {
    const redditStats = await fetchRedditStats(username);
    renderStats(redditStats);
    setStatus(`Klart! Statistiken för u/${redditStats.username} är uppdaterad.`, "success");
  } catch (error) {
    console.log("Lyckades inte hämta Reddit-data", error);
    setStatus("Kunde inte hämta Reddit-data. Visar mockad statistik i stället.", "error");
    const fallback = await fetchMockStats();
    if (fallback) {
      renderStats(fallback);
    }
  }
}

function attachEvents() {
  const form = document.getElementById("username-form");
  if (!form) return;

  form.addEventListener("submit", handleSubmit);
}

(async function init() {
  renderLayout();
  attachEvents();

  const mock = await fetchMockStats();
  if (mock) {
    renderStats(mock);
    setStatus("Visar exempeldata. Ange ditt användarnamn för live-data.", "info");
  }
})();
