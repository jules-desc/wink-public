import { Marked } from 'marked'
import type { Tokens } from 'marked'

export interface TocEntry {
  id: string
  text: string
  level: number
}

function decodeEntities(text: string): string {
  return text
    .replace(/&#39;/g, '\'')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

function headingId(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Rend le Markdown d'une ressource en HTML, avec des ancres sur les titres
 * et une table des matières (niveaux 2). Les liens externes s'ouvrent dans un nouvel onglet.
 */
export function renderMarkdown(markdown: string): { html: string, toc: TocEntry[] } {
  const toc: TocEntry[] = []
  const used = new Map<string, number>()

  const marked = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth }: Tokens.Heading) {
        const text = this.parser.parseInline(tokens)
        const plain = decodeEntities(text.replace(/<[^>]+>/g, ''))
        let id = headingId(plain) || 'section'
        const count = used.get(id) ?? 0
        used.set(id, count + 1)
        if (count) id = `${id}-${count}`
        if (depth === 2) toc.push({ id, text: plain, level: depth })
        return `<h${depth} id="${id}">${text}</h${depth}>\n`
      },
      link({ href, title, tokens }: Tokens.Link) {
        const text = this.parser.parseInline(tokens)
        const external = /^https?:\/\//.test(href)
        const titleAttr = title ? ` title="${title}"` : ''
        const target = external ? ' target="_blank" rel="noopener noreferrer"' : ''
        return `<a href="${href}"${titleAttr}${target}>${text}</a>`
      },
      table(token: Tokens.Table) {
        const head = token.header.map(cell => `<th>${this.parser.parseInline(cell.tokens)}</th>`).join('')
        const rows = token.rows
          .map(row => `<tr>${row.map(cell => `<td>${this.parser.parseInline(cell.tokens)}</td>`).join('')}</tr>`)
          .join('')
        return `<div class="mep-table"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>\n`
      }
    }
  })

  const html = marked.parse(markdown, { async: false })
  return { html, toc }
}

/** Sépare le corps d'un modèle : texte d'introduction / modèle à copier / suite. */
export function splitModele(markdown: string): { avant: string, modele: string | null, apres: string } {
  const start = markdown.search(/^## Le modèle\s*$/m)
  if (start === -1) return { avant: markdown, modele: null, apres: '' }
  const afterHeading = markdown.indexOf('\n', start) + 1
  const rest = markdown.slice(afterHeading)
  const next = rest.search(/^## /m)
  return {
    avant: markdown.slice(0, start).trim(),
    modele: (next === -1 ? rest : rest.slice(0, next)).trim(),
    apres: next === -1 ? '' : rest.slice(next).trim()
  }
}
