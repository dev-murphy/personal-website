import { defineContentConfig, defineCollection, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: "page",
      source: "blog/**/*.md",
      schema: z.object({
        date: z.string(),
        lastEdited: z.string().optional(),
        image: z.string().optional(),
        category: z.string().optional(),
        duration: z.string().optional(),
        tags: z.array(z.string()).optional(),
      }),
    }),
  },
});
