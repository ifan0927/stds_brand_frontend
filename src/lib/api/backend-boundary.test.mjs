import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const allowedEndpoint = '/api/v1/public/properties/availability';
const fixturePath = 'scripts/brand-api-fixture.mjs';
const workflowPath = '.github/workflows/pr-ci.yml';

describe('backend integration boundary', () => {
  it('keeps production backend API usage limited to property availability', () => {
    const checkedFiles = [
      ...readProductionFiles('src'),
      fixturePath,
      workflowPath,
    ];
    const endpointUsage = collectEndpointUsage(checkedFiles);

    expect(endpointUsage).toEqual([
      {
        file: workflowPath,
        endpoint: allowedEndpoint,
      },
      {
        file: fixturePath,
        endpoint: allowedEndpoint,
      },
      {
        file: 'src/lib/api/brand.ts',
        endpoint: allowedEndpoint,
      },
    ]);
  });

  it('keeps the CI fixture availability-only with the accepted response shape', () => {
    const source = readText(fixturePath);

    expect(source).toContain(`'${allowedEndpoint}'`);
    expect(source).not.toContain('/api/v1/public/brand/profile');
    expect(source).not.toContain('/api/v1/public/brand/faqs');
    expect(source).toContain('items: [');

    for (const field of ['property_id', 'property_public_name', 'address', 'has_vacant_room']) {
      expect(source).toContain(field);
    }
  });

  it('probes the availability endpoint before running the CI build', () => {
    const source = readText(workflowPath);
    const probeIndex = source.indexOf(`fetch('http://127.0.0.1:4177${allowedEndpoint}')`);
    const buildIndex = source.indexOf('npm run build');

    expect(probeIndex).toBeGreaterThan(-1);
    expect(buildIndex).toBeGreaterThan(-1);
    expect(probeIndex).toBeLessThan(buildIndex);
    expect(source).not.toContain('/api/v1/public/brand/profile');
    expect(source).not.toContain('/api/v1/public/brand/faqs');
  });
});

function readProductionFiles(path) {
  const absolutePath = join(root, path);
  const stat = statSync(absolutePath);

  if (stat.isFile()) {
    return isProductionSourceFile(path) ? [path] : [];
  }

  return readdirSync(absolutePath)
    .flatMap((entry) => readProductionFiles(join(path, entry)));
}

function isProductionSourceFile(path) {
  return (
    /\.(astro|ts|mjs|js)$/.test(path) &&
    !path.endsWith('.test.ts') &&
    !path.endsWith('.test.mjs')
  );
}

function collectEndpointUsage(files) {
  return files
    .flatMap((file) => {
      const source = readText(file);
      return [...source.matchAll(/\/api\/v1\/[A-Za-z0-9_./:-]+/g)].map((match) => ({
        file,
        endpoint: match[0],
      }));
    })
    .sort((a, b) => `${a.file}:${a.endpoint}`.localeCompare(`${b.file}:${b.endpoint}`));
}

function readText(path) {
  return readFileSync(join(root, path), 'utf8');
}
