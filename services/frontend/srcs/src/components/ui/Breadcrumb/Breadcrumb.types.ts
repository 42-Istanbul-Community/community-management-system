export type BreadcrumbItem = {
  label: string
  to?: string
}

export type BreadcrumbProps = {
  items: BreadcrumbItem[]
}
