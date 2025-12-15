function buildBadge(profile) {
  if (!profile.is_gold) {
    return "<span class=\"badge muted\">Standardkonto</span>";
  }
  return "<span class=\"badge\">Reddit Premium</span>";
}

export function renderAccountCard(data) {
  const profile = data.profile || {};
  const cakeDay = profile.cake_day || "Okänt";
  const avatar = profile.avatar ? `<img src="${profile.avatar}" alt="Avatar" />` : "<div class=\"avatar-fallback\">u</div>";

  return `
    <section class="card profile-card">
      <h2>Konto &amp; identitet</h2>
      <div class="profile-row">
        <div class="avatar">${avatar}</div>
        <div>
          <p class="tagline">u/${data.username}</p>
          <p class="data-row">
            <span class="badge">Cake day ${cakeDay}</span>
            ${buildBadge(profile)}
          </p>
        </div>
      </div>
      <div class="stats-grid mini">
        <div class="stat">
          <p>Postkarma</p>
          <strong>${profile.post_karma?.toLocaleString("sv-SE") ?? "0"}</strong>
        </div>
        <div class="stat">
          <p>Commentkarma</p>
          <strong>${profile.comment_karma?.toLocaleString("sv-SE") ?? "0"}</strong>
        </div>
        <div class="stat">
          <p>Total karma</p>
          <strong>${((profile.post_karma || 0) + (profile.comment_karma || 0)).toLocaleString("sv-SE")}</strong>
        </div>
      </div>
    </section>
  `;
}
