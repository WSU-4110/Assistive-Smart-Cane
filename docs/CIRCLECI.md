# CircleCI Setup for Assistive-Smart-Cane

This repository includes a CircleCI configuration at `.circleci/config.yml` that runs the project's tests.

## What the config does
- Runs root tests (Jest) by executing `npm test` in the repository root.
- Attempts to run `npm test` inside the `server/` folder if a `test` script exists; the job is written to avoid failing the entire workflow when no server tests exist.
- Caches `node_modules` for faster subsequent builds.

## Quick setup
1. Push the `circle-ci` branch (or another branch) to GitHub:

```bash
git checkout -b circle-ci
git add .circleci/config.yml docs/CIRCLECI.md
git commit -m "ci: add CircleCI config and docs"
git push --set-upstream origin circle-ci
```

2. Sign in to CircleCI (https://circleci.com) and follow the instructions to add the `WSU-4110/Assistive-Smart-Cane` project.

3. Enable builds for the repository and allow CircleCI to use the `circle-ci` branch (or enable builds for all branches).

4. (Optional) Add environment variables (Firebase keys, API tokens) in the CircleCI project settings under **Project Settings → Environment Variables**.

5. Monitor pipeline runs in the CircleCI web UI. The workflow will run `test-root` and `test-server` jobs in parallel.

## Notes & next steps
- The server currently has no meaningful `test` script; if you want server tests to fail the build when present, we can update `server/package.json` to include a real test script and update the CircleCI job to treat failures as fatal.
- If you want JUnit test reporting, coverage artifacts, or splitting matrix tests across Node versions, I can update `.circleci/config.yml` to add those capabilities.

## Cancel previous runs when new run starts (one pipeline at a time)

GitHub Actions: the repo workflow already uses `concurrency` to cancel any in-progress workflow run for the same branch when a new run is triggered. This ensures only one pipeline runs per branch.

CircleCI: CircleCI offers "Cancel redundant builds" in the project settings (UI). To enable equivalent behavior on CircleCI, open the project in the CircleCI app, go to **Project Settings → Advanced**, and enable **Cancel redundant builds** (this will cancel older workflows for the same branch when new commits are pushed).
