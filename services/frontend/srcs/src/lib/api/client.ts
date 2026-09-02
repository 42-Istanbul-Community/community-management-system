import { useAuthStore } from '@/stores'
import axios from 'axios'

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

client.interceptors.request.use((config) => {
  const { token, user } = useAuthStore.getState()

  if (token) config.headers.Authorization = `Bearer ${token}`
  if (user) config.headers['X-User-ID'] = user.id

  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useAuthStore.getState().clear()
    }

    return Promise.reject(error)
  },
)
