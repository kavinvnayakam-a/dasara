import type { MetadataRoute } from 'next'

/**
 * Generates a robots.txt file that disallows all crawlers from accessing any part of the site.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  }
}
