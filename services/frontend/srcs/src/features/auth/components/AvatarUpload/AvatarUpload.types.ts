export type AvatarUploadProps = {
  value?: File
  onChange: (file: File | undefined) => void
  error?: string
}
