import json
from pathlib import Path

from flask import Flask, jsonify

app = Flask(__name__)


def load_stats():
    stats_path = Path(__file__).resolve().parents[2] / "public" / "data" / "mock_stats.json"
    with stats_path.open(encoding="utf-8") as stats_file:
        return json.load(stats_file)


@app.route("/api/stats", methods=["GET"])
def get_stats():
    data = load_stats()
    return jsonify(data)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
