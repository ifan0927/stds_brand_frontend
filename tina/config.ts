import { defineConfig } from 'tinacms';

declare const process: {
  env: Record<string, string | undefined>;
};

const tinaBranch = process.env.TINA_BRANCH || process.env.CF_PAGES_BRANCH || 'dev';
const tinaClientId = process.env.TINA_CLIENT_ID || null;
const tinaToken = process.env.TINA_TOKEN || null;

const seoFields = [
  { type: 'string', label: 'SEO Title', name: 'seoTitle' },
  {
    type: 'string',
    label: 'SEO Description',
    name: 'seoDescription',
    ui: { component: 'textarea' },
  },
] as const;

const introFields = [
  { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
  { type: 'string', label: 'Title', name: 'title', required: true },
  {
    type: 'string',
    label: 'Lede',
    name: 'lede',
    ui: { component: 'textarea' },
  },
] as const;

const ctaFields = [
  { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
  { type: 'string', label: 'Title', name: 'title', required: true },
  {
    type: 'string',
    label: 'Body',
    name: 'body',
    ui: { component: 'textarea' },
  },
  { type: 'string', label: 'CTA Label', name: 'ctaLabel', required: true },
] as const;

const serviceItemFields = [
  { type: 'string', label: 'Title', name: 'title', required: true },
  {
    type: 'string',
    label: 'Body',
    name: 'body',
    required: true,
    ui: { component: 'textarea' },
  },
] as const;

export default defineConfig({
  branch: tinaBranch,
  clientId: tinaClientId,
  token: tinaToken,
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
    defaultBranchName: tinaBranch,
  },
  schema: {
    collections: [
      {
        label: 'Site Settings',
        name: 'siteSettings',
        path: 'content/site-settings',
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
          { type: 'string', label: 'Brand Name', name: 'brandName', required: true },
          { type: 'string', label: 'English Brand Name', name: 'brandNameEn', required: true },
          { type: 'image', label: 'Logo', name: 'logo', required: true },
          {
            type: 'object',
            label: 'Navigation',
            name: 'nav',
            list: true,
            fields: [
              { type: 'string', label: 'Label', name: 'label', required: true },
              { type: 'string', label: 'Href', name: 'href', required: true },
              { type: 'boolean', label: 'External', name: 'external' },
            ],
          },
          {
            type: 'object',
            label: 'Contact',
            name: 'contact',
            fields: [
              { type: 'string', label: 'Phone', name: 'phone', required: true },
              { type: 'string', label: 'Email', name: 'email', required: true },
              { type: 'string', label: 'Address', name: 'address', required: true },
              { type: 'string', label: 'Hours', name: 'hours', required: true },
            ],
          },
          {
            type: 'object',
            label: 'Social',
            name: 'social',
            fields: [
              { type: 'string', label: 'LINE URL', name: 'lineUrl', required: true },
              { type: 'string', label: 'Facebook URL', name: 'fbUrl', required: true },
              { type: 'string', label: 'Facebook Label', name: 'fbLabel', required: true },
            ],
          },
          {
            type: 'object',
            label: 'Forms',
            name: 'forms',
            fields: [
              { type: 'string', label: 'Viewing Form URL', name: 'viewingUrl', required: true },
              { type: 'string', label: 'Landlord Form URL', name: 'landlordUrl', required: true },
            ],
          },
          {
            type: 'string',
            label: 'Footer Tagline',
            name: 'footerTagline',
            required: true,
            ui: { component: 'textarea' },
          },
          { type: 'string', label: 'Copyright', name: 'copyright', required: true },
        ],
      },
      {
        label: 'Home Page',
        name: 'homePage',
        path: 'content/pages/home',
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
          ...seoFields,
          {
            type: 'object',
            label: 'Hero',
            name: 'hero',
            fields: [
              { type: 'string', label: 'Eyebrow', name: 'eyebrow', required: true },
              { type: 'string', label: 'Title', name: 'title', required: true },
              {
                type: 'string',
                label: 'Subtitle',
                name: 'subtitle',
                required: true,
                ui: { component: 'textarea' },
              },
              { type: 'image', label: 'Image', name: 'image', required: true },
            ],
          },
          {
            type: 'object',
            label: 'Dual Entry Cards',
            name: 'dualEntry',
            list: true,
            fields: [
              { type: 'string', label: 'Tag', name: 'tag', required: true },
              { type: 'string', label: 'Title', name: 'title', required: true },
              {
                type: 'string',
                label: 'Body',
                name: 'body',
                required: true,
                ui: { component: 'textarea' },
              },
              { type: 'string', label: 'CTA Label', name: 'ctaLabel', required: true },
            ],
          },
          {
            type: 'object',
            label: 'About',
            name: 'about',
            fields: [
              ...introFields,
              { type: 'image', label: 'Photo', name: 'photo', required: true },
              { type: 'string', label: 'Owner Role', name: 'ownerRole', required: true },
              { type: 'string', label: 'Owner Name', name: 'ownerName', required: true },
              {
                type: 'object',
                label: 'Services',
                name: 'services',
                list: true,
                fields: [...serviceItemFields],
              },
              {
                type: 'string',
                label: 'Quote',
                name: 'quote',
                required: true,
                ui: { component: 'textarea' },
              },
              { type: 'string', label: 'Quote Meta', name: 'quoteMeta', required: true },
            ],
          },
          {
            type: 'object',
            label: 'Interior Band',
            name: 'interior',
            list: true,
            fields: [
              { type: 'image', label: 'Image', name: 'image', required: true },
              { type: 'string', label: 'Kicker', name: 'kicker', required: true },
              { type: 'string', label: 'Caption', name: 'caption', required: true },
            ],
          },
          {
            type: 'object',
            label: 'CTA Band',
            name: 'ctaBand',
            fields: [
              { type: 'string', label: 'Eyebrow', name: 'eyebrow', required: true },
              { type: 'string', label: 'Title', name: 'title', required: true },
              {
                type: 'string',
                label: 'Subtitle',
                name: 'subtitle',
                required: true,
                ui: { component: 'textarea' },
              },
              { type: 'image', label: 'Image', name: 'image', required: true },
              {
                type: 'object',
                label: 'Buttons',
                name: 'buttons',
                list: true,
                fields: [
                  { type: 'string', label: 'Label', name: 'label', required: true },
                  { type: 'string', label: 'Href', name: 'href', required: true },
                ],
              },
            ],
          },
          {
            type: 'object',
            label: 'Credentials',
            name: 'credentials',
            fields: [
              ...introFields,
              {
                type: 'object',
                label: 'Items',
                name: 'items',
                list: true,
                fields: [
                  { type: 'image', label: 'Image', name: 'image', required: true },
                  { type: 'string', label: 'Kicker', name: 'kicker', required: true },
                  { type: 'string', label: 'Title', name: 'title', required: true },
                  {
                    type: 'string',
                    label: 'Body',
                    name: 'body',
                    required: true,
                    ui: { component: 'textarea' },
                  },
                ],
              },
            ],
          },
          {
            type: 'object',
            label: 'FAQ Intro',
            name: 'faqIntro',
            fields: [...introFields],
          },
          {
            type: 'object',
            label: 'Contact Intro',
            name: 'contact',
            fields: [...introFields],
          },
        ],
      },
      {
        label: 'Tenant Page',
        name: 'tenantPage',
        path: 'content/pages/tenant',
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
          ...seoFields,
          { type: 'object', label: 'Page Head', name: 'head', fields: [...introFields] },
          { type: 'object', label: 'List Intro', name: 'listIntro', fields: [...introFields] },
          { type: 'object', label: 'CTA', name: 'cta', fields: [...ctaFields] },
        ],
      },
      {
        label: 'Landlord Page',
        name: 'landlordPage',
        path: 'content/pages/landlord',
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
          ...seoFields,
          { type: 'object', label: 'Page Head', name: 'head', fields: [...introFields] },
          {
            type: 'object',
            label: 'Services',
            name: 'services',
            list: true,
            fields: [...serviceItemFields],
          },
          { type: 'image', label: 'Photo', name: 'photo', required: true },
          { type: 'object', label: 'CTA', name: 'cta', fields: [...ctaFields] },
        ],
      },
      {
        label: 'News Index Page',
        name: 'newsIndexPage',
        path: 'content/pages/news-index',
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
          ...seoFields,
          { type: 'object', label: 'Page Head', name: 'head', fields: [...introFields] },
        ],
      },
      {
        label: 'FAQs',
        name: 'faqs',
        path: 'content/faqs',
        format: 'json',
        fields: [
          { type: 'string', label: 'Question', name: 'question', isTitle: true, required: true },
          {
            type: 'string',
            label: 'Answer',
            name: 'answer',
            required: true,
            ui: { component: 'textarea' },
          },
          { type: 'number', label: 'Sort Order', name: 'sort_order', required: true },
        ],
      },
      {
        label: 'News',
        name: 'news',
        path: 'content/news',
        format: 'mdx',
        fields: [
          { type: 'string', label: 'Slug', name: 'slug', required: true },
          {
            type: 'string',
            label: 'Category',
            name: 'category',
            required: true,
            options: ['公告', '房東指南', '物件動態', '房客指南'],
          },
          { type: 'string', label: 'Title', name: 'title', isTitle: true, required: true },
          {
            type: 'string',
            label: 'Excerpt',
            name: 'excerpt',
            required: true,
            ui: { component: 'textarea' },
          },
          { type: 'image', label: 'Cover', name: 'cover', required: true },
          { type: 'datetime', label: 'Date', name: 'date', required: true },
          { type: 'string', label: 'Author', name: 'author', required: true },
          { type: 'number', label: 'Read Minutes', name: 'read_min', required: true },
          { type: 'string', label: 'Tags', name: 'tags', list: true },
          { type: 'rich-text', label: 'Body', name: 'body', isBody: true },
        ],
      },
    ],
  },
});
