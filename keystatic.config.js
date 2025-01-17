// keystatic.config.ts
import { config, fields, collection } from '@keystatic/core';

export default config({
  ui: {
    brand: { name: 'lil Bardy Dashboard' },
  },
  storage: {
    kind: 'cloud'
  },
	cloud: {
    project: 'lil-bardy/main-lil-bardy',
  },
  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        featuredImage: fields.image({ 
          label: 'Featured Image',
          directory: 'public/images/thumbnails',
          publicPath: '/images/thumbnails'
        }),
        content: fields.markdoc({ label: 'Content' }),
      },
    }),
  },
});