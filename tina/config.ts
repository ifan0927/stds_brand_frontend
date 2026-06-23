import { defineConfig } from 'tinacms';

export default defineConfig({
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'uploads',
      publicFolder: 'public',
      static: true,
    },
  },
  repoProvider: {
    defaultBranchName: 'dev',
  },
  schema: {
    collections: [
      {
        label: 'Tina Foundation',
        name: 'tinaFoundation',
        path: 'content/tina-foundation',
        format: 'json',
        ui: {
          allowedActions: {
            create: false,
            delete: false,
            createFolder: false,
            createNestedFolder: false,
          },
        },
        fields: [
          {
            type: 'string',
            label: 'Status',
            name: 'status',
            required: true,
          },
        ],
      },
    ],
  },
});
