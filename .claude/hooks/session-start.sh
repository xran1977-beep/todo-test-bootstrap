#!/bin/bash
# SessionStart hook: install npm dependencies so tests and linters are ready.
set -euo pipefail

# Only needed in Claude Code on the web (fresh container each session).
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}"

# npm install (not ci) so the cached container state can be reused.
npm install --no-audit --no-fund
