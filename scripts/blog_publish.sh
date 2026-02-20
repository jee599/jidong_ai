#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
python3 scripts/blog_units.py publish --min-units "${1:-5}"
