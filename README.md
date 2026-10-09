[![portfolio](https://img.shields.io/website?url=https%3A%2F%2Fmvagnon.dev&up_message=Visit&label=Portfolio&color=%23007fff)](https://mvagnon.dev)
[![bymeacoffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-Support-yellow?logo=buymeacoffee)](https://buymeacoffee.com/mvagnon)

# React Native Boilerplate

Expo SDK 57, Expo Router, TypeScript and Bun 1.3.14. Tooling and CI use Node 24.

## Commands

| Command                                      | Purpose                                                               |
| -------------------------------------------- | --------------------------------------------------------------------- |
| `bun install`                                | Install dependencies                                                  |
| `bun run api:sync`                           | Regenerate the typed fetch client from OpenAPI                        |
| `bun run pull`                               | Pull development EAS variables into `.env.local`                      |
| `bun run pull:preview`                       | Pull preview EAS variables into `.env.local`                          |
| `bun run prebuild`                           | Generate Android and iOS projects                                     |
| `bun run ios`                                | Build and run on a selected iOS device; Metro starts separately       |
| `bun run android`                            | Build and run on a selected Android device; Metro starts separately   |
| `bun run web`                                | Start the web app                                                     |
| `bun run start`                              | Start Metro for development builds on localhost                       |
| `bun run storybook`                          | Start on-device Storybook instead of the app                          |
| `bun run storybook:android`                  | Start Storybook and open the Android development build                |
| `bun run storybook:ios`                      | Start Storybook and open the iOS development build                    |
| `bun run storybook-generate`                 | Regenerate the story registry                                         |
| `bun run lint`                               | Check JS/TS, JSON and CSS lint rules; warnings fail                   |
| `bun run typecheck`                          | Check TypeScript types                                                |
| `bun run knip`                               | Find unused code and dependencies                                     |
| `bun run test`                               | Run Vitest tests in `tests/`                                          |
| `bun run staticchecks`                       | Run lint, typecheck, Knip and tests                                   |
| `bun run preview`                            | Build both platforms with the preview profile and submit to stores    |
| `bun run preview:android`                    | Build Android with the preview profile without submitting             |
| `bun run preview:ios`                        | Build iOS with the preview profile and submit to TestFlight           |
| `bun run prod`                               | Build both platforms with the production profile and submit to stores |
| `bun run prod:android`                       | Build Android with the production profile without submitting          |
| `bun run prod:ios`                           | Build iOS with the production profile and submit to TestFlight        |
| `bun run update --message "Fix description"` | Publish a production OTA update                                       |

Build a development client with `ios` or `android`, then start Metro with `start`. Local native builds require Xcode or Android tooling.
Routes live in `src/app/`; native directories are generated and ignored by Git. After native dependency or app config changes, regenerate with `bunx expo prebuild --clean --platform ios` (or `android`), then rebuild; this replaces the generated directory.

## Startup splash

BootSplash requires a development build, not Expo Go. The native splash hands off to an overlay that waits for the focused screen's first layout; text and spinner fade together.

| Configuration | Location |
| ------------- | -------- |
| App name, logo path and logo width | `app.json` |
| Light/dark backgrounds, text and primary color | `src/constants/colors.json` |
| Screen readiness | Call `useStartupReady()` in each entry screen and pass its callback to `onLayout`; for async screens, call it after initial loading finishes |

Regenerate and rebuild after changing the logo, backgrounds or native dependencies. Text and spinner changes only need a JS reload.

## Env variables

| Variable              | Purpose                                                             | Default                              |
| --------------------- | ------------------------------------------------------------------- | ------------------------------------ |
| `OPENAPI_URL`         | OpenAPI URL or file path for `api:sync`; shell or `.env.local`      | `http://localhost:3000/openapi.json` |
| `EXPO_PUBLIC_API_URL` | Absolute API base URL without a trailing slash; `.env.local` or EAS | Required when calling the API        |

`api:sync` requires backend access or a local schema and generates files in `src/api/generated/`. Never edit generated files; commit them and run `staticchecks` after syncing. HTTP error responses reject; generation is not part of CI.
For physical devices, use a reachable API host or your computer's LAN IP, not `localhost`. Never put secrets in `EXPO_PUBLIC_` variables.

## Storybook

- The Storybook scripts automatically set `STORYBOOK_ENABLED=true` to replace the app entry point in Metro. No `.env` configuration is needed; keep this flag unset for normal builds and OTA updates.
- Colocate `*.stories.tsx` with components under `src/`. Shared configuration and decorators live in `.rnstorybook/`.
- Stories use the application's system-driven light/dark theme and `@/*` aliases. Use deterministic props rather than a live backend; add providers only where needed.
- Build the native development client first, stop the existing Metro server, then run `bun run storybook`. Stop Storybook and run `bun run start --clear` to return to the app.
- `storybook.requires.ts` is generated and not committed. Metro, lint, typecheck and Knip regenerate it automatically.
- `bun run test` runs only `tests/**/*.test.ts` in Node, for pure logic without native modules. Stories are not automated tests; no browser or native UI runner is installed. Disable `passWithNoTests` once real tests exist.
- This on-device setup has no static HTML build, Chromatic or DOM accessibility panel. Native Storybook and its UI are pinned to 10.5.1 for Expo 57's safe-area compatibility.

## CI/CD

| GitHub setting     | Location                    | Purpose                                                                | Default          |
| ------------------ | --------------------------- | ---------------------------------------------------------------------- | ---------------- |
| `RELEASE_ENABLED`  | Repository Actions variable | Set to `true` to enable releases and EAS deployments                   | Unset (disabled) |
| `RELEASE_REVIEWER` | Repository Actions variable | GitHub login to request a review from on release PR creation or update | Unset (disabled) |
| `EXPO_TOKEN`       | Actions secret              | Authenticate EAS builds and submissions                                | None             |

- **CI**: pull requests, pushes to `main` and manual runs execute `staticchecks` and an OSV vulnerability scan. CI stays active without EAS configuration.
- **Release**: Conventional Commits maintain a release PR; merging it creates a GitHub release and updates app/package versions and the changelog.
- Set `RELEASE_REVIEWER` to your GitHub login (e.g. `mvagnon`) to request or re-request a review using the existing `GITHUB_TOKEN`. Requiring approval before merge is a separate branch protection setting.
- **Preview**: non-draft, same-repository release PRs labeled `autorelease: pending` build and submit store candidates.
- **Production**: new releases build and submit the released commit. Android targets Play's internal track; iOS targets TestFlight, not public release.
- Release-please, preview and production are disabled unless `RELEASE_ENABLED=true`. Deployment jobs check the code, then queue EAS jobs with `--no-wait`; monitor completion on Expo. Build numbers auto-increment remotely; preview is store distribution, not an APK.

### Enable deployments for your app

1. Customize the name, slug, scheme, `ios.bundleIdentifier` and `android.package` in `app.json`.
2. Run `bunx eas-cli login`, `bunx eas-cli init`, then `bunx eas-cli update:configure`. Use your own project ID and update URL. With the `appVersion` runtime policy, bump the app version and rebuild after native changes.
3. Create App Store Connect and Google Play app records. Set `submit.production.ios.ascAppId` in `eas.json` and configure EAS submission credentials. Google Play requires a first manual upload.
4. Complete an interactive build and submission for each platform before enabling non-interactive CI.
5. Create GitHub environments `preview` and `production`, the `EXPO_TOKEN` secret, and matching EAS environments/variables. Configure production reviewers if needed.
6. Allow GitHub Actions to create PRs. Release-please uses `GITHUB_TOKEN`; PR events it creates do not automatically trigger CI or preview.
7. Set the **repository** Actions variable `RELEASE_ENABLED` to `true` only after setup. Template installation does not create a cloud project or deploy the app.

## Setup for an existing project

Ask your agent:

```text
Use `mvagnon/rn-boilerplate` as a reference to adopt CI, quality scripts, API generation and on-device Storybook in this Expo project.
Follow its README's "Setup for an existing project" instructions using `gh`.
```

Agent instructions:

1. Use `gh` to read this README, the boilerplate's `AGENTS.md` and relevant files at the requested ref (default: default branch). Record the commit SHA.
2. Read the target project's applicable `AGENTS.md` files first. Its instructions and conventions take precedence. Apply only the requested modules from the table below.
3. Briefly explain the changes, then merge configuration without duplicates. Adapt commands, paths and the package manager; do not replace app screens or navigation.
4. Read the target's Expo SDK version and matching documentation. Install missing dependencies through `expo install`, using `bunx` for Bun projects, and update the lockfile. Respect SDK compatibility and pinned peer dependencies; do not change the SDK or downgrade packages without approval.
5. For API generation, adapt `orval.config.ts` to the backend schema, output paths and client needs. Keep an absolute, environment-driven API URL for native devices; never edit generated code.
6. For Storybook, merge the Metro wrapper and decorators without disturbing Expo Router. Keep Storybook opt-in, preserve the app's production entry point, and adapt its registry generation and lint/Knip configuration. Omit these integrations for quality-only adoption without Storybook.
7. For EAS deployments, preserve the target's app identifiers, project ID, update URL, runtime policy and signing setup. Keep releases and deployments disabled until its owner completes cloud and store configuration; never reuse this template's identity.
8. Run affected checks and relevant bundling checks. Do not trigger builds, submissions or OTA updates in the cloud without approval. Report changes, results and the source SHA.

| Module          | Source files                                                                                                                                                               |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CI              | `.github/workflows/ci.yml`, `package.json`                                                                                                                                 |
| Quality scripts | `package.json`, `eslint.config.js`, `knip.json`, `tsconfig.json`, `vitest.config.mts`                                                                                      |
| API generation  | `orval.config.ts`, `package.json`, `eslint.config.js`                                                                                                                      |
| Storybook       | `.rnstorybook/` (excluding generated registry), `metro.config.js`, `package.json`, `eslint.config.js`, `knip.json`, `.gitignore`                                           |
| Startup splash  | `plugins/with-native-bootsplash.js`, `assets/bootsplash/`, `assets/images/splash-icon.png`, `src/components/animated-bootsplash*`, `src/hooks/use-startup-ready.ts`, `src/constants/colors.json`, `app.json`, `package.json`, `knip.json` |
| EAS deployments | `.github/workflows/preview.yml`, `.github/workflows/production.yml`, `eas.json`, `app.json`, `release-please-config.json`, `.release-please-manifest.json`, `package.json` |
