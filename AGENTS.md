# Project Instructions

## Architecture

Expo/React Native application with Expo Router. Routes and layouts live in `src/app/`; keep components, hooks and constants outside it. Shared Storybook configuration lives in `.rnstorybook/`, generated API code in `src/api/generated/`, and Node-based unit tests in `tests/`.

## Roadmap

Project management URL: [GitHub](https://github.com/mvagnon/react-boilerplate/issues)

Consult it with the dedicated tool (`gh` CLI or appropriate MCP, etc.) to understand the project and make decisions that account for upcoming changes.

## Orval

Generates typed fetch functions and API types in `src/api/generated/` from the backend's OpenAPI endpoint. Set `OPENAPI_URL` and run `bun run api:sync`; reuse the generated client and never edit it manually. Set `EXPO_PUBLIC_API_URL` to an API host reachable from the device.

## Storybook

On-device UI development and documentation workshop. Keep `*.stories.tsx` next to components under `src/`, with fixed data and no live backend. Run `bun run storybook` with a native development build; configuration lives in `.rnstorybook/`.

Every component creation, update or deletion must include the corresponding story creation, update or deletion.

Consult [React Native Storybook documentation on Context7](https://context7.com/storybookjs/react-native) (`/storybookjs/react-native`) for well-structured, testable stories. Use typed CSF (`satisfies Meta`, `StoryObj` from `@storybook/react-native`) and cover all applicable variants and states through `args` and on-device controls. Keep interactions reproducible without assuming browser-only testing APIs.
