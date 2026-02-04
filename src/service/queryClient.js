// src/lib/queryClient.js
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - data ko 5 min tak fresh mano
      cacheTime: 1000 * 60 * 10, // 10 minutes - cache mein 10 min tak rakho
      refetchOnWindowFocus: false, // Window focus par refetch na karo
      refetchOnReconnect: true, // Internet reconnect par refetch karo
      retry: 2, // Agar fail ho to 1 baar retry karo
    },
  },
})