import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string(),
    date: z.coerce.date(),
    sourceName: z.string(),
    sourceType: z.enum(['新闻报道', '专业政策资料', '政府资料']),
    sourceDate: z.coerce.date().optional(),
    sourceURL: z.string().url(),
    sourceByline: z.string().optional(),
    category: z.enum(['政策变化', '法律与亲权', '行业动态', '专业指引']),
    jurisdiction: z.string(),
    legalStatus: z.enum(['已生效', '已签署待生效', '提案或讨论中', '个案报道', '专业组织分析', '一般行业信息']),
    summary: z.string(),
    keyTakeaway: z.string(),
    reviewedDate: z.coerce.date(),
    published: z.boolean().default(false),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    sources: z.array(z.object({
      title: z.string(),
      publisher: z.string(),
      url: z.string().url(),
      publishedDate: z.coerce.date().optional(),
    })).default([]),
  }),
});

export const collections = { news };
