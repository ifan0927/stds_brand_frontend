import { spawnSync } from 'node:child_process';

const hasTinaCloudConfig = Boolean(
  process.env.TINA_BRANCH && process.env.TINA_CLIENT_ID && process.env.TINA_TOKEN,
);

const tinacmsBin =
  process.platform === 'win32' ? 'node_modules/.bin/tinacms.cmd' : 'node_modules/.bin/tinacms';

const args = hasTinaCloudConfig
  ? [
      'build',
      '--content=local',
      '--skip-cloud-checks',
      '--skip-indexing',
      '--noTelemetry',
      '-c',
      'astro build',
    ]
  : [
      'build',
      '--local',
      '--skip-cloud-checks',
      '--skip-indexing',
      '--noTelemetry',
      '-c',
      'astro build',
    ];

if (hasTinaCloudConfig) {
  console.log('Building TinaCMS admin with TinaCloud client configuration.');
} else {
  console.log('Building TinaCMS admin in local mode; TINA_BRANCH, TINA_CLIENT_ID, or TINA_TOKEN is missing.');
}

const result = spawnSync(tinacmsBin, args, { stdio: 'inherit' });

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
