#!/bin/bash
# statusline-with-update.sh — 업데이트 알림이 포함된 Claude Code statusline 예제
#
# ~/.claude/settings.json 에 추가:
#   { "statusLine": { "type": "command", "command": "~/.claude/statusline-with-update.sh" } }
#
# 최초 설정:
#   chmod +x ~/.claude/statusline-with-update.sh
#   # 업데이트 체크를 cron에 등록 (1시간마다):
#   (crontab -l 2>/dev/null; echo "0 * * * * ~/.claude/scripts/update-check.sh") | crontab -
#   # 또는 첫 실행 시 백그라운드 체크:
#   ~/.claude/scripts/update-check.sh &

input=$(cat)

# ── 필드 추출 ────────────────────────────────────────────────
MODEL=$(echo "$input" | jq -r '.model.display_name // "?"')
VERSION=$(echo "$input" | jq -r '.version // "?"')
DIR=$(echo "$input" | jq -r '.workspace.current_dir // ""')
DIR_NAME="${DIR##*/}"
COST=$(echo "$input" | jq -r '.cost.total_cost_usd // 0')
PCT=$(echo "$input" | jq -r '.context_window.used_percentage // 0' | cut -d. -f1)

# ── ANSI 색상 ────────────────────────────────────────────────
CYAN='\033[36m'
GREEN='\033[32m'
YELLOW='\033[33m'
ORANGE='\033[38;5;173m'
DIM='\033[2m'
BOLD='\033[1m'
RESET='\033[0m'

# ── 업데이트 체크 (캐시 파일 읽기) ──────────────────────────
UPDATE=$(cat /tmp/claude-code-update 2>/dev/null || echo "")

# 백그라운드에서 비동기 업데이트 체크 (statusline을 블로킹하지 않음)
~/.claude/scripts/update-check.sh &>/dev/null &

# ── 컨텍스트 바 (색상 임계값 적용) ─────────────────────────
if [ "$PCT" -ge 85 ]; then
  BAR_COLOR=$ORANGE
elif [ "$PCT" -ge 60 ]; then
  BAR_COLOR=$YELLOW
else
  BAR_COLOR=$GREEN
fi

FILLED=$((PCT * 10 / 100))
EMPTY=$((10 - FILLED))
BAR="${BAR_COLOR}"
[ "$FILLED" -gt 0 ] && printf -v FILL "%${FILLED}s" && BAR+="${FILL// /█}"
[ "$EMPTY"  -gt 0 ] && printf -v PAD  "%${EMPTY}s"  && BAR+="${DIM}${PAD// /░}"
BAR+="${RESET}"

# ── 비용 포맷 ────────────────────────────────────────────────
COST_FMT=$(printf '$%.4f' "$COST")

# ── 업데이트 뱃지 ────────────────────────────────────────────
UPDATE_BADGE=""
if [ -n "$UPDATE" ]; then
  UPDATE_BADGE=" ${YELLOW}${BOLD}↑ $UPDATE${RESET}"
fi

# ── 출력 ─────────────────────────────────────────────────────
printf "%b" "${CYAN}${BOLD}◆ $MODEL${RESET}  ${DIM}v$VERSION${RESET}${UPDATE_BADGE}  ${DIM}$DIR_NAME${RESET}  $BAR ${DIM}${PCT}%${RESET}  ${DIM}$COST_FMT${RESET}\n"
