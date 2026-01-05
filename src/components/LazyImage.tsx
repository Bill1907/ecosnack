import { useState } from 'react'
import { getOptimizedImageUrl } from '../lib/utils'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  priority?: boolean // 중요한 이미지는 즉시 로드
}

export function LazyImage({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* 로딩 중 플레이스홀더 - CLS 방지 */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{
            aspectRatio: width && height ? `${width}/${height}` : undefined,
          }}
        />
      )}

      {/* Native lazy loading 사용 - Lighthouse Performance 최적화 */}
      {/* Native lazy loading 사용 - Lighthouse Performance 최적화 */}
      <img
        src={getOptimizedImageUrl(src, width || 800)}
        srcSet={`
          ${getOptimizedImageUrl(src, 640)} 640w,
          ${getOptimizedImageUrl(src, 768)} 768w,
          ${getOptimizedImageUrl(src, 1024)} 1024w,
          ${getOptimizedImageUrl(src, 1280)} 1280w
        `}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        width={width}
        height={height}
      />
    </div>
  )
}
