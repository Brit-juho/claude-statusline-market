#!/bin/bash
# update-check.sh — Claude Code 업데이트 체크 데몬
# ~/.claude/statusline.sh 에서 source 하거나 cron으로 실행
#
# 작동 원리:
#   1. /tmp/claude-code-update 파일에 최신 버전을 캐시 (하루 1회 갱신)
#   2. 현재 버전과 다르면 파일에 최신 버전 기록, 같으면 빈 파일
#   3. statusline 스크립트에서 파일 내용을 읽어 뱃지 표시
#
# 설치:
#   chmod +x ~/.claude/update-check.sh
#   # cron에 추가 (1시간마다 체크):
#   (crontab -l 2>/dev/null; echo "0 * * * * ~/.claude/update-check.sh") | crontab -
#
# statusline 스크립트에서 사용:
#   UPDATE=$(cat /tmp/claude-code-update 2>/dev/null)
#   [ -n "$UPDATE" ] && echo -n "↑ $UPDATE  "

set -euo pipefail

CACHE_FILE="/tmp/claude-code-update"
LOCK_FILE="/tmp/claude-code-update.lock"
CACHE_TTL=3600  # 1시간 (초)

# ── 캐시가 유효한지 확인 ─────────────────────────────────────
cache_is_fresh() {
  [ -f "$CACHE_FILE" ] || return 1
  local now mtime age
  now=$(date +%s)
  # macOS / Linux 호환
  mtime=$(stat -f %m "$CACHE_FILE" 2>/dev/null || stat -c %Y "$CACHE_FILE" 2>/dev/null || echo 0)
  age=$(( now - mtime ))
  [ "$age" -lt "$CACHE_TTL" ]
}

# 이미 캐시가 신선하면 종료
cache_is_fresh && exit 0

# ── 중복 실행 방지 ──────────────────────────────────────────
exec 9>"$LOCK_FILE"
flock -n 9 || exit 0

# ── npm에서 최신 버전 조회 ──────────────────────────────────
LATEST=""
if command -v npm >/dev/null 2>&1; then
  LATEST=$(npm view @anthropic-ai/claude-code version 2>/dev/null || echo "")
fi

# npm 실패 시 GitHub API 폴백
if [ -z "$LATEST" ] && command -v curl >/dev/null 2>&1; then
  LATEST=$(curl -s --max-time 5 \
    "https://api.github.com/repos/anthropics/claude-code/releases/latest" \
    2>/dev/null | grep '"tag_name"' | grep -o 'v[0-9.]*' | head -1 | tr -d 'v' || echo "")
fi

# 버전 조회 실패 시 캐시 타임스탬프만 갱신 (다음 체크 연장)
if [ -z "$LATEST" ]; then
  touch "$CACHE_FILE"
  exit 0
fi

# ── 현재 버전과 비교 ────────────────────────────────────────
CURRENT=$(claude --version 2>/dev/null | grep -o '[0-9][0-9.]*' | head -1 || echo "")

if [ -n "$CURRENT" ] && [ "$LATEST" != "$CURRENT" ]; then
  # 업데이트 가능: 최신 버전 기록
  printf "v%s" "$LATEST" > "$CACHE_FILE"
else
  # 최신 상태: 빈 파일로 캐시 (뱃지 숨김)
  > "$CACHE_FILE"
fi

flock -u 9
