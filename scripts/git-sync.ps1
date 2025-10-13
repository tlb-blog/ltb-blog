param(
    [string]$Message = "Update changes"
)

function Run-Git {
    param([string]$Cmd)
    # Use cmd /c to run git with a single command string for compatibility with PowerShell 5.1
    Write-Host "git $Cmd"
    $full = "git $Cmd"
    $output = & cmd /c $full 2>&1
    $exit = $LASTEXITCODE
    $text = @()
    if ($output) { $text = $output -join "`n" }
    return @{ ExitCode = $exit; Stdout = $text; Stderr = "" }
}

Write-Host "Starting git-sync with message: '$Message'"

# fetch
$r = Run-Git "fetch origin"
if ($r.ExitCode -ne 0) { Write-Error "git fetch failed: $($r.Stderr)"; exit $r.ExitCode }

# stash (including untracked)
$r = Run-Git "stash push -u -m \"autostash before git-sync\""
if ($r.ExitCode -ne 0) { Write-Warning "git stash failed or nothing to stash: $($r.Stderr)" }
else { Write-Host "Stashed changes." }

# rebase onto origin/main
$r = Run-Git "rebase origin/main"
if ($r.ExitCode -ne 0) {
    Write-Error "Rebase failed: $($r.Stderr)";
    Write-Host "Attempting to abort rebase and restore stash..."
    Run-Git "rebase --abort" | Out-Null
    Run-Git "stash pop" | Out-Null
    exit $r.ExitCode
}

# stage all
$r = Run-Git "add -A"
if ($r.ExitCode -ne 0) { Write-Error "git add failed: $($r.Stderr)"; exit $r.ExitCode }

# check if there is anything to commit
$status = Run-Git "status --porcelain"
if ($status.Stdout -match '\S') {
    $r = Run-Git "commit -m \"$Message\""
    if ($r.ExitCode -ne 0) { Write-Error "git commit failed: $($r.Stderr)"; Run-Git "stash pop" | Out-Null; exit $r.ExitCode }
    Write-Host "Committed changes." 
} else {
    Write-Host "No changes to commit." 
}

# push
$r = Run-Git "push origin main"
if ($r.ExitCode -ne 0) { Write-Error "git push failed: $($r.Stderr)"; Run-Git "stash pop" | Out-Null; exit $r.ExitCode }

# restore stash
$r = Run-Git "stash pop"
if ($r.ExitCode -ne 0) { Write-Warning "stash pop failed or nothing to pop: $($r.Stderr)" } else { Write-Host "Restored stashed changes." }

Write-Host "git-sync completed successfully."
