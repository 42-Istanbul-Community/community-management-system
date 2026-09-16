import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import './index.css'
import { queryClient, setupAxe } from '@/lib'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

setupAxe()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
  </QueryClientProvider>,
)
