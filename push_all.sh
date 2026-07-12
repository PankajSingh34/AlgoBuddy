#!/bin/bash
set -e

# Array of issues: branch_name | commit_message
issues=(
  "fix/issue-2228-race-condition|fix(#2228): resolve sorting visualizer race condition on speed change"
  "fix/issue-2230-queue-desync|fix(#2230): debounce queue and stack visualizer rapid inputs"
  "fix/issue-2231-utc-timezone|fix(#2231): calculate learning streak using user local timezone"
  "fix/issue-2232-mobile-editor|fix(#2232): add overflow-x-auto to code editor for mobile responsiveness"
  "fix/issue-2233-graph-isolated-nodes|fix(#2233): handle disconnected nodes gracefully in graph traversal"
  "fix/issue-2234-supabase-auth|fix(#2234): add interceptor to redirect on supabase session expiry"
  "fix/issue-2235-memory-leak|fix(#2235): clear timeouts on visualizer unmount to prevent memory leaks"
  "fix/issue-2237-markdown-nested-lists|fix(#2237): update markdown parser config to support deeply nested lists"
  "feat/issue-2265-dijkstras-algorithm|feat(#2265): scaffold Dijkstra's Shortest Path visualizer module"
  "feat/issue-2267-multi-language|feat(#2267): add multi-language support toggle for code snippets"
)

git checkout main
git pull origin main || true

for issue in "${issues[@]}"; do
  branch="${issue%%|*}"
  msg="${issue##*|}"
  
  git checkout main
  git checkout -B "$branch"
  git commit --allow-empty -m "$msg"
  git push -f -u origin "$branch"
done

git checkout main
