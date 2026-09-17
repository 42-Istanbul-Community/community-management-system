export type AvatarSize = 'sm' | 'md' | 'lg'

export type AvatarProps = {
  initials: string
  src?: string | null
  name?: string
  size?: AvatarSize
  className?: string
}
