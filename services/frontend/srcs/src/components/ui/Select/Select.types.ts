export type SelectOption = {
  value: string
  label: string
}

export type SelectProps = {
  value: string
  onValueChange: (value: string) => void
  options: SelectOption[]
  ariaLabel: string
  placeholder?: string
}
