import { Share2 } from 'lucide-react'

export function ShareButtons() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing', err)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert('링크가 복사되었습니다!')
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-2 py-2 md:px-4 md:border md:border-[#e5e5e5] rounded hover:bg-[#f5f5f5] transition-colors"
        style={{ fontSize: '14px', fontWeight: '500' }}
        aria-label="공유하기"
      >
        <Share2 className="w-4 h-4" color="#999999" />
        <span className="hidden md:inline">공유하기</span>
      </button>
    </div>
  )
}
