#!/bin/bash
# install-preset.sh — macOS / Linux
# Usage: curl -fsSL https://<site>/i/<preset-id> | sh
#    or: bash install-preset.sh <preset-id>
set -euo pipefail

PRESET_ID="${1:-}"
SITE_BASE="${SITE_BASE:-https://NeTrioGit.github.io/claude-statusline-market}"
# Presets are served from the built GitHub Pages site (SITE_BASE), but the
# scripts/ folder isn't part of the Astro build output — it only exists in
# the git repo, so it's fetched from raw.githubusercontent.com instead.
RAW_BASE="${RAW_BASE:-https://raw.githubusercontent.com/NeTrioGit/claude-statusline-market/main}"
# Resolve alongside this script when run from a checkout; when piped via
# `curl ... | sh` there is no local file, so BASH_SOURCE[0] won't point
# anywhere usable — fall back to fetching it fresh from the site.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-.}")" 2>/dev/null && pwd || true)"

if [ -z "$PRESET_ID" ]; then
  echo "Usage: bash install-preset.sh <preset-id>" >&2
  echo "       or pipe from site: curl -fsSL ${SITE_BASE}/i/<id> | sh" >&2
  exit 1
fi

PRESET_URL="${SITE_BASE}/presets/${PRESET_ID}.json"

# ── 의존성 체크 ──────────────────────────────────────────────
check_dep() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Error: '$1' is required but not installed." >&2
    case "$1" in
      jq)    echo "  macOS:  brew install jq" >&2
             echo "  Ubuntu: sudo apt install jq" >&2
             echo "  Arch:   sudo pacman -S jq" >&2 ;;
      curl)  echo "  macOS:  brew install curl" >&2
             echo "  Ubuntu: sudo apt install curl" >&2 ;;
    esac
    exit 1
  fi
}
check_dep curl
check_dep jq

# ── 다운로드 ─────────────────────────────────────────────────
echo "Fetching preset '${PRESET_ID}'..."
TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT

HTTP_STATUS=$(curl -fsSL -w "%{http_code}" -o "$TMP" "$PRESET_URL") || {
  echo "Error: failed to download preset (curl error)." >&2
  exit 1
}

if [ "$HTTP_STATUS" = "404" ]; then
  echo "Error: preset '${PRESET_ID}' not found (404)." >&2
  echo "  Browse all presets at: ${SITE_BASE}" >&2
  exit 1
fi

# ── JSON 유효성 확인 ─────────────────────────────────────────
if ! jq empty "$TMP" 2>/dev/null; then
  echo "Error: downloaded file is not valid JSON. Aborting." >&2
  exit 1
fi

# ── SHA256 체크섬 (옵션, PRESET_SHA256 환경변수 제공 시) ──────
if [ -n "${PRESET_SHA256:-}" ]; then
  ACTUAL=$(shasum -a 256 "$TMP" | awk '{print $1}')
  if [ "$ACTUAL" != "$PRESET_SHA256" ]; then
    echo "Error: SHA256 mismatch." >&2
    echo "  expected: $PRESET_SHA256" >&2
    echo "  got:      $ACTUAL" >&2
    exit 1
  fi
  echo "SHA256 verified."
fi

# ── ccstatusline_settings 추출 ────────────────────────────────
if ! jq -e '.ccstatusline_settings' "$TMP" >/dev/null 2>&1; then
  echo "Error: preset '${PRESET_ID}' does not contain 'ccstatusline_settings' key." >&2
  echo "  This preset may be outdated. Please check for an updated version at:" >&2
  echo "  ${SITE_BASE}" >&2
  exit 1
fi

CCS_SETTINGS_ONLY=$(mktemp)
trap 'rm -f "$TMP" "$CCS_SETTINGS_ONLY"' EXIT
jq '.ccstatusline_settings' "$TMP" > "$CCS_SETTINGS_ONLY"

# ── 백업 + 적용 (install-preset.sh와 statusline-market Skill이 공유) ──
APPLY_SCRIPT="$SCRIPT_DIR/apply-ccstatusline.sh"
if [ -n "$SCRIPT_DIR" ] && [ -f "$APPLY_SCRIPT" ]; then
  bash "$APPLY_SCRIPT" "$CCS_SETTINGS_ONLY"
else
  APPLY_TMP=$(mktemp)
  trap 'rm -f "$TMP" "$CCS_SETTINGS_ONLY" "$APPLY_TMP"' EXIT
  curl -fsSL "${RAW_BASE}/scripts/apply-ccstatusline.sh" -o "$APPLY_TMP"
  bash "$APPLY_TMP" "$CCS_SETTINGS_ONLY"
fi
