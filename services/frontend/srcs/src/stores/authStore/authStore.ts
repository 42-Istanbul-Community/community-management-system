import type { AuthState } from './authStore.types'
import { decodeToken } from './decodeToken'
import { create } from 'zustand'

const STORAGE_KEY = 'cms-token'

function readStoredToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

const initialToken = readStoredToken()

export const useAuthStore = create<AuthState>((set) => ({
  token: initialToken,
  user: initialToken ? decodeToken(initialToken) : null,

  setToken: (token) => {
    localStorage.setItem(STORAGE_KEY, token)
    set({ token, user: decodeToken(token) })
  },

  clear: () => {
    localStorage.removeItem(STORAGE_KEY)
    set({ token: null, user: null })
  },
}))
