import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';
import { structure, SINGLETONS } from './structure';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? '';
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';

export default defineConfig({
  name: 'flora-concept',
  title: 'Flora Concept',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: '2025-02-19' })],
  schema: {
    types: schemaTypes,
    // Singletons cannot be created from the "new document" menu.
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.has(schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) =>
      SINGLETONS.has(schemaType)
        ? actions.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : actions,
  },
});
