# Protect the main branch of Jttacalig/devvy-ui using GitHub repository rulesets.
# Requires: GitHub CLI (gh) authenticated as an admin of this repository.
# This script only creates a new ruleset. It refuses to overwrite an existing one.

$ErrorActionPreference = 'Stop'
$repo = 'Jttacalig/devvy-ui'
$name = 'Protect Devvy UI Main'

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    throw 'GitHub CLI (gh) was not found. Install it from https://cli.github.com/ then run gh auth login.'
}

& gh auth status
if ($LASTEXITCODE -ne 0) {
    throw 'GitHub CLI is not authenticated. Run gh auth login and try again.'
}

$repoInfoJson = & gh api "repos/$repo"
if ($LASTEXITCODE -ne 0) {
    throw "Could not read $repo. Check your GitHub login and repository access."
}
$repoInfo = ($repoInfoJson -join "`n") | ConvertFrom-Json
if ($repoInfo.default_branch -ne 'main') {
    throw "Expected default branch main; GitHub returned '$($repoInfo.default_branch)'. No changes were made."
}
if (-not $repoInfo.permissions.admin) {
    throw "GitHub authentication does not report admin access to $repo. No changes were made."
}

$existingJson = & gh api "repos/$repo/rulesets"
if ($LASTEXITCODE -ne 0) {
    throw 'Could not inspect existing rulesets. No changes were made.'
}
$existing = @(($existingJson -join "`n") | ConvertFrom-Json)
if (@($existing | Where-Object { $_.name -eq $name }).Count -gt 0) {
    throw "A ruleset named '$name' already exists. Review it in GitHub Settings > Rules > Rulesets. No changes were made."
}

$payload = @{
    name = $name
    target = 'branch'
    enforcement = 'active'
    conditions = @{
        ref_name = @{
            include = @('refs/heads/main')
            exclude = @()
        }
    }
    bypass_actors = @()
    rules = @(
        @{ type = 'deletion' },
        @{ type = 'non_fast_forward' },
        @{
            type = 'pull_request'
            parameters = @{
                required_approving_review_count = 0
                dismiss_stale_reviews_on_push = $false
                require_code_owner_review = $false
                require_last_push_approval = $false
                required_review_thread_resolution = $true
                allowed_merge_methods = @('merge', 'squash', 'rebase')
            }
        },
        @{
            type = 'required_status_checks'
            parameters = @{
                strict_required_status_checks_policy = $false
                do_not_enforce_on_create = $false
                required_status_checks = @(
                    @{ context = 'verify (22)' },
                    @{ context = 'verify (24)' },
                    @{ context = 'consumer (18.3.1)' },
                    @{ context = 'consumer (19.3.1)' }
                )
            }
        }
    )
}

$temporaryPath = [System.IO.Path]::GetTempFileName()
try {
    $json = $payload | ConvertTo-Json -Depth 15
    [System.IO.File]::WriteAllText($temporaryPath, $json, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "Creating an ACTIVE main branch ruleset for $repo..."
    $createdJson = & gh api --method POST "repos/$repo/rulesets" --input "$temporaryPath"
    if ($LASTEXITCODE -ne 0) {
        throw 'GitHub rejected the ruleset creation. No successful configuration change was confirmed.'
    }
    $created = ($createdJson -join "`n") | ConvertFrom-Json
    if (-not $created.id) {
        throw 'GitHub response did not include a ruleset ID. Verify Settings > Rules before retrying.'
    }
    Write-Host "Created ruleset #$($created.id) ($($created.enforcement))."
    Write-Host "URL: https://github.com/$repo/rules/$($created.id)"
    Write-Host 'Required checks: verify (22), verify (24), consumer (18.3.1), consumer (19.3.1).'
    Write-Host 'Browser check excluded until its failing tests are fixed.'
}
finally {
    Remove-Item -LiteralPath $temporaryPath -ErrorAction SilentlyContinue
}
