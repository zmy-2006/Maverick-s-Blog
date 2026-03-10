import { defineDocumentType, makeSource } from "contentlayer/source-files";

export const Archive = defineDocumentType(() => ({
  name: "Archive",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    summary: { type: "string", required: true },
    category: { type: "enum", options: ["life", "notes", "research", "tech"], required: true },
    publishedAt: { type: "date", required: true },
    readingTime: { type: "string", required: true },
    tier: { type: "string", required: true },
    featured: { type: "boolean", required: false, default: false },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath,
    },
    url: {
      type: "string",
      resolve: (doc) => `/archives/${doc._raw.flattenedPath}`,
    },
  },
}));

export default makeSource({
  contentDirPath: "content/archives",
  documentTypes: [Archive],
  disableImportAliasWarning: true,
});
