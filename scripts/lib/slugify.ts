export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function communeSlug(nom: string, codePostal: string): string {
  return `${slugify(nom)}-${codePostal}`
}

export function epciSlug(nom: string, departementCode: string): string {
  return `${slugify(nom)}-${departementCode}`
}

export function departementSlug(nom: string, code: string): string {
  return `departement-${slugify(nom)}-${code}`
}

export function regionSlug(nom: string): string {
  return `region-${slugify(nom)}`
}

export function deduplicateSlugs(slugs: Map<string, string[]>): Map<string, string> {
  const final = new Map<string, string>()
  for (const [slug, codeInsees] of slugs) {
    if (codeInsees.length === 1) {
      final.set(codeInsees[0], slug)
    } else {
      codeInsees.forEach((codeInsee, i) => {
        final.set(codeInsee, i === 0 ? slug : `${slug}-${i + 1}`)
      })
    }
  }
  return final
}
