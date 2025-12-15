import json
import os
from pathlib import Path
from typing import Optional

import requests
from flask import Flask, jsonify, request

app = Flask(__name__)

USER_AGENT = "reddit-wrapped-2025/0.1 (by u/yourusername)"


def load_stats():
    stats_path = Path(__file__).resolve().parents[2] / "public" / "data" / "mock_stats.json"
    with stats_path.open(encoding="utf-8") as stats_file:
        return json.load(stats_file)


def get_env(key: str) -> Optional[str]:
    value = os.environ.get(key)
    return value.strip() if value else None


def exchange_code(code: str, redirect_uri: str):
    client_id = get_env("REDDIT_CLIENT_ID")
    client_secret = get_env("REDDIT_CLIENT_SECRET")

    if not client_id or not client_secret:
        return None, {
            "error": "missing_credentials",
            "error_description": "Set REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET",
        }

    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": redirect_uri,
    }

    response = requests.post(
        "https://www.reddit.com/api/v1/access_token",
        data=data,
        auth=(client_id, client_secret),
        headers={"User-Agent": USER_AGENT},
        timeout=15,
    )

    if response.status_code != 200:
        try:
            error_payload = response.json()
        except ValueError:
            error_payload = {"error": "unknown_error", "error_description": response.text}
        return None, error_payload

    return response.json(), None


@app.route("/api/stats", methods=["GET"])
def get_stats():
    data = load_stats()
    return jsonify(data)


@app.route("/api/auth/exchange", methods=["POST"])
def auth_exchange():
    payload = request.get_json(silent=True) or {}
    code = payload.get("code")
    redirect_uri = payload.get("redirect_uri")

    if not code or not redirect_uri:
        return jsonify({"error": "invalid_request", "error_description": "code and redirect_uri är obligatoriska"}), 400

    token_data, error = exchange_code(code, redirect_uri)

    if error:
        status = 500 if error.get("error") == "missing_credentials" else 400
        return jsonify(error), status

    return jsonify(token_data)


@app.route("/api/auth/config", methods=["GET"])
def auth_config():
    return jsonify(
        {
            "client_id_present": bool(get_env("REDDIT_CLIENT_ID")),
            "redirect_uri_hint": os.environ.get("REDDIT_REDIRECT_URI", ""),
            "scopes": "identity history read mysubreddits",
        }
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
