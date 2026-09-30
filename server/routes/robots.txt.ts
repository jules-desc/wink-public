export default defineEventHandler((event) => {
  const siteUrl = useRuntimeConfig().public.siteUrl || getRequestURL(event).origin
  setResponseHeader(event, 'content-type', 'text/plain')
  return `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
})
