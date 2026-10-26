import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? '',
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  },
  // Served by the `studio` Vercel service under /studio (vercel.json rewrites).
  project: { basePath: '/studio' },
  deployment: { autoUpdates: true },
});
