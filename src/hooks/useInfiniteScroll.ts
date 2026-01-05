import { useEffect, useRef, useCallback } from 'react'

interface UseInfiniteScrollOptions {
  threshold?: number
  rootMargin?: string
}

export function useInfiniteScroll(
  onLoadMore: () => void,
  hasNextPage: boolean,
  isLoading: boolean,
  options: UseInfiniteScrollOptions = {}
) {
  const { threshold = 0.1, rootMargin = '100px' } = options
  const observerRef = useRef<HTMLDivElement>(null)
  const callbackRef = useRef(onLoadMore)

  // 콜백 최신화
  useEffect(() => {
    callbackRef.current = onLoadMore
  }, [onLoadMore])

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isLoading) {
        callbackRef.current()
      }
    },
    [hasNextPage, isLoading]
  )

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin,
    })

    const currentRef = observerRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
      observer.disconnect()
    }
  }, [handleIntersect, threshold, rootMargin])

  return observerRef
}
