export function renderIntroCard(data) {
  const formattedActivity = data.total_activity.toLocaleString("sv-SE");
  const formattedUpvotes = data.total_upvotes.toLocaleString("sv-SE");

  return `
    <section class="card">
      <h2>Introduktion &amp; Sammanfattning</h2>
      <p class="tagline">Tack för att du redditade, <span class="highlight">u/${data.username}</span>!</p>
      <div class="stats-grid">
        <div class="stat">
          <p>Total aktivitet</p>
          <strong>${formattedActivity}</strong>
          <p>inlägg &amp; kommentarer</p>
        </div>
        <div class="stat">
          <p>Total uppröstning</p>
          <strong>${formattedUpvotes}</strong>
          <p>karma</p>
        </div>
        <div class="stat">
          <p>Dagar på Reddit</p>
          <strong>${data.days_active}</strong>
          <p>dagar i rad</p>
        </div>
      </div>
    </section>
  `;
}
