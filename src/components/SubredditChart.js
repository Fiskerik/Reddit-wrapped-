function buildBar(subreddit, maxCount) {
  const width = Math.max(14, Math.round((subreddit.count / maxCount) * 100));
  return `
    <div class="chart-bar" aria-label="${subreddit.name} ${subreddit.count} inlägg eller kommentarer">
      <div class="chart-fill" style="width: ${width}%;"></div>
      <div class="meta-row">
        <span>${subreddit.name}</span>
        <strong>${subreddit.count}</strong>
      </div>
    </div>
  `;
}

export function renderSubredditChart(data) {
  if (!Array.isArray(data.top_subreddits)) {
    console.log("Ingen subredditattribut hittades i datan.");
    return "";
  }

  const maxCount = Math.max(...data.top_subreddits.map((item) => item.count));
  const bars = data.top_subreddits.map((item) => buildBar(item, maxCount)).join("");

  return `
    <section class="card">
      <h2>Topp 3 Subreddits</h2>
      <p class="tagline">Din galax av intressen under ${data.year}</p>
      <div class="chart-bars">${bars}</div>
      <div class="meta-row">
        <span>Mest aktiva månad</span>
        <span class="accent-text">${data.most_active_month.month} (${data.most_active_month.count} inlägg/kommentarer)</span>
      </div>
    </section>
  `;
}
