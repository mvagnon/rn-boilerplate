# React Native boilerplate

Expo SDK 57, Expo Router, TypeScript and Bun 1.3.14.

## Development

```bash
bun install --frozen-lockfile
bun run ios # Or: bun run android. Creates a native development build.
bun run start # Starts Metro separately.
```

Routes live in `src/app/`. Native directories are generated and ignored by Git.
Run `bun run ios` or `bun run android` again after adding a native dependency.
Use `bunx expo prebuild --clean --platform ios` (or `android`) when app configuration
changes require regenerating the native project; this replaces the generated directory.

## Scripts

| Command | Purpose |
| --- | --- |
| `bun run web` | Start the web app |
| `bun run lint` | ESLint, zero warnings allowed |
| `bun run typecheck` | TypeScript checks |
| `bun run staticchecks` | Run lint and typecheck |
| `bun run pull` / `pull:preview` | Pull EAS variables into `.env.local` |
| `bun run preview` / `prod` | Build both platforms and submit to stores |
| `bun run preview:android` / `prod:android` | Build Android without submitting |
| `bun run preview:ios` / `prod:ios` | Build iOS and submit to TestFlight |
| `bun run update --message "Fix description"` | Publish a production OTA update |
| `bun run reset-project` | Replace the starter screens with a blank app |

No test runner is configured yet, so CI only runs the existing static checks.

## CI/CD

- **CI**: pull requests, pushes to `main`, and manual runs execute static checks and an OSV vulnerability scan.
- **Release**: pushes to `main` maintain a release PR using Conventional Commits (`feat:`, `fix:`, `feat!:`). Merging it creates a GitHub release and updates `package.json`, `app.json`, and the changelog.
- **Preview**: non-draft release PRs labeled `autorelease: pending` build and submit store candidates using the EAS `preview` environment/channel.
- **Production**: a new release builds and submits the exact released commit using the EAS `production` environment/channel. Android submissions target the internal track; iOS submissions go to TestFlight, not directly to public release.

Both deployment jobs run static checks before submitting builds. They only queue
EAS jobs (`--no-wait`); monitor the actual build and submission results on Expo.
Release-please, preview, and production jobs are skipped unless the repository
variable `EAS_ENABLED` is `true`. CI stays active.

| Setting | Location | Purpose |
| --- | --- | --- |
| `EAS_ENABLED` | GitHub repository Actions variable | Opt in to releases and preview/production deployments |
| `EXPO_TOKEN` | GitHub Actions secret | Authenticate EAS builds and submissions |
| App environment variables | EAS environments | Pull locally with `pull` / `pull:preview`; never commit secrets |

### Enable deployments for your app

1. Customize the app name, slug, scheme, `ios.bundleIdentifier`, and `android.package` in `app.json`.
2. Run `bunx eas-cli login`, `bunx eas-cli init`, then `bunx eas-cli update:configure`. These link your own project and configure `extra.eas.projectId`, `updates.url`, and `runtimeVersion`; never reuse another app's IDs. With the `appVersion` runtime policy, bump the app version and rebuild whenever native dependencies or configuration change.
3. Create the app records in App Store Connect and Google Play. Add your app's `submit.production.ios.ascAppId` to `eas.json` and configure submission credentials in EAS. Google Play requires a first manual upload before API submissions.
4. Complete an interactive build and submission for each platform to provision credentials before enabling non-interactive CI.
5. Create GitHub environments `preview` and `production`; configure required reviewers for production if desired. Add an `EXPO_TOKEN` secret, and create the corresponding EAS environments/variables.
6. Allow GitHub Actions to create pull requests in repository settings. Release-please uses the built-in `GITHUB_TOKEN`; PR events it creates do not automatically trigger CI or preview workflows.
7. Set the **repository** Actions variable `EAS_ENABLED` to `true` only after setup is complete.

Build profiles use remote build numbers with automatic increments. Preview uses
store distribution (TestFlight / Play internal track), not an installable APK.
No cloud project, build, submission, or OTA update is created by this template setup.
