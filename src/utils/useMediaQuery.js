import { useSyncExternalStore } from 'react'

// 미디어 쿼리 일치 여부 (창 크기가 바뀌면 다시 그림). 예: useMediaQuery('(min-width: 501px)')
export function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query)
      media.addEventListener('change', onChange)
      return () => media.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
  )
}
