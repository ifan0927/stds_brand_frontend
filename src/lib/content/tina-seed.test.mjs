import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

describe('Tina seed content', () => {
  it('seeds required singleton, FAQ, and news content without availability data', () => {
    expect(readJson('content/site-settings/site.json')).toMatchObject({
      brandName: '奕德不動產',
      contact: {
        phone: '06-208-1688',
      },
      forms: {
        viewingUrl: expect.any(String),
        landlordUrl: expect.any(String),
      },
    });

    for (const page of ['home', 'tenant', 'landlord', 'news-index']) {
      const pageContent = readJson(`content/pages/${page}/page.json`);
      expect(pageContent.seoTitle).toEqual(expect.any(String));
      expect(pageContent.seoDescription).toEqual(expect.any(String));
    }

    const faqs = readCollection('content/faqs', '.json').map((path) => readJson(path));
    expect(faqs.length).toBeGreaterThanOrEqual(6);
    expect(faqs.every((item) => item.question && item.answer && Number.isInteger(item.sort_order))).toBe(true);

    const news = readCollection('content/news', '.mdx').map(readMdxFrontmatter);
    expect(news.length).toBeGreaterThanOrEqual(6);
    expect(news).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          slug: 'spring-contract-reminder',
          category: '公告',
          read_min: '5',
        }),
      ]),
    );
    expect(news.every((item) => item.slug && item.cover && item.date && item.author)).toBe(true);

    expect(existsSync(join(root, 'content/availability'))).toBe(false);
  });

  it('keeps seeded Tina media paths available under public/uploads', () => {
    const contentFiles = [
      'content/site-settings/site.json',
      'content/pages/home/page.json',
      'content/pages/landlord/page.json',
      ...readCollection('content/news', '.mdx'),
    ];
    const mediaPaths = new Set();

    for (const file of contentFiles) {
      const source = readFileSync(join(root, file), 'utf8');
      for (const match of source.matchAll(/\/uploads\/[^"'\s]+/g)) {
        mediaPaths.add(match[0]);
      }
    }

    expect(mediaPaths.size).toBeGreaterThan(0);
    for (const mediaPath of mediaPaths) {
      expect(existsSync(join(root, 'public', mediaPath))).toBe(true);
    }
  });
});

function readJson(path) {
  return JSON.parse(readFileSync(join(root, path), 'utf8'));
}

function readCollection(path, extension) {
  return readdirSync(join(root, path))
    .filter((file) => file.endsWith(extension))
    .map((file) => join(path, file))
    .filter((file) => statSync(join(root, file)).isFile());
}

function readMdxFrontmatter(path) {
  const source = readFileSync(join(root, path), 'utf8');
  const match = source.match(/^---\n([\s\S]+?)\n---/);
  expect(match).not.toBeNull();

  const data = {};
  for (const line of match?.[1].split('\n') ?? []) {
    const field = line.match(/^([a-z_]+):\s*(.+)$/);
    if (field) data[field[1]] = field[2];
  }
  return data;
}
