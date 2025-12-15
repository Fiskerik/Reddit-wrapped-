import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import LandingForm from "./components/LandingForm";
import OAuthStatusCard from "./components/OAuthStatusCard";
import { exchangeAuthorizationCode, getAuthorizeUrl } from "./services/oauth";
import type { ExchangeResult } from "./types/oauth";

const gradientBg = "gradient-bg";

function App() {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [tokenResult, setTokenResult] = useState<ExchangeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const stateToken = useMemo(() => crypto.randomUUID(), []);

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code) return;

    if (!state || state !== stateToken) {
      setStatus("Staten matchar inte. Försök logga in igen.");
      console.log("State mismatch", { expected: stateToken, provided: state });
      return;
    }

    setIsLoading(true);
    setStatus("Byter ut Reddit-koden mot en access token...");

    exchangeAuthorizationCode(code)
      .then((result) => {
        setTokenResult(result);
        setStatus("Inloggningen lyckades! Token sparad i sessionen.");
      })
      .catch((error) => {
        console.log("Fel vid tokenutbyte", error);
        setStatus("Kunde inte byta ut koden. Försök igen.");
      })
      .finally(() => {
        setIsLoading(false);
        url.search = "";
        window.history.replaceState({}, document.title, url.toString());
      });
  }, [stateToken]);

  const handleLogin = () => {
    const authorizeUrl = getAuthorizeUrl(stateToken);
    if (!authorizeUrl) {
      setStatus("Saknar Reddit Client ID eller redirect-URL. Lägg till i .env.");
      return;
    }
    console.log("Redirecting to Reddit authorize", authorizeUrl);
    window.location.href = authorizeUrl;
  };

  const handleUsernameSubmit = (value: string) => {
    setUsername(value);
    setStatus(`Sparade användarnamn: u/${value}. Logga in för att fortsätta.`);
  };

  return (
    <div className={`min-h-screen ${gradientBg} px-4 py-10 sm:px-8 lg:px-12`}>
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-2 text-slate-100">
          <p className="text-sm uppercase tracking-[0.2em] text-brand">Reddit Wrapped 2025</p>
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            Bygg grunden: autentisering &amp; inloggning
          </h1>
          <p className="max-w-3xl text-lg text-slate-300">
            Koppla ditt Reddit-konto, spara ditt användarnamn och förbered den personliga Wrapped-upplevelsen.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="card-surface p-6 shadow-lg"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-brand">Steg 1</p>
                <h2 className="text-2xl font-semibold text-white">Projektuppsättning</h2>
                <p className="text-slate-300">
                  React + TypeScript + Tailwind + Framer Motion är installerat och redo.
                </p>
              </div>
              <span className="badge">Foundation</span>
            </div>

            <div className="mt-6 space-y-4">
              <p className="text-sm text-slate-300">
                Du kan nu fortsätta med inloggningen. När du klickar på knappen nedan öppnas Reddit OAuth-flödet
                med de scopes som krävs för att läsa dina 2025-data.
              </p>
              <div className="flex flex-wrap gap-3">
                <button type="button" className="button-primary" onClick={handleLogin} disabled={isLoading}>
                  {isLoading ? "Loggar in..." : "Logga in med Reddit"}
                </button>
                <a
                  className="button-secondary"
                  href="https://www.reddit.com/prefs/apps"
                  target="_blank"
                  rel="noreferrer"
                >
                  Skapa Reddit-app
                </a>
              </div>
              <p className="text-xs text-slate-400">
                Kom ihåg att ställa in <code className="text-brand">VITE_REDDIT_CLIENT_ID</code> och
                <code className="text-brand"> VITE_REDDIT_REDIRECT_URI</code> i din miljö.
              </p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="card-surface p-6 shadow-lg"
          >
            <p className="text-sm uppercase tracking-[0.2em] text-brand">Steg 3</p>
            <h2 className="text-2xl font-semibold text-white">Grundläggande landningssida</h2>
            <p className="text-slate-300">
              Samla in användarnamnet direkt. Vi sparar det lokalt tills du loggar in via Reddit.
            </p>
            <div className="mt-6">
              <LandingForm
                defaultValue={username}
                onSubmit={handleUsernameSubmit}
                disabled={isLoading}
              />
            </div>
            <p className="mt-4 text-sm text-slate-400">
              Vi använder detta namn när vi hämtar din 2025-statistik efter att inloggningen är klar.
            </p>
          </motion.section>
        </div>

        <OAuthStatusCard status={status} tokenResult={tokenResult} />
      </div>
    </div>
  );
}

export default App;
