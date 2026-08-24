# install-preset.ps1 — Windows (PowerShell 5.1+)
# Usage: irm https://<site>/scripts/install-preset.ps1 | iex; Install-Preset <preset-id>
#    or: .\install-preset.ps1 -PresetId <preset-id>
#
# Requires: jq (optional, but recommended for JSON validation/extraction)
#   Install via Scoop:      scoop install jq
#   Install via Winget:     winget install jqlang.jq
#   Install via Chocolatey: choco install jq
#
# ccstatusline must be installed: npm install -g ccstatusline
#   or use: npx ccstatusline@latest (no global install needed)

param(
  [Parameter(Mandatory=$false)]
  [string]$PresetId = "",

  [Parameter(Mandatory=$false)]
  [string]$SiteBase = "https://Brit-juho.github.io/claude-statusline-market",

  [Parameter(Mandatory=$false)]
  [string]$ExpectedSha256 = ""
)

function Install-Preset {
  [CmdletBinding()]
  param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$PresetId,

    [Parameter(Mandatory=$false)]
    [string]$SiteBase = "https://Brit-juho.github.io/claude-statusline-market",

    [Parameter(Mandatory=$false)]
    [string]$ExpectedSha256 = ""
  )

  $ErrorActionPreference = "Stop"

  if (-not $PresetId) {
    Write-Error "Usage: Install-Preset <preset-id>"
    Write-Host "  Browse presets at: $SiteBase" -ForegroundColor Cyan
    return
  }

  # ── 경로 설정 ────────────────────────────────────────────────
  $XdgConfig = if ($env:XDG_CONFIG_HOME) { $env:XDG_CONFIG_HOME }
               else { Join-Path $HOME ".config" }
  $CcsSettings = Join-Path $XdgConfig "ccstatusline" "settings.json"
  $CcSettings  = Join-Path $HOME ".claude" "settings.json"
  $PresetUrl   = "$SiteBase/presets/$PresetId.json"

  # ── jq 체크 (권장 — 없으면 ConvertFrom-Json/ConvertTo-Json으로 대체) ──
  $HasJq = $null -ne (Get-Command "jq" -ErrorAction SilentlyContinue)
  if (-not $HasJq) {
    Write-Warning "jq not found. Falling back to PowerShell's native JSON parser."
    Write-Host "  Install jq for best results: scoop install jq  OR  winget install jqlang.jq" -ForegroundColor Yellow
  }

  # ── 다운로드 ─────────────────────────────────────────────────
  Write-Host "Fetching preset '$PresetId'..." -ForegroundColor Cyan
  $TmpFile = [System.IO.Path]::GetTempFileName()

  try {
    $Response = Invoke-WebRequest -Uri $PresetUrl -UseBasicParsing -ErrorAction Stop
    if ($Response.StatusCode -eq 404) {
      Write-Error "Preset '$PresetId' not found (404). Browse: $SiteBase"
      return
    }
    [System.IO.File]::WriteAllBytes($TmpFile, $Response.Content)
  } catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
      Write-Error "Preset '$PresetId' not found. Browse: $SiteBase"
    } else {
      Write-Error "Download failed: $_"
    }
    Remove-Item -Path $TmpFile -Force -ErrorAction SilentlyContinue
    return
  }

  # ── JSON 유효성 확인 ─────────────────────────────────────────
  $PresetObj = $null
  if ($HasJq) {
    $JqResult = & jq "empty" $TmpFile 2>&1
    if ($LASTEXITCODE -ne 0) {
      Write-Error "Downloaded file is not valid JSON. Aborting."
      Remove-Item -Path $TmpFile -Force -ErrorAction SilentlyContinue
      return
    }
  }
  try {
    $Content = Get-Content $TmpFile -Raw
    $PresetObj = $Content | ConvertFrom-Json
  } catch {
    Write-Error "Downloaded file is not valid JSON. Aborting."
    Remove-Item -Path $TmpFile -Force -ErrorAction SilentlyContinue
    return
  }

  # ── SHA256 체크섬 (옵션) ──────────────────────────────────────
  if ($ExpectedSha256) {
    $Hash = (Get-FileHash -Path $TmpFile -Algorithm SHA256).Hash.ToLower()
    if ($Hash -ne $ExpectedSha256.ToLower()) {
      Write-Error "SHA256 mismatch.`n  expected: $ExpectedSha256`n  got:      $Hash"
      Remove-Item -Path $TmpFile -Force -ErrorAction SilentlyContinue
      return
    }
    Write-Host "SHA256 verified." -ForegroundColor Green
  }

  # ── ccstatusline_settings 추출 ─────────────────────────────────
  # (버그 수정: 과거 버전은 프리셋 파일 전체를 그대로 옮겨서 id/title 등
  #  메타데이터까지 ccstatusline settings.json에 섞여 들어갔음)
  if (-not $PresetObj.PSObject.Properties["ccstatusline_settings"]) {
    Write-Error "Preset '$PresetId' does not contain 'ccstatusline_settings' key. This preset may be outdated. Check: $SiteBase"
    Remove-Item -Path $TmpFile -Force -ErrorAction SilentlyContinue
    return
  }
  $CcsSettingsObj = $PresetObj.ccstatusline_settings
  Remove-Item -Path $TmpFile -Force -ErrorAction SilentlyContinue

  # ── 백업 ─────────────────────────────────────────────────────
  $CcsDirPath = Split-Path $CcsSettings -Parent
  if (-not (Test-Path $CcsDirPath)) {
    New-Item -ItemType Directory -Path $CcsDirPath -Force | Out-Null
  }

  if (Test-Path $CcsSettings) {
    $Timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
    $BackupPath = "${CcsSettings}.backup-${Timestamp}"
    Copy-Item -Path $CcsSettings -Destination $BackupPath
    Write-Host "Backup saved: $BackupPath" -ForegroundColor Gray
  }

  # ── 설치 (ccstatusline_settings만 기록) ───────────────────────
  $CcsSettingsObj | ConvertTo-Json -Depth 20 | Set-Content $CcsSettings -Encoding UTF8
  Write-Host "Preset installed: $CcsSettings" -ForegroundColor Green

  # ── Claude Code settings.json에 statusLine 등록 ──────────────
  $CcDir = Split-Path $CcSettings -Parent
  if (Test-Path $CcSettings) {
    $CcJson = Get-Content $CcSettings -Raw | ConvertFrom-Json
    if (-not $CcJson.PSObject.Properties["statusLine"]) {
      $Timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
      $BackupCc = "${CcSettings}.backup-${Timestamp}"
      Copy-Item -Path $CcSettings -Destination $BackupCc

      $CcJson | Add-Member -NotePropertyName "statusLine" -NotePropertyValue @{
        type    = "command"
        command = "npx -y ccstatusline@latest"
      } -Force
      $CcJson | ConvertTo-Json -Depth 10 | Set-Content $CcSettings -Encoding UTF8
      Write-Host "Added statusLine to: $CcSettings" -ForegroundColor Green
      Write-Host "Backup: $BackupCc" -ForegroundColor Gray
    }
  } elseif (Test-Path $CcDir) {
    @{ statusLine = @{ type = "command"; command = "npx -y ccstatusline@latest" } } |
      ConvertTo-Json -Depth 5 | Set-Content $CcSettings -Encoding UTF8
    Write-Host "Created: $CcSettings" -ForegroundColor Green
  }

  # ── 완료 ─────────────────────────────────────────────────────
  Write-Host ""
  Write-Host "Done! Restart Claude Code to apply the preset." -ForegroundColor Green
  Write-Host "  Settings: $CcsSettings"
  Write-Host ""
  Write-Host "To restore backup:" -ForegroundColor Gray
  Write-Host "  Copy-Item `"${CcsSettings}.backup-<timestamp>`" -Destination `"$CcsSettings`"" -ForegroundColor Gray
}

# ── 직접 실행 시(예: .\install-preset.ps1 -PresetId <id>) 바로 호출 ──
if ($PresetId) {
  Install-Preset -PresetId $PresetId -SiteBase $SiteBase -ExpectedSha256 $ExpectedSha256
}
