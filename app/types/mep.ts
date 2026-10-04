export interface MepNavItem {
  label: string
  to: string
  icon?: string
}

export interface MepFooterColumn {
  title: string
  links: Array<{ label: string, to: string }>
}
