export type NewsBodyBlock =
  | { type: 'lede'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'callout'; text: string };

export type NewsPost = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  cover: string;
  date: string;
  author: string;
  read_min: number;
  tags: string[];
  body: NewsBodyBlock[];
};

export type NewsPostNeighbor = Pick<NewsPost, 'slug' | 'title'> | null;

const newsSources = import.meta.glob<string>('../../../content/news/*.mdx', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export function getNewsPosts(): NewsPost[] {
  return Object.entries(newsSources)
    .map(([path, source]) => parseNewsPost(source, path))
    .sort(compareNewsPosts);
}

export function getNewsCategories(posts: NewsPost[]): string[] {
  return [...new Set(posts.map((post) => post.category).filter(Boolean))];
}

export function getNewsNeighbors(posts: NewsPost[], slug: string): { previous: NewsPostNeighbor; next: NewsPostNeighbor } {
  const index = posts.findIndex((post) => post.slug === slug);
  return {
    previous: index > 0 ? posts[index - 1] : null,
    next: index >= 0 && index < posts.length - 1 ? posts[index + 1] : null,
  };
}

export function getRelatedNewsPosts(posts: NewsPost[], current: NewsPost, limit = 3): NewsPost[] {
  const others = posts.filter((post) => post.slug !== current.slug);
  const sameCategory = others.filter((post) => post.category === current.category);
  const otherCategories = others.filter((post) => post.category !== current.category);
  return [...sameCategory, ...otherCategories].slice(0, limit);
}

export function formatNewsDate(date: string): { year: string; monthDay: string; full: string; iso: string } {
  const [, year, month = '01', day = '01'] = date.match(/^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/) ?? [];
  if (!year) {
    throw new Error(`Invalid news date: ${date}`);
  }

  return {
    year,
    monthDay: `${month.padStart(2, '0')}.${day.padStart(2, '0')}`,
    full: `${year}.${month.padStart(2, '0')}.${day.padStart(2, '0')}`,
    iso: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
  };
}

function parseNewsPost(source: string, path: string): NewsPost {
  const match = source.match(/^---\n([\s\S]+?)\n---\n?([\s\S]*)$/);
  if (!match) {
    throw new Error(`News post is missing frontmatter: ${path}`);
  }

  const frontmatter = parseFrontmatter(match[1]);
  const readMinutes = Number(frontmatter.read_min);
  if (!Number.isFinite(readMinutes)) {
    throw new Error(`News post has invalid read_min: ${path}`);
  }

  return {
    slug: requireString(frontmatter.slug, 'slug', path),
    category: requireString(frontmatter.category, 'category', path),
    title: requireString(frontmatter.title, 'title', path),
    excerpt: requireString(frontmatter.excerpt, 'excerpt', path),
    cover: requireString(frontmatter.cover, 'cover', path),
    date: requireString(frontmatter.date, 'date', path),
    author: requireString(frontmatter.author, 'author', path),
    read_min: readMinutes,
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    body: parseNewsBody(match[2]),
  };
}

function parseFrontmatter(source: string): Record<string, string | string[]> {
  const data: Record<string, string | string[]> = {};
  const lines = source.split('\n');

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const field = line.match(/^([a-z_]+):\s*(.*)$/);
    if (!field) continue;

    const [, key, rawValue] = field;
    if (rawValue !== '') {
      data[key] = rawValue.trim();
      continue;
    }

    const list: string[] = [];
    while (lines[index + 1]?.startsWith('  - ')) {
      index += 1;
      list.push(lines[index].slice(4).trim());
    }
    data[key] = list;
  }

  return data;
}

function parseNewsBody(source: string): NewsBodyBlock[] {
  const blocks = source
    .trim()
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map((block, index) => {
    if (block.startsWith('## ')) {
      return { type: 'heading', text: block.slice(3).trim() };
    }

    if (block.startsWith('> ')) {
      return {
        type: 'callout',
        text: block
          .split('\n')
          .map((line) => line.replace(/^>\s?/, '').trim())
          .join(' '),
      };
    }

    return {
      type: index === 0 ? 'lede' : 'paragraph',
      text: block.replace(/\n/g, ' '),
    };
  });
}

function compareNewsPosts(a: NewsPost, b: NewsPost): number {
  const byDate = b.date.localeCompare(a.date);
  if (byDate !== 0) return byDate;
  return a.slug.localeCompare(b.slug);
}

function requireString(value: string | string[] | undefined, field: string, path: string): string {
  if (typeof value === 'string' && value.trim() !== '') return value.trim();
  throw new Error(`News post is missing ${field}: ${path}`);
}
