import { renderIntroCard } from "./components/IntroCard.js";
import { renderSubredditChart } from "./components/SubredditChart.js";
import { renderKarmaTrophy } from "./components/KarmaTrophy.js";

async function fetchStats() {
  try {
    const response = await fetch("./public/data/mock_stats.json");
    if (!response.ok) {
      console.log("Kunde inte läsa mock_stats.json", response.status);
      return null;
    }
    const data = await response.json();
    console.log("Mockad statistik laddad", data);
    return data;
  } catch (error) {
    console.log("Fel vid hämtning av statistik", error);
    return null;
  }
}

function renderApp(data) {
  const app = document.getElementById("app");
  if (!app) {
    console.log("Hittade inget #app-element");
    return;
  }

  const intro = renderIntroCard(data);
  const chart = renderSubredditChart(data);
  const trophy = renderKarmaTrophy(data);

  app.innerHTML = `
    ${intro}
    ${chart}
    ${trophy}
    <footer>Reddit Wrapped 2025 · Mockad design för prototyping</footer>
  `;
}

(async function init() {
  const stats = await fetchStats();
  if (!stats) {
    console.log("Ingen statistik att rendera");
    return;
  }
  renderApp(stats);
})();
