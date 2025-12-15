import { motion } from "framer-motion";
import type { ExchangeResult } from "../types/oauth";

type OAuthStatusCardProps = {
  status: string | null;
  tokenResult: ExchangeResult | null;
};

function OAuthStatusCard({ status, tokenResult }: OAuthStatusCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="card-surface p-6"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-brand">
          <span className="text-lg">🔐</span>
          <h2 className="text-xl font-semibold text-white">OAuth-status</h2>
        </div>
        <p className="text-slate-300">
          Vi hanterar Reddit OAuth 2.0 med scopes: <code className="text-brand">identity</code>,
          <code className="text-brand"> history</code>, <code className="text-brand"> read</code>,
          <code className="text-brand"> mysubreddits</code>.
        </p>
        <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-slate-200">
          <p className="font-semibold text-white">Senaste status</p>
          <p className="text-slate-300">{status ?? "Ingen inloggning påbörjad ännu."}</p>
        </div>
        {tokenResult && (
          <div className="rounded-xl border border-emerald-600/40 bg-emerald-500/10 p-4 text-sm text-emerald-100">
            <p className="font-semibold text-emerald-200">Access token mottagen</p>
            <p>Token: {tokenResult.access_token.slice(0, 6)}...{tokenResult.access_token.slice(-6)}</p>
            <p>Giltig i: {tokenResult.expires_in} sekunder</p>
            {tokenResult.refresh_token && <p>Refresh token sparad för servern.</p>}
          </div>
        )}
      </div>
    </motion.section>
  );
}

export default OAuthStatusCard;
