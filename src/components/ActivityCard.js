function buildSplitBar(breakdown) {
  const commentWidth = `${breakdown.comments_percentage}%`;
  const postWidth = `${breakdown.posts_percentage}%`;
  return `
    <div class="split-bar" role="presentation">
      <span class="comments" style="width:${commentWidth}"></span>
      <span class="posts" style="width:${postWidth}"></span>
    </div>
    <div class="meta-row">
      <span>Kommentarer ${commentWidth}</span>
      <span>Inlägg ${postWidth}</span>
    </div>
  `;
}

export function renderActivityCard(data) {
  const totals = data.totals || { posts: 0, comments: 0 };
  const breakdown = data.activity_breakdown || { posts_percentage: 0, comments_percentage: 0, persona: "Explorer" };

  return `
    <section class="card">
      <h2>Aktivitet &amp; persona</h2>
      <p class="tagline">${data.year} års favoritsätt att bidra</p>
      <div class="stats-grid mini">
        <div class="stat">
          <p>Inlägg</p>
          <strong>${totals.posts}</strong>
        </div>
        <div class="stat">
          <p>Kommentarer</p>
          <strong>${totals.comments}</strong>
        </div>
        <div class="stat">
          <p>Persona</p>
          <strong>${breakdown.persona}</strong>
        </div>
      </div>
      ${buildSplitBar(breakdown)}
    </section>
  `;
}
