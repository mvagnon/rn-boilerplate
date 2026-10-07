import type { ConfigExternal } from 'orval';

export default {
  api: {
    input: {
      target: process.env.OPENAPI_URL ?? 'http://localhost:3000/openapi.json',
    },
    output: {
      target: './src/api/generated/client.ts',
      schemas: './src/api/generated/models',
      mode: 'tags-split',
      client: 'fetch',
      baseUrl: { runtime: 'process.env.EXPO_PUBLIC_API_URL' },
      override: {
        fetch: {
          includeHttpResponseReturnType: false,
          forceSuccessResponse: true,
        },
      },
    },
  },
} satisfies ConfigExternal;
