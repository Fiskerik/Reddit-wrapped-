function buildBar(subreddit, maxCount) {
  const safeMax = maxCount || 1;
  const width = Math.max(14, Math.round((subreddit.count / safeMax) * 100));
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
  if (!Array.isArray(data.top_subreddits) || data.top_subreddits.length === 0) {
    console.log("Ingen subredditattribut hittades i datan.");
    return `
      <section class="card">
        <h2>Topp 3 Subreddits</h2>
        <p class="tagline">Vi kunde inte hitta någon aktivitet än. Testa att posta eller kommentera något!</p>
      </section>
    `;
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
