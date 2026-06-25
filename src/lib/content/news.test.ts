import { describe, expect, it } from 'vitest';

import {
  formatNewsDate,
  getNewsCategories,
  getNewsNeighbors,
  getNewsPosts,
  getRelatedNewsPosts,
} from './news';

describe('news content helpers', () => {
  it('loads seeded news posts sorted newest first', () => {
    const posts = getNewsPosts();

    expect(posts.map((post) => post.slug)).toEqual([
      'spring-contract-reminder',
      'tax-guide-2026',
      'east-district-new-listings',
      'lease-vs-managed',
      'handover-checklist',
      'company-anniversary',
    ]);
    expect(posts[0]).toMatchObject({
      category: '公告',
      read_min: 5,
      tags: ['合約', '續約', '房東'],
    });
    expect(posts[0].body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'lede' }),
        expect.objectContaining({ type: 'heading', text: '01 · 合約到期前 60 天就可以開始討論' }),
        expect.objectContaining({ type: 'callout' }),
      ]),
    );
  });

  it('derives categories in first appearance order', () => {
    expect(getNewsCategories(getNewsPosts())).toEqual(['公告', '房東指南', '物件動態', '房客指南']);
  });

  it('builds deterministic previous, next, and related posts', () => {
    const posts = getNewsPosts();
    const current = posts.find((post) => post.slug === 'lease-vs-managed');

    expect(current).toBeDefined();
    expect(getNewsNeighbors(posts, 'lease-vs-managed')).toEqual({
      previous: expect.objectContaining({ slug: 'east-district-new-listings' }),
      next: expect.objectContaining({ slug: 'handover-checklist' }),
    });
    expect(getRelatedNewsPosts(posts, current!).map((post) => post.slug)).toEqual([
      'tax-guide-2026',
      'spring-contract-reminder',
      'east-district-new-listings',
    ]);
  });

  it('formats dates for list and article metadata without timezone drift', () => {
    expect(formatNewsDate('2026-05-15')).toEqual({
      year: '2026',
      monthDay: '05.15',
      full: '2026.05.15',
      iso: '2026-05-15',
    });
    expect(formatNewsDate('2026-05-15T00:00:00.000Z')).toEqual({
      year: '2026',
      monthDay: '05.15',
      full: '2026.05.15',
      iso: '2026-05-15',
    });
  });
});
