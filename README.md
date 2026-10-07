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

| Command                                      | Purpose                                                               |
| -------------------------------------------- | --------------------------------------------------------------------- |
| `bun run api:sync`                           | Generate the typed fetch client and models from OpenAPI                |
| `bun run pull`                               | Pull development EAS variables into `.env.local`                      |
| `bun run pull:preview`                       | Pull preview EAS variables into `.env.local`                          |
| `bun run android`                            | Build and run on a selected Android device; Metro starts separately   |
| `bun run ios`                                | Build and run on a selected iOS device; Metro starts separately       |
| `bun run web`                                | Start the web app                                                     |
| `bun run start`                              | Start Metro for development builds on localhost                       |
| `bun run storybook`                          | Start on-device Storybook instead of the app                           |
| `bun run storybook:android`                  | Start Storybook and open the Android development build                 |
| `bun run storybook:ios`                      | Start Storybook and open the iOS development build                     |
| `bun run storybook-generate`                 | Regenerate the story registry (automatic before each static check)     |
| `bun run lint`                               | ESLint for JS/TS, JSON and CSS; zero warnings allowed                 |
| `bun run typecheck`                          | Regenerate the story registry and run TypeScript checks                |
| `bun run knip`                               | Detect unused files, exports and dependencies                         |
| `bun run test`                               | Run Vitest unit tests                                                 |
| `bun run staticchecks`                       | Run lint, typecheck, Knip and tests                                    |
| `bun run preview`                            | Build both platforms with the preview profile and submit to stores    |
| `bun run preview:android`                    | Build Android with the preview profile without submitting             |
| `bun run preview:ios`                        | Build iOS with the preview profile and submit to TestFlight           |
| `bun run prod`                               | Build both platforms with the production profile and submit to stores |
| `bun run prod:android`                       | Build Android with the production profile without submitting          |
| `bun run prod:ios`                           | Build iOS with the production profile and submit to TestFlight        |
| `bun run update --message "Fix description"` | Publish a production OTA update                                       |

## Unit tests

Vitest runs pure TypeScript tests in `tests/**/*.test.ts`, with a Node environment
and the project's TypeScript path aliases. It does not render React Native UI or
load native modules. No tests exist yet; `passWithNoTests` allows this initial
empty suite. Disable it after adding real tests. Tests run as part of `staticchecks`
locally and in CI.

## API generation

Orval generates typed fetch functions and models in `src/api/generated/`.
Run `bun run api:sync` with your backend available, then commit the generated files;
do not edit them manually. HTTP error responses reject instead of returning success data.
API generation is explicit, not part of CI's static checks.

| Variable | Default | Purpose |
| --- | --- | --- |
| `OPENAPI_URL` | `http://localhost:3000/openapi.json` | OpenAPI URL or file path used by `api:sync`; set in the shell or `.env.local` |
| `EXPO_PUBLIC_API_URL` | None (required when calling the API) | Absolute API base URL, without a trailing slash; set in `.env.local` or EAS |

The client reads `EXPO_PUBLIC_API_URL` through Expo's environment variable inlining.
For a physical device, use a reachable host or your computer's LAN IP, not `localhost`.
Public variables must not contain secrets. No backend schema or generated client
is bundled with this template yet.

## Storybook

Build the development client once with `bun run ios` or `bun run android` after
installing the Storybook native dependencies, then run `bun run storybook`.
Stop the existing Metro server first. Stop Storybook and run `bun run start --clear`
to return to the app.

Stories live alongside components as `src/**/*.stories.tsx`; shared configuration
and decorators live in `.rnstorybook/`. The examples cover `ThemedText` and `HintRow`,
with editable props and the app's system-driven light/dark theme.
Metro generates `storybook.requires.ts` automatically; it is not committed.

| Variable | Default | Purpose |
| --- | --- | --- |
| `STORYBOOK_ENABLED` | Unset (disabled) | `true` replaces the app entry point with Storybook; set by the Storybook scripts |

Keep this variable unset for builds and OTA updates. Normal app bundles keep
Expo Router and exclude Storybook. This on-device setup has no static HTML build,
Chromatic, or DOM accessibility addons.
The native Storybook packages and UI are pinned to 10.5.1 to retain Expo 57's
supported `react-native-safe-area-context` version (5.7).

## CI/CD

- **CI**: pull requests, pushes to `main`, and manual runs execute static checks and an OSV vulnerability scan.
- **Release**: pushes to `main` maintain a release PR using Conventional Commits (`feat:`, `fix:`, `feat!:`). Merging it creates a GitHub release and updates `package.json`, `app.json`, and the changelog.
- **Preview**: non-draft release PRs labeled `autorelease: pending` build and submit store candidates using the EAS `preview` environment/channel.
- **Production**: a new release builds and submits the exact released commit using the EAS `production` environment/channel. Android submissions target the internal track; iOS submissions go to TestFlight, not directly to public release.

Both deployment jobs run static checks before submitting builds. They only queue
EAS jobs (`--no-wait`); monitor the actual build and submission results on Expo.
Release-please, preview, and production jobs are skipped unless the repository
variable `EAS_ENABLED` is `true`. CI stays active.

| Setting                   | Location                           | Purpose                                                         |
| ------------------------- | ---------------------------------- | --------------------------------------------------------------- |
| `EAS_ENABLED`             | GitHub repository Actions variable | Opt in to releases and preview/production deployments           |
| `EXPO_TOKEN`              | GitHub Actions secret              | Authenticate EAS builds and submissions                         |
| App environment variables | EAS environments                   | Pull locally with `pull` / `pull:preview`; never commit secrets |

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
