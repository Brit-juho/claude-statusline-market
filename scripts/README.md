# Install Scripts

One-line preset installers for each supported platform.

## macOS / Linux

```bash
curl -fsSL https://NeTrioGit.github.io/claude-statusline-market/i/<preset-id> | sh
```

**Requirements**: `curl`, `jq`

```bash
# macOS
brew install jq

# Ubuntu / Debian
sudo apt install jq

# Arch
sudo pacman -S jq
```

**Verify before running** (recommended):

```bash
# View the script first
curl -fsSL https://NeTrioGit.github.io/claude-statusline-market/i/<preset-id>

# Then install
curl -fsSL https://NeTrioGit.github.io/claude-statusline-market/i/<preset-id> | sh
```

---

## Windows (PowerShell)

```powershell
irm https://NeTrioGit.github.io/claude-statusline-market/i/<preset-id>.ps1 | iex
```

Or download and run manually:

```powershell
Invoke-WebRequest -Uri https://NeTrioGit.github.io/claude-statusline-market/scripts/install-preset.ps1 -OutFile install.ps1
.\install.ps1 -PresetId <preset-id>
```

**Requirements**: PowerShell 5.1+, Node.js (for `npx ccstatusline`)

**jq (optional, recommended for validation)**:

```powershell
# via Scoop
scoop install jq

# via Winget
winget install jqlang.jq

# via Chocolatey
choco install jq
```

**If script execution is blocked** (ExecutionPolicy):

```powershell
# Check current policy
Get-ExecutionPolicy

# Allow scripts from the internet (user scope, recommended)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Verify before running**:

```powershell
# View the script first
Invoke-WebRequest -Uri https://NeTrioGit.github.io/claude-statusline-market/i/<preset-id>.ps1 | Select-Object -ExpandProperty Content
```

---

## What these scripts do

1. Download the preset JSON from the gallery
2. Validate it's proper JSON (with jq if available)
3. Optionally verify SHA256 checksum
4. Back up your existing `~/.config/ccstatusline/settings.json`
5. Install the preset
6. Register `statusLine` in `~/.claude/settings.json` (if not already present)

**To restore a backup**:

```bash
# macOS/Linux
cp ~/.config/ccstatusline/settings.json.backup-<timestamp> ~/.config/ccstatusline/settings.json

# Windows PowerShell
Copy-Item "$HOME\.config\ccstatusline\settings.json.backup-<timestamp>" "$HOME\.config\ccstatusline\settings.json"
```
