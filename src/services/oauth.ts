import type { ExchangeError, ExchangeResult } from "../types/oauth";

const SCOPES = "identity history read mysubreddits";

function getEnv(key: string) {
  const value = import.meta.env[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

export function getAuthorizeUrl(state: string) {
  const clientId = getEnv("VITE_REDDIT_CLIENT_ID");
  const redirectUri = getEnv("VITE_REDDIT_REDIRECT_URI") ?? `${window.location.origin}/callback`;

  if (!clientId || !redirectUri) return null;

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    state,
    redirect_uri: redirectUri,
    duration: "temporary",
    scope: SCOPES,
  });

  return `https://www.reddit.com/api/v1/authorize?${params.toString()}`;
}

export async function exchangeAuthorizationCode(code: string): Promise<ExchangeResult> {
  const redirectUri = getEnv("VITE_REDDIT_REDIRECT_URI") ?? `${window.location.origin}/callback`;
  const response = await fetch("/api/auth/exchange", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, redirect_uri: redirectUri }),
  });

  if (!response.ok) {
    const error: ExchangeError = await response.json();
    throw new Error(error.error_description || error.error || "Kunde inte byta kod mot token");
  }

  const payload: ExchangeResult = await response.json();
  sessionStorage.setItem("reddit_access_token", payload.access_token);
  return payload;
}
