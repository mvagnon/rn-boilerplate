[![portfolio](https://img.shields.io/website?url=https%3A%2F%2Fmvagnon.dev&up_message=Visit&label=Portfolio&color=%23007fff)](https://mvagnon.dev)
[![bymeacoffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-Support-yellow?logo=buymeacoffee)](https://buymeacoffee.com/mvagnon)

# React Native Boilerplate

## More technical info

See [AGENTS.md](./AGENTS.md) for architecture, roadmap, API generation and Storybook guidelines, for both contributors and agents.

## Commands

| Command                                        | Purpose                                                              |
| ---------------------------------------------- | -------------------------------------------------------------------- |
| `bun install`                                  | Install dependencies                                                 |
| `bun run api:sync`                             | Regenerate the typed API client                                      |
| `bun run pull` / `pull:preview`                | Pull EAS variables into `.env.local`                                 |
| `bun run prebuild`                             | Regenerate Android and iOS projects (replaces generated directories) |
| `bun run ios` / `android`                      | Build and run on a device; Metro starts separately                   |
| `bun run start` / `web`                        | Start Metro for development builds / start the web app               |
| `bun run storybook`                            | Start on-device Storybook instead of the app                         |
| `bun run storybook:ios` / `storybook:android`  | Start Storybook and open a development build                         |
| `bun run storybook-generate`                   | Regenerate the story registry                                        |
| `bun run lint` / `typecheck` / `knip` / `test` | Run individual checks                                                |
| `bun run staticchecks`                         | Run lint, typecheck, Knip and Node-based tests                       |
| `bun run preview` / `prod`                     | Build both platforms and submit store candidates                     |
| `bun run preview:ios` / `prod:ios`             | Build and submit to TestFlight                                       |
| `bun run preview:android` / `prod:android`     | Build Android without submitting                                     |
| `bun run update --message "Fix description"`   | Publish a production OTA update                                      |

For local development: install dependencies, run `prebuild`, build with `ios` or `android`, then run `start`. Native builds require Xcode or Android tooling; use a development build, not Expo Go. Regenerate and rebuild after native dependency or app config changes.

## Env variables

| Variable              | Purpose                                                             | Default                              |
| --------------------- | ------------------------------------------------------------------- | ------------------------------------ |
| `OPENAPI_URL`         | OpenAPI URL or file path for `api:sync`                             | `http://localhost:3000/openapi.json` |
| `EXPO_PUBLIC_API_URL` | Absolute API base URL without a trailing slash; `.env.local` or EAS | Required for API calls               |

`api:sync` generates `src/api/generated/`; never edit generated files and run `staticchecks` after syncing. On physical devices, use a reachable host, not `localhost`. Never put secrets in `EXPO_PUBLIC_` variables.

## CI/CD

CI runs `staticchecks` and a vulnerability scan. Optional releases use Conventional Commits and release PRs; preview builds release PR candidates, and production builds the released commit. Android submissions target Play's internal track; iOS targets TestFlight. Monitor queued builds on Expo.

| Setting                               | Location                                | Purpose                                                                                       |
| ------------------------------------- | --------------------------------------- | --------------------------------------------------------------------------------------------- |
| `RELEASE_ENABLED`                     | Repository Actions variable             | Set to `true` only after EAS/store setup; disabled by default                                 |
| `RELEASE_REVIEWER`                    | Repository Actions variable             | Optional GitHub login for release PR reviews                                                  |
| `EXPO_TOKEN`                          | Actions secret                          | Authenticate EAS builds and submissions                                                       |
| App identity and native configuration | `app.json`                              | Set your name, identifiers, EAS project ID and update URL                                     |
| Build and submission profiles         | `eas.json`                              | Configure build environments and iOS `ascAppId`                                               |
| Startup splash                        | `app.json`, `src/constants/colors.json` | Configure logo/colors; connect `useStartupReady()` to entry-screen `onLayout` (after loading) |

Before setting `RELEASE_ENABLED=true`:

1. Initialize your own EAS project with `bunx eas-cli init` and `bunx eas-cli update:configure`.
2. Configure store records and signing/submission credentials; complete an interactive build/submission per platform (Google Play needs a first manual upload).
3. Create GitHub environments `preview` and `production`, set `EXPO_TOKEN` and matching EAS variables, and allow Actions to create PRs.

PRs created with `GITHUB_TOKEN` do not automatically trigger CI or preview. With an `appVersion` runtime policy, bump the app version and rebuild after native changes.

## Setup for an existing project

Ask your agent:

```text
Use `mvagnon/rn-boilerplate` as a reference to adopt CI, quality scripts, API generation and on-device Storybook in this Expo project.
Follow its README's "Setup for an existing project" instructions using `gh`.
```

Agent instructions:

1. Use `gh` to read the boilerplate's README, `AGENTS.md` and requested files at the chosen ref; record its SHA. The target project's instructions take precedence.
2. Merge only requested modules, adapting paths and commands without replacing screens, navigation or app identity. Check the target's Expo SDK docs; install compatible dependencies with `expo install` and update the lockfile without downgrades or SDK changes unless approved.
3. Adapt Orval to the backend and a device-reachable API URL. Keep Storybook opt-in and preserve the production entry point; omit its integrations for quality-only adoption.
4. Preserve EAS identifiers, signing and runtime policy; keep deployments disabled until the owner completes setup. Never trigger cloud builds, submissions or OTA updates without approval.
5. Run affected checks and report changes, results and source SHA.

| Module          | Source files                                                                                                                                                               |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CI              | `.github/workflows/ci.yml`, `package.json`                                                                                                                                 |
| Quality scripts | `package.json`, `eslint.config.js`, `knip.json`, `tsconfig.json`, `vitest.config.mts`                                                                                      |
| API generation  | `orval.config.ts`, `package.json`, `eslint.config.js`                                                                                                                      |
| Storybook       | `.rnstorybook/` (excluding generated registry), `metro.config.js`, `package.json`, `eslint.config.js`, `knip.json`, `.gitignore`                                           |
| EAS deployments | `.github/workflows/preview.yml`, `.github/workflows/production.yml`, `eas.json`, `app.json`, `release-please-config.json`, `.release-please-manifest.json`, `package.json` |
