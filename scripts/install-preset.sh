#!/bin/bash
# install-preset.sh — macOS / Linux
# Usage: curl -fsSL https://<site>/i/<preset-id> | sh
#    or: bash install-preset.sh <preset-id>
set -euo pipefail

PRESET_ID="${1:-}"
SITE_BASE="${SITE_BASE:-https://NeTrioGit.github.io/claude-statusline-market}"

if [ -z "$PRESET_ID" ]; then
  echo "Usage: bash install-preset.sh <preset-id>" >&2
  echo "       or pipe from site: curl -fsSL ${SITE_BASE}/i/<id> | sh" >&2
  exit 1
fi

PRESET_URL="${SITE_BASE}/presets/${PRESET_ID}.json"
CCS_SETTINGS="${XDG_CONFIG_HOME:-$HOME/.config}/ccstatusline/settings.json"
CC_SETTINGS="$HOME/.claude/settings.json"

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

# ── 백업 ─────────────────────────────────────────────────────
mkdir -p "$(dirname "$CCS_SETTINGS")"
if [ -f "$CCS_SETTINGS" ]; then
  BACKUP="${CCS_SETTINGS}.backup-$(date +%s)"
  cp "$CCS_SETTINGS" "$BACKUP"
  echo "Backup saved: $BACKUP"
fi

# ── ccstatusline_settings 추출 및 설치 ───────────────────────
if ! jq -e '.ccstatusline_settings' "$TMP" >/dev/null 2>&1; then
  echo "Error: preset '${PRESET_ID}' does not contain 'ccstatusline_settings' key." >&2
  echo "  This preset may be outdated. Please check for an updated version at:" >&2
  echo "  ${SITE_BASE}" >&2
  exit 1
fi

jq '.ccstatusline_settings' "$TMP" > "$CCS_SETTINGS"
echo "Preset installed: $CCS_SETTINGS"

# ── Claude Code settings.json에 statusLine 등록 (없으면) ─────
if [ -f "$CC_SETTINGS" ]; then
  if ! jq -e '.statusLine' "$CC_SETTINGS" >/dev/null 2>&1; then
    BACKUP_CC="${CC_SETTINGS}.backup-$(date +%s)"
    cp "$CC_SETTINGS" "$BACKUP_CC"
    TMP_CC=$(mktemp)
    jq '. + {"statusLine":{"type":"command","command":"npx -y ccstatusline@latest"}}' \
      "$CC_SETTINGS" > "$TMP_CC" && mv "$TMP_CC" "$CC_SETTINGS"
    echo "Added statusLine to: $CC_SETTINGS"
    echo "Backup: $BACKUP_CC"
  fi
elif [ -d "$HOME/.claude" ]; then
  echo '{"statusLine":{"type":"command","command":"npx -y ccstatusline@latest"}}' \
    > "$CC_SETTINGS"
  echo "Created: $CC_SETTINGS"
fi

# ── 권한 체크 ────────────────────────────────────────────────
if [ ! -w "$(dirname "$CCS_SETTINGS")" ]; then
  echo "Warning: cannot write to $(dirname "$CCS_SETTINGS"). Check directory permissions." >&2
fi

# ── ccstatusline 감지 체크 ───────────────────────────────────
if ! command -v npx >/dev/null 2>&1; then
  echo ""
  echo "Note: 'npx' (Node.js) is required to run ccstatusline." >&2
  echo "  Install Node.js: https://nodejs.org/" >&2
  echo "  After installation, run: npx -y ccstatusline@latest" >&2
elif ! command -v ccstatusline >/dev/null 2>&1; then
  echo ""
  echo "Note: ccstatusline is not installed globally." >&2
  echo "  Install it: npm install -g ccstatusline" >&2
  echo "  Or it will be fetched automatically via: npx -y ccstatusline@latest" >&2
fi

echo ""
echo "Done! Restart Claude Code to apply the preset."
echo "  Settings: $CCS_SETTINGS"
echo ""
echo "To restore backup, run:"
echo "  cp ${CCS_SETTINGS}.backup-<timestamp> $CCS_SETTINGS"
