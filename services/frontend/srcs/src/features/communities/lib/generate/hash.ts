export function hash(value: string) {
  let result = 0
  for (let i = 0; i < value.length; i++) {
    result = (result * 31 + value.charCodeAt(i)) >>> 0
  }
  return result
}

export function pick<T>(items: T[], seed: number) {
  const index = Math.abs(Math.trunc(seed)) % items.length
  return items[index]
}
