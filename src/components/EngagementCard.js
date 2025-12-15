export function renderEngagementCard(data) {
  const averages = data.averages || { post_average: 0, comment_average: 0 };
  const engagement = data.engagement || { awards: 0, average_karma_per_day: 0 };
  const emojiInfo = data.most_used_emoji || { emoji: "🔥", count: 0 };

  return `
    <section class="card">
      <h2>Engagemang</h2>
      <p class="tagline">Karma per dag och kärlek från communityt</p>
      <div class="stats-grid mini">
        <div class="stat">
          <p>Snittkarma per inlägg</p>
          <strong>${averages.post_average}</strong>
        </div>
        <div class="stat">
          <p>Snittkarma per kommentar</p>
          <strong>${averages.comment_average}</strong>
        </div>
        <div class="stat">
          <p>Karma per dag</p>
          <strong>${engagement.average_karma_per_day}</strong>
        </div>
      </div>
      <div class="meta-row">
        <span class="badge">${engagement.awards} awards</span>
        <span class="accent-text">Mest använda emoji: ${emojiInfo.emoji} (${emojiInfo.count}x)</span>
      </div>
    </section>
  `;
}
