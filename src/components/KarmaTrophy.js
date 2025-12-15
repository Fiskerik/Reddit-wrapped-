function buildPersona(breakdown, emojiData) {
  const commentShare = breakdown.comments_percentage;
  const postShare = breakdown.posts_percentage;
  return `
    <div class="badge" aria-label="Aktivitetsfördelning">
      <span>Kommentarer: ${commentShare}%</span>
      <span>Inlägg: ${postShare}%</span>
    </div>
    <p class="tagline">Du var en <span class="accent-text">${breakdown.persona}</span>.</p>
    <p class="data-row">Mest använda emoji ${emojiData.emoji} · ${emojiData.count} gånger</p>
  `;
}

export function renderKarmaTrophy(data) {
  const bestPost = data.best_post;
  const breakdown = data.activity_breakdown;
  const emojiData = data.most_used_emoji;

  return `
    <section class="card">
      <h2>Posten som definierade dig</h2>
      <div class="trophy" aria-hidden="true">🏆</div>
      <p class="tagline">${bestPost.type} i <span class="accent-text">${bestPost.subreddit}</span></p>
      <p class="highlight">"${bestPost.excerpt}"</p>
      <div class="data-row">
        <span class="badge">${bestPost.karma.toLocaleString("sv-SE")} upvotes</span>
        <span>${bestPost.published}</span>
      </div>
      ${buildPersona(breakdown, emojiData)}
    </section>
  `;
}
