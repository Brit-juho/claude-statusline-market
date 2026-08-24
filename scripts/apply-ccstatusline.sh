#!/bin/bash
# apply-ccstatusline.sh — apply a ccstatusline_settings JSON object to the local machine.
#
# Usage: bash apply-ccstatusline.sh <path-to-json>
#
# The input file must be the raw ccstatusline settings object itself
# (i.e. {"version":3,"lines":[[...]]}), NOT a full preset file with
# id/title/description metadata. install-preset.sh extracts that shape
# from a downloaded preset before calling this script; a custom builder
# (e.g. the statusline-market Skill) can hand it this shape directly.
#
# Shared by:
#   - install-preset.sh (site presets)
#   - skills/statusline-market (terminal-native custom builds)
set -euo pipefail

SETTINGS_JSON="${1:-}"
if [ -z "$SETTINGS_JSON" ] || [ ! -f "$SETTINGS_JSON" ]; then
  echo "Usage: bash apply-ccstatusline.sh <path-to-ccstatusline-settings.json>" >&2
  exit 1
fi

CCS_SETTINGS="${XDG_CONFIG_HOME:-$HOME/.config}/ccstatusline/settings.json"
CC_SETTINGS="$HOME/.claude/settings.json"

command -v jq >/dev/null 2>&1 || { echo "Error: 'jq' is required but not installed." >&2; exit 1; }

# ── 입력 유효성 확인 ──────────────────────────────────────────
if ! jq -e '.version and .lines' "$SETTINGS_JSON" >/dev/null 2>&1; then
  echo "Error: input file is not a valid ccstatusline_settings object (expected {version, lines})." >&2
  exit 1
fi

# ── 백업 + 설치 ──────────────────────────────────────────────
mkdir -p "$(dirname "$CCS_SETTINGS")"
if [ -f "$CCS_SETTINGS" ]; then
  BACKUP="${CCS_SETTINGS}.backup-$(date +%s)"
  cp "$CCS_SETTINGS" "$BACKUP"
  echo "Backup saved: $BACKUP"
fi

jq '.' "$SETTINGS_JSON" > "$CCS_SETTINGS"
echo "ccstatusline settings installed: $CCS_SETTINGS"

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
echo "Done! Restart Claude Code to apply the statusline."
echo "  Settings: $CCS_SETTINGS"
echo ""
echo "To restore backup, run:"
echo "  cp ${CCS_SETTINGS}.backup-<timestamp> $CCS_SETTINGS"
